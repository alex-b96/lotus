import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-middleware'

export async function GET() {
  try {
    await requireAdmin()
    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 403 })
  }
}