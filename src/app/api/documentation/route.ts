import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { documentationSchema } from '@/lib/community-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const manage = new URL(request.url).searchParams.get('scope') === 'manage'
  if (manage && !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await prisma.documentation.findMany({ where: manage ? undefined : { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = documentationSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const data = await prisma.documentation.create({ data: { ...parsed.data, authorId: session.user.id } })
  await writeAuditLog({ actorId: session.user.id, action: 'DOCUMENTATION_CREATED', entityType: 'DOCUMENTATION', entityId: data.id })
  return NextResponse.json({ data }, { status: 201 })
}
