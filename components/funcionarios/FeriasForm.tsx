import React, { useState } from 'react';
import Modal from '../Modal';

interface FeriasFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { startDate: string; endDate: string; periodoAquisitivo: string; observacoes?: string }) => void;
}

const FeriasForm: React.FC<FeriasFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    periodoAquisitivo: '',
    observacoes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.periodoAquisitivo || !formData.startDate || !formData.endDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onSubmit(formData);
  };
  
  const standardInputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-brand-gray rounded-lg shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Período de Férias">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className={standardInputClasses}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate}
              className={standardInputClasses}
            />
          </div>
        </div>
        <div>
          <label htmlFor="periodoAquisitivo" className="block text-sm font-medium text-gray-700">Período Aquisitivo</label>
          <input
            type="text"
            id="periodoAquisitivo"
            name="periodoAquisitivo"
            value={formData.periodoAquisitivo}
            onChange={handleChange}
            required
            placeholder="Ex: 2022/2023"
            className={standardInputClasses}
          />
        </div>
        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações (Opcional)</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
            placeholder="Alguma observação sobre as férias..."
            className={standardInputClasses}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue"
          >
            Salvar Férias
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeriasForm;
