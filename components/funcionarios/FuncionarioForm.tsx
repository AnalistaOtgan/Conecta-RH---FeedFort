import React, { useState } from "react";
import { User } from "../../types";
import { ChevronDownIcon } from "../icons";

// --- START: Local UI Components ---
const Dialog: React.FC<{open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode}> = ({ children }) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">{children}</div>;
const DialogContent: React.FC<{className?: string, children: React.ReactNode}> = ({ children, className }) => <div className={`relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md ${className}`}>{children}</div>;
const DialogHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;
const DialogFooter: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string}> = ({ children, className, variant, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2 ${variant === 'outline' ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-brand-blue text-white hover:bg-brand-dark-blue'} disabled:opacity-50 ${className}`} {...props}>{children}</button>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input className={`block w-full px-3 py-2 bg-white border border-brand-gray rounded-md shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${props.className}`} {...props} />;
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => <label className="text-sm font-medium text-gray-700" {...props} />;
const Select: React.FC<{value: string, onValueChange: (v: string) => void, children: React.ReactNode, disabled?: boolean}> = ({ value, onValueChange, children, disabled }) => (
    <div className="relative">
        <select value={value} onChange={e => onValueChange(e.target.value)} disabled={disabled} className="block w-full appearance-none rounded-md border border-brand-gray bg-white px-3 py-2 pr-8 text-brand-text shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
            {children}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
    </div>
);
const SelectItem: React.FC<{value: string, children: React.ReactNode}> = ({ value, children }) => <option value={value}>{children}</option>;
const Switch: React.FC<{checked: boolean, onCheckedChange: (c: boolean) => void, id: string}> = ({checked, onCheckedChange, id}) => (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={`${checked ? 'bg-brand-blue' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}>
        <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
    </button>
);
const Separator: React.FC = () => <hr className="border-gray-200" />;
// --- END: Local UI Components ---

export default function FuncionarioForm({ funcionario, setores, secoes, onSubmit, onCancel, currentUser }) {
  const [formData, setFormData] = useState(funcionario || {
    nome_completo: "",
    email: "",
    secao_id: "",
    turno: "abertura",
    eh_lider: false,
    setores_liderados: [],
    ativo: true,
    isUser: false,
  });
  
  const [selectedSetor, setSelectedSetor] = useState(secoes.find(s => s.id === formData.secao_id)?.setor_id || "");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSetorChange = (setorId) => {
    setSelectedSetor(setorId);
    const currentSecao = secoes.find(s => s.id === formData.secao_id);
    if (currentSecao?.setor_id !== setorId) {
      handleChange('secao_id', '');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const availableSecoes = secoes.filter(s => s.setor_id === selectedSetor && s.ativo);
  const isAdmin = currentUser.role === 'RH' || currentUser.role === 'Diretor';

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input id="nome_completo" value={formData.nome_completo} onChange={(e) => handleChange('nome_completo', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Select value={selectedSetor} onValueChange={handleSetorChange}>
                <option value="" disabled>Selecione...</option>
                {setores.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secao_id">Seção</Label>
              <Select value={formData.secao_id} onValueChange={(val) => handleChange('secao_id', val)} disabled={!selectedSetor}>
                <option value="" disabled>Selecione...</option>
                {availableSecoes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="turno">Turno</Label>
            <Select value={formData.turno} onValueChange={(val) => handleChange('turno', val)}>
              <SelectItem value="abertura">Abertura</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="fechamento">Fechamento</SelectItem>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch id="eh_lider" checked={formData.eh_lider} onCheckedChange={(val) => handleChange('eh_lider', val)} />
              <Label htmlFor="eh_lider">É líder?</Label>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <Switch id="isUser" checked={formData.isUser} onCheckedChange={(val) => handleChange('isUser', val)} />
                <Label htmlFor="isUser">Criar acesso de usuário</Label>
              </div>
            )}
          </div>
          {formData.eh_lider && (
             <div className="space-y-2">
                <Label htmlFor="setores_liderados">Setores Liderados</Label>
                <p className="text-xs text-gray-500">Funcionalidade de seleção múltipla em desenvolvimento.</p>
             </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}