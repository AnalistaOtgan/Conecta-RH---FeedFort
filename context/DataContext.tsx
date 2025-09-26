import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Employee, Activity, Occurrence, OccurrenceCategory, Sector, Section, DetailedFeedback, User, FeedbackData, JobHistoryEntry, MedicalCertificate, Ferias } from '../types';

// Mock Data - Simulates the database
const sectorsData: Sector[] = [
    { id: 'sec1', name: 'Mercearia', description: 'Setor de produtos secos e embalados.', sections: 2, ativo: true },
    { id: 'sec2', name: 'Hortifruti', description: 'Setor de frutas, verduras e legumes.', sections: 1, ativo: true },
    { id: 'sec3', name: 'Açougue', description: 'Setor de carnes.', sections: 1, ativo: true },
    { id: 'sec4', name: 'Administrativo', description: 'Setor administrativo e de gerência.', sections: 1, ativo: true },
];

const sectionsData: Section[] = [
    { id: 'sct1', name: 'Corredor 1', setor_id: 'sec1', description: 'Massas e molhos', ativo: true },
    { id: 'sct2', name: 'Corredor 2', setor_id: 'sec1', description: 'Enlatados e conservas', ativo: true },
    { id: 'sct3', name: 'Bancada de Folhas', setor_id: 'sec2', description: 'Verduras e legumes frescos', ativo: true },
    { id: 'sct4', name: 'Balcão de Atendimento', setor_id: 'sec3', description: 'Cortes de carne bovina e suína', ativo: true },
    { id: 'sct5', name: 'Gerência', setor_id: 'sec4', description: 'Gerência da loja', ativo: true },
];

