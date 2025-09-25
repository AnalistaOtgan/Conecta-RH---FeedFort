
import React, { useState } from 'react';
import Card from '../components/Card';
import { useData } from '../context/DataContext';
import { Activity, Occurrence, OccurrenceCategory } from '../types';
import { StarIcon, CalendarIcon, ChevronDownIcon, XIcon } from '../components/icons';

const getOccurrenceGroup = (category: OccurrenceCategory) => {    
    switch (category) {
        case OccurrenceCategory.DesempenhoExcepcional: return 'Desempenho Excepcional';
        case OccurrenceCategory.PrecisaMelhorar: return 'Precisa Melhorar';
        case OccurrenceCategory.Positivo: return 'Positivo';
        case OccurrenceCategory.ViolacaoPolitica: return 'Violação de Política';
        default: return 'Outros';
    }
}

const getOccurrenceIcon = (category: OccurrenceCategory) => {
    switch (category) {
        case OccurrenceCategory.DesempenhoExcepcional: return <span className="text-blue-500">△</span>;
        case OccurrenceCategory.PrecisaMelhorar: return <span className="text-yellow-500">!</span>;
        case OccurrenceCategory.Positivo: return <span className="text-green-500">✓</span>;
        case OccurrenceCategory.ViolacaoPolitica: return <span className="text-red-500">⊘</span>;
    }
}

