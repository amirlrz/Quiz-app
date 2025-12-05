'use client';
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/app/lib/supabse/client';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/auth');
    });
  }, []);


  return <>{children}</>;
}
