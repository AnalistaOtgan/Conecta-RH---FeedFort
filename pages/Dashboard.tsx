import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import { ArrowRightIcon, PlusCircleIcon } from '../components/icons';
import { useData } from '../context/DataContext';

const feedbackTrendData = [
  { name: '19/09', Quantidade: 1 },
  { name: '21/09', Quantidade: 2 },
  { name: '23/09', Quantidade: 1 },
  { name: '25/09', Quantidade: 0 },
];

const performanceData = [
    { name: 'Excelente (8-10)', value: 1, color: '#22C55E' },
    { name: 'Bom (6-7.9)', value: 0, color: '#FBBF24' },
    { name: 'Precisa Melhorar (4-5.9)', value: 0, color: '#F97316' },
    { name: 'Crítico (0-3.9)', value: 1, color: '#EF4444' },
];

const topPerformers = [
    { name: 'FERNANDA...', score: '10/10', initials: 'FE', feedbacks: 1 },
    { name: 'BRENDON...', score: '0/10', initials: 'BR', feedbacks: 1 },
]

const recentFeedbacks = [
    { name: 'BRENDON SOUSA DE OLIVEIRA', date: '22 de set às 02:52', activities: 8, score: 0 },
    { name: 'FERNANDA SILVA DOS SANTOS', date: '22 de set às 02:49', activities: 9, score: 10 },
]

const Dashboard: React.FC = () => {
  const { employees } = useData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Bem-vindo ao Dashboard</h2>
          <p className="text-brand-text-light">Acompanhe o desempenho e feedback da sua equipe em tempo real</p>
        </div>
        <NavLink to="/feedback" className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Novo Feedback
        </NavLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-brand-text-light">TOTAL DE FEEDBACKS</p>
          <p className="text-3xl font-bold">2</p>
          <p className="text-sm text-green-500">+12% esta semana</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">FUNCIONÁRIOS ATIVOS</p>
          <p className="text-3xl font-bold">{employees.length}</p>
          <p className="text-sm text-green-500">+2 novos este mês</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">PONTUAÇÃO MÉDIA</p>
          <p className="text-3xl font-bold">5.0/10</p>
          <p className="text-sm text-red-500">-0.3 pontos</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">FEEDBACK HOJE</p>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-brand-text-light">Meta: 15 feedbacks</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Tendência de Feedback - Última Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip wrapperClassName="rounded-lg border bg-white shadow-sm" />
                <Bar dataKey="Quantidade" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </Card>
        <div className="space-y-6">
            <Card>
                 <h3 className="font-bold text-lg mb-4">Top Performers</h3>
                 <div className="space-y-4">
                    {topPerformers.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-brand-text-light mr-3">#{i+1}</span>
                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-brand-text mr-3">{p.initials}</div>
                                <div>
                                    <p className="text-sm font-semibold">{p.name}</p>
                                    <p className="text-xs text-brand-text-light">{p.feedbacks} feedback</p>
                                </div>
                            </div>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${p.score.startsWith('10') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.score}</span>
                        </div>
                    ))}
                 </div>
            </Card>
        </div>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
                <h3 className="font-bold text-lg mb-4">Visão Geral de Performance</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={performanceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                            {performanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                 <div className="mt-4 space-y-2">
                    {performanceData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                                <span>{entry.name}</span>
                            </div>
                            <span>{entry.value}</span>
                        </div>
                    ))}
                </div>
            </Card>
             <Card className="lg:col-span-2">
                 <h3 className="font-bold text-lg mb-4">Feedbacks Recentes</h3>
                 <div className="space-y-4">
                    {recentFeedbacks.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                            <div>
                                <p className="font-semibold">{f.name}</p>
                                <p className="text-sm text-brand-text-light">{f.date} • {f.activities} atividades</p>
                            </div>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${f.score === 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{f.score}/10</span>
                        </div>
                    ))}
                 </div>
             </Card>
       </div>

       <Card>
            <h3 className="font-bold text-lg mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NavLink to="/feedback" className="flex justify-between items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <span className="font-semibold">Dar Feedback</span>
                    <ArrowRightIcon className="w-5 h-5 text-brand-text-light"/>
                </NavLink>
                <NavLink to="/reports" className="flex justify-between items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <span className="font-semibold">Ver Relatórios</span>
                    <ArrowRightIcon className="w-5 h-5 text-brand-text-light"/>
                </NavLink>
                <NavLink to="/employees" className="flex justify-between items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <span className="font-semibold">Gerenciar Equipe</span>
                    <ArrowRightIcon className="w-5 h-5 text-brand-text-light"/>
                </NavLink>
            </div>
       </Card>
    </div>
  );
};

export default Dashboard;
