"use client"

import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin } from 'lucide-react'

interface LocationPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allLocations: string[]
  onSelect: (location: string) => void
}

export function LocationPicker({ open, onOpenChange, allLocations, onSelect }: LocationPickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = allLocations
      .filter(l => l)
      .filter((l, idx, arr) => arr.indexOf(l) === idx)
      .sort((a, b) => a.localeCompare(b))
    if (!q) return list.slice(0, 50)
    return list.filter(l => l.toLowerCase().includes(q)).slice(0, 50)
  }, [query, allLocations])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose your city</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter your city..."
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto">
            {filtered.map(loc => (
              <Button
                key={loc}
                variant="outline"
                className="justify-start"
                onClick={() => { onSelect(loc); onOpenChange(false); }}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {loc}
              </Button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">No matches found.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


