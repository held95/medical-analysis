'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePatientsStore } from '@/lib/store/patientsStore';
import {
  formatCPF,
  formatPhone,
  formatDate,
} from '@/lib/utils/formatters';
import { Edit, Trash2, Eye, FileCheck, FileX } from 'lucide-react';

export function PatientList() {
  const patients = usePatientsStore((state) => state.patients);
  const deletePatient = usePatientsStore((state) => state.deletePatient);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o paciente ${name}?`)) {
      deletePatient(id);
      // Se a página atual ficar vazia, volta para a anterior
      if (currentPatients.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pacientes ({patients.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Documentos</TableHead>
                <TableHead>Exames Realizados</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <p className="text-lg font-medium">
                        Nenhum paciente cadastrado
                      </p>
                      <p className="text-sm mt-1">
                        Clique em "Novo Paciente" para adicionar um paciente
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{formatCPF(patient.cpf)}</TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>{formatPhone(patient.phone)}</TableCell>
                    <TableCell>
                      {patient.hasDocuments ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          <FileCheck className="h-3 w-3 mr-1" />
                          Completo
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <FileX className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {patient.examsCompleted.length}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir"
                          onClick={() => handleDelete(patient.id, patient.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {patients.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, patients.length)}{' '}
              de {patients.length} pacientes
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
