import { NextResponse } from 'next/server'
import { warmupFunction } from '@/lib/function-warmup'

export const runtime = 'nodejs'
export const maxDuration = 5

export async function GET() {
  try {
    await warmupFunction()
    return NextResponse.json({ status: 'warmed' })
  } catch (error) {
    return NextResponse.json({ error: 'warmup failed' }, { status: 500 })
  }
}