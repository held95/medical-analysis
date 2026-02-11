'use client';

import { useEffect, useMemo } from 'react';
import { usePatientsStore } from '@/lib/store/patientsStore';
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

export default function AgendamentosPage() {
  const { exams, patients, initializeStore } = usePatientsStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const stats = useMemo(() => {
    const scheduledExams = exams.filter((e) => e.status === 'scheduled');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingExams = scheduledExams.filter((e) => {
      const examDate = new Date(e.date);
      examDate.setHours(0, 0, 0, 0);
      return examDate >= today;
    });

    const todayExams = scheduledExams.filter((e) => {
      const examDate = new Date(e.date);
      examDate.setHours(0, 0, 0, 0);
      return examDate.getTime() === today.getTime();
    });

    // Get unique patients with scheduled exams
    const uniquePatientIds = new Set(scheduledExams.map((e) => e.patientId));

    return {
      total: scheduledExams.length,
      upcoming: upcomingExams.length,
      today: todayExams.length,
      patients: uniquePatientIds.size,
    };
  }, [exams]);

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-12 mb-8 rounded-b-3xl shadow-xl">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Agendamentos
        </h1>
        <p className="text-blue-100 text-lg">
          Visualize e gerencie os agendamentos de exames
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 px-6 -mt-20 relative z-10">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Agendados
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Próximos
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pacientes
                </p>
                <p className="text-3xl font-bold text-gray-900">{stats.patients}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <div className="px-6">
        <AppointmentsCalendar />
      </div>

      {/* Info Box */}
      <div className="px-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-2xl border-2 border-indigo-200">
          <h3 className="font-semibold text-indigo-900 mb-3 text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Como usar o calendário
          </h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Clique em uma data no calendário para ver os agendamentos daquele
                dia
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Dias com agendamentos são destacados em verde com um badge mostrando
                a quantidade
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Use os botões de navegação para alternar entre meses ou clique em
                "Hoje" para voltar ao dia atual
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                Os detalhes dos agendamentos aparecem no painel lateral ao selecionar
                uma data
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
