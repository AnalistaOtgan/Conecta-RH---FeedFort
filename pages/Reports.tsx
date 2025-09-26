
import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { ChevronDownIcon, DownloadIcon, FilterIcon, FileTextIcon, ArrowRightIcon } from '../components/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const reportTypes = [
    {
        id: 'performance_summary',
        title: 'Resumo de Performance',
        description: 'Consolidado de performance por funcionário e setor.',
    },
    {
        id: 'feedback_frequency',
        title: 'Frequência de Feedback',
        description: 'Análise da frequência de feedback por líder.',
    },
    {
        id: 'occurrences_report',
        title: 'Relatório de Ocorrências',
        description: 'Detalha todas as ocorrências registradas no período.',
    },
    {
        id: 'qualitative_report',
        title: 'Feedback Qualitativo',
        description: 'Exporta todos os feedbacks qualitativos para análise de texto.',
    },
    {
        id: 'attribute_evolution',
        title: 'Evolução de Atributos',
        description: 'Mostra a evolução dos atributos de performance.',
    },
    {
        id: 'performance_comparison',
        title: 'Comparativo de Performance',
        description: 'Compare a performance entre funcionários ou setores.',
    }
];

const Reports: React.FC = () => {
    const dataContext = useData();
    const { employees, sectors, sections, feedbacks, occurrences } = dataContext;

    const [filters, setFilters] = useState({
        employeeId: 'all',
        leaderId: 'all',
        sectorId: 'all',
        period: 'last_30_days',
    });
    const [view, setView] = useState<'list' | 'report'>('list');
    const [currentReport, setCurrentReport] = useState<any>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const leaders = useMemo(() => employees.filter(e => e.eh_lider && e.ativo), [employees]);

    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const generateReport = (reportType: any) => {
        setIsLoading(true);
        setCurrentReport(reportType);

        setTimeout(() => { // Simulate API call/processing
            const now = new Date();
            let startDate = new Date();
            const endDate = new Date(now);

            switch (filters.period) {
                case 'last_7_days': startDate.setDate(now.getDate() - 7); break;
                case 'last_30_days': startDate.setDate(now.getDate() - 30); break;
                case 'this_month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
                case 'last_month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    endDate.setDate(0);
                    break;
                default: startDate.setDate(now.getDate() - 30); break;
            }

            let filteredFeedbacks = feedbacks.filter(f => {
                const feedbackDate = new Date(f.date);
                return feedbackDate >= startDate && feedbackDate <= endDate;
            });

            if (filters.employeeId !== 'all') {
                filteredFeedbacks = filteredFeedbacks.filter(f => f.employeeId === filters.employeeId);
            }
            if (filters.leaderId !== 'all') {
                filteredFeedbacks = filteredFeedbacks.filter(f => f.authorId === filters.leaderId);
            }
            if (filters.sectorId !== 'all') {
                const sectionsInSector = sections.filter(s => s.setor_id === filters.sectorId).map(s => s.id);
                const employeesInSector = employees.filter(e => sectionsInSector.includes(e.secao_id)).map(e => e.id);
                filteredFeedbacks = filteredFeedbacks.filter(f => employeesInSector.includes(f.employeeId));
            }

            let data;
            switch (reportType.id) {
                case 'performance_summary':
                    const performanceMap = new Map();
                    filteredFeedbacks.forEach(f => {
                        if (!performanceMap.has(f.employeeId)) {
                            const emp = employees.find(e => e.id === f.employeeId);
                            const sec = sections.find(s => s.id === emp?.secao_id);
                            const set = sectors.find(s => s.id === sec?.setor_id);
                            performanceMap.set(f.employeeId, { employee: emp, sector: set, scores: [] });
                        }
                        performanceMap.get(f.employeeId).scores.push(f.finalScore);
                    });
                    data = Array.from(performanceMap.values()).map(({ employee, sector, scores }) => ({
                        employeeName: employee?.name || 'N/A',
                        sectorName: sector?.name || 'N/A',
                        feedbackCount: scores.length,
                        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
                    })).sort((a, b) => b.avgScore - a.avgScore);
                    break;
                case 'feedback_frequency':
                    const frequencyMap = new Map();
                    filteredFeedbacks.forEach(f => {
                        const count = frequencyMap.get(f.authorId) || 0;
                        frequencyMap.set(f.authorId, count + 1);
                    });
                    data = Array.from(frequencyMap.entries()).map(([authorId, count]) => ({
                        leaderName: employees.find(e => e.id === authorId)?.name || 'N/A',
                        feedbackCount: count,
                    })).sort((a,b) => b.feedbackCount - a.feedbackCount);
                    break;
                case 'occurrences_report':
                     data = filteredFeedbacks.flatMap(f => 
                        f.occurrences.map(occ => {
                            const occInfo = occurrences.find(o => o.id === occ.id);
                            return {
                                date: new Date(f.date).toLocaleDateString('pt-BR'),
                                employeeName: employees.find(e => e.id === f.employeeId)?.name || 'N/A',
                                occurrenceName: occInfo?.name || 'N/A',
                                category: occInfo?.category || 'N/A',
                                qualitative: f.qualitative.substring(0, 50) + '...'
                            }
                        })
                     );
                     break;
                case 'qualitative_report':
                    data = filteredFeedbacks.map(f => ({
                        date: new Date(f.date).toLocaleString('pt-BR'),
                        employeeName: employees.find(e => e.id === f.employeeId)?.name || 'N/A',
                        authorName: f.authorName,
                        qualitative: f.qualitative,
                        score: f.finalScore
                    }));
                    break;
                default:
                    data = [];
            }

            setReportData({ type: reportType, data });
            setView('report');
            setIsLoading(false);
        }, 500);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (view === 'report') {
        return <ReportViewer reportData={reportData} filters={filters} dataContext={dataContext} onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-brand-text">Relatórios</h2>
                <p className="text-brand-text-light">Gere e visualize relatórios detalhados de performance e feedback</p>
            </div>
          
            <Card>
                <div className="p-6">
                    <h3 className="text-xl font-semibold flex items-center text-brand-text mb-4">
                        <FilterIcon className="w-6 h-6 mr-3 text-brand-blue"/> Filtros
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <FilterSelect label="Funcionário" value={filters.employeeId} onChange={v => handleFilterChange('employeeId', v)}>
                            <option value="all">Todos os funcionários</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </FilterSelect>
                        <FilterSelect label="Líder" value={filters.leaderId} onChange={v => handleFilterChange('leaderId', v)}>
                            <option value="all">Todos os líderes</option>
                            {leaders.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </FilterSelect>
                        <FilterSelect label="Setor" value={filters.sectorId} onChange={v => handleFilterChange('sectorId', v)}>
                            <option value="all">Todos os setores</option>
                            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </FilterSelect>
                        <FilterSelect label="Período" value={filters.period} onChange={v => handleFilterChange('period', v)}>
                            <option value="last_7_days">Últimos 7 dias</option>
                            <option value="last_30_days">Últimos 30 dias</option>
                            <option value="this_month">Este mês</option>
                            <option value="last_month">Mês passado</option>
                        </FilterSelect>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportTypes.map((report) => (
                    <Card key={report.id} className="flex flex-col hover:shadow-lg transition-shadow">
                        <div className="p-6 flex-grow">
                            <div className="flex items-start mb-4">
                                <FileTextIcon className="w-8 h-8 mr-4 text-brand-blue flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-brand-text">{report.title}</h3>
                                    <p className="text-sm text-brand-text-light mt-1">{report.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 mt-auto space-y-3">
                            <button onClick={() => generateReport(report)} className="w-full flex items-center justify-center px-4 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-dark-blue">
                                <FileTextIcon className="w-5 h-5 mr-2" />
                                Visualizar Relatório
                            </button>
                            <button disabled className="w-full flex items-center justify-center px-4 py-2 border border-brand-gray rounded-lg text-brand-text font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
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

const FilterSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select value={value} onChange={e => onChange(e.target.value)} className="block w-full px-3 py-2 pr-8 bg-white border border-brand-gray rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
                {children}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
        </div>
    </div>
);

const ReportViewer = ({ reportData, filters, dataContext, onBack }: any) => {
    const { type, data } = reportData;

    const renderContent = () => {
        if (!data || data.length === 0) {
            return <p className="text-center text-gray-500 py-12">Nenhum dado encontrado para os filtros selecionados.</p>;
        }

        switch (type.id) {
            case 'performance_summary': return <PerformanceSummaryContent data={data} />;
            case 'feedback_frequency': return <FeedbackFrequencyContent data={data} />;
            case 'occurrences_report': return <OccurrencesContent data={data} />;
            case 'qualitative_report': return <QualitativeContent data={data} />;
            default:
                return (
                    <div className="text-center py-12">
                        <p className="font-semibold">Relatório em Desenvolvimento</p>
                        <p className="text-gray-500">Esta funcionalidade estará disponível em breve.</p>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-blue hover:underline mb-2">
                        <ArrowRightIcon className="w-4 h-4 mr-1 transform rotate-180" />
                        Voltar para a lista de relatórios
                    </button>
                    <h2 className="text-2xl font-bold text-brand-text">{type.title}</h2>
                    <p className="text-brand-text-light">Exibindo resultados para o período selecionado.</p>
                </div>
                 <button disabled className="px-4 py-2 flex items-center bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed">
                    <DownloadIcon className="w-5 h-5 mr-2"/> Baixar PDF
                </button>
            </div>
            <Card className="p-6">
                {renderContent()}
            </Card>
        </div>
    );
};

const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    {headers.map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {children}
            </tbody>
        </table>
    </div>
);

const PerformanceSummaryContent: React.FC<{ data: any[] }> = ({ data }) => (
    <div className="space-y-6">
        <h3 className="font-semibold">Desempenho por Funcionário</h3>
        <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.slice(0, 10)}>
                    <XAxis dataKey="employeeName" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgScore" name="Pontuação Média" fill="#3B82F6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <Table headers={['Funcionário', 'Setor', 'Nº de Feedbacks', 'Pontuação Média']}>
            {data.map((row, i) => (
                <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sectorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.feedbackCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{row.avgScore.toFixed(1)}</td>
                </tr>
            ))}
        </Table>
    </div>
);

const FeedbackFrequencyContent: React.FC<{ data: any[] }> = ({ data }) => (
    <Table headers={['Líder', 'Feedbacks Realizados']}>
         {data.map((row, i) => (
            <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.leaderName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.feedbackCount}</td>
            </tr>
        ))}
    </Table>
);

const OccurrencesContent: React.FC<{ data: any[] }> = ({ data }) => (
    <Table headers={['Data', 'Funcionário', 'Ocorrência', 'Categoria', 'Feedback Relacionado']}>
         {data.map((row, i) => (
            <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.occurrenceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">"{row.qualitative}"</td>
            </tr>
        ))}
    </Table>
);

const QualitativeContent: React.FC<{ data: any[] }> = ({ data }) => (
    <div className="space-y-4">
        {data.map((row, i) => (
            <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <p className="font-semibold">{row.employeeName}</p>
                        <p className="text-xs text-gray-500">Por: {row.authorName} em {row.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${row.score >= 8 ? 'bg-green-100 text-green-700' : row.score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {row.score.toFixed(1)}/10
                    </span>
                </div>
                <p className="text-sm text-gray-700 italic">"{row.qualitative}"</p>
            </div>
        ))}
    </div>
);

export default Reports;