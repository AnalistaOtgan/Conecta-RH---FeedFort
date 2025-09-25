import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { PlusCircleIcon, SearchIcon, ChevronDownIcon } from '../components/icons';
import { Employee } from '../types';

const Employees: React.FC = () => {
    const { employees, sectors, addEmployee } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // FIX: Add state and handlers for the new employee modal form.
    const initialFormState = {
        name: '',
        role: '',
        sector: sectors[0]?.name || '',
        shift: 'Manhã',
        admissionDate: new Date().toISOString().split('T')[0],
    };
    const [newEmployeeData, setNewEmployeeData] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEmployeeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmployeeData.name || !newEmployeeData.role || !newEmployeeData.sector) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        addEmployee(newEmployeeData);
        setIsModalOpen(false);
        setNewEmployeeData(initialFormState);
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.sector.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    const getStatusClass = (status: 'Ativo' | 'Inativo') => {
        return status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">Gerenciamento de Funcionários</h2>
                    <p className="text-brand-text-light">Visualize e gerencie os dados da sua equipe</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Novo Funcionário
                </button>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Lista de Funcionários</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar funcionário..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded-md pl-10"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Cargo</th>
                                <th scope="col" className="px-6 py-3">Setor</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Admissão</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee: Employee) => (
                                <tr key={employee.id} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-brand-text mr-3 text-xs">{employee.initials}</div>
                                            {employee.name}
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{employee.role}</td>
                                    <td className="px-6 py-4">{employee.sector}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(employee.status)}`}>
                                            {employee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(employee.admissionDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <NavLink to={`/employees/${employee.id}`} className="font-medium text-brand-blue hover:underline">Ver Dossiê</NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Novo Funcionário">
                {/* FIX: Implement functional form for adding a new employee */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" value={newEmployeeData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <input type="text" name="role" value={newEmployeeData.role} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Setor</label>
                        <select name="sector" value={newEmployeeData.sector} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white appearance-none pr-8" required>
                            {sectors.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-9 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Turno</label>
                        <select name="shift" value={newEmployeeData.shift} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-white">
                            <option>Manhã</option>
                            <option>Tarde</option>
                            <option>Integral</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Data de Admissão</label>
                        <input type="date" name="admissionDate" value={newEmployeeData.admissionDate} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                    </div>
                     <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Employees;