import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { contentSchema } from '@/lib/content-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const contents = await prisma.content.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } })
  return NextResponse.json({ data: contents })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = contentSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const slug = `${parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`
  const content = await prisma.content.create({
    data: { ...parsed.data, slug, authorId: session.user.id, publishedAt: parsed.data.status === 'PUBLISHED' ? new Date() : null },
  })
  await writeAuditLog({ actorId: session.user.id, action: 'CONTENT_CREATED', entityType: 'CONTENT', entityId: content.id, metadata: { status: content.status, type: content.type } })
  return NextResponse.json({ data: content }, { status: 201 })
}
