import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { BackFab } from '@/components/BackFab'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tuvo - Modern Event Booking Platform',
  description: 'Discover and book tickets for the best events in your area. From technology conferences to music festivals, find your next unforgettable experience.',
  keywords: 'event tickets, booking platform, concerts, conferences, festivals',
  authors: [{ name: 'Tuvo Team' }],
  openGraph: {
    title: 'Tuvo - Modern Event Booking Platform',
    description: 'Discover and book tickets for the best events in your area.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <BackFab />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 