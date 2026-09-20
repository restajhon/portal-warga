import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD wajib diisi untuk menjalankan seed.')
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, status: 'AKTIF', role: 'SUPER_ADMIN', accountType: 'PENGURUS' },
    create: {
      name: 'Super Admin Development',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      accountType: 'PENGURUS',
      status: 'AKTIF',
    },
    select: { id: true, email: true, role: true, accountType: true, status: true },
  })

  console.log(`Seeded development user: ${user.email} (${user.role})`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
