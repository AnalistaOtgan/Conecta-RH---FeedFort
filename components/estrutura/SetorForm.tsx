import React, { useState } from "react";
import Modal from "../Modal";
import { Sector } from "../../types";

interface SetorFormProps {
  setor: Sector | null;
  onSubmit: (data: Omit<Sector, 'id' | 'sections' | 'ativo'>) => void;
  onCancel: () => void;
}

export default function SetorForm({ setor, onSubmit, onCancel }: SetorFormProps) {
  // FIX: Use 'name' and 'description' to match the Sector type.
  const [formData, setFormData] = useState(setor || { name: "", description: "", ativo: true });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Remove 'ativo' from submitted object to match onSubmit prop type.
    const { name, description } = formData;
    onSubmit({ name, description });
  };
  
  const standardInputClasses = "block w-full px-3 py-2 bg-white border border-brand-gray rounded-md shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <Modal isOpen={true} onClose={onCancel} title={setor ? 'Editar Setor' : 'Novo Setor'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Setor</label>
            <input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required 
                   className={standardInputClasses}/>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} 
                      className={standardInputClasses} rows={3} />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button type="button" className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
          </div>
        </form>
    </Modal>
  );
}