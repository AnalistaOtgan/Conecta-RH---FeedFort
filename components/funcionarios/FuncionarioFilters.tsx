import React from "react";

// --- START: Local UI Components ---
const Select: React.FC<{value: string, onValueChange: (v: string) => void, children: React.ReactNode, disabled?: boolean}> = ({ value, onValueChange, children, disabled }) => (
    <div className="relative">
        <select value={value} onChange={e => onValueChange(e.target.value)} disabled={disabled} className="block w-full px-3 py-2 pr-8 bg-white border border-brand-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
            {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
);
const SelectContent: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>;
const SelectItem: React.FC<{value: string, children: React.ReactNode}> = ({ value, children }) => <option value={value}>{children}</option>;
const SelectTrigger: React.FC<{children: React.ReactNode}> = ({ children }) => <>{children}</>; // Placeholder, logic is in Select
const SelectValue: React.FC<{placeholder?: string}> = ({ placeholder }) => <>{placeholder}</>; // Placeholder, logic is in Select
// --- END: Local UI Components ---

export default function FuncionarioFilters({ filters, onFiltersChange, setores }) {
  const handleChange = (filterName, value) => {
    onFiltersChange(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Select value={filters.status} onValueChange={(val) => handleChange('status', val)}>
          <SelectItem value="ativo">Ativos</SelectItem>
          <SelectItem value="inativo">Inativos</SelectItem>
          <SelectItem value="all">Todos (Status)</SelectItem>
      </Select>
      
      <Select value={filters.turno} onValueChange={(val) => handleChange('turno', val)}>
          <SelectItem value="all">Todos os Turnos</SelectItem>
          <SelectItem value="abertura">Abertura</SelectItem>
          <SelectItem value="intermediario">Intermediário</SelectItem>
          <SelectItem value="fechamento">Fechamento</SelectItem>
      </Select>
      
      <Select value={filters.lider} onValueChange={(val) => handleChange('lider', val)}>
          <SelectItem value="all">Todos (Líder)</SelectItem>
          <SelectItem value="sim">Sim</SelectItem>
          <SelectItem value="nao">Não</SelectItem>
      </Select>
      
      <Select value={filters.setor} onValueChange={(val) => handleChange('setor', val)}>
          <SelectItem value="all">Todos os Setores</SelectItem>
          {setores.filter(s => s.ativo).map(s => (
            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
          ))}
      </Select>
    </div>
  );
}