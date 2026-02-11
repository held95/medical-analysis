'use client';

import { useEffect } from 'react';
import { usePatientsStore } from '@/lib/store/patientsStore';
import { PatientForm } from '@/components/patients/PatientForm';
import { PatientList } from '@/components/patients/PatientList';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function PatientsPage() {
  const initializeStore = usePatientsStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Pacientes
        </h1>
        <p className="text-muted-foreground">
          Cadastre e gerencie pacientes do sistema
        </p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Pacientes</TabsTrigger>
          <TabsTrigger value="new">Novo Paciente</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <PatientList />
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <PatientForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
