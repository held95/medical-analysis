'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyAdherence } from '@/types';

interface AdherenceLineChartProps {
  data: MonthlyAdherence[];
}

export function AdherenceLineChart({ data }: AdherenceLineChartProps) {
  // Formata os dados para o gráfico
  const chartData = data.map((item) => ({
    month: item.month.substring(0, 3), // Abrevia o nome do mês
    'Indicador Atual': item.adherencePercentage,
    'Meta Mensal': item.goalPercentage,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        Indicador - ASO (Atestado de Saúde Ocupacional)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            domain={[0, 120]}
            tick={{ fontSize: 12 }}
            label={{ value: 'Aderência (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => value !== undefined ? `${Number(value).toFixed(1)}%` : 'N/A'}
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Indicador Atual"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="Meta Mensal"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full" />
          <span className="text-muted-foreground">Indicador Atual (% de aderência)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500" />
          <span className="text-muted-foreground">Meta Mensal (100%)</span>
        </div>
      </div>
    </Card>
  );
}
