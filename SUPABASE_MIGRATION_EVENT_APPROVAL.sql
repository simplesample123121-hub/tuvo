-- Events approval workflow migration
-- 1) Columns
alter table if exists public.events
  add column if not exists approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  add column if not exists approval_reason text,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid;
  
-- Track who submitted (user vs admin) for UI filtering (optional but helpful)
alter table if exists public.events
  add column if not exists submission_source text check (submission_source in ('user','admin'));

-- Optional FK to users table if it exists as auth.users or public.users
-- alter table public.events add constraint events_approved_by_fkey foreign key (approved_by) references auth.users (id);

-- 2) Indexes
create index if not exists idx_events_approval_status on public.events (approval_status);

-- 3) RLS (enable on events table if not already)
-- Enable RLS
alter table public.events enable row level security;

-- Policies
-- Allow authenticated users to insert their own event requests; force pending status server-side via a check/update policy.
drop policy if exists "insert own pending events" on public.events;
create policy "insert own pending events" on public.events
  for insert to authenticated
  with check (
    created_by::text = auth.uid()::text and approval_status = 'pending'
  );

-- Allow owners to select their rows; admins can see all (assumes a function is_admin()).
drop policy if exists "select own or admin all" on public.events;
create policy "select own or admin all" on public.events
  for select to authenticated
  using (
    created_by::text = auth.uid()::text or exists (
      select 1 from public.users u where u.id::text = auth.uid()::text and u.role in ('admin','super_admin')
    )
  );

-- Allow owners to update their events only while pending; admins can update always.
drop policy if exists "update pending own or admin" on public.events;
create policy "update pending own or admin" on public.events
  for update to authenticated
  using (
    (created_by::text = auth.uid()::text and approval_status = 'pending') or exists (
      select 1 from public.users u where u.id::text = auth.uid()::text and u.role in ('admin','super_admin')
    )
  )
  with check (
    (created_by::text = auth.uid()::text and approval_status = 'pending') or exists (
      select 1 from public.users u where u.id::text = auth.uid()::text and u.role in ('admin','super_admin')
    )
  );

-- Public listing should only show approved events; expose via Supabase anon role or through RPC/view if desired.
-- Example view for public approved events
create or replace view public.approved_events as
  select * from public.events where approval_status = 'approved';

grant select on public.approved_events to anon, authenticated;


-- 4) Auto-approve admin-created events (DB-side enforcement)
create or replace function public.events_auto_approve()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Auto-approve only when created from admin surface
  -- i.e., submission_source='admin' AND creator is admin/super_admin
  if (new.submission_source = 'admin') and exists (
    select 1 from public.users u
    where u.id::text = auth.uid()::text
      and u.role in ('admin','super_admin')
  ) then
    new.approval_status := 'approved';
  else
    -- Otherwise keep/push to pending for review
    if new.approval_status is null then
      new.approval_status := 'pending';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_events_auto_approve on public.events;
create trigger trg_events_auto_approve
before insert on public.events
for each row execute function public.events_auto_approve();

-- 7) Atomic inventory decrement helper
create or replace function public.decrement_tickets(eid uuid, qty integer)
returns boolean
language plpgsql
security definer
as $$
declare
  ok boolean := false;
begin
  update public.events
    set available_tickets = available_tickets - qty,
        updated_at = now()
    where id = eid
      and available_tickets >= qty;
  if found then
    ok := true;
  end if;
  return ok;
end;
$$;

