'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { StatsData } from '@/types/filters';

interface StatsCardsProps {
  stats: StatsData;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      lightBg: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total de Exames',
      value: stats.totalExams,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      lightBg: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Exames Concluídos',
      value: stats.completedExams,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      lightBg: 'from-green-500 to-green-600',
    },
    {
      title: 'Exames Pendentes',
      value: stats.pendingExams,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      lightBg: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.lightBg} opacity-5`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-700">
                {card.title}
              </CardTitle>
              <div
                className={`p-3 rounded-xl ${card.bgColor} shadow-lg transform hover:scale-110 transition-transform`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-4xl font-bold ${card.color} mb-1`}>
                {card.value}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                Média: {stats.averageExamsPerPatient.toFixed(1)} exames/paciente
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