const NewFeedback: React.FC = () => {
    const { employees, activities, occurrences } = useData();
    const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
    const [selectedOccurrences, setSelectedOccurrences] = useState<Occurrence[]>([]);
    const [activityRatings, setActivityRatings] = useState<{[key: string]: number}>({});

    // FIX: Refactored score calculation to be more robust and readable, resolving type errors.
    const ratingsValues = Object.values(activityRatings);
    const averageActivityScore = ratingsValues.length > 0 ? ratingsValues.reduce((acc: number, rating: number) => acc + rating, 0) / ratingsValues.length : 0;
    const occurrenceImpact = selectedOccurrences.reduce((acc: number, o: Occurrence) => acc + o.impact, 0);
    const totalScore = averageActivityScore + occurrenceImpact;

    const finalScore = Math.max(0, Math.min(10, totalScore)).toFixed(1);

    const toggleActivity = (activity: Activity) => {
        if (selectedActivities.find(a => a.id === activity.id)) {
            setSelectedActivities(prev => prev.filter(a => a.id !== activity.id));
            setActivityRatings(prev => {
                const newRatings = {...prev};
                delete newRatings[activity.id];
                return newRatings;
            })
        } else {
            setSelectedActivities(prev => [...prev, activity]);
            setActivityRatings(prev => ({...prev, [activity.id]: 5}));
        }
    };

    const toggleOccurrence = (occurrence: Occurrence) => {
        if (selectedOccurrences.find(o => o.id === occurrence.id)) {
            setSelectedOccurrences(prev => prev.filter(o => o.id !== occurrence.id));
        } else {
            setSelectedOccurrences(prev => [...prev, occurrence]);
        }
    };

    const groupedOccurrences = occurrences.reduce((acc, o) => {
        const group = getOccurrenceGroup(o.category);
        if(!acc[group]) acc[group] = [];
        acc[group].push(o);
        return acc;
    }, {} as {[key: string]: Occurrence[]});

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text">Novo Feedback</h2>
                    <p className="text-brand-text-light">Registre o desempenho e desenvolvimento da equipe</p>
                </div>
                <button className="text-brand-text-light hover:text-red-500 transition-colors">
                    <XIcon className="w-6 h-6 mr-2" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="!p-4">
                        <h3 className="font-bold text-lg mb-4 px-2">Informações Básicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="relative">
                                <select className="w-full p-2 border rounded-md bg-white appearance-none">
                                    <option value="">Selecione um funcionário</option>
                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                           </div>
                           <div className="relative">
                                <input type="text" value="25/09/2025" className="w-full p-2 border rounded-md" readOnly/>
                                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                           </div>
                           <div className="relative">
                                <select className="w-full p-2 border rounded-md bg-white appearance-none">
                                    <option>Abertura</option>
                                    <option>Fechamento</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
                           </div>
                        </div>
                    </Card>

                    {/* Activities */}
                    <Card className="!p-4">
                        <h3 className="font-bold text-lg mb-4 px-2">Atividades Observadas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activities.map(activity => (
                                <div key={activity.id} onClick={() => toggleActivity(activity)}
                                     className={`p-3 border rounded-lg cursor-pointer transition-all ${selectedActivities.find(a => a.id === activity.id) ? 'border-brand-blue bg-blue-50' : 'hover:border-gray-400'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{activity.name}</p>
                                            <p className="text-sm text-brand-text-light">{activity.description}</p>
                                        </div>
                                        <div className="text-xs font-semibold bg-gray-200 text-brand-text-light px-2 py-1 rounded-full whitespace-nowrap">Peso {activity.weight}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {selectedActivities.length > 0 && <div className="mt-6 border-t pt-4 space-y-4">
                            <h4 className="font-bold px-2">Pontuação das Atividades</h4>
                            {selectedActivities.map(activity => (
                                <div key={activity.id} className="px-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="font-semibold">{activity.name}</label>
                                        <div className="flex items-center">
                                            {[...Array(10)].map((_, i) => (
                                                <StarIcon key={i} className={`w-5 h-5 cursor-pointer ${activityRatings[activity.id] > i ? 'text-yellow-400' : 'text-gray-300'}`} filled={activityRatings[activity.id] > i} onClick={() => setActivityRatings(prev => ({...prev, [activity.id]: i+1}))} />
                                            ))}
                                        </div>
                                    </div>
                                    <input type="range" min="0" max="10" value={activityRatings[activity.id] || 0}
                                        onChange={(e) => setActivityRatings(prev => ({...prev, [activity.id]: parseInt(e.target.value)}))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                    <textarea placeholder="Detalhar observações sobre esta atividade..." className="w-full mt-2 p-2 border rounded-md text-sm" rows={2}></textarea>
                                </div>
                            ))}
                        </div>}
                    </Card>

                    {/* Qualitative Feedback */}
                     <Card className="!p-4">
                        <h3 className="font-bold text-lg mb-2 px-2">Feedback Qualitativo</h3>
                         <textarea placeholder="Descreva observações detalhadas sobre o desempenho, pontos fortes, áreas de melhoria e orientações para desenvolvimento..." className="w-full p-2 border rounded-md text-sm" rows={4}></textarea>
                     </Card>
                     
                    {/* Occurrences */}
                    <Card className="!p-4">
                        <h3 className="font-bold text-lg mb-4 px-2">Ocorrências</h3>
                        <div className="space-y-4">
                            {/* FIX: Explicitly type the destructured array from Object.entries to ensure 'occs' is recognized as an array. */}
                            {Object.entries(groupedOccurrences).map(([group, occs]: [string, Occurrence[]]) => (
                                <div key={group}>
                                    <h4 className="font-semibold text-brand-text-light mb-2 flex items-center">{getOccurrenceIcon(occs[0].category)}<span className="ml-2">{group}</span></h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {occs.map(o => (
                                            <div key={o.id} onClick={() => toggleOccurrence(o)}
                                                 className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedOccurrences.find(so => so.id === o.id) ? 'border-brand-blue bg-blue-50' : 'hover:border-gray-400'}`}>
                                                <div>
                                                    <p className="font-semibold">{o.name}</p>
                                                    {selectedOccurrences.find(so => so.id === o.id) && <textarea onClick={e => e.stopPropagation()} placeholder="Detalhes da Ocorrência" className="w-full mt-2 p-1 border rounded-md text-sm" rows={1}></textarea>}
                                                </div>
                                                <span className={`font-bold text-lg ${o.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>{o.impact > 0 ? '+' : ''}{o.impact}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    
                     <div className="flex justify-end space-x-4">
                        <button className="px-6 py-2 rounded-lg text-brand-text font-semibold hover:bg-gray-100">Cancelar</button>
                        <button className="px-6 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-brand-dark-blue">Salvar Feedback</button>
                    </div>
                </div>
                
                {/* Summary */}
                <div className="md:col-span-1">
                    <div className="sticky top-8">
                        <Card>
                            <h3 className="font-bold text-lg mb-4 text-center">Resumo do Feedback</h3>
                            <div className="text-center my-6">
                                <p className="text-5xl font-bold text-brand-text">{finalScore}</p>
                                <p className="font-semibold text-yellow-500">Precisa Melhorar</p>
                            </div>
                            <div className="space-y-2 text-sm border-t pt-4">
                                <h4 className="font-bold mb-2">Detalhes:</h4>
                                {/* FIX: Replaced inline calculations with pre-calculated variables for clarity and to fix type errors. */}
                                <div className="flex justify-between"><span>Atividades ({selectedActivities.length})</span> <span>{averageActivityScore.toFixed(1)}/10</span></div>
                                <div className="flex justify-between"><span>Ocorrências ({selectedOccurrences.length})</span> <span>{occurrenceImpact}</span></div>
                                {selectedOccurrences.map(o => (
                                     <div key={o.id} className="flex justify-between pl-4 text-brand-text-light"><span>• {o.name}</span> <span>{o.impact > 0 ? '+' : ''}{o.impact}</span></div>
                                ))}
                            </div>
                            <div className="text-center text-brand-text-light mt-6">
                                 <p>Selecione um funcionário para ver o resumo</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFeedback;