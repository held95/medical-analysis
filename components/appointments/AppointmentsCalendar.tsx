'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';

export function AppointmentsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { employees, exams } = useEmployeesStore();

  // Get scheduled exams
  const scheduledExams = useMemo(() => {
    return exams.filter((exam) => exam.status === 'scheduled');
  }, [exams]);

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.name : 'Desconhecido';
  };

  // Get employee data by ID
  const getEmployee = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId);
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledExams.filter((exam) => {
      const examDate = new Date(exam.date).toISOString().split('T')[0];
      return examDate === dateStr;
    });
  };

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty days for the start of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth();
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const selectedAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Hoje
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Week days header */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-gray-600 pb-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const appointments = getAppointmentsForDate(date);
              const hasAppointments = appointments.length > 0;
              const isSelected =
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear();

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all hover:border-blue-400 hover:shadow-md ${
                    isToday(date)
                      ? 'bg-blue-100 border-blue-500 font-bold'
                      : hasAppointments
                      ? 'bg-green-50 border-green-300'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-sm ${
                        isToday(date) ? 'text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasAppointments && (
                      <Badge
                        className="mt-1 h-5 px-1.5 text-xs bg-green-600"
                      >
                        {appointments.length}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Hoje</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-300"></div>
              <span className="text-sm text-gray-600">Com agendamentos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments list for selected date */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate
              ? `Agendamentos - ${selectedDate.getDate()} de ${
                  monthNames[selectedDate.getMonth()]
                }`
              : 'Selecione uma data'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Clique em uma data no calendário para ver os agendamentos
              </p>
            </div>
          ) : selectedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Nenhum agendamento para esta data
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {selectedAppointments.map((exam) => {
                const employee = getEmployee(exam.employeeId);
                return (
                  <div
                    key={exam.id}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {getEmployeeName(exam.employeeId)}
                        </p>
                        <p className="text-sm text-gray-700 font-medium mt-1">
                          {exam.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Categoria: {exam.category}
                        </p>
                        {employee && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Mat: {employee.matricula}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {employee.setor}
                            </Badge>
                          </div>
                        )}
                        {exam.notes && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            Obs: {exam.notes}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-blue-600 flex-shrink-0">
                        Agendado
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
