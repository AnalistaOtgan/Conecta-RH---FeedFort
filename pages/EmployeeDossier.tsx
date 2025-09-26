import React, { useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowRightIcon, BuildingIcon, LayersIcon, ClipboardListIcon, PlusCircleIcon, StarIcon, MessageSquareIcon, PlaneIcon } from '../components/icons';
import AtestadoForm from '../components/funcionarios/AtestadoForm';
import FeriasForm from '../components/funcionarios/FeriasForm';
import FeedbackDetailModal from '../components/feedback/FeedbackDetailModal';
import { DetailedFeedback } from '../types';

const TabButton: React.FC<{
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 font-semibold text-sm rounded-md transition-colors ${
            isActive
                ? 'bg-blue-100 text-brand-blue'
                : 'text-brand-text-light hover:bg-gray-100'
        }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);


const EmployeeDossier: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const { user } = useAuth();
    const { employees, feedbacks: allFeedbacks, sections, sectors, medicalCertificates, addMedicalCertificate, ferias: allFerias, addFerias } = useData();
    const [isAtestadoModalOpen, setIsAtestadoModalOpen] = useState(false);
    const [isFeriasModalOpen, setIsFeriasModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<DetailedFeedback | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    const employee = employees.find(e => e.id === employeeId);
    const feedbacks = allFeedbacks.filter(f => f.employeeId === employeeId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const atestados = medicalCertificates.filter(mc => mc.employeeId === employeeId)
        .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    const ferias = allFerias.filter(f => f.employeeId === employeeId)
        .sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());


    if (!employee) {
        return (
            <Card>
                <h2 className="text-xl font-bold text-red-600">Funcionário não encontrado.</h2>
                <p>O ID do funcionário fornecido não corresponde a nenhum registro.</p>
                <NavLink to="/employees" className="text-brand-blue hover:underline mt-4 inline-block">Voltar para a lista</NavLink>
            </Card>
        );
    }
    
    const averageScore = feedbacks.length > 0 ? feedbacks.reduce((acc, f) => acc + f.finalScore, 0) / feedbacks.length : 0;
    
    const performanceData = feedbacks.reduce((acc, f) => {
        if(f.finalScore >= 8) acc[0].value++;
        else if (f.finalScore >= 6) acc[1].value++;
        else if (f.finalScore >= 4) acc[2].value++;
        else acc[3].value++;
        return acc;
    }, [
        { name: 'Excelente', value: 0, color: '#22C55E' },
        { name: 'Bom', value: 0, color: '#FBBF24' },
        { name: 'A Melhorar', value: 0, color: '#F97316' },
        { name: 'Crítico', value: 0, color: '#EF4444' },
    ]);

    const feedbackHistoryData = feedbacks.map(f => ({
        name: new Date(f.date).toLocaleDateString('pt-BR', {month: 'short', day: 'numeric'}),
        Pontuação: f.finalScore
    })).reverse();
    
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');


    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <p className="text-sm text-brand-text-light">PONTUAÇÃO MÉDIA</p>
                                <p className="text-3xl font-bold">{averageScore.toFixed(1)}/10</p>
                            </Card>
                            <Card>
                                <p className="text-sm text-brand-text-light">TOTAL DE FEEDBACKS</p>
                                <p className="text-3xl font-bold">{feedbacks.length}</p>
                            </Card>
                            <Card>
                                <p className="text-sm text-brand-text-light">DATA DE ADMISSÃO</p>
                                <p className="text-3xl font-bold">{new Date(employee.admissionDate).toLocaleDateString('pt-BR')}</p>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <Card className="lg:col-span-3">
                                <h3 className="font-bold text-lg mb-4">Histórico de Pontuação</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={feedbackHistoryData}>
                                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                                        <YAxis stroke="#6B7280" fontSize={12} domain={[0, 10]} />
                                        <Tooltip />
                                        <Bar dataKey="Pontuação" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                            <Card className="lg:col-span-2">
                                <h3 className="font-bold text-lg mb-4">Distribuição de Performance</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={performanceData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} dataKey="value">
                                            {performanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>
                    </div>
                );
            case 'feedbacks':
                return (
                    <Card>
                        <h3 className="font-bold text-lg mb-4">Histórico de Feedbacks</h3>
                        <div className="space-y-4">
                            {feedbacks.length > 0 ? feedbacks.map(f => (
                                <div key={f.id} className="p-4 rounded-lg border hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Feedback de <span className="text-brand-blue">{f.authorName}</span></p>
                                            <p className="text-sm text-brand-text-light">{new Date(f.date).toLocaleString('pt-BR')}</p>
                                        </div>
                                        <span className={`text-sm font-bold px-2 py-1 rounded ${f.finalScore >= 8 ? 'bg-green-100 text-green-700' : f.finalScore >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{f.finalScore.toFixed(1)}/10</span>
                                    </div>
                                    <p className="mt-2 text-sm italic">"{f.qualitative}"</p>
                                    <button onClick={() => setSelectedFeedback(f)} className="text-sm text-brand-blue font-semibold mt-2 flex items-center hover:underline">
                                        Ver Detalhes <ArrowRightIcon className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-brand-text-light text-center py-4">Nenhum feedback registrado para este funcionário.</p>
                            )}
                        </div>
                    </Card>
                );
            case 'cargos':
                return (
                     <Card>
                        <h3 className="font-bold text-lg mb-6">Histórico de Cargos</h3>
                        <div className="relative pl-4 border-l-2 border-gray-200">
                            {(employee.jobHistory && employee.jobHistory.length > 0) ? 
                                [...employee.jobHistory].reverse().map((job, index, arr) => {
                                    const section = sections.find(s => s.id === job.sectionId);
                                    const sector = section ? sectors.find(s => s.id === section.setor_id) : null;
                                    const isCurrent = !job.endDate;
                                    return (
                                        <div key={index} className={`relative ${index === arr.length - 1 ? '' : 'pb-8'}`}>
                                            <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${isCurrent ? 'bg-blue-500 ring-4 ring-blue-100' : 'bg-gray-300'}`}></div>
                                            <div className="ml-6">
                                                <div className="flex justify-between items-center">
                                                <p className={`font-semibold ${isCurrent ? 'text-brand-blue' : 'text-brand-text'}`}>{job.role}</p>
                                                <span className="text-sm text-brand-text-light">{formatDate(job.startDate)} - {job.endDate ? formatDate(job.endDate) : 'Presente'}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1 text-sm text-brand-text-light">
                                                    <span className="flex items-center gap-1.5"><BuildingIcon className="w-4 h-4" /> {sector?.name || 'N/A'}</span>
                                                    <span className="flex items-center gap-1.5"><LayersIcon className="w-4 h-4" /> {section?.name || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) 
                                : (
                                <p className="text-brand-text-light text-center py-4">Nenhum histórico de cargos encontrado.</p>
                            )}
                        </div>
                    </Card>
                );
            case 'atestados':
                 return (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg flex items-center"><ClipboardListIcon className="w-6 h-6 mr-3 text-brand-blue" />Histórico de Atestados</h3>
                            {(user?.role === 'RH' || user?.role === 'Diretor') && (
                                <button
                                    onClick={() => setIsAtestadoModalOpen(true)}
                                    className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg font-semibold text-sm hover:bg-brand-dark-blue"
                                >
                                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                                    Adicionar Atestado
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {atestados.length > 0 ? atestados.map(atestado => (
                                <div key={atestado.id} className="p-4 rounded-lg border bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <p className="font-semibold text-brand-text">{atestado.reason}</p>
                                            <p className="text-sm text-brand-text-light">
                                                {formatDate(atestado.startDate)} a {formatDate(atestado.endDate)}
                                            </p>
                                        </div>
                                        {atestado.cid && (
                                            <span className="mt-2 sm:mt-0 text-xs font-semibold bg-gray-200 text-brand-text-light px-2 py-1 rounded-full">
                                                CID: {atestado.cid}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-brand-text-light text-center py-4">Nenhum atestado registrado para este funcionário.</p>
                            )}
                        </div>
                    </Card>
                 );
            case 'ferias':
                return (
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg flex items-center"><PlaneIcon className="w-6 h-6 mr-3 text-brand-blue" />Histórico de Férias</h3>
                            {(user?.role === 'RH' || user?.role === 'Diretor') && (
                                <button
                                    onClick={() => setIsFeriasModalOpen(true)}
                                    className="flex items-center px-4 py-2 bg-brand-blue text-white rounded-lg font-semibold text-sm hover:bg-brand-dark-blue"
                                >
                                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                                    Adicionar Férias
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {ferias.length > 0 ? ferias.map(f => (
                                <div key={f.id} className="p-4 rounded-lg border bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <p className="font-semibold text-brand-text">Período Aquisitivo: {f.periodoAquisitivo}</p>
                                            <p className="text-sm text-brand-text-light">
                                                {formatDate(f.startDate)} a {formatDate(f.endDate)}
                                            </p>
                                        </div>
                                        {f.observacoes && (
                                            <p className="mt-2 sm:mt-0 text-xs text-brand-text-light italic">
                                                Obs: {f.observacoes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-brand-text-light text-center py-4">Nenhum período de férias registrado.</p>
                            )}
                        </div>
                    </Card>
                );
            default: return null;
        }
    }


    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center font-bold text-brand-text text-3xl">{employee.initials}</div>
                    <div>
                        <h2 className="text-3xl font-bold text-brand-text">{employee.name}</h2>
                        <p className="text-brand-text-light">{employee.role} • {employee.sector}</p>
                        <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${employee.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{employee.status}</span>
                    </div>
                </div>
            </Card>

            <Card>
                 <div className="p-2 border-b grid grid-cols-2 md:grid-cols-5 gap-2">
                    <TabButton label="Visão Geral" icon={StarIcon} isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <TabButton label="Feedbacks" icon={MessageSquareIcon} isActive={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')} />
                    <TabButton label="Cargos" icon={BuildingIcon} isActive={activeTab === 'cargos'} onClick={() => setActiveTab('cargos')} />
                    <TabButton label="Atestados" icon={ClipboardListIcon} isActive={activeTab === 'atestados'} onClick={() => setActiveTab('atestados')} />
                    <TabButton label="Férias" icon={PlaneIcon} isActive={activeTab === 'ferias'} onClick={() => setActiveTab('ferias')} />
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </Card>


            {isAtestadoModalOpen && (
                <AtestadoForm
                    isOpen={isAtestadoModalOpen}
                    onClose={() => setIsAtestadoModalOpen(false)}
                    onSubmit={(data) => {
                        if(employeeId) {
                            addMedicalCertificate({ ...data, employeeId });
                        }
                        setIsAtestadoModalOpen(false);
                    }}
                />
            )}

            {isFeriasModalOpen && (
                <FeriasForm
                    isOpen={isFeriasModalOpen}
                    onClose={() => setIsFeriasModalOpen(false)}
                    onSubmit={(data) => {
                        if(employeeId) {
                            addFerias({ ...data, employeeId });
                        }
                        setIsFeriasModalOpen(false);
                    }}
                />
            )}

            {selectedFeedback && employee && (
                <FeedbackDetailModal
                    isOpen={!!selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                    feedback={selectedFeedback}
                    employeeName={employee.name}
                />
            )}
        </div>
    );
};

export default EmployeeDossier;