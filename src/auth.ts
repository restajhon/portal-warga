import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { loginSchema } from '@/lib/auth/login-schema'
import { prisma } from '@/lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success || !process.env.DATABASE_URL) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user || !user.passwordHash) return null

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!passwordMatches) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ?? undefined,
          accountType: user.accountType,
          status: user.status,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.accountType = user.accountType
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role as 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL' | undefined
        session.user.accountType = token.accountType as 'WARGA' | 'PENGURUS' | undefined
        session.user.status = token.status as 'MENUNGGU_VERIFIKASI' | 'AKTIF' | 'NONAKTIF' | undefined
      }
      return session
    },
  },
  pages: { signIn: '/' },
})
