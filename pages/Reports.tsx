import React from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { CalendarIcon, ChevronDownIcon, DownloadIcon, FilterIcon } from '../components/icons';
import { DetailedFeedback, Employee } from '../types';

const Reports: React.FC = () => {
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
    
    // Make table data dynamic
    const recentFeedbacks = [...teamFeedbacks]
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(f => {
            const employee = teamEmployees.find(e => e.id === f.employeeId);
            return {
                id: f.id,
                employee: employee?.name || 'Desconhecido',
                date: new Date(f.date).toLocaleDateString('pt-BR'),
                score: f.finalScore,
                sector: employee?.sector || 'N/A',
                author: f.authorName
            }
        });
        
    // Calculate dynamic performance data
    const performanceBySector = teamFeedbacks.reduce((acc, feedback) => {
        const employee = teamEmployees.find(e => e.id === feedback.employeeId);
        if (employee) {
            const sectorName = employee.sector;
            if (!acc[sectorName]) {
                acc[sectorName] = { totalScore: 0, count: 0 };
            }
            acc[sectorName].totalScore += feedback.finalScore;
            acc[sectorName].count++;
        }
        return acc;
    }, {} as Record<string, { totalScore: number, count: number }>);

    const teamPerformanceData = Object.entries(performanceBySector).map(([name, data]) => ({
        name,
        media: data.count > 0 ? parseFloat((data.totalScore / data.count).toFixed(1)) : 0,
    }));
    
    const averageScore = teamFeedbacks.length > 0 ? teamFeedbacks.reduce((acc, f) => acc + f.finalScore, 0) / teamFeedbacks.length : 0;
    
    const participationRate = teamEmployees.length > 0 
        ? (new Set(teamFeedbacks.map(f => f.employeeId)).size / teamEmployees.length) * 100 
        : 0;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-brand-text">Relatórios de Desempenho</h2>
            <p className="text-brand-text-light">Analise os dados de feedback da sua equipe</p>
        </div>
        <button className="bg-brand-blue hover:bg-brand-dark-blue text-white font-bold py-2 px-4 rounded-lg flex items-center">
            <DownloadIcon className="w-5 h-5 mr-2"/>
            Exportar Relatório
        </button>
      </div>
      
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold flex items-center"><FilterIcon className="w-5 h-5 mr-2"/> Filtros</h3>
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                    <input type="text" placeholder="01/09/2025 - 30/09/2025" className="p-2 border rounded-md pr-10"/>
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                </div>
                <div className="relative">
                    <select className="p-2 border rounded-md bg-white appearance-none pr-8">
                        <option>Todos os Setores</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                </div>
                <div className="relative">
                    <select className="p-2 border rounded-md bg-white appearance-none pr-8">
                        <option>Todos os Funcionários</option>
                        {teamEmployees.map(e => <option key={e.id}>{e.name}</option>)}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                </div>
                 <button className="px-4 py-2 rounded-lg bg-gray-200 text-brand-text font-semibold hover:bg-gray-300">
                    Aplicar
                </button>
            </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm text-brand-text-light">PONTUAÇÃO MÉDIA GERAL</p>
            <p className="text-3xl font-bold">{averageScore.toFixed(1)}</p>
          </Card>
          <Card>
            <p className="text-sm text-brand-text-light">TOTAL DE FEEDBACKS</p>
            <p className="text-3xl font-bold">{recentFeedbacks.length}</p>
          </Card>
           <Card>
            <p className="text-sm text-brand-text-light">TAXA DE PARTICIPAÇÃO</p>
            <p className="text-3xl font-bold">{participationRate.toFixed(0)}%</p>
            <p className="text-sm text-brand-text-light">Funcionários com feedback</p>
          </Card>
      </div>

      <Card>
        <h3 className="font-bold text-lg mb-4">Performance por Setor</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="media" fill="#3B82F6" name="Média de Pontuação" />
            </BarChart>
        </ResponsiveContainer>
      </Card>

       <Card>
            <h3 className="font-bold text-lg mb-4">Últimos Feedbacks Registrados</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Funcionário</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Setor</th>
                            <th scope="col" className="px-6 py-3">Autor</th>
                            <th scope="col" className="px-6 py-3 text-right">Pontuação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentFeedbacks.map((fb) => (
                            <tr key={fb.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {fb.employee}
                                </th>
                                <td className="px-6 py-4">{fb.date}</td>
                                <td className="px-6 py-4">{fb.sector}</td>
                                <td className="px-6 py-4">{fb.author}</td>
                                <td className="px-6 py-4 text-right font-bold">{fb.score.toFixed(1)}/10</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
       </Card>
    </div>
  );
};

export default Reports;