const employeesData: Employee[] = [
    {
      id: 'user_dir_1',
      name: 'Diretor',
      role: 'Diretor',
      sector: 'Administrativo',
      shift: 'Integral',
      status: 'Ativo',
      initials: 'D',
      admissionDate: '2020-01-01',
      nome_completo: 'Diretor Geral',
      email: 'diretoria@email.com',
      secao_id: 'sct5',
      turno: 'integral',
      eh_lider: true,
      ativo: true,
      isUser: true,
      setores_liderados: ['sec1', 'sec2', 'sec3', 'sec4'],
      jobHistory: [
          { role: 'Diretor', sectionId: 'sct5', startDate: '2020-01-01'}
      ]
    },
    {
      id: 'user_rh_1',
      name: 'Admin RH',
      role: 'RH',
      sector: 'Administrativo',
      shift: 'Integral',
      status: 'Ativo',
      initials: 'RH',
      admissionDate: '2021-06-10',
      nome_completo: 'Admin RH',
      email: 'admin@email.com',
      secao_id: 'sct5',
      turno: 'integral',
      eh_lider: true,
      ativo: true,
      isUser: true,
      setores_liderados: ['sec4'],
      jobHistory: [
          { role: 'RH', sectionId: 'sct5', startDate: '2021-06-10'}
      ]
    },
    {
      id: 'user_ldr_1',
      name: 'Ana Costa',
      role: 'Líder de Loja',
      sector: 'Gerência',
      shift: 'Integral',
      status: 'Ativo',
      initials: 'AC',
      admissionDate: '2022-01-15',
      nome_completo: 'Ana Costa',
      email: 'ana.costa@loja.com',
      secao_id: 'sct5',
      turno: 'integral',
      eh_lider: true,
      ativo: true,
      isUser: true,
      setores_liderados: ['sec1', 'sec2', 'sec3'],
      jobHistory: [
        { role: 'Líder de Loja', sectionId: 'sct5', startDate: '2022-01-15' }
      ]
    },
    {
      id: 'emp2',
      name: 'Bruno Lima',
      role: 'Operador de Caixa',
      sector: 'Frente de Loja',
      shift: 'Tarde',
      status: 'Ativo',
      initials: 'BL',
      admissionDate: '2022-05-20',
      leaderId: 'user_ldr_1',
      leaderName: 'Ana Costa',
      nome_completo: 'Bruno Lima',
      email: 'bruno.lima@loja.com',
      secao_id: 'sct1',
      turno: 'fechamento',
      eh_lider: false,
      ativo: true,
      isUser: false,
      jobHistory: [
        { role: 'Operador de Caixa', sectionId: 'sct1', startDate: '2022-05-20' }
      ]
    },
    {
      id: 'emp3',
      name: 'Carla Dias',
      role: 'Repositor',
      sector: 'Mercearia',
      shift: 'Manhã',
      status: 'Ativo',
      initials: 'CD',
      admissionDate: '2023-02-10',
      leaderId: 'user_ldr_1',
      leaderName: 'Ana Costa',
      nome_completo: 'Carla Dias',
      email: 'carla.dias@loja.com',
      secao_id: 'sct1',
      turno: 'abertura',
      eh_lider: false,
      ativo: true,
      isUser: false,
      jobHistory: [
        { role: 'Repositor', sectionId: 'sct2', startDate: '2023-02-10', endDate: '2023-12-31' },
        { role: 'Repositor', sectionId: 'sct1', startDate: '2024-01-01' }
      ]
    },
    {
      id: 'emp4',
      name: 'Daniel Souza',
      role: 'Açougueiro',
      sector: 'Açougue',
      shift: 'Integral',
      status: 'Ativo',
      initials: 'DS',
      admissionDate: '2021-11-05',
      leaderId: 'user_ldr_1',
      leaderName: 'Ana Costa',
      nome_completo: 'Daniel Souza',
      email: 'daniel.souza@loja.com',
      secao_id: 'sct4',
      turno: 'integral',
      eh_lider: false,
      ativo: true,
      isUser: false,
      jobHistory: [
        { role: 'Açougueiro', sectionId: 'sct4', startDate: '2021-11-05' }
      ]
    },
    {
      id: 'emp5',
      name: 'Eduarda Martins',
      role: 'Repositor',
      sector: 'Hortifruti',
      shift: 'Tarde',
      status: 'Inativo',
      initials: 'EM',
      admissionDate: '2022-08-01',
      terminationDate: '2024-01-20',
      leaderId: 'user_ldr_1',
      leaderName: 'Ana Costa',
      nome_completo: 'Eduarda Martins',
      email: 'eduarda.martins@loja.com',
      secao_id: 'sct3',
      turno: 'fechamento',
      eh_lider: false,
      ativo: false,
      isUser: false,
      jobHistory: [
        { role: 'Repositor', sectionId: 'sct3', startDate: '2022-08-01', endDate: '2024-01-20' }
      ]
    },
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
    { id: 'fb1', employeeId: 'emp2', authorId: 'user_ldr_1', authorName: 'Ana Costa', date: '2024-07-20T10:00:00Z', finalScore: 8.5, qualitative: 'Bruno demonstrou excelente atendimento ao cliente.', activities: [{ id: 'act1', name: 'Atendimento ao Cliente', rating: 9, weight: 8 }], occurrences: [{ id: 'occ1', name: 'Elogio de Cliente', impact: 1.5 }] },
    { id: 'fb2', employeeId: 'emp3', authorId: 'user_ldr_1', authorName: 'Ana Costa', date: '2024-07-19T15:30:00Z', finalScore: 6.5, qualitative: 'Carla precisa melhorar a organização.', activities: [{ id: 'act2', name: 'Organização da Gôndola', rating: 6, weight: 6 }], occurrences: [{ id: 'occ4', name: 'Gôndola Desorganizada', impact: -0.5 }] },
    { id: 'fb3', employeeId: 'emp4', authorId: 'user_ldr_1', authorName: 'Ana Costa', date: '2024-07-21T09:00:00Z', finalScore: 9.0, qualitative: 'Daniel é muito proativo e colaborativo.', activities: [{ id: 'act3', name: 'Proatividade na Resolução', rating: 9, weight: 7 }, { id: 'act4', name: 'Trabalho em Equipe', rating: 9, weight: 5 }], occurrences: [] },
    { id: 'fb4', employeeId: 'emp2', authorId: 'user_ldr_1', authorName: 'Ana Costa', date: '2024-06-15T10:00:00Z', finalScore: 7.0, qualitative: 'Bom desempenho geral.', activities: [{ id: 'act1', name: 'Atendimento ao Cliente', rating: 7, weight: 8 }], occurrences: [] },
];

