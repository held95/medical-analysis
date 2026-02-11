'use client';

import { useEffect, useMemo } from 'react';
import { usePatientsStore } from '@/lib/store/patientsStore';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { ExamsChart } from '@/components/dashboard/ExamsChart';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StatsData, ChartData } from '@/types/filters';

export default function DashboardPage() {
  const { patients, exams, initializeStore } = usePatientsStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const stats = useMemo((): StatsData => {
    const totalPatients = patients.length;
    const totalExams = exams.length;
    const completedExams = exams.filter((e) => e.status === 'completed').length;
    const pendingExams = exams.filter((e) => e.status === 'pending').length;
    const scheduledExams = exams.filter((e) => e.status === 'scheduled').length;
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
  }, [patients, exams]);

  const examChartData = useMemo((): ChartData[] => {
    const examCounts = exams.reduce(
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
  }, [exams]);

  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };

  const handleClearFilters = () => {
    console.log('Clearing filters');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos pacientes e exames
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <SearchBar onSearch={handleSearch} />
          <ExamsChart data={examChartData} title="Top 10 Exames Realizados" />
        </div>

        <div>
          <FilterPanel
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
}
