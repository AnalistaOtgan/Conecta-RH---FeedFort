import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee, Activity, Occurrence, OccurrenceCategory, Sector, Section, DetailedFeedback, User, FeedbackData } from '../types';

// Mock Data
const sectorsData: Sector[] = [
    { id: 'sec1', name: 'Mercearia', description: 'Setor de produtos secos e embalados.', sections: 2, ativo: true },
    { id: 'sec2', name: 'Hortifruti', description: 'Setor de frutas, verduras e legumes.', sections: 1, ativo: true },
    { id: 'sec3', name: 'Açougue', description: 'Setor de carnes.', sections: 1, ativo: true },
];

const sectionsData: Section[] = [
    { id: 'sct1', name: 'Corredor 1', setor_id: 'sec1', description: 'Massas e molhos', ativo: true },
    { id: 'sct2', name: 'Corredor 2', setor_id: 'sec1', description: 'Enlatados e conservas', ativo: true },
    { id: 'sct3', name: 'Bancada de Folhas', setor_id: 'sec2', description: 'Verduras e legumes frescos', ativo: true },
    { id: 'sct4', name: 'Balcão de Atendimento', setor_id: 'sec3', description: 'Cortes de carne bovina e suína', ativo: true },
];

const employeesData: Employee[] = [
    { id: 'user_ldr_1', name: 'Ana Costa', role: 'Líder de Loja', sector: 'Gerência', shift: 'Integral', status: 'Ativo', initials: 'AC', admissionDate: '2022-01-15' },
    { id: 'emp2', name: 'Bruno Lima', role: 'Operador de Caixa', sector: 'Frente de Loja', shift: 'Tarde', status: 'Ativo', initials: 'BL', admissionDate: '2022-05-20', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
    { id: 'emp3', name: 'Carla Dias', role: 'Repositor', sector: 'Mercearia', shift: 'Manhã', status: 'Ativo', initials: 'CD', admissionDate: '2023-02-10', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
    { id: 'emp4', name: 'Daniel Souza', role: 'Açougueiro', sector: 'Açougue', shift: 'Integral', status: 'Ativo', initials: 'DS', admissionDate: '2021-11-05', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
    { id: 'emp5', name: 'Eduarda Martins', role: 'Repositor', sector: 'Hortifruti', shift: 'Tarde', status: 'Inativo', initials: 'EM', admissionDate: '2022-08-01', terminationDate: '2024-01-20', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
];

const activitiesData: Activity[] = [
    { id: 'act1', name: 'Atendimento ao Cliente', description: 'Cortesia e eficiência no atendimento.', weight: 8, attribute: 'Comunicação' },
    { id: 'act2', name: 'Organização da Gôndola', description: 'Manter produtos alinhados e precificados.', weight: 6, attribute: 'Organização' },
    { id: 'act3', name: 'Proatividade na Resolução', description: 'Iniciativa para resolver problemas.', weight: 7, attribute: 'Iniciativa' },
    { id: 'act4', name: 'Trabalho em Equipe', description: 'Colaboração com colegas de setor.', weight: 5, attribute: 'Trabalho em Equipe' },
];

const occurrencesData: Occurrence[] = [
    { id: 'occ1', name: 'Elogio de Cliente', description: 'Cliente elogiou o atendimento proativo.', category: OccurrenceCategory.DesempenhoExcepcional, impact: 1.5 },
    { id: 'occ2', name: 'Atraso Injustificado', description: 'Chegou 20 minutos atrasado sem aviso.', category: OccurrenceCategory.ViolacaoPolitica, impact: -1.0 },
    { id: 'occ3', name: 'Ajuda a Colega', description: 'Ajudou colega de outro setor a organizar.', category: OccurrenceCategory.Positivo, impact: 0.5 },
    { id: 'occ4', name: 'Gôndola Desorganizada', description: 'Deixou seção desorganizada no fim do turno.', category: OccurrenceCategory.PrecisaMelhorar, impact: -0.5 },
];

const feedbacksData: DetailedFeedback[] = [
    { id: 'fb1', employeeId: 'emp2', authorName: 'Ana Costa', date: '2024-07-20T10:00:00Z', finalScore: 8.5, qualitative: 'Bruno demonstrou excelente atendimento ao cliente.', activities: [{ id: 'act1', name: 'Atendimento ao Cliente', rating: 9, weight: 8 }], occurrences: [{ id: 'occ1', name: 'Elogio de Cliente', impact: 1.5 }] },
    { id: 'fb2', employeeId: 'emp3', authorName: 'Ana Costa', date: '2024-07-19T15:30:00Z', finalScore: 6.5, qualitative: 'Carla precisa melhorar a organização.', activities: [{ id: 'act2', name: 'Organização da Gôndola', rating: 6, weight: 6 }], occurrences: [{ id: 'occ4', name: 'Gôndola Desorganizada', impact: -0.5 }] },
    { id: 'fb3', employeeId: 'emp4', authorName: 'Ana Costa', date: '2024-07-21T09:00:00Z', finalScore: 9.0, qualitative: 'Daniel é muito proativo e colaborativo.', activities: [{ id: 'act3', name: 'Proatividade na Resolução', rating: 9, weight: 7 }, { id: 'act4', name: 'Trabalho em Equipe', rating: 9, weight: 5 }], occurrences: [] },
    { id: 'fb4', employeeId: 'emp2', authorName: 'Ana Costa', date: '2024-06-15T10:00:00Z', finalScore: 7.0, qualitative: 'Bom desempenho geral.', activities: [{ id: 'act1', name: 'Atendimento ao Cliente', rating: 7, weight: 8 }], occurrences: [] },
];

interface DataContextType {
    user: User | null;
    employees: Employee[];
    activities: Activity[];
    occurrences: Occurrence[];
    sectors: Sector[];
    sections: Section[];
    feedbacks: DetailedFeedback[];
    addSector: (sector: Omit<Sector, 'id' | 'sections' | 'ativo'>) => void;
    updateSector: (id: string, data: Partial<Omit<Sector, 'id'>>) => void;
    addSection: (section: Omit<Section, 'id' | 'ativo'>) => void;
    updateSection: (id: string, data: Partial<Omit<Section, 'id'>>) => void;
    addActivity: (activity: Omit<Activity, 'id'>) => void;
    addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void;
    addEmployee: (employee: Omit<Employee, 'id' | 'status' | 'initials' | 'terminationDate' | 'leaderId' | 'leaderName'>) => void;
    addFeedback: (feedbackData: FeedbackData) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [employees, setEmployees] = useState<Employee[]>(employeesData);
    const [activities, setActivities] = useState<Activity[]>(activitiesData);
    const [occurrences, setOccurrences] = useState<Occurrence[]>(occurrencesData);
    const [sectors, setSectors] = useState<Sector[]>(sectorsData);
    const [sections, setSections] = useState<Section[]>(sectionsData);
    const [feedbacks, setFeedbacks] = useState<DetailedFeedback[]>(feedbacksData);

    const addSector = (sector: Omit<Sector, 'id' | 'sections' | 'ativo'>) => {
        const newSector: Sector = { ...sector, id: `sec${Date.now()}`, sections: 0, ativo: true };
        setSectors(prev => [...prev, newSector]);
    };

    const updateSector = (id: string, data: Partial<Omit<Sector, 'id'>>) => {
        setSectors(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const addSection = (section: Omit<Section, 'id' | 'ativo'>) => {
        const newSection: Section = { ...section, id: `sct${Date.now()}`, ativo: true };
        setSections(prev => [...prev, newSection]);
        setSectors(prevSectors => prevSectors.map(s => s.id === newSection.setor_id ? { ...s, sections: s.sections + 1 } : s));
    };
    
    const updateSection = (id: string, data: Partial<Omit<Section, 'id'>>) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const addActivity = (activity: Omit<Activity, 'id'>) => {
        const newActivity: Activity = { ...activity, id: `act${Date.now()}` };
        setActivities(prev => [...prev, newActivity]);
    };
    
    const addOccurrence = (occurrence: Omit<Occurrence, 'id'>) => {
        const newOccurrence: Occurrence = { ...occurrence, id: `occ${Date.now()}` };
        setOccurrences(prev => [...prev, newOccurrence]);
    };

    const addEmployee = (employee: Omit<Employee, 'id' | 'status' | 'initials' | 'terminationDate' | 'leaderId' | 'leaderName'>) => {
        const initials = employee.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const newEmployee: Employee = {
            ...employee,
            id: `emp${Date.now()}`,
            status: 'Ativo',
            initials,
        };
        setEmployees(prev => [...prev, newEmployee]);
    };

    const addFeedback = (feedbackData: FeedbackData) => {
        const author = employees.find(e => e.id === feedbackData.authorId);

        const newDetailedFeedback: DetailedFeedback = {
            id: `fb${Date.now()}`,
            employeeId: feedbackData.employeeId,
            authorName: author?.name || 'Sistema',
            date: new Date(feedbackData.feedbackDate).toISOString(),
            finalScore: feedbackData.finalScore,
            qualitative: feedbackData.qualitativeFeedback,
            activities: feedbackData.observedActivities.map(obsAct => {
                const activityInfo = activities.find(a => a.id === obsAct.activityId);
                return {
                    id: obsAct.activityId,
                    name: activityInfo?.name || 'Desconhecida',
                    rating: obsAct.rating,
                    weight: activityInfo?.weight || 0,
                };
            }),
            occurrences: feedbackData.occurrences.map(regOcc => {
                const occurrenceInfo = occurrences.find(o => o.id === regOcc.occurrenceId);
                return {
                    id: regOcc.occurrenceId,
                    name: occurrenceInfo?.name || 'Desconhecida',
                    impact: occurrenceInfo?.impact || 0,
                };
            }),
        };

        setFeedbacks(prev => [newDetailedFeedback, ...prev]);
    };

    const value = {
        user: null,
        employees,
        activities,
        occurrences,
        sectors,
        sections,
        feedbacks,
        addSector,
        updateSector,
        addSection,
        updateSection,
        addActivity,
        addOccurrence,
        addEmployee,
        addFeedback
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};