import React, { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Employee } from '../types';
import { PlusCircleIcon, ChevronDownIcon, EditIcon, TrashIcon, EyeIcon } from '../components/icons';
import { NavLink } from 'react-router-dom';

const EmployeeCard: React.FC<{ employee: Employee }> = ({ employee }) => (
    <Card className="!p-4 flex flex-col justify-between">
        <div>
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold mr-3">{employee.initials}</div>
                <div>
                    <p className="font-bold text-brand-text">{employee.name}</p>
                    <p className="text-sm text-brand-text-light">{employee.role}</p>
                </div>
            </div>
            <div className="text-sm text-brand-text-light space-y-1 mt-4">
                <p><strong>Setor:</strong> {employee.sector}</p>
                <p><strong>Líder:</strong> {employee.leaderName || 'N/A'}</p>
                <p><strong>Turno:</strong> {employee.shift}</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{employee.status}</span></p>
            </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2 border-t pt-3">
             <NavLink to={`/employees/${employee.id}`} className="p-2 text-brand-text-light hover:text-brand-blue" title="Ver Dossiê">
                <EyeIcon className="w-4 h-4"/>
            </NavLink>
             <button className="p-2 text-brand-text-light hover:text-brand-blue" title="Editar"><EditIcon className="w-4 h-4"/></button>
             <button className="p-2 text-brand-text-light hover:text-red-500" title="Remover"><TrashIcon className="w-4 h-4"/></button>
        </div>
    </Card>
);

const Employees: React.FC = () => {
  const { employees, addEmployee, users } = useData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialNewEmployeeState = { name: '', role: '', sector: '', shift: '', leaderId: '', status: 'Ativo' as const };
  const [newEmployee, setNewEmployee] = useState(initialNewEmployeeState);
  
  const leaders = users.filter(u => u.role === 'Líder de Loja');

  const displayedEmployees = user?.role === 'Líder de Loja'
    ? employees.filter(e => e.leaderId === user.id)
    : employees;

  const handleAddEmployee = () => {
      const leader = leaders.find(l => l.id === newEmployee.leaderId);
      addEmployee({
          name: newEmployee.name,
          role: newEmployee.role,
          sector: newEmployee.sector,
          shift: newEmployee.shift,
          status: newEmployee.status,
          leaderId: newEmployee.leaderId || undefined,
          leaderName: leader ? leader.name : undefined
      });
      setIsModalOpen(false);
      setNewEmployee(initialNewEmployeeState);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">
            {user?.role === 'Líder de Loja' ? 'Minha Equipe' : 'Funcionários'}
        </h2>
        <p className="text-brand-text-light">Gerencie os dados e informações dos funcionários</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <input type="text" placeholder="Buscar funcionário..." className="p-2 border rounded-md" />
            <div className="relative">
                <select className="p-2 border rounded-md bg-white appearance-none pr-8">
                    <option>Todos os setores</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
            </div>
            <div className="relative">
                <select className="p-2 border rounded-md bg-white appearance-none pr-8">
                    <option>Todos os turnos</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
            </div>
             <div className="relative">
                <select className="p-2 border rounded-md bg-white appearance-none pr-8">
                    <option>Ativos</option>
                    <option>Inativos</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Novo Funcionário
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedEmployees.map(employee => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Funcionário">
        <div className="space-y-4">
            <input type="text" placeholder="Nome" value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full p-2 border rounded-md"/>
            <input type="text" placeholder="Cargo" value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} className="w-full p-2 border rounded-md"/>
            <input type="text" placeholder="Setor" value={newEmployee.sector} onChange={(e) => setNewEmployee({...newEmployee, sector: e.target.value})} className="w-full p-2 border rounded-md"/>
            <select value={newEmployee.shift} onChange={(e) => setNewEmployee({...newEmployee, shift: e.target.value})} className="w-full p-2 border rounded-md bg-white">
                <option value="">Selecione o Turno</option>
                <option value="Abertura">Abertura</option>
                <option value="Fechamento">Fechamento</option>
                <option value="Intermediário">Intermediário</option>
            </select>
            <select value={newEmployee.leaderId} onChange={(e) => setNewEmployee({...newEmployee, leaderId: e.target.value})} className="w-full p-2 border rounded-md bg-white">
                <option value="">Selecione o Líder</option>
                {leaders.map(leader => (
                    <option key={leader.id} value={leader.id}>{leader.name}</option>
                ))}
            </select>
            <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                <button onClick={handleAddEmployee} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar</button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;