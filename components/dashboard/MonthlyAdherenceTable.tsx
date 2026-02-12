'use client';

import { Card } from '@/components/ui/card';
import { MonthlyAdherence } from '@/types';

interface MonthlyAdherenceTableProps {
  data: MonthlyAdherence[];
}

export function MonthlyAdherenceTable({ data }: MonthlyAdherenceTableProps) {
  return (
    <Card className="p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">
        Indicador Atestado de Saúde Ocupacional (ASO) - Indicador do Farol
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">
                Aderência
              </th>
              {data.map((item) => (
                <th
                  key={item.month}
                  className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold"
                >
                  {item.month.substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Linha N° Total ASO */}
            <tr className="bg-blue-100">
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                N° Total ASO
              </td>
              {data.map((item) => (
                <td
                  key={`aso-${item.month}`}
                  className="border border-gray-300 px-3 py-2 text-center text-sm"
                >
                  {item.totalASO}
                </td>
              ))}
            </tr>

            {/* Linha N° Total funcionários */}
            <tr className="bg-white">
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                N° Total funcionários
              </td>
              {data.map((item) => (
                <td
                  key={`func-${item.month}`}
                  className="border border-gray-300 px-3 py-2 text-center text-sm"
                >
                  {item.totalEmployees}
                </td>
              ))}
            </tr>

            {/* Linha Aderência */}
            <tr className="bg-blue-100">
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                Aderência
              </td>
              {data.map((item) => {
                const meetsGoal = item.adherencePercentage >= item.goalPercentage;
                return (
                  <td
                    key={`adh-${item.month}`}
                    className={`border border-gray-300 px-3 py-2 text-center text-sm font-semibold ${
                      meetsGoal ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {item.adherencePercentage.toFixed(1)}%
                  </td>
                );
              })}
            </tr>

            {/* Linha Meta */}
            <tr className="bg-white">
              <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                Meta
              </td>
              {data.map((item) => (
                <td
                  key={`meta-${item.month}`}
                  className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold"
                >
                  {item.goalPercentage.toFixed(1)}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-700 rounded" />
          <span className="text-muted-foreground">Atingiu a meta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-700 rounded" />
          <span className="text-muted-foreground">Abaixo da meta</span>
        </div>
      </div>
    </Card>
  );
}
