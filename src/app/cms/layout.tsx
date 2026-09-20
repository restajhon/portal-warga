import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  if (session.user.accountType !== 'PENGURUS') redirect('/forbidden')
  if (session.user.status !== 'AKTIF') redirect('/admin/login')
  return children
}
