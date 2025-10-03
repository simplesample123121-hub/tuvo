"use client"

import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Star } from 'lucide-react'
import { INDIAN_CITIES, POPULAR_CITIES } from '@/lib/cities'

interface LocationPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allLocations?: string[] // Made optional since we'll use predefined cities
  onSelect: (location: string) => void
}

export function LocationPicker({ open, onOpenChange, allLocations, onSelect }: LocationPickerProps) {
  const [query, setQuery] = useState('')
  const [showPopular, setShowPopular] = useState(true)

  // Use predefined cities or fallback to allLocations
  const citiesList = useMemo(() => {
    const base = allLocations && allLocations.length > 0 ? allLocations : INDIAN_CITIES
    return Array.from(new Set(base)).filter(Boolean)
  }, [allLocations])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    
    if (!q) {
      // Show popular cities first when no search query
      if (showPopular) {
        return POPULAR_CITIES.slice(0, 20)
      }
      return citiesList.slice(0, 50)
    }
    
    // Filter cities based on search query
    const filtered = citiesList.filter(city => 
      city.toLowerCase().includes(q)
    ).sort((a, b) => a.localeCompare(b))
    
    return filtered.slice(0, 50)
  }, [query, citiesList, showPopular])

  const popularCities = useMemo(() => Array.from(new Set(POPULAR_CITIES)).slice(0, 12), [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Choose your city
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for your city..."
              className="pl-10 text-base py-3"
            />
          </div>

          {/* Popular Cities Section - Only show when no search query */}
          {!query && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <h3 className="text-lg font-semibold">Popular Cities</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {popularCities.map(city => (
                  <Button
                    key={city}
                    variant="outline"
                    className="justify-start text-sm h-10"
                    onClick={() => { onSelect(city); onOpenChange(false); }}
                  >
                    <MapPin className="h-3 w-3 mr-2" />
                    {city}
                  </Button>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPopular(!showPopular)}
                  className="text-primary"
                >
                  {showPopular ? 'Show All Cities' : 'Show Popular Cities'}
                </Button>
              </div>
            </div>
          )}

          {/* All Cities Section */}
          <div className="space-y-3">
            {query && (
              <h3 className="text-lg font-semibold">
                Search Results ({filtered.length} cities found)
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
              {filtered.map(city => (
                <Button
                  key={city}
                  variant="outline"
                  className="justify-start text-sm h-10"
                  onClick={() => { onSelect(city); onOpenChange(false); }}
                >
                  <MapPin className="h-3 w-3 mr-2" />
                  {city}
                </Button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No cities found matching "{query}"</p>
                  <p className="text-sm">Try searching with a different term</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


