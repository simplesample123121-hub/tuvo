import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
  
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    userAgent,
    isMobile,
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url,
    method: request.method,
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  }

  return NextResponse.json(healthData, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
} 