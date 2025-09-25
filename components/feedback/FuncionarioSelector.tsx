import React from "react";
import { Employee } from "../../types";

// Helper components
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Select: React.FC<{children: React.ReactNode, value: string, onValueChange: (val:string) => void, placeholder: string}> = ({children, value, onValueChange, placeholder}) => (
    <select value={value} onChange={e => onValueChange(e.target.value)} className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!value ? 'text-gray-500': ''}`}>
        <option value="" disabled>{placeholder}</option>
        {children}
    </select>
);
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
      <Select value={selectedId} onValueChange={onChange} placeholder="Selecione um funcionário">
          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.name} ({funcionario.shift})
            </option>
          ))}
      </Select>
    </div>
  );
}