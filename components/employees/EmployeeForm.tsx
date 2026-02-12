'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { CreateEmployeeDTO } from '@/types';
import { SETORES, CARGOS, TURNOS } from '@/constants/aso';
import { UserPlus, Save } from 'lucide-react';

export function EmployeeForm() {
  const { addEmployee } = useEmployeesStore();
  const [formData, setFormData] = useState<CreateEmployeeDTO>({
    name: '',
    cpf: '',
    matricula: '',
    age: 25,
    gender: 'M',
    email: '',
    phone: '',
    cargo: '',
    turno: '',
    setor: 'SABDARIA',
    dataAdmissao: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.cpf || formData.cpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!formData.matricula) {
      newErrors.matricula = 'Matrícula é obrigatória';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone || formData.phone.length !== 11) {
      newErrors.phone = 'Telefone deve ter 11 dígitos';
    }

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    if (!formData.turno) {
      newErrors.turno = 'Turno é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    addEmployee(formData);

    // Reset form
    setFormData({
      name: '',
      cpf: '',
      matricula: '',
      age: 25,
      gender: 'M',
      email: '',
      phone: '',
      cargo: '',
      turno: '',
      setor: 'SABDARIA',
      dataAdmissao: new Date().toISOString().split('T')[0],
    });

    setErrors({});
    alert('Funcionário cadastrado com sucesso!');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Novo Funcionário</h2>
          <p className="text-sm text-muted-foreground">
            Preencha os dados para cadastrar um novo funcionário
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Dados Pessoais</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                placeholder="JOÃO SILVA SANTOS"
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
                placeholder="12345678900"
                maxLength={11}
              />
              {errors.cpf && <p className="text-xs text-red-600">{errors.cpf}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="funcionario@empresa.com"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="11987654321"
                maxLength={11}
              />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                min={18}
                max={80}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Sexo *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'M' | 'F') => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dados Profissionais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Dados Profissionais</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                placeholder="123456"
              />
              {errors.matricula && <p className="text-xs text-red-600">{errors.matricula}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo *</Label>
              <Select
                value={formData.cargo}
                onValueChange={(value) => setFormData({ ...formData, cargo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {CARGOS.map((cargo) => (
                    <SelectItem key={cargo} value={cargo}>
                      {cargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cargo && <p className="text-xs text-red-600">{errors.cargo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="turno">Turno *</Label>
              <Select
                value={formData.turno}
                onValueChange={(value) => setFormData({ ...formData, turno: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  {TURNOS.map((turno) => (
                    <SelectItem key={turno.codigo} value={turno.codigo}>
                      {turno.descricao} - {turno.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.turno && <p className="text-xs text-red-600">{errors.turno}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setor">Setor *</Label>
              <Select
                value={formData.setor}
                onValueChange={(value: any) => setFormData({ ...formData, setor: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SETORES.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
              <Input
                id="dataAdmissao"
                type="date"
                value={formData.dataAdmissao}
                onChange={(e) => setFormData({ ...formData, dataAdmissao: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: '',
                cpf: '',
                matricula: '',
                age: 25,
                gender: 'M',
                email: '',
                phone: '',
                cargo: '',
                turno: '',
                setor: 'SABDARIA',
                dataAdmissao: new Date().toISOString().split('T')[0],
              });
              setErrors({});
            }}
          >
            Limpar Formulário
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Cadastrar Funcionário
          </Button>
        </div>
      </form>
    </Card>
  );
}
