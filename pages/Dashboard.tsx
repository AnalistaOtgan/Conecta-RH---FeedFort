import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../components/Card';
import { ArrowRightIcon, PlusCircleIcon } from '../components/icons';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { DetailedFeedback, Employee } from '../types';

const Dashboard: React.FC = () => {
  const { employees, feedbacks } = useData();
  const { user } = useAuth();

  // Filter data based on user role
  let teamEmployees: Employee[] = employees;
  let teamFeedbacks: DetailedFeedback[] = feedbacks;

  if (user?.role === 'Líder de Loja') {
    teamEmployees = employees.filter(e => e.leaderId === user.id);
    const teamEmployeeIds = teamEmployees.map(e => e.id);
    teamFeedbacks = feedbacks.filter(f => teamEmployeeIds.includes(f.employeeId));
  }

  // Calculate stats based on filtered data
  const totalFeedbacks = teamFeedbacks.length;
  const activeEmployees = teamEmployees.filter(e => e.status === 'Ativo').length;
  const averageScore = totalFeedbacks > 0 ? teamFeedbacks.reduce((acc, f) => acc + f.finalScore, 0) / totalFeedbacks : 0;
  
  const feedbacksToday = teamFeedbacks.filter(f => new Date(f.date).toDateString() === new Date().toDateString()).length;

  const feedbackTrendData = teamFeedbacks.reduce((acc, f) => {
      const date = new Date(f.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'});
      const found = acc.find(item => item.name === date);
      if (found) {
          found.Quantidade++;
      } else {
          acc.push({ name: date, Quantidade: 1 });
      }
      return acc;
  }, [] as {name: string, Quantidade: number}[]).slice(-7);


    const performanceData = teamFeedbacks.reduce((acc, f) => {
        if(f.finalScore >= 8) acc[0].value++;
        else if (f.finalScore >= 6) acc[1].value++;
        else if (f.finalScore >= 4) acc[2].value++;
        else acc[3].value++;
        return acc;
    }, [
        { name: 'Excelente (8-10)', value: 0, color: '#22C55E' },
        { name: 'Bom (6-7.9)', value: 0, color: '#FBBF24' },
        { name: 'Precisa Melhorar (4-5.9)', value: 0, color: '#F97316' },
        { name: 'Crítico (0-3.9)', value: 0, color: '#EF4444' },
    ]);
    
    const employeeScores: {[key: string]: {totalScore: number, count: number}} = teamFeedbacks.reduce((acc, f) => {
        if(!acc[f.employeeId]) acc[f.employeeId] = { totalScore: 0, count: 0 };
        acc[f.employeeId].totalScore += f.finalScore;
        acc[f.employeeId].count++;
        return acc;
    }, {} as {[key: string]: {totalScore: number, count: number}});

    const topPerformers = Object.entries(employeeScores)
        .map(([employeeId, data]) => {
            const employee = teamEmployees.find(e => e.id === employeeId);
            return {
                name: employee?.name || 'Desconhecido',
                initials: employee?.initials || '??',
                feedbacks: data.count,
                score: data.totalScore / data.count
            }
        })
        .sort((a,b) => b.score - a.score)
        .slice(0, 2);
    
    const recentFeedbacks = [...teamFeedbacks]
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2)
        .map(f => {
            const employee = teamEmployees.find(e => e.id === f.employeeId);
            return {
                name: employee?.name || 'Desconhecido',
                date: new Date(f.date).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'}),
                activities: f.activities.length,
                score: f.finalScore
            }
        });


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
          <p className="text-3xl font-bold">{totalFeedbacks}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">FUNCIONÁRIOS ATIVOS</p>
          <p className="text-3xl font-bold">{activeEmployees}</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">PONTUAÇÃO MÉDIA</p>
          <p className="text-3xl font-bold">{averageScore.toFixed(1)}/10</p>
        </Card>
        <Card>
          <p className="text-sm text-brand-text-light">FEEDBACK HOJE</p>
          <p className="text-3xl font-bold">{feedbacksToday}</p>
          <p className="text-sm text-brand-text-light">Meta: 15 feedbacks</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-4">Tendência de Feedback - Última Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feedbackTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} allowDecimals={false} />
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
                                    <p className="text-sm font-semibold truncate" title={p.name}>{p.name.split(' ')[0]}...</p>
                                    <p className="text-xs text-brand-text-light">{p.feedbacks} feedback(s)</p>
                                </div>
                            </div>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${p.score >= 8 ? 'bg-green-100 text-green-700' : p.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.score.toFixed(1)}/10</span>
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
                            <span className={`text-sm font-bold px-2 py-1 rounded ${f.score >= 8 ? 'bg-green-100 text-green-700' : f.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{f.score.toFixed(1)}/10</span>
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