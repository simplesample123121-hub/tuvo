"use client"

import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { eventsApi, type Event } from '@/lib/api/events'
import EventCard from '@/components/event-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type TabKey = 'all' | 'today' | 'tomorrow' | 'this-week' | 'this-weekend' | 'next-week' | 'next-weekend' | 'this-month' | 'next-month'

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'this-week', label: 'This Week' },
  { key: 'this-weekend', label: 'This Weekend' },
  { key: 'next-week', label: 'Next Week' },
  { key: 'next-weekend', label: 'Next Weekend' },
  { key: 'this-month', label: 'This Month' },
  { key: 'next-month', label: 'Next Month' },
]

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x }
function addDays(d: Date, days: number) { const x = new Date(d); x.setDate(x.getDate() + days); return x }
function startOfWeek(d: Date) { const x = startOfDay(d); const day = x.getDay(); const diff = (day + 6) % 7; x.setDate(x.getDate() - diff); return x } // Monday
function endOfWeek(d: Date) { const s = startOfWeek(d); return endOfDay(addDays(s, 6)) }
function nextWeekRange(d: Date) { const eow = endOfWeek(d); const start = startOfDay(addDays(eow, 1)); const end = endOfDay(addDays(start, 6)); return { start, end } }
function getWeekendRangeOfWeek(d: Date) { const s = startOfWeek(d); const sat = startOfDay(addDays(s, 5)); const sun = endOfDay(addDays(s, 6)); return { start: sat, end: sun } }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999) }

function nextMonthRange(d: Date) { const start = startOfMonth(new Date(d.getFullYear(), d.getMonth() + 1, 1)); const end = endOfMonth(start); return { start, end } }

function isInRange(dateISO: string, start: Date, end: Date) {
  if (!dateISO) return false
  const dt = new Date(dateISO)
  return dt >= start && dt <= end
}

function filterByRange(events: Event[], tab: TabKey) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)
  const tomorrowStart = startOfDay(addDays(now, 1))
  const tomorrowEnd = endOfDay(addDays(now, 1))
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)
  const { start: nextWeekStart, end: nextWeekEnd } = nextWeekRange(now)
  const { start: thisWeekendStart, end: thisWeekendEnd } = getWeekendRangeOfWeek(now)
  const { start: monthStart, end: monthEnd } = { start: startOfMonth(now), end: endOfMonth(now) }
  const { start: nextMonthStart, end: nextMonthEnd } = nextMonthRange(now)

  switch (tab) {
    case 'today':
      return events.filter(e => isInRange(e.date, todayStart, todayEnd))
    case 'tomorrow':
      return events.filter(e => isInRange(e.date, tomorrowStart, tomorrowEnd))
    case 'this-week':
      return events.filter(e => isInRange(e.date, weekStart, weekEnd))
    case 'this-weekend':
      return events.filter(e => isInRange(e.date, thisWeekendStart, thisWeekendEnd))
    case 'next-week':
      return events.filter(e => isInRange(e.date, nextWeekStart, nextWeekEnd))
    case 'next-weekend': {
      const nextWeekSaturday = startOfDay(addDays(startOfWeek(addDays(now, 7)), 5))
      const nextWeekSunday = endOfDay(addDays(startOfWeek(addDays(now, 7)), 6))
      return events.filter(e => isInRange(e.date, nextWeekSaturday, nextWeekSunday))
    }
    case 'this-month':
      return events.filter(e => isInRange(e.date, monthStart, monthEnd))
    case 'next-month':
      return events.filter(e => isInRange(e.date, nextMonthStart, nextMonthEnd))
    default:
      return events
  }
}

export function HomeEventTabs() {
  const [tab, setTab] = useState<TabKey>('all')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await eventsApi.getAllPublic()
        const valid = data.filter(e => e && e.$id)
        setEvents(valid)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => filterByRange(events, tab), [events, tab])
  const counts = useMemo(() => {
    const keys: TabKey[] = ['all','today','tomorrow','this-week','this-weekend','next-week','next-weekend','this-month','next-month']
    const map = new Map<TabKey, number>()
    keys.forEach(k => {
      map.set(k, k === 'all' ? events.length : filterByRange(events, k).length)
    })
    return map
  }, [events])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Discover by date</h2>
            <p className="text-lg text-muted-foreground mt-2">Quickly browse events happening across different time ranges</p>
          </div>
          <Button asChild variant="outline" size="lg" className="hidden sm:inline-flex">
            <Link href="/events">View all</Link>
          </Button>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className="w-full h-auto flex flex-wrap gap-1 rounded-full">
            {TAB_DEFS.map(({ key, label }, idx) => (
              <TabsTrigger
                key={key}
                value={key}
                className={`group inline-flex items-center gap-2`}
                aria-label={`${label} events`}
              >
                <span>{label}</span>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-foreground px-1">
                  {counts.get(key) || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Single content renders based on selected tab */}
          <TabsContent value={tab} className="mt-6">
            {loading ? (
              <div className="py-16 text-center text-muted-foreground">Loading events…</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">No events found for this range.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {filtered.slice(0, 9).map(ev => (
                  <EventCard key={ev.$id} event={ev} />
                ))}
              </div>
            )}

            {filtered.length > 9 && (
              <div className="flex justify-center mt-8">
                <Button asChild variant="secondary" className="px-6">
                  <Link href="/events">View more</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}


