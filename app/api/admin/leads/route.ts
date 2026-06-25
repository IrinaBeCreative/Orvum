import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getLeads } from '@/lib/sanity/queries'
import { writeClient } from '@/lib/sanity/client'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const stage = searchParams.get('stage') ?? 'all'

  const leads = await getLeads(stage)
  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, stage, notes, estimateAmount, assignedTech } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const patch = writeClient.patch(id)
  if (stage) patch.set({ stage })
  if (notes !== undefined) patch.set({ notes })
  if (estimateAmount !== undefined) patch.set({ estimateAmount })
  if (assignedTech !== undefined) patch.set({ assignedTech })

  const updated = await patch.commit()
  return NextResponse.json(updated)
}
