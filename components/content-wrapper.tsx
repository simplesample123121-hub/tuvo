"use client"

import { usePathname } from 'next/navigation'
import React from 'react'

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  return isAdmin ? (
    <>{children}</>
  ) : (
    <div className="px-4 sm:px-6 lg:px-8 mx-auto w-full max-w-7xl">{children}</div>
  )
}


