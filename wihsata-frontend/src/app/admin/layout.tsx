import { redirect } from 'next/navigation';
import { getSession } from '@/lib/api/session';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect('/auth/login?redirect=/admin');
  if (!session.is_admin) redirect('/');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-muted/30 p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  );
}
