export interface EventCategoryOption {
  id: string;
  name: string;
  slug: string;
}

// Canonical list of categories shared across the app
export const EVENT_CATEGORIES: EventCategoryOption[] = [
  { id: 'music', name: 'Music', slug: 'music' },
  { id: 'business', name: 'Business', slug: 'business' },
  { id: 'concerts', name: 'Concert', slug: 'concerts' },
  { id: 'parties', name: 'Parties', slug: 'parties' },
  { id: 'food-drinks', name: 'Food & Drinks', slug: 'food-drinks' },
  { id: 'comedy', name: 'Comedy Shows', slug: 'comedy' },
  { id: 'cooking', name: 'Cooking', slug: 'cooking' },
  { id: 'crafts', name: 'Crafts', slug: 'crafts' },
  { id: 'festivals', name: 'Festivals', slug: 'festivals' },
  { id: 'fine-arts', name: 'Fine Arts', slug: 'fine-arts' },
  { id: 'dance', name: 'Dance', slug: 'dance' },
  { id: 'health-wellness', name: 'Health & Wellness', slug: 'health-wellness' },
  { id: 'kids', name: 'Kids', slug: 'kids' },
  { id: 'performances', name: 'Performances', slug: 'performances' },
  { id: 'photography', name: 'Photography', slug: 'photography' },
  { id: 'sports', name: 'Sports', slug: 'sports' },
  { id: 'technology', name: 'Technology', slug: 'technology' },
  { id: 'fashion', name: 'Fashion', slug: 'fashion' },
  { id: 'theatre', name: 'Theatre', slug: 'theatre' },
  { id: 'trips-adventures', name: 'Trips & Adventure', slug: 'trips-adventures' },
  { id: 'speed-dating', name: 'Speed Dating', slug: 'speed-dating' },
  { id: 'gaming', name: 'Gaming', slug: 'gaming' }
]

export const EVENT_CATEGORY_NAMES: string[] = EVENT_CATEGORIES.map(c => c.name)

