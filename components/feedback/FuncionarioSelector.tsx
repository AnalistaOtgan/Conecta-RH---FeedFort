import React from "react";
import { Employee } from "../../types";
import { ChevronDownIcon } from "../icons";

// Helper components
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Avatar: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarFallback: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</span>;

interface FuncionarioSelectorProps {
    funcionarios: Employee[];
    selectedId: string;
    onChange: (id: string) => void;
}

export default function FuncionarioSelector({ funcionarios, selectedId, onChange }: FuncionarioSelectorProps) {
  
  return (
    <div className="space-y-2">
      <Label htmlFor="funcionario">Funcionário *</Label>
      <div className="relative">
        <select
          id="funcionario"
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full appearance-none rounded-lg border border-brand-gray bg-white px-3 py-2 pr-8 text-brand-text shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${!selectedId ? 'text-gray-500' : ''}`}
        >
          <option value="" disabled>Selecione um funcionário</option>
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.name} ({funcionario.shift})
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
      </div>
    </div>
  );
}