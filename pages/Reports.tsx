import React from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { ChevronDownIcon, DownloadIcon, FilterIcon, FileTextIcon } from '../components/icons';

const Reports: React.FC = () => {
    const { employees, sectors } = useData();
    const leaders = employees.filter(e => e.role.toLowerCase().includes('líder'));

    const reportTypes = [
        {
            title: 'Resumo de Performance',
            description: 'Relatório consolidado com médias de performance por funcionário, setor e período.',
        },
        {
            title: 'Frequência de Feedback',
            description: 'Análise da frequência de feedback fornecido por líder e recebido por funcionário.',
        },
        {
            title: 'Relatório de Ocorrências',
            description: 'Detalha todas as ocorrências (positivas e negativas) registradas no período.',
        },
        {
            title: 'Evolução de Atributos',
            description: 'Mostra a evolução dos atributos de performance para um funcionário ou setor.',
        },
        {
            title: 'Comparativo de Performance',
            description: 'Compare a performance entre funcionários ou setores.',
        },
        {
            title: 'Feedback Qualitativo',
            description: 'Exporta todos os feedbacks qualitativos para análise de texto.',
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-brand-text">Relatórios</h2>
                <p className="text-brand-text-light">Gere e visualize relatórios detalhados de performance e feedback</p>
            </div>
          
            <Card>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold flex items-center text-brand-text">
                        <FilterIcon className="w-6 h-6 mr-3 text-brand-blue"/> Filtros
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
                        <div className="relative">
                            <select className="w-full p-2 border border-brand-gray rounded-lg bg-white appearance-none pr-8">
                                <option>Todos os funcionários</option>
                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Líder</label>
                        <div className="relative">
                            <select className="w-full p-2 border border-brand-gray rounded-lg bg-white appearance-none pr-8">
                                <option>Todos os líderes</option>
                                {leaders.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                        <div className="relative">
                            <select className="w-full p-2 border border-brand-gray rounded-lg bg-white appearance-none pr-8">
                                <option>Todos os setores</option>
                                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <div className="relative">
                             <select className="w-full p-2 border border-brand-gray rounded-lg bg-white appearance-none pr-8">
                                <option>Últimos 30 dias</option>
                                <option>Este mês</option>
                                <option>Mês passado</option>
                                <option>Últimos 90 dias</option>
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">
                        Aplicar Filtros
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report, index) => (
                    <Card key={index} className="flex flex-col">
                        <div className="flex items-start mb-4">
                            <FileTextIcon className="w-8 h-8 mr-4 text-brand-blue flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-bold text-brand-text">{report.title}</h3>
                                <p className="text-sm text-brand-text-light mt-1">{report.description}</p>
                            </div>
                        </div>
                        <div className="mt-auto space-y-3 pt-4">
                            <button className="w-full flex items-center justify-center px-4 py-2 border border-brand-gray rounded-lg text-brand-text font-semibold hover:bg-gray-50">
                                <FileTextIcon className="w-5 h-5 mr-2" />
                                Visualizar Relatório
                            </button>
                            <button className="w-full flex items-center justify-center px-4 py-2 border border-brand-gray rounded-lg text-brand-text font-semibold hover:bg-gray-50">
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Baixar PDF
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Reports;