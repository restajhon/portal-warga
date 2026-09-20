import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'
import { agendaSchema } from '@/lib/agenda-schema'
import { writeAuditLog } from '@/lib/audit'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const manage = new URL(request.url).searchParams.get('scope') === 'manage'
  if (manage && !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const agendas = await prisma.agenda.findMany({ where: manage ? undefined : { status: 'PUBLISHED', startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' } })
  return NextResponse.json({ data: agendas })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const parsed = agendaSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  const agenda = await prisma.agenda.create({ data: { ...parsed.data, startsAt: new Date(parsed.data.startsAt), endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null, authorId: session.user.id } })
  await writeAuditLog({ actorId: session.user.id, action: 'AGENDA_CREATED', entityType: 'AGENDA', entityId: agenda.id, metadata: { status: agenda.status } })
  return NextResponse.json({ data: agenda }, { status: 201 })
}
