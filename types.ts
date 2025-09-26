
export interface User {
  id: string;
  name: string;
  role: 'Diretor' | 'RH' | 'Líder de Loja';
  avatar: string;
}

export interface JobHistoryEntry {
  role: string;
  sectionId: string;
  startDate: string;
  endDate?: string;
}

export interface MedicalCertificate {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string; // Causa/Motivo
  cid?: string;    // CID
}

export interface Ferias {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  periodoAquisitivo: string;
  observacoes?: string;
}

export interface Employee {
    id: string;
    // New fields
    nome_completo: string;
    email: string;
    secao_id: string; 
    turno: 'abertura' | 'intermediario' | 'fechamento' | 'integral';
    eh_lider: boolean;
    ativo: boolean;
    setores_liderados?: string[];
    jobHistory?: JobHistoryEntry[];
    isUser?: boolean;
    
    // Old fields for compatibility
    name: string;
    role: string;
    sector: string;
    shift: string;
    status: 'Ativo' | 'Inativo';

    // Common fields
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
    authorId: string;
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