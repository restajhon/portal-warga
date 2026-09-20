import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL'
    accountType?: 'WARGA' | 'PENGURUS'
  }

  interface Session {
    user: {
      id: string
      role?: User['role']
      accountType?: User['accountType']
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'SUPER_ADMIN' | 'ADMIN' | 'OPERASIONAL'
    accountType?: 'WARGA' | 'PENGURUS'
  }
}
