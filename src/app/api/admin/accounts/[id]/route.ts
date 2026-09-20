import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!hasPermission(session, 'account:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, phone: true, role: true, accountType: true, status: true, address: true, createdAt: true, updatedAt: true, phoneVerifiedAt: true, emailVerifiedAt: true, verifiedById: true } })
  if (!user) return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 404 })
  return NextResponse.json({ data: user })
}
