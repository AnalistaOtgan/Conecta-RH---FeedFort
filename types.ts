
export interface User {
  name: string;
  role: string;
  avatar: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  sector: string;
  shift: string;
  status: 'Ativo' | 'Inativo';
  initials: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  weight: number;
  attribute: string;
}

export enum OccurrenceCategory {
  DesempenhoExcepcional = 'Desempenho Excepcional',
  Positivo = 'Positivo',
  PrecisaMelhorar = 'Precisa Melhorar',
  ViolacaoPolitica = 'Violação de Política',
}

export interface Occurrence {
  id: string;
  name: string;
  description: string;
  category: OccurrenceCategory;
  impact: number;
}

export interface Sector {
    id: string;
    name: string;
    description: string;
    sections: number;
}

export interface Section {
    id: string;
    name: string;
    sector: string;
    description: string;
}

export interface Feedback {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  score: number;
  activities: number;
}
