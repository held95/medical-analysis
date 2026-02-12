'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a nova página de funcionários
    router.replace('/funcionarios');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecionando...</h1>
        <p className="text-gray-600">Esta página foi movida para Funcionários</p>
      </div>
    </div>
  );
}
