import React, { useState } from "react";
import Modal from "../Modal";
import { Section, Sector } from "../../types";

interface SecaoFormProps {
  secao: Section | null;
  setores: Sector[];
  onSubmit: (data: Omit<Section, 'id' | 'ativo'>) => void;
  onCancel: () => void;
}

export default function SecaoForm({ secao, setores, onSubmit, onCancel }: SecaoFormProps) {
  // FIX: Use 'name' and 'description' to match the Section type.
  const [formData, setFormData] = useState(secao || { name: "", description: "", setor_id: setores[0]?.id || "", ativo: true });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.setor_id) {
        alert("Por favor, selecione um setor.");
        return;
    }
    // FIX: Remove 'ativo' from the submitted object to match the onSubmit prop type.
    const { name, description, setor_id } = formData;
    onSubmit({ name, description, setor_id });
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title={secao ? 'Editar Seção' : 'Nova Seção'}>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Seção</label>
          <input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required 
                 className="w-full p-2 border rounded-md"/>
        </div>
        <div className="space-y-2">
          <label htmlFor="setor_id" className="block text-sm font-medium text-gray-700">Setor</label>
          <select value={formData.setor_id} onChange={(e) => handleChange('setor_id', e.target.value)} required
                  className="w-full p-2 border rounded-md bg-white">
            <option value="" disabled>Selecione um setor...</option>
            {/* FIX: Use 'name' property from Sector type. */}
            {setores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} 
                    className="w-full p-2 border rounded-md" rows={3}/>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button type="button" className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}