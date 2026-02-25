// src/middleware.ts
// Route protection middleware.
// /admin/* routes require a valid hp_wc_admin cookie (admin session).
// /dashboard/* routes require a valid hp_wc_token cookie (trader session).
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production'
)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { role?: string; userId?: string }
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Protect /admin/* ─────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const adminToken = req.cookies.get('hp_wc_admin')?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin-login', req.url))
    }

    const payload = await verifyToken(adminToken)

    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
      // Invalid or non-admin token — clear cookie and redirect
      const res = NextResponse.redirect(new URL('/admin-login', req.url))
      res.cookies.delete('hp_wc_admin')
      return res
    }

    return NextResponse.next()
  }

  // ── Protect /dashboard/* ─────────────────────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    const traderToken = req.cookies.get('hp_wc_token')?.value

    if (!traderToken) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const payload = await verifyToken(traderToken)

    if (!payload) {
      const res = NextResponse.redirect(new URL('/login', req.url))
      res.cookies.delete('hp_wc_token')
      return res
    }

    // Admin trying to access trader dashboard — redirect to their panel
    if (payload.role === 'ADMIN' || payload.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin-login', req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login', '/dashboard/:path*'],
}
