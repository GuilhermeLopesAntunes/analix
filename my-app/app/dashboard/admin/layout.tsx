'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getUserRoutePolicies } from '@/app/services/auth.service';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = getUserRoutePolicies();

    if (role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return <>{children}</>;
}
