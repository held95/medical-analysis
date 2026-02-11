'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatientsStore } from '@/lib/store/patientsStore';
import { EXAM_TYPES } from '@/constants/exams';
import { Calendar, Plus } from 'lucide-react';
import { Exam, ExamType, ExamCategory } from '@/types';

export function NewAppointmentDialog() {
  const [open, setOpen] = useState(false);
  const { patients, addExam } = usePatientsStore();

  const [formData, setFormData] = useState({
    patientId: '',
    examType: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId || !formData.examType || !formData.date || !formData.time) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const dateTime = `${formData.date}T${formData.time}:00`;

    // Determinar categoria baseada no tipo de exame
    let category: ExamCategory = 'laboratorial';
    if (['Raio-X', 'Ultrassonografia'].includes(formData.examType)) {
      category = 'imagem';
    } else if (['Eletrocardiograma', 'Teste ergométrico'].includes(formData.examType)) {
      category = 'cardiológico';
    }

    const newExam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: formData.patientId,
      name: formData.examType as ExamType,
      category,
      date: new Date(dateTime).toISOString(),
      scheduledDate: new Date(dateTime).toISOString(),
      status: 'scheduled',
      notes: formData.notes || 'Agendamento criado manualmente',
    };

    addExam(newExam);

    // Reset form
    setFormData({
      patientId: '',
      examType: '',
      date: '',
      time: '',
      notes: '',
    });

    setOpen(false);
    alert('Agendamento criado com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Criar Novo Agendamento
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar um novo exame
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente *</Label>
            <Select
              value={formData.patientId}
              onValueChange={(value) =>
                setFormData({ ...formData, patientId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examType">Tipo de Exame *</Label>
            <Select
              value={formData.examType}
              onValueChange={(value) =>
                setFormData({ ...formData, examType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de exame" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {EXAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Input
              id="notes"
              placeholder="Observações sobre o agendamento (opcional)"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
