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