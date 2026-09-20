import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/auth/permissions'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.status !== 'AKTIF') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // account:manage covers Super Admin + Admin (DECISIONS-BASELINE §1).
  if (!hasPermission(session, 'account:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const status = new URL(request.url).searchParams.get('status')
  const accountType = new URL(request.url).searchParams.get('accountType')

  const where: { status?: 'MENUNGGU_VERIFIKASI' | 'AKTIF' | 'NONAKTIF'; accountType?: 'WARGA' | 'PENGURUS' } = {}
  if (status === 'MENUNGGU_VERIFIKASI' || status === 'AKTIF' || status === 'NONAKTIF') where.status = status
  if (accountType === 'WARGA' || accountType === 'PENGURUS') where.accountType = accountType

  const users = await prisma.user.findMany({
    where,
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      accountType: true,
      status: true,
      address: true,
      createdAt: true,
      verifiedById: true,
    },
  })

  // Never expose password hashes — explicit selection guarantees it.
  return NextResponse.json({ data: users })
}
