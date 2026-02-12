'use client';

import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEmployeesStore } from '@/lib/store/employeesStore';
import { formatCPF } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Buscar funcionários...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const employees = useEmployeesStore((state) => state.employees);

  const filteredEmployees = useMemo(() => {
    if (!query) return employees.slice(0, 10); // Show first 10 if no query

    const lowerQuery = query.toLowerCase();
    return employees
      .filter((employee) => {
        const nameMatch = employee.name.toLowerCase().includes(lowerQuery);
        const cpfMatch = employee.cpf.includes(query);
        const matriculaMatch = employee.matricula.includes(query);
        return nameMatch || cpfMatch || matriculaMatch;
      })
      .slice(0, 10); // Limit to 10 results
  }, [employees, query]);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
    if (value) {
      setDropdownOpen(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setDropdownOpen(false);
  };

  const selectEmployee = (employeeName: string) => {
    setQuery(employeeName);
    onSearch(employeeName);
    setDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          className="pl-10 pr-24"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Selecionar funcionário"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] p-0"
              align="end"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="max-h-96 overflow-y-auto">
                {filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nenhum funcionário encontrado
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-2">
                      FUNCIONÁRIOS ({filteredEmployees.length})
                    </div>
                    {filteredEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        onClick={() => selectEmployee(employee.name)}
                        className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors flex items-start gap-3 group"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Mat: {employee.matricula} | CPF: {formatCPF(employee.cpf)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {employee.setor}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {employee.cargo}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0"
                            >
                              {employee.examsCompleted.length} exames
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