const medicalCertificatesData: MedicalCertificate[] = [
    { id: 'mc1', employeeId: 'emp3', startDate: '2024-03-10', endDate: '2024-03-12', reason: 'Consulta de rotina', cid: 'Z00.0' },
    { id: 'mc2', employeeId: 'emp3', startDate: '2024-05-22', endDate: '2024-05-22', reason: 'Exame de sangue' },
    { id: 'mc3', employeeId: 'emp5', startDate: '2023-11-01', endDate: '2023-11-05', reason: 'Gripe', cid: 'J11' },
];

const feriasData: Ferias[] = [
    { id: 'fer1', employeeId: 'emp3', startDate: '2024-01-15', endDate: '2024-02-14', periodoAquisitivo: '2022/2023', observacoes: 'Primeiras férias' },
    { id: 'fer2', employeeId: 'emp4', startDate: '2023-07-01', endDate: '2023-07-30', periodoAquisitivo: '2021/2022' },
];

// FIX: Refactored the 'api' object to use async method syntax to resolve parsing and type errors.
const api = {
    async get<T>(data: T): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return data;
    },
    async post<T, R>(data: T): Promise<R> {
        await new Promise(resolve => setTimeout(resolve, 500));
        // This is a simulation, so we'll just return a mock response
        return { ...data, id: `new_${Date.now()}` } as unknown as R;
    },
    async put<T>(data: T): Promise<T> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return data;
    },
    async "delete"(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
};


type EmployeeInput = Omit<Employee, 'id' | 'initials' | 'terminationDate' | 'name' | 'role' | 'sector' | 'shift' | 'status' | 'leaderId' | 'leaderName' | 'jobHistory'>

