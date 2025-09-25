export interface User {
  id: string;
  name: string;
  role: 'Diretor' | 'RH' | 'Líder de Loja';
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
    admissionDate: string;
    terminationDate?: string;
    leaderId?: string;
    leaderName?: string;
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
    PrecisaMelhorar = 'Precisa Melhorar',
    Positivo = 'Positivo',
    ViolacaoPolitica = 'Violação de Política',
}

export interface Occurrence {
    id:string;
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
    ativo: boolean;
}

export interface Section {
    id: string;
    name: string;
    setor_id: string;
    description: string;
    ativo: boolean;
}

export interface DetailedFeedback {
    id: string;
    employeeId: string;
    authorName: string;
    date: string;
    finalScore: number;
    qualitative: string;
    activities: { id: string; name: string; rating: number; weight: number }[];
    occurrences: { id: string; name: string; impact: number }[];
}

// Types for the New Feedback Form
export interface ObservedActivity {
  activityId: string;
  rating: number;
  observations: string;
}

export interface RegisteredOccurrence {
  occurrenceId: string;
  details: string;
}

export interface FeedbackData {
  employeeId: string;
  feedbackDate: string;
  shift: string;
  observedActivities: ObservedActivity[];
  qualitativeFeedback: string;
  occurrences: RegisteredOccurrence[];
  finalScore: number;
  authorId: string;
}