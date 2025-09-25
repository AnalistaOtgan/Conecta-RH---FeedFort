import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowRightIcon } from '../components/icons';

const EmployeeDossier: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const { employees, feedbacks: allFeedbacks } = useData();

    const employee = employees.find(e => e.id === employeeId);
    const feedbacks = allFeedbacks.filter(f => f.employeeId === employeeId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
                             <button className="text-sm text-brand-blue font-semibold mt-2 flex items-center">
                                Ver Detalhes <ArrowRightIcon className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    )) : (
                        <p className="text-brand-text-light text-center py-4">Nenhum feedback registrado para este funcionário.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDossier;
