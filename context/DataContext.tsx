import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Employee, Activity, Occurrence, OccurrenceCategory, Sector, Section, DetailedFeedback, LoggedOccurrence, User } from '../types';

const initialUsers: User[] = [
    { id: 'user_ldr_1', name: 'Ana Costa', role: 'Líder de Loja', avatar: 'AC', managedSectorIds: ['s1'] }, // Frente de Loja
    { id: 'user_ldr_2', name: 'João Mendes', role: 'Líder de Loja', avatar: 'JM', managedSectorIds: ['s2', 's3'] }, // Mercearia & Açougue
    { id: 'user_rh_1', name: 'Admin RH', role: 'RH', avatar: 'RH' },
    { id: 'user_dir_1', name: 'Diretor', role: 'Diretor', avatar: 'D' },
];

// Mock Data (as initial data if localStorage is empty)
const initialEmployees: Employee[] = [
  { id: '1', name: 'FERNANDA SILVA DOS SANTOS', role: 'Operador de Caixa', sector: 'Frente de Loja', shift: 'Fechamento', status: 'Ativo', initials: 'FE', admissionDate: '2023-01-15', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
  { id: '2', name: 'BRENDON SOUSA DE OLIVEIRA', role: 'Repositor', sector: 'Mercearia', shift: 'Abertura', status: 'Ativo', initials: 'BR', admissionDate: '2022-11-20', leaderId: 'user_ldr_2', leaderName: 'João Mendes' },
  { id: '3', name: 'CARLOS ALBERTO PEREIRA', role: 'Açougueiro', sector: 'Açougue', shift: 'Intermediário', status: 'Ativo', initials: 'CA', admissionDate: '2021-05-10', leaderId: 'user_ldr_2', leaderName: 'João Mendes' },
  { id: '4', name: 'MARIA EDUARDA GONÇALVES', role: 'Padeiro', sector: 'Padaria', shift: 'Abertura', status: 'Ativo', initials: 'ME', admissionDate: '2023-03-01', leaderId: 'user_ldr_1', leaderName: 'Ana Costa' },
];

const initialActivities: Activity[] = [
  { id: 'a1', name: 'Abordagem ao Cliente', description: 'Recepcionar clientes com cordialidade e eficiência.', weight: 8, attribute: 'comunicacao' },
  { id: 'a2', name: 'Organização do Setor', description: 'Manter o setor limpo, organizado e abastecido.', weight: 7, attribute: 'organizacao' },
  { id: 'a3', name: 'Trabalho em Equipe', description: 'Colaborar com colegas para atingir metas.', weight: 6, attribute: 'trabalho equipe' },
  { id: 'a4', name: 'Proatividade e Iniciativa', description: 'Identificar e resolver problemas de forma autônoma.', weight: 9, attribute: 'iniciativa' },
];

const initialOccurrences: Occurrence[] = [
    { id: 'o1', name: 'Elogio de Cliente', description: 'Cliente elogiou o atendimento prestado.', category: OccurrenceCategory.DesempenhoExcepcional, impact: 2 },
    { id: 'o2', name: 'Meta de Vendas Atingida', description: 'Colaborador atingiu a meta individual de vendas.', category: OccurrenceCategory.Positivo, impact: 1 },
    { id: 'o3', name: 'Atraso Injustificado', description: 'Chegou atrasado sem comunicação prévia.', category: OccurrenceCategory.PrecisaMelhorar, impact: -1 },
    { id: 'o4', name: 'Uso de Celular', description: 'Utilizando o celular em horário de trabalho fora das pausas.', category: OccurrenceCategory.ViolacaoPolitica, impact: -2 },
];

const initialDetailedFeedbacks: DetailedFeedback[] = [
    { 
        id: 'f1', employeeId: '1', authorName: 'Ana Costa', date: '2025-09-22T02:49:00Z', finalScore: 10,
        qualitative: 'Fernanda demonstrou excelente habilidade de comunicação e proatividade ao resolver um problema com um cliente. Manteve a calma e encontrou uma solução que deixou o cliente satisfeito.',
        activities: [ { id: 'a1', name: 'Abordagem ao Cliente', rating: 10, weight: 8 }, { id: 'a4', name: 'Proatividade e Iniciativa', rating: 9, weight: 9 } ],
        occurrences: [ { id: 'o1', name: 'Elogio de Cliente', impact: 2 } ]
    },
    { 
        id: 'f2', employeeId: '2', authorName: 'João Mendes', date: '2025-09-22T02:52:00Z', finalScore: 0,
        qualitative: 'Brendon precisa melhorar a atenção aos detalhes na organização do setor. Foram encontrados produtos fora do lugar em sua área de responsabilidade. Ocorrência de atraso também impactou negativamente.',
        activities: [ { id: 'a2', name: 'Organização do Setor', rating: 3, weight: 7 } ],
        occurrences: [ { id: 'o3', name: 'Atraso Injustificado', impact: -1 } ]
    },
    { 
        id: 'f3', employeeId: '1', authorName: 'Ana Costa', date: '2025-08-15T10:00:00Z', finalScore: 8.5,
        qualitative: 'Desempenho muito bom no trabalho em equipe durante o período de alta demanda. Ajudou colegas de outros setores sem que fosse solicitado.',
        activities: [ { id: 'a3', name: 'Trabalho em Equipe', rating: 9, weight: 6 } ],
        occurrences: []
    }
];

const initialLoggedOccurrences: LoggedOccurrence[] = [
    { id: 'lo1', employeeId: '2', occurrenceId: 'o3', name: 'Atraso Injustificado', category: OccurrenceCategory.PrecisaMelhorar, date: '2025-09-21T08:10:00Z', authorName: 'João Mendes', notes: 'Chegou 10 minutos atrasado.' },
    { id: 'lo2', employeeId: '1', occurrenceId: 'o1', name: 'Elogio de Cliente', category: OccurrenceCategory.DesempenhoExcepcional, date: '2025-09-22T14:30:00Z', authorName: 'Ana Costa', notes: 'Cliente Sra. Marta ligou para elogiar a paciência e cordialidade da funcionária.' },
    { id: 'lo3', employeeId: '3', occurrenceId: 'o2', name: 'Meta de Vendas Atingida', category: OccurrenceCategory.Positivo, date: '2025-08-30T18:00:00Z', authorName: 'João Mendes', notes: 'Atingiu 110% da meta de vendas de carnes nobres.' },
    { id: 'lo4', employeeId: '4', occurrenceId: 'o4', name: 'Uso de Celular', category: OccurrenceCategory.ViolacaoPolitica, date: '2025-09-19T11:00:00Z', authorName: 'Admin RH', notes: 'Observado utilizando redes sociais no celular durante o horário de produção.' }
];


const initialSectors: Sector[] = [
    { id: 's1', name: 'Frente de Loja', description: 'Operação de caixas e atendimento ao cliente.', sections: 2 },
    { id: 's2', name: 'Mercearia', description: 'Reposição e organização de produtos.', sections: 3 },
    { id: 's3', name: 'Açougue', description: 'Corte e venda de carnes.', sections: 1 },
    { id: 's4', name: 'Padaria', description: 'Produção e venda de pães e confeitaria.', sections: 1 },
];

const initialSections: Section[] = [
    { id: 'sec1', name: 'Caixas Rápidos', sector: 'Frente de Loja', description: 'Atendimento para poucos volumes.' },
    { id: 'sec2', name: 'Caixas Preferenciais', sector: 'Frente de Loja', description: 'Atendimento prioritário.' },
    { id: 'sec3', name: 'Corredor 1-5', sector: 'Mercearia', description: 'Produtos de alimentação básica.' },
    { id: 'sec4', name: 'Corredor 6-10', sector: 'Mercearia', description: 'Bebidas e enlatados.' },
    { id: 'sec5', name: 'Corredor 11-15', sector: 'Mercearia', description: 'Limpeza e higiene.' },
    { id: 'sec6', name: 'Balcão de Atendimento', sector: 'Açougue', description: 'Atendimento direto ao cliente.' },
    { id: 'sec7', name: 'Produção', sector: 'Padaria', description: 'Área de fabricação de produtos.' },
];


const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        localStorage.removeItem(key);
    }
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
};


