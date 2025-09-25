import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { OccurrenceCategory } from '../types';
import { ArrowLeftIcon, BriefcaseIcon, CalendarIcon, PlusCircleIcon, AlertTriangleIcon, StarIcon } from '../components/icons';

const occurrenceTagColors: {[key in OccurrenceCategory]: string} = {
    [OccurrenceCategory.DesempenhoExcepcional]: 'bg-blue-100 text-blue-700',
    [OccurrenceCategory.PrecisaMelhorar]: 'bg-yellow-100 text-yellow-700',
    [OccurrenceCategory.Positivo]: 'bg-green-100 text-green-700',
    [OccurrenceCategory.ViolacaoPolitica]: 'bg-red-100 text-red-700',
}

const EmployeeDossier: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const { employees, feedbacks, loggedOccurrences, occurrences, addLoggedOccurrence } = useData();
    const { user } = useAuth();

    const employee = employees.find(e => e.id === employeeId);
    const employeeFeedbacks = feedbacks.filter(f => f.employeeId === employeeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const employeeLoggedOccurrences = loggedOccurrences.filter(o => o.employeeId === employeeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newOccurrenceId, setNewOccurrenceId] = useState('');
    const [newOccurrenceNotes, setNewOccurrenceNotes] = useState('');

    const handleAddOccurrence = () => {
        if (!newOccurrenceId || !employeeId) {
            alert('Selecione uma ocorrência.');
            return;
        }
        addLoggedOccurrence({
            employeeId,
            occurrenceId: newOccurrenceId,
            date: new Date().toISOString(),
            authorName: user?.name || 'Sistema',
            notes: newOccurrenceNotes
        });
        setIsModalOpen(false);
        setNewOccurrenceId('');
        setNewOccurrenceNotes('');
    };

    if (!employee) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">Funcionário não encontrado.</h2>
                <NavLink to="/employees" className="text-brand-blue hover:underline mt-4 inline-block">Voltar para a lista de funcionários</NavLink>
            </div>
        );
    }
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <NavLink to="/employees" className="p-2 rounded-md mr-2 hover:bg-gray-200">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </NavLink>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text">{employee.name}</h2>
                        <p className="text-brand-text-light">{employee.role}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-2xl mr-4">{employee.initials}</div>
                            <div>
                                <p className={`px-3 py-1 text-sm font-semibold inline-block rounded-full ${employee.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{employee.status}</p>
                            </div>
                        </div>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="font-semibold text-brand-text">Setor</dt><dd className="text-brand-text-light">{employee.sector}</dd></div>
                            <div className="flex justify-between"><dt className="font-semibold text-brand-text">Turno</dt><dd className="text-brand-text-light">{employee.shift}</dd></div>
                            <div className="flex justify-between"><dt className="font-semibold text-brand-text">Admissão</dt><dd className="text-brand-text-light">{formatDate(employee.admissionDate)}</dd></div>
                        </dl>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2 text-brand-blue" />Histórico Funcional</h3>
                        <p className="text-sm text-brand-text-light">Em breve: histórico de cargos, setores, líderes e avaliações de experiência.</p>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                     {user?.role === 'RH' && (
                        <Card className="bg-blue-50 border-brand-blue">
                             <h3 className="font-bold text-lg mb-2">Ação Rápida de RH</h3>
                             <p className="text-sm text-brand-text-light mb-4">Registre uma nova ocorrência para {employee.name.split(' ')[0]}.</p>
                             <button onClick={() => setIsModalOpen(true)} className="bg-brand-blue hover:bg-brand-dark-blue text-white font-semibold py-2 px-4 rounded-lg flex items-center w-full justify-center">
                                <PlusCircleIcon className="w-5 h-5 mr-2" />
                                Lançar Nova Ocorrência
                             </button>
                        </Card>
                     )}
                     
                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center"><StarIcon className="w-5 h-5 mr-2 text-yellow-500"/>Histórico de Feedbacks</h3>
                        <div className="space-y-4">
                            {employeeFeedbacks.length > 0 ? employeeFeedbacks.map(fb => (
                                <div key={fb.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-brand-text">{fb.authorName} em {formatDate(fb.date)}</p>
                                            <p className="text-sm text-brand-text-light mt-2 italic">"{fb.qualitative}"</p>
                                        </div>
                                        <span className={`text-lg font-bold px-3 py-1 rounded-md ${fb.finalScore >= 8 ? 'bg-green-100 text-green-700' : fb.finalScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {fb.finalScore.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-brand-text-light">Nenhum feedback registrado.</p>}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center"><AlertTriangleIcon className="w-5 h-5 mr-2 text-red-500"/>Log de Ocorrências</h3>
                        <div className="space-y-3">
                            {employeeLoggedOccurrences.length > 0 ? employeeLoggedOccurrences.map(lo => (
                                <div key={lo.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-brand-text">{lo.name}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${occurrenceTagColors[lo.category]}`}>{lo.category}</span>
                                    </div>
                                     <p className="text-sm text-brand-text-light mt-1">{lo.notes}</p>
                                     <p className="text-xs text-right text-gray-400 mt-2">Registrado por {lo.authorName} em {formatDate(lo.date)}</p>
                                </div>
                            )) : <p className="text-sm text-brand-text-light">Nenhuma ocorrência registrada.</p>}
                        </div>
                    </Card>
                </div>
            </div>
            
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Lançar Nova Ocorrência">
                <div className="space-y-4">
                    <p>Funcionário: <span className="font-semibold">{employee.name}</span></p>
                    <div>
                        <label htmlFor="occurrenceSelect" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ocorrência</label>
                        <select id="occurrenceSelect" value={newOccurrenceId} onChange={(e) => setNewOccurrenceId(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                            <option value="">Selecione...</option>
                            {occurrences.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="occurrenceNotes" className="block text-sm font-medium text-gray-700 mb-1">Notas / Detalhes</label>
                        <textarea id="occurrenceNotes" value={newOccurrenceNotes} onChange={(e) => setNewOccurrenceNotes(e.target.value)} className="w-full p-2 border rounded-md" rows={4} placeholder="Descreva os detalhes da ocorrência..."></textarea>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                        <button onClick={handleAddOccurrence} className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar Ocorrência</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeDossier;