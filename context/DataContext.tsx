import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Employee, Activity, Occurrence, OccurrenceCategory, Sector, Section } from '../types';

// A safe storage wrapper that checks for localStorage availability once.
const createSafeStorage = (): Storage => {
  // In-memory storage fallback
  const inMemoryStore: { [key: string]: string } = {};
  const inMemoryStorage: Storage = {
    getItem: (key: string) => inMemoryStore[key] ?? null,
    setItem: (key: string, value: string) => {
      inMemoryStore[key] = value;
    },
    removeItem: (key: string) => {
      delete inMemoryStore[key];
    },
    clear: () => {
      for (const key in inMemoryStore) {
        delete inMemoryStore[key];
      }
    },
    key: (index: number) => Object.keys(inMemoryStore)[index] ?? null,
    get length() {
      return Object.keys(inMemoryStore).length;
    },
  };

  try {
    // We need to check for existence and then perform a test operation.
    // The entire block is in a try-catch to handle SecurityError.
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__test_storage_';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch (e) {
    console.warn("localStorage is not available, falling back to in-memory storage. Data will not be persisted across page loads.", e);
  }
  
  // If the try block failed or localStorage is not available, return the in-memory fallback.
  return inMemoryStorage;
};

const safeStorage = createSafeStorage();

// Mock Data (as initial data if localStorage is empty)
const initialEmployees: Employee[] = [
  { id: '1', name: 'FERNANDA SILVA DOS SANTOS', role: 'Operador de Caixa', sector: 'Frente de Loja', shift: 'Fechamento', status: 'Ativo', initials: 'FE' },
  { id: '2', name: 'BRENDON SOUSA DE OLIVEIRA', role: 'Repositor', sector: 'Mercearia', shift: 'Abertura', status: 'Ativo', initials: 'BR' },
  { id: '3', name: 'CARLOS ALBERTO PEREIRA', role: 'Açougueiro', sector: 'Açougue', shift: 'Intermediário', status: 'Ativo', initials: 'CA' },
  { id: '4', name: 'MARIA EDUARDA GONÇALVES', role: 'Padeiro', sector: 'Padaria', shift: 'Abertura', status: 'Ativo', initials: 'ME' },
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
        const storedValue = safeStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading ${key} from safeStorage`, error);
        safeStorage.removeItem(key);
    }
    safeStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
};


interface DataContextType {
  employees: Employee[];
  activities: Activity[];
  occurrences: Occurrence[];
  sectors: Sector[];
  sections: Section[];
  addEmployee: (employee: Omit<Employee, 'id' | 'initials'>) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void;
  addSector: (sector: Omit<Sector, 'id' | 'sections'>) => void;
  addSection: (section: Omit<Section, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => getInitialState('employees', initialEmployees));
  const [activities, setActivities] = useState<Activity[]>(() => getInitialState('activities', initialActivities));
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => getInitialState('occurrences', initialOccurrences));
  const [sectors, setSectors] = useState<Sector[]>(() => getInitialState('sectors', initialSectors));
  const [sections, setSections] = useState<Section[]>(() => getInitialState('sections', initialSections));

  useEffect(() => { safeStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { safeStorage.setItem('activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { safeStorage.setItem('occurrences', JSON.stringify(occurrences)); }, [occurrences]);
  useEffect(() => { safeStorage.setItem('sectors', JSON.stringify(sectors)); }, [sectors]);
  useEffect(() => { safeStorage.setItem('sections', JSON.stringify(sections)); }, [sections]);

  const addEmployee = (employee: Omit<Employee, 'id' | 'initials'>) => {
    const newId = `emp_${Date.now()}`;
    const initials = (employee.name.split(' ').map(n => n[0]).slice(0, 2).join('') || '').toUpperCase();
    const newEmployee: Employee = { ...employee, id: newId, initials };
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

  const addSector = (sector: Omit<Sector, 'id' | 'sections'>) => {
    const newSector: Sector = { ...sector, id: `sec_${Date.now()}`, sections: 0 };
    setSectors(prev => [...prev, newSector]);
  };

  const addSection = (section: Omit<Section, 'id'>) => {
    const newSection: Section = { ...section, id: `sct_${Date.now()}` };
    setSections(prev => [...prev, newSection]);
    setSectors(prev => prev.map(s => s.name === section.sector ? {...s, sections: s.sections + 1} : s));
  };

  const value = { employees, activities, occurrences, sectors, sections, addEmployee, addActivity, addOccurrence, addSector, addSection };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};