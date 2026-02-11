'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Patient } from '@/types';
import { usePatientsStore } from '@/lib/store/patientsStore';
import {
  formatCPF,
  formatPhone,
  formatDate,
} from '@/lib/utils/formatters';
import {
  FileCheck,
  FileX,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  CalendarClock,
} from 'lucide-react';
import { useMemo } from 'react';

interface PatientDetailsModalProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailsModal({
  patient,
  open,
  onOpenChange,
}: PatientDetailsModalProps) {
  const exams = usePatientsStore((state) => state.exams);

  const patientExams = useMemo(() => {
    if (!patient) return [];
    return exams.filter((exam) => exam.patientId === patient.id);
  }, [exams, patient]);

  const examsByStatus = useMemo(() => {
    const completed = patientExams.filter((e) => e.status === 'completed');
    const pending = patientExams.filter((e) => e.status === 'pending');
    const scheduled = patientExams.filter((e) => e.status === 'scheduled');
    const cancelled = patientExams.filter((e) => e.status === 'cancelled');
    return { completed, pending, scheduled, cancelled };
  }, [patientExams]);

  if (!patient) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'scheduled':
        return <CalendarClock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      scheduled: 'Agendado',
      cancelled: 'Cancelado',
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} border`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            {patient.name}
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do paciente e histórico de exames
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Pessoais */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-blue-900">
              <User className="h-5 w-5" />
              Informações Pessoais
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">CPF</p>
                  <p className="font-medium text-gray-900">{formatCPF(patient.cpf)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Idade</p>
                  <p className="font-medium text-gray-900">{patient.age} anos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Gênero</p>
                  <p className="font-medium text-gray-900">
                    {patient.gender === 'M' ? 'Masculino' : 'Feminino'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{formatPhone(patient.phone)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Última Visita</p>
                  <p className="font-medium text-gray-900">{formatDate(patient.lastVisit)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-purple-900">
              <MapPin className="h-5 w-5" />
              Endereço
            </h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">
                  {patient.address.street}, {patient.address.number}
                </p>
                <p className="text-sm text-gray-600">
                  {patient.address.city} - {patient.address.state}
                </p>
                <p className="text-sm text-gray-600">CEP: {patient.address.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Status de Documentos */}
          <div
            className={`p-6 rounded-xl border-2 ${
              patient.hasDocuments
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
            }`}
          >
            <h3
              className={`font-semibold text-lg mb-4 flex items-center gap-2 ${
                patient.hasDocuments ? 'text-green-900' : 'text-orange-900'
              }`}
            >
              {patient.hasDocuments ? (
                <>
                  <FileCheck className="h-5 w-5" />
                  Documentos Completos
                </>
              ) : (
                <>
                  <FileX className="h-5 w-5" />
                  Documentos Pendentes
                </>
              )}
            </h3>
            <div className="flex items-center gap-4">
              {patient.hasDocuments ? (
                <Badge className="bg-green-600 hover:bg-green-700 text-white">
                  <FileCheck className="h-3 w-3 mr-1" />
                  Toda documentação está completa
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <FileX className="h-3 w-3 mr-1" />
                  Documentação incompleta - Solicitar pendências
                </Badge>
              )}
            </div>
          </div>

          {/* Resumo de Exames */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border-2 border-slate-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900">
              <Activity className="h-5 w-5" />
              Resumo de Exames ({patientExams.length} total)
            </h3>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">
                    {examsByStatus.completed.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Concluídos</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-900">
                    {examsByStatus.pending.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <CalendarClock className="h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">
                    {examsByStatus.scheduled.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Agendados</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold text-red-900">
                    {examsByStatus.cancelled.length}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Cancelados</p>
              </div>
            </div>
          </div>

          {/* Lista de Exames */}
          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900">
              <Activity className="h-5 w-5" />
              Histórico Detalhado de Exames
            </h3>
            {patientExams.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhum exame registrado para este paciente
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {patientExams
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(exam.status)}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{exam.name}</p>
                            <p className="text-sm text-gray-600">
                              Categoria: {exam.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              Data: {formatDate(exam.date)}
                            </p>
                            {exam.result && (
                              <p className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">Resultado:</span> {exam.result}
                              </p>
                            )}
                            {exam.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Observações:</span> {exam.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>{getStatusBadge(exam.status)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
