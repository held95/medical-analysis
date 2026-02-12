'use client';

import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AdherencePieChartsProps {
  totalOk: number;
  totalExpired: number;
  audiometriaOk: number;
  audiometriaExpired: number;
  demaisExamesOk: number;
  demaisExamesExpired: number;
}

const COLORS = {
  ok: '#22c55e', // green-500
  expired: '#ef4444', // red-500
};

export function AdherencePieCharts({
  totalOk,
  totalExpired,
  audiometriaOk,
  audiometriaExpired,
  demaisExamesOk,
  demaisExamesExpired,
}: AdherencePieChartsProps) {
  const totalData = [
    { name: 'Ok', value: totalOk },
    { name: 'Vencido', value: totalExpired },
  ];

  const audiometriaData = [
    { name: 'Ok', value: audiometriaOk },
    { name: 'Vencido', value: audiometriaExpired },
  ];

  const demaisData = [
    { name: 'Ok', value: demaisExamesOk },
    { name: 'Vencido', value: demaisExamesExpired },
  ];

  const renderLabel = (entry: any) => {
    const total = entry.value;
    return total > 0 ? `${total}` : '';
  };

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
      {/* Total Exames */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Total Exames</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={totalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {totalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Ok' ? COLORS.ok : COLORS.expired} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            Total: {totalOk + totalExpired} exames
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {totalOk + totalExpired > 0
              ? `${((totalOk / (totalOk + totalExpired)) * 100).toFixed(1)}% de aderência`
              : '0% de aderência'}
          </p>
        </div>
      </Card>

      {/* Aderência - Audiometria */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Aderência - Audiometria</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={audiometriaData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {audiometriaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Ok' ? COLORS.ok : COLORS.expired} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            Total: {audiometriaOk + audiometriaExpired} exames
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {audiometriaOk + audiometriaExpired > 0
              ? `${((audiometriaOk / (audiometriaOk + audiometriaExpired)) * 100).toFixed(1)}% de aderência`
              : '0% de aderência'}
          </p>
        </div>
      </Card>

      {/* Aderência - Demais Exames */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Aderência - Demais Exames</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={demaisData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {demaisData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Ok' ? COLORS.ok : COLORS.expired} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <p className="text-sm text-muted-foreground">
            Total: {demaisExamesOk + demaisExamesExpired} exames
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {demaisExamesOk + demaisExamesExpired > 0
              ? `${((demaisExamesOk / (demaisExamesOk + demaisExamesExpired)) * 100).toFixed(1)}% de aderência`
              : '0% de aderência'}
          </p>
        </div>
      </Card>
    </div>
  );
}
