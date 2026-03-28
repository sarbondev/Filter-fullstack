import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '@/hooks/store';

export function AdminLayout() {
  const { token, user } = useAppSelector((s) => s.auth);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === 'CLIENT') return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
