'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePatientsStore } from '@/lib/store/patientsStore';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ExamsChart } from '@/components/dashboard/ExamsChart';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsData, ChartData } from '@/types/filters';
import { Badge } from '@/components/ui/badge';
import { FileCheck, FileX } from 'lucide-react';

export default function DashboardPage() {
  const { patients, exams, initializeStore } = usePatientsStore();
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Aplicar filtros nos pacientes
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    if (filters.hasDocuments && filters.hasDocuments !== 'all') {
      const hasDocsFilter = filters.hasDocuments === 'true';
      filtered = filtered.filter((p) => p.hasDocuments === hasDocsFilter);
    }

    if (filters.gender && filters.gender !== 'all') {
      filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    return filtered;
  }, [patients, filters]);

  // Aplicar filtros nos exames
  const filteredExams = useMemo(() => {
    let filtered = [...exams];

    // Filtrar por pacientes filtrados
    const filteredPatientIds = new Set(filteredPatients.map((p) => p.id));
    filtered = filtered.filter((e) => filteredPatientIds.has(e.patientId));

    // Filtrar por tipo de exame
    if (filters.examType && filters.examType !== 'all') {
      filtered = filtered.filter((e) => e.name === filters.examType);
    }

    // Filtrar por status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    return filtered;
  }, [exams, filteredPatients, filters]);

  const stats = useMemo((): StatsData => {
    const totalPatients = filteredPatients.length;
    const totalExams = filteredExams.length;
    const completedExams = filteredExams.filter((e) => e.status === 'completed').length;
    const pendingExams = filteredExams.filter((e) => e.status === 'pending').length;
    const scheduledExams = filteredExams.filter((e) => e.status === 'scheduled').length;
    const averageExamsPerPatient =
      totalPatients > 0 ? totalExams / totalPatients : 0;

    return {
      totalPatients,
      totalExams,
      completedExams,
      pendingExams,
      scheduledExams,
      averageExamsPerPatient,
    };
  }, [filteredPatients, filteredExams]);

  const examChartData = useMemo((): ChartData[] => {
    const examCounts = filteredExams.reduce(
      (acc, exam) => {
        acc[exam.name] = (acc[exam.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(examCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredExams]);

  const documentStats = useMemo(() => {
    const withDocs = filteredPatients.filter((p) => p.hasDocuments).length;
    const withoutDocs = filteredPatients.filter((p) => !p.hasDocuments).length;
    return { withDocs, withoutDocs };
  }, [filteredPatients]);

  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-12 mb-8 rounded-b-3xl shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Dashboard Médico
        </h1>
        <p className="text-blue-100 text-lg">
          Visão geral e análise de pacientes e exames
        </p>
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              Filtros ativos: {Object.keys(filters).filter(k => filters[k] && filters[k] !== 'all').length}
            </Badge>
          </div>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="-mt-20 relative z-10 px-6">
        <StatsCards stats={stats} />
      </div>

      {/* Estatísticas de Documentos */}
      <div className="grid gap-4 md:grid-cols-2 px-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-green-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">
                Pacientes com Documentos
              </p>
              <p className="text-3xl font-bold text-green-900">
                {documentStats.withDocs}
              </p>
              <Badge className="mt-2 bg-green-600">
                <FileCheck className="h-3 w-3 mr-1" />
                {filteredPatients.length > 0 ? ((documentStats.withDocs / filteredPatients.length) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <FileCheck className="h-16 w-16 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-2xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 mb-1">
                Pacientes sem Documentos
              </p>
              <p className="text-3xl font-bold text-orange-900">
                {documentStats.withoutDocs}
              </p>
              <Badge className="mt-2 bg-orange-600">
                <FileX className="h-3 w-3 mr-1" />
                {filteredPatients.length > 0 ? ((documentStats.withoutDocs / filteredPatients.length) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
            <FileX className="h-16 w-16 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6 lg:grid-cols-3 px-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <ExamsChart
              data={examChartData}
              title={`Top ${examChartData.length} Exames Mais Realizados`}
            />
          </div>
        </div>

        <div className="space-y-6">
          <FilterPanel
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Info adicional */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl border-2 border-indigo-200">
            <h3 className="font-semibold text-indigo-900 mb-3 text-lg">
              ℹ️ Informações
            </h3>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dados atualizados em tempo real</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Filtros afetam gráficos e estatísticas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  Acesse "Pacientes" para cadastrar novos registros
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
