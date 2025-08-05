import { ReactNode } from 'react';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, loading: authLoading } = useAuth();

  // Show loading state while auth or profile is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );
  }

  // If no user is authenticated, don't render the layout
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Header />
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}