interface DataContextType {
    loading: boolean;
    employees: Employee[];
    activities: Activity[];
    occurrences: Occurrence[];
    sectors: Sector[];
    sections: Section[];
    feedbacks: DetailedFeedback[];
    medicalCertificates: MedicalCertificate[];
    ferias: Ferias[];
    addSector: (sector: Omit<Sector, 'id' | 'sections' | 'ativo'>) => Promise<void>;
    updateSector: (id: string, data: Partial<Omit<Sector, 'id'>>) => Promise<void>;
    addSection: (section: Omit<Section, 'id' | 'ativo'>) => Promise<void>;
    updateSection: (id: string, data: Partial<Omit<Section, 'id'>>) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
    updateActivity: (id: string, data: Partial<Omit<Activity, 'id'>>) => Promise<void>;
    deleteActivity: (id: string) => Promise<void>;
    addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => Promise<void>;
    updateOccurrence: (id: string, data: Partial<Omit<Occurrence, 'id'>>) => Promise<void>;
    deleteOccurrence: (id: string) => Promise<void>;
    addEmployee: (employee: EmployeeInput) => Promise<void>;
    updateEmployee: (id: string, data: Partial<EmployeeInput>) => Promise<void>;
    bulkAddEmployees: (employees: EmployeeInput[]) => Promise<void>;
    addFeedback: (feedbackData: FeedbackData) => Promise<void>;
    addMedicalCertificate: (certificate: Omit<MedicalCertificate, 'id'>) => Promise<void>;
    addFerias: (feriasEntry: Omit<Ferias, 'id'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [feedbacks, setFeedbacks] = useState<DetailedFeedback[]>([]);
    const [medicalCertificates, setMedicalCertificates] = useState<MedicalCertificate[]>([]);
    const [ferias, setFerias] = useState<Ferias[]>([]);
    
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [
                    employeesRes, activitiesRes, occurrencesRes, sectorsRes, 
                    sectionsRes, feedbacksRes, medicalCertificatesRes, feriasRes
                ] = await Promise.all([
                    api.get(employeesData),
                    api.get(activitiesData),
                    api.get(occurrencesData),
                    api.get(sectorsData),
                    api.get(sectionsData),
                    api.get(feedbacksData),
                    api.get(medicalCertificatesData),
                    api.get(feriasData),
                ]);
                
                setEmployees(employeesRes);
                setActivities(activitiesRes);
                setOccurrences(occurrencesRes);
                setSectors(sectorsRes);
                setSections(sectionsRes);
                setFeedbacks(feedbacksRes);
                setMedicalCertificates(medicalCertificatesRes);
                setFerias(feriasRes);

            } catch (error) {
                console.error("Failed to load initial data", error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);


    const addSector = async (sector: Omit<Sector, 'id' | 'sections' | 'ativo'>) => {
        const newSector: Sector = { ...sector, id: `sec${Date.now()}`, sections: 0, ativo: true };
        await api.post(newSector);
        setSectors(prev => [...prev, newSector]);
    };

    const updateSector = async (id: string, data: Partial<Omit<Sector, 'id'>>) => {
        await api.put({ id, ...data });
        setSectors(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const addSection = async (section: Omit<Section, 'id' | 'ativo'>) => {
        const newSection: Section = { ...section, id: `sct${Date.now()}`, ativo: true };
        await api.post(newSection);
        setSections(prev => [...prev, newSection]);
        setSectors(prevSectors => prevSectors.map(s => s.id === newSection.setor_id ? { ...s, sections: s.sections + 1 } : s));
    };
    
    const updateSection = async (id: string, data: Partial<Omit<Section, 'id'>>) => {
        await api.put({ id, ...data });
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const addActivity = async (activity: Omit<Activity, 'id'>) => {
        const newActivity: Activity = { ...activity, id: `act${Date.now()}` };
        await api.post(newActivity);
        setActivities(prev => [...prev, newActivity]);
    };

    const updateActivity = async (id: string, data: Partial<Omit<Activity, 'id'>>) => {
        await api.put({ id, ...data });
        setActivities(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    };

    const deleteActivity = async (id: string) => {
        await api.delete();
        setActivities(prev => prev.filter(a => a.id !== id));
    };
    
    const addOccurrence = async (occurrence: Omit<Occurrence, 'id'>) => {
        const newOccurrence: Occurrence = { ...occurrence, id: `occ${Date.now()}` };
        await api.post(newOccurrence);
        setOccurrences(prev => [...prev, newOccurrence]);
    };

    const updateOccurrence = async (id: string, data: Partial<Omit<Occurrence, 'id'>>) => {
        await api.put({ id, ...data });
        setOccurrences(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    };

    const deleteOccurrence = async (id: string) => {
        await api.delete();
        setOccurrences(prev => prev.filter(o => o.id !== id));
    };
    
    const getCompatibilityFields = (employeeData: Partial<EmployeeInput>): { name: string; role: string; sector: string; shift: string; status: 'Ativo' | 'Inativo' } => {
        const secao = sections.find(s => s.id === employeeData.secao_id);
        const setor = secao ? sectors.find(s => s.id === secao.setor_id) : null;

        const turnMap = { 'abertura': 'Manhã', 'fechamento': 'Tarde', 'intermediario': 'Integral', 'integral': 'Integral'};

        return {
            name: employeeData.nome_completo,
            role: employeeData.eh_lider ? 'Líder' : (secao?.name || 'Funcionário'),
            sector: setor?.name || 'N/A',
            shift: turnMap[employeeData.turno] || 'Integral',
            status: employeeData.ativo ? 'Ativo' : 'Inativo',
        }
    }

    const addEmployee = async (employeeData: EmployeeInput) => {
        const initials = employeeData.nome_completo.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const admissionDate = new Date().toISOString().split('T')[0];
        const compatibilityFields = getCompatibilityFields(employeeData);

        const newEmployee: Employee = {
            ...employeeData,
            ...compatibilityFields,
            id: `emp${Date.now()}`,
            initials,
            admissionDate,
            isUser: employeeData.isUser || false,
            jobHistory: [{
              role: compatibilityFields.role,
              sectionId: employeeData.secao_id,
              startDate: admissionDate
            }]
        };
        await api.post(newEmployee);
        setEmployees(prev => [...prev, newEmployee]);
    };

    const updateEmployee = async (id: string, data: Partial<EmployeeInput>) => {
        const originalEmployee = employees.find(e => e.id === id);
        if (!originalEmployee) return;

        const updatedEmployeeData = { ...originalEmployee, ...data };
        const compatibilityFields = getCompatibilityFields(updatedEmployeeData);

        // Job History Logic
        if (data.secao_id && data.secao_id !== originalEmployee.secao_id) {
            const today = new Date().toISOString().split('T')[0];
            const newHistory: JobHistoryEntry[] = (updatedEmployeeData.jobHistory || []).map(h => {
                if (!h.endDate) return { ...h, endDate: today };
                return h;
            });
            newHistory.push({
                role: compatibilityFields.role,
                sectionId: data.secao_id,
                startDate: today
            });
            updatedEmployeeData.jobHistory = newHistory;
        }
        
        const finalUpdatedEmployee = { ...updatedEmployeeData, ...compatibilityFields };
        
        await api.put(finalUpdatedEmployee);
        setEmployees(prev => prev.map(e => e.id === id ? finalUpdatedEmployee : e));
    };

    const bulkAddEmployees = async (newEmployeesData: EmployeeInput[]) => {
        const employeesToAdd: Employee[] = newEmployeesData.map((employeeData, index) => {
             const initials = employeeData.nome_completo.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
             const admissionDate = new Date().toISOString().split('T')[0];
             const compatibilityFields = getCompatibilityFields(employeeData);
             return {
                ...employeeData,
                ...compatibilityFields,
                id: `emp${Date.now()}_${index}`,
                initials,
                admissionDate,
                jobHistory: [{
                    role: compatibilityFields.role,
                    sectionId: employeeData.secao_id,
                    startDate: admissionDate
                }]
             }
        });
        await api.post(employeesToAdd);
        setEmployees(prev => [...prev, ...employeesToAdd]);
    }

    const addFeedback = async (feedbackData: FeedbackData) => {
        const author = employees.find(e => e.id === feedbackData.authorId);

        const newDetailedFeedback: DetailedFeedback = {
            id: `fb${Date.now()}`,
            employeeId: feedbackData.employeeId,
            authorId: feedbackData.authorId,
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

        await api.post(newDetailedFeedback);
        setFeedbacks(prev => [newDetailedFeedback, ...prev]);
    };

    const addMedicalCertificate = async (certificate: Omit<MedicalCertificate, 'id'>) => {
        const newCertificate: MedicalCertificate = { ...certificate, id: `mc${Date.now()}` };
        await api.post(newCertificate);
        setMedicalCertificates(prev => [newCertificate, ...prev].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    };

    const addFerias = async (feriasEntry: Omit<Ferias, 'id'>) => {
        const newFerias: Ferias = { ...feriasEntry, id: `fer${Date.now()}` };
        await api.post(newFerias);
        setFerias(prev => [newFerias, ...prev].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    };

    const value = {
        loading,
        employees,
        activities,
        occurrences,
        sectors,
        sections,
        feedbacks,
        medicalCertificates,
        ferias,
        addSector,
        updateSector,
        addSection,
        updateSection,
        addActivity,
        updateActivity,
        deleteActivity,
        addOccurrence,
        updateOccurrence,
        deleteOccurrence,
        addEmployee,
        updateEmployee,
        bulkAddEmployees,
        addFeedback,
        addMedicalCertificate,
        addFerias
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