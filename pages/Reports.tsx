
import React from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { CalendarIcon, ChevronDownIcon, DownloadIcon, FilterIcon } from '../components/icons';

const teamPerformanceData = [
  { name: 'Frente de Loja', media: 8.5 },
  { name: 'Mercearia', media: 7.2 },
  { name: 'Açougue', media: 9.1 },
  { name: 'Padaria', media: 6.8 },
];

const Reports: React.FC = () => {
    const { employees } = useData();

    // Mock recent feedbacks for report
    const recentFeedbacks = [
        { id: 1, employee: 'FERNANDA SILVA DOS SANTOS', date: '22/09/2025', score: 10, sector: 'Frente de Loja', author: 'Líder de Loja' },
        { id: 2, employee: 'BRENDON SOUSA DE OLIVEIRA', date: '22/09/2025', score: 0, sector: 'Mercearia', author: 'Líder de Loja' },
        { id: 3, employee: 'CARLOS ALBERTO PEREIRA', date: '21/09/2025', score: 8, sector: 'Açougue', author: 'Líder de Loja' },
        { id: 4, employee: 'MARIA EDUARDA GONÇALVES', date: '20/09/2025', score: 7, sector: 'Padaria', author: 'Líder de Loja' },
    ];

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
                        {employees.map(e => <option key={e.id}>{e.name}</option>)}
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
            <p className="text-3xl font-bold">5.0</p>
            <p className="text-sm text-green-500">+0.5 vs. mês passado</p>
          </Card>
          <Card>
            <p className="text-sm text-brand-text-light">TOTAL DE FEEDBACKS</p>
            <p className="text-3xl font-bold">{recentFeedbacks.length}</p>
            <p className="text-sm text-red-500">-10% vs. mês passado</p>
          </Card>
           <Card>
            <p className="text-sm text-brand-text-light">TAXA DE PARTICIPAÇÃO</p>
            <p className="text-3xl font-bold">85%</p>
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
                                <td className="px-6 py-4 text-right font-bold">{fb.score}/10</td>
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
