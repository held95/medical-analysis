'use client';

import { useEffect, useMemo } from 'react';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { ASOIndicatorCards } from '@/components/dashboard/ASOIndicatorCards';
import { AdherencePieCharts } from '@/components/dashboard/AdherencePieCharts';
import { AdherenceLineChart } from '@/components/dashboard/AdherenceLineChart';
import { MonthlyAdherenceTable } from '@/components/dashboard/MonthlyAdherenceTable';

export default function DashboardPage() {
  const { employees, exams, initializeStore, getASOIndicators, getMonthlyAdherence } = useEmployeesStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Indicadores ASO
  const asoIndicators = useMemo(() => {
    return getASOIndicators();
  }, [employees, exams, getASOIndicators]);

  // Aderência mensal
  const monthlyAdherence = useMemo(() => {
    return getMonthlyAdherence();
  }, [employees, exams, getMonthlyAdherence]);

  // Dados para os gráficos de pizza
  const pieChartsData = useMemo(() => {
    const audiometriaExams = exams.filter((e) => e.name === 'Audiometria');
    const demaisExams = exams.filter((e) => e.name !== 'Audiometria');

    return {
      totalOk: exams.filter((e) => e.status === 'completed').length,
      totalExpired: exams.filter((e) => e.status === 'expired').length,
      audiometriaOk: audiometriaExams.filter((e) => e.status === 'completed').length,
      audiometriaExpired: audiometriaExams.filter((e) => e.status === 'expired').length,
      demaisExamesOk: demaisExams.filter((e) => e.status === 'completed').length,
      demaisExamesExpired: demaisExams.filter((e) => e.status === 'expired').length,
    };
  }, [exams]);

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-16 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">📋</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Controle ASO
            </h1>
            <p className="text-blue-100 text-lg">
              Atestado de Saúde Ocupacional - Indicador do Farol
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            <span>Sistema online</span>
          </div>
          <div className="flex items-center gap-2">
            <span>•</span>
            <span>{employees.length} funcionários cadastrados</span>
          </div>
          <div className="flex items-center gap-2">
            <span>•</span>
            <span>{exams.length} exames registrados</span>
          </div>
        </div>
      </div>

      {/* Cards de Indicadores ASO */}
      <div className="-mt-24 relative z-10 px-6">
        <ASOIndicatorCards
          vencido={asoIndicators.vencido}
          ok={asoIndicators.ok}
          total={asoIndicators.total}
          adherencePercentage={asoIndicators.adherencePercentage}
        />
      </div>

      {/* Gráficos de Pizza - Aderência */}
      <div className="px-6 mt-6">
        <AdherencePieCharts
          totalOk={pieChartsData.totalOk}
          totalExpired={pieChartsData.totalExpired}
          audiometriaOk={pieChartsData.audiometriaOk}
          audiometriaExpired={pieChartsData.audiometriaExpired}
          demaisExamesOk={pieChartsData.demaisExamesOk}
          demaisExamesExpired={pieChartsData.demaisExamesExpired}
        />
      </div>

      {/* Gráfico de Linha - Evolução Mensal */}
      <div className="px-6 mt-6">
        <AdherenceLineChart data={monthlyAdherence} />
      </div>

      {/* Tabela de Aderência Mensal */}
      <div className="px-6 mt-6">
        <MonthlyAdherenceTable data={monthlyAdherence} />
      </div>

      {/* Informações Adicionais */}
      <div className="px-6 mt-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl border-2 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3 text-lg flex items-center gap-2">
            <span>ℹ️</span>
            <span>Informações do Sistema</span>
          </h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                <strong>Meta de Aderência:</strong> 100% - Todos os funcionários devem ter exames ASO em dia
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                <strong>Validade dos Exames:</strong> 12 meses para todos os tipos de exames ASO
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                <strong>Status:</strong> "Ok" indica exame válido, "Vencido" indica que precisa renovar
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                <strong>Setores:</strong> SABDARIA, MOD, SMT, TI
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">•</span>
              <span>
                Acesse "Funcionários" para gerenciar cadastros e exames
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
