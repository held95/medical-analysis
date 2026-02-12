'use client';

import { useEffect, useState } from 'react';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { Users, Search, List, UserPlus } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

export default function FuncionariosPage() {
  const { employees, exams, initializeStore } = useEmployeesStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.matricula.includes(searchTerm) ||
      emp.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 -mx-6 -mt-6 px-6 pt-8 pb-16 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Funcionários
            </h1>
            <p className="text-blue-100 text-lg">
              Gerenciamento de funcionários e exames ASO
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <span>{employees.length} funcionários cadastrados</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="-mt-8 relative z-10 px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm font-medium text-gray-600 mb-1">Total</div>
            <div className="text-3xl font-bold">{employees.length}</div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm font-medium text-gray-600 mb-1">SABDARIA</div>
            <div className="text-3xl font-bold">
              {employees.filter((e) => e.setor === 'SABDARIA').length}
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm font-medium text-gray-600 mb-1">MOD</div>
            <div className="text-3xl font-bold">
              {employees.filter((e) => e.setor === 'MOD').length}
            </div>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm font-medium text-gray-600 mb-1">SMT</div>
            <div className="text-3xl font-bold">
              {employees.filter((e) => e.setor === 'SMT').length}
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs - Lista e Novo */}
      <div className="px-6">
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista de Funcionários
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novo Funcionário
            </TabsTrigger>
          </TabsList>

          {/* Tab Lista */}
          <TabsContent value="list">
            <Card className="p-4 mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, matrícula ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Matrícula</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Cargo</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Setor</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Exames</th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEmployees.slice(0, 20).map((employee) => {
                      const employeeExams = exams.filter((e) => e.employeeId === employee.id);
                      const completedExams = employeeExams.filter((e) => e.status === 'completed');
                      const expiredExams = employeeExams.filter((e) => e.status === 'expired');

                      return (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">{employee.matricula}</td>
                          <td className="py-3 px-4 text-sm">{employee.name}</td>
                          <td className="py-3 px-4 text-sm">{employee.cargo}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="text-xs">
                              {employee.setor}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {completedExams.length}/{employeeExams.length}
                          </td>
                          <td className="py-3 px-4">
                            {expiredExams.length > 0 ? (
                              <Badge className="bg-red-500 text-xs">Vencido</Badge>
                            ) : completedExams.length > 0 ? (
                              <Badge className="bg-green-500 text-xs">Ok</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Pendente</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum funcionário encontrado
                </div>
              )}

              {filteredEmployees.length > 20 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  Mostrando 20 de {filteredEmployees.length} funcionários
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tab Novo */}
          <TabsContent value="new">
            <EmployeeForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
