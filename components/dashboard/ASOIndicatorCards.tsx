'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, ClipboardList, TrendingUp } from 'lucide-react';

interface ASOIndicatorCardsProps {
  vencido: number;
  ok: number;
  total: number;
  adherencePercentage: number;
}

export function ASOIndicatorCards({ vencido, ok, total, adherencePercentage }: ASOIndicatorCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Card Vencido */}
      <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Vencido</p>
            <h3 className="text-3xl font-bold mt-2 text-red-600">{vencido}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Card Ok */}
      <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ok</p>
            <h3 className="text-3xl font-bold mt-2 text-green-600">{ok}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Card Total */}
      <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <h3 className="text-3xl font-bold mt-2 text-blue-600">{total}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Card Aderência */}
      <Card className="p-6 border-2 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Aderência</p>
            <h3 className="text-3xl font-bold mt-2 text-indigo-600">
              {adherencePercentage.toFixed(1)}%
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                adherencePercentage >= 100
                  ? 'bg-green-500'
                  : adherencePercentage >= 80
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(adherencePercentage, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
