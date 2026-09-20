import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/auth/register-schema'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash, accountType: 'WARGA', status: 'AKTIF' },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Email sudah terdaftar.' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Registrasi gagal. Coba lagi nanti.' }, { status: 500 })
  }
}
