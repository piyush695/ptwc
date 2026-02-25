// src/app/api/auth/admin-logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('hp_wc_admin')
  return res
}