interface DataContextType {
  employees: Employee[];
  activities: Activity[];
  occurrences: Occurrence[];
  sectors: Sector[];
  sections: Section[];
  feedbacks: DetailedFeedback[];
  loggedOccurrences: LoggedOccurrence[];
  users: User[];
  addEmployee: (employee: Omit<Employee, 'id' | 'initials' | 'admissionDate'>) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void;
  addSector: (sector: Omit<Sector, 'id' | 'sections'>) => void;
  addSection: (section: Omit<Section, 'id'>) => void;
  addLoggedOccurrence: (occurrenceData: Omit<LoggedOccurrence, 'id' | 'name' | 'category'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => getInitialState('employees', initialEmployees));
  const [activities, setActivities] = useState<Activity[]>(() => getInitialState('activities', initialActivities));
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => getInitialState('occurrences', initialOccurrences));
  const [sectors, setSectors] = useState<Sector[]>(() => getInitialState('sectors', initialSectors));
  const [sections, setSections] = useState<Section[]>(() => getInitialState('sections', initialSections));
  const [feedbacks, setFeedbacks] = useState<DetailedFeedback[]>(() => getInitialState('feedbacks', initialDetailedFeedbacks));
  const [loggedOccurrences, setLoggedOccurrences] = useState<LoggedOccurrence[]>(() => getInitialState('loggedOccurrences', initialLoggedOccurrences));
  const [users, setUsers] = useState<User[]>(() => getInitialState('users', initialUsers));

  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('occurrences', JSON.stringify(occurrences)); }, [occurrences]);
  useEffect(() => { localStorage.setItem('sectors', JSON.stringify(sectors)); }, [sectors]);
  useEffect(() => { localStorage.setItem('sections', JSON.stringify(sections)); }, [sections]);
  useEffect(() => { localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); }, [feedbacks]);
  useEffect(() => { localStorage.setItem('loggedOccurrences', JSON.stringify(loggedOccurrences)); }, [loggedOccurrences]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);


  const addEmployee = (employee: Omit<Employee, 'id' | 'initials' | 'admissionDate'>) => {
    const newId = `emp_${Date.now()}`;
    const initials = (employee.name.split(' ').map(n => n[0]).slice(0, 2).join('') || '').toUpperCase();
    const admissionDate = new Date().toISOString().split('T')[0];
    const newEmployee: Employee = { ...employee, id: newId, initials, admissionDate };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { ...activity, id: `act_${Date.now()}` };
    setActivities(prev => [...prev, newActivity]);
  };

  const addOccurrence = (occurrence: Omit<Occurrence, 'id'>) => {
    const newOccurrence: Occurrence = { ...occurrence, id: `occ_${Date.now()}` };
    setOccurrences(prev => [...prev, newOccurrence]);
  };
  
  const addLoggedOccurrence = (occurrenceData: Omit<LoggedOccurrence, 'id' | 'name' | 'category'>) => {
    const baseOccurrence = occurrences.find(o => o.id === occurrenceData.occurrenceId);
    if (!baseOccurrence) return;

    const newLoggedOccurrence: LoggedOccurrence = {
        ...occurrenceData,
        id: `locc_${Date.now()}`,
        name: baseOccurrence.name,
        category: baseOccurrence.category,
    };
    setLoggedOccurrences(prev => [newLoggedOccurrence, ...prev]);
  };

  const addSector = (sector: Omit<Sector, 'id' | 'sections'>) => {
    const newSector: Sector = { ...sector, id: `sec_${Date.now()}`, sections: 0 };
    setSectors(prev => [...prev, newSector]);
  };

  const addSection = (section: Omit<Section, 'id'>) => {
    const newSection: Section = { ...section, id: `sct_${Date.now()}` };
    setSections(prev => [...prev, newSection]);
    setSectors(prev => prev.map(s => s.name === section.sector ? {...s, sections: s.sections + 1} : s));
  };

  const value = { employees, activities, occurrences, sectors, sections, feedbacks, loggedOccurrences, users, addEmployee, addActivity, addOccurrence, addSector, addSection, addLoggedOccurrence };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};