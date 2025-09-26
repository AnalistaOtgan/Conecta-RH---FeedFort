import React, { useState, useEffect } from "react";
import { Employee, Activity, Occurrence, FeedbackData } from "../types";
import { 
  MessageSquareIcon, 
  UsersIcon, 
  CalendarIcon, 
  StarIcon, 
  AlertTriangleIcon,
  SaveIcon,
  XIcon,
  ChevronDownIcon
} from "../components/icons";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

import FuncionarioSelector from "../components/feedback/FuncionarioSelector";
import AtividadeSelector from "../components/feedback/AtividadeSelector";
import OcorrenciaSelector from "../components/feedback/OcorrenciaSelector";
import FeedbackPreview from "../components/feedback/FeedbackPreview";

// Helper components to replicate UI from example
const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>{children}</div>;
const CardHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="p-6 pb-4">{children}</div>;
const CardTitle: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${className}`} {...props}>{children}</button>;
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input className={`block w-full px-3 py-2 bg-white border border-brand-gray rounded-lg shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${props.className}`} {...props} />;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea className={`block w-full px-3 py-2 bg-white border border-brand-gray rounded-lg shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px] ${props.className}`} {...props} />;
const Select: React.FC<{children: React.ReactNode, value: string, onValueChange: (val:string) => void}> = ({children, value, onValueChange}) => (
    <div className="relative">
        <select value={value} onChange={e => onValueChange(e.target.value)} className="block w-full appearance-none rounded-lg border border-brand-gray bg-white px-3 py-2 pr-8 text-brand-text shadow-sm focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed">
            {children}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"/>
    </div>
);
const SelectItem: React.FC<{children: React.ReactNode, value: string}> = ({children, value}) => <option value={value}>{children}</option>;


export default function NewFeedback() {
  const navigate = useNavigate();
  const { employees, activities, occurrences, addFeedback } = useData();
  const { user } = useAuth();
  
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);
  const [activeActivities, setActiveActivities] = useState<Activity[]>([]);
  const [activeOccurrences, setActiveOccurrences] = useState<Occurrence[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [feedbackData, setFeedbackData] = useState({
    employeeId: "",
    feedbackDate: new Date().toISOString().split('T')[0],
    observedActivities: [],
    qualitativeFeedback: "",
    occurrences: [],
    shift: "abertura"
  });

  useEffect(() => {
    // In a real app, this would be an API call. Here we just filter the context data.
    setActiveEmployees(employees.filter(f => f.status === 'Ativo'));
    setActiveActivities(activities); // Assuming all context activities are active
    setActiveOccurrences(occurrences); // Assuming all context occurrences are active
    setIsLoading(false);
  }, [employees, activities, occurrences]);

  const handleActivityChange = (activityId, rating, observations = "") => {
    setFeedbackData(prev => {
      const newActivities = [...prev.observedActivities];
      const existingIndex = newActivities.findIndex(a => a.activityId === activityId);
      
      if (existingIndex >= 0) {
        if (rating === null) {
          newActivities.splice(existingIndex, 1);
        } else {
          newActivities[existingIndex] = { activityId, rating, observations };
        }
      } else if (rating !== null) {
        newActivities.push({ activityId, rating, observations });
      }
      
      return { ...prev, observedActivities: newActivities };
    });
  };

  const handleOccurrenceChange = (occurrenceId, details = "") => {
    setFeedbackData(prev => {
      const newOccurrences = [...prev.occurrences];
      const existingIndex = newOccurrences.findIndex(o => o.occurrenceId === occurrenceId);
      
      if (existingIndex >= 0) {
          // If details are null, it means uncheck
          if (details === null) {
            newOccurrences.splice(existingIndex, 1);
          } else {
            // Update details
            newOccurrences[existingIndex] = { ...newOccurrences[existingIndex], details };
          }
      } else {
        newOccurrences.push({ occurrenceId, details });
      }
      
      return { ...prev, occurrences: newOccurrences };
    });
  };

  const calculateFinalScore = () => {
    if (feedbackData.observedActivities.length === 0) return 0;
    
    let totalScore = 0;
    let totalWeight = 0;
    
    feedbackData.observedActivities.forEach(activity => {
      const activityInfo = activeActivities.find(a => a.id === activity.activityId);
      if (activityInfo) {
        totalScore += activity.rating * activityInfo.weight;
        totalWeight += activityInfo.weight;
      }
    });
    
    const baseScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    let occurrenceImpact = 0;
    feedbackData.occurrences.forEach(occurrence => {
      const occurrenceInfo = activeOccurrences.find(o => o.id === occurrence.occurrenceId);
      if (occurrenceInfo) {
        occurrenceImpact += occurrenceInfo.impact || 0;
      }
    });
    
    return Math.max(0, Math.min(10, baseScore + occurrenceImpact));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackData.employeeId) {
        alert("Por favor, selecione um funcionário.");
        return;
    }
    setIsSaving(true);
    
    try {
      const finalScore = calculateFinalScore();
      
      const submissionData: FeedbackData = {
        ...feedbackData,
        finalScore: Number(finalScore.toFixed(1)),
        authorId: user?.id || "unknown_user"
      };

      addFeedback(submissionData);
      
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando formulário...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Novo Feedback</h2>
          <p className="text-gray-500 mt-1">Registre o desempenho e desenvolvimento da equipe</p>
        </div>
        <Button 
          className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={() => navigate("/")}
        >
          <XIcon className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-blue-500" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FuncionarioSelector
                funcionarios={activeEmployees}
                selectedId={feedbackData.employeeId}
                onChange={(id) => setFeedbackData(prev => ({ ...prev, employeeId: id }))}
              />
              
              <div className="space-y-2">
                <Label htmlFor="feedbackDate">Data do Feedback</Label>
                <Input
                  id="feedbackDate"
                  type="date"
                  value={feedbackData.feedbackDate}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, feedbackDate: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift">Turno</Label>
                <Select
                  value={feedbackData.shift} 
                  onValueChange={(value) => setFeedbackData(prev => ({ ...prev, shift: value }))}
                >
                    <SelectItem value="abertura">Abertura</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="fechamento">Fechamento</SelectItem>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades Observadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-500" />
              Atividades Observadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AtividadeSelector
              atividades={activeActivities}
              selectedAtividades={feedbackData.observedActivities}
              onChange={handleActivityChange}
            />
          </CardContent>
        </Card>

        {/* Feedback Qualitativo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="w-5 h-5 text-green-500" />
              Feedback Qualitativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Descreva observações detalhadas sobre o desempenho, pontos fortes, áreas de melhoria e orientações para desenvolvimento..."
              value={feedbackData.qualitativeFeedback}
              onChange={(e) => setFeedbackData(prev => ({ ...prev, qualitativeFeedback: e.target.value }))}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Ocorrências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-orange-500" />
              Ocorrências
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OcorrenciaSelector
              ocorrencias={activeOccurrences}
              selectedOcorrencias={feedbackData.occurrences}
              onChange={handleOccurrenceChange}
            />
          </CardContent>
        </Card>

        {/* Preview e Ações */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button 
                  type="submit" 
                  className="bg-brand-blue text-white hover:bg-brand-dark-blue flex-1"
                  disabled={!feedbackData.employeeId || isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4 mr-2" />
                      Salvar Feedback
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/")}
                >
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>

          <FeedbackPreview
            feedbackData={feedbackData}
            activities={activeActivities}
            occurrences={activeOccurrences}
            employees={activeEmployees}
            finalScore={calculateFinalScore()}
          />
        </div>
      </form>
    </div>
  );
}