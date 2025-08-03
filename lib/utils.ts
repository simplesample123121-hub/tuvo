import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time: string): string {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function generateQRCode(data: string): string {
  // This would typically use a QR code library
  return `qr-${data}-${Date.now()}`
}

export function generateBookingId(): string {
  return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function isEventOngoing(eventDate: string, eventTime: string): boolean {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`)
  const now = new Date()
  const eventEnd = new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000) // 3 hours duration
  
  return now >= eventDateTime && now <= eventEnd
}

export function isEventUpcoming(eventDate: string, eventTime: string): boolean {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`)
  const now = new Date()
  
  return now < eventDateTime
}

export function getEventStatus(eventDate: string, eventTime: string): 'upcoming' | 'ongoing' | 'completed' {
  const eventDateTime = new Date(`${eventDate}T${eventTime}`)
  const now = new Date()
  const eventEnd = new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000) // 3 hours duration
  
  if (now < eventDateTime) return 'upcoming'
  if (now >= eventDateTime && now <= eventEnd) return 'ongoing'
  return 'completed'
} 

// User profile utilities
export const getUserAvatar = (profileString?: string): string => {
  if (!profileString) return '';
  
  try {
    const profile = JSON.parse(profileString);
    return profile?.avatar || '';
  } catch (error) {
    console.error('Failed to parse profile for avatar:', error);
    return '';
  }
};

export const getUserProfile = (profileString?: string): any => {
  if (!profileString) return null;
  
  try {
    return JSON.parse(profileString);
  } catch (error) {
    console.error('Failed to parse profile:', error);
    return null;
  }
}; 

// Mobile detection utilities
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const isMobileSafari = (): boolean => {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator.userAgent
  return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
}

export const isMobileChrome = (): boolean => {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator.userAgent
  return /Android/.test(userAgent) && /Chrome/.test(userAgent)
}

// Debug logging for mobile issues
export const logMobileInfo = (): void => {
  if (typeof window === 'undefined') return
  
  console.log('Mobile Debug Info:', {
    userAgent: window.navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    isMobile: isMobile(),
    isMobileSafari: isMobileSafari(),
    isMobileChrome: isMobileChrome()
  })
} 