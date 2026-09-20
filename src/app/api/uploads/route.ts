import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { hasPermission } from '@/lib/auth/permissions'

export const runtime = 'nodejs'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || !hasPermission(session, 'content:manage')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'File foto wajib dipilih.' }, { status: 400 })
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Format foto harus JPG, PNG, atau WebP.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Ukuran foto maksimal 5 MB.' }, { status: 400 })

  const directory = path.join(process.cwd(), 'public', 'uploads', 'community')
  await mkdir(directory, { recursive: true })
  const fileName = `${randomUUID()}.${EXTENSIONS[file.type]}`
  await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()))
  return NextResponse.json({ data: { url: `/uploads/community/${fileName}`, name: file.name } }, { status: 201 })
}
