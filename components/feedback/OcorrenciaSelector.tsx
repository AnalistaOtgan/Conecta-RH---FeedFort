import React from "react";
import { Occurrence, RegisteredOccurrence, OccurrenceCategory } from "../../types";
import { AlertTriangleIcon, CheckCircleIcon, AlertCircleIcon, XCircleIcon } from "../icons";

// Helper components
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea className={`block w-full px-3 py-2 bg-white border border-brand-gray rounded-md shadow-sm text-brand-text placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[80px] ${props.className}`} {...props} />;
const Badge: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;
const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input type="checkbox" className={`h-4 w-4 shrink-0 rounded-sm border border-brand-gray text-brand-blue focus:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`} {...props} />;


const categoryConfig = {
  [OccurrenceCategory.Positivo]: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircleIcon,
    iconColor: "text-green-500"
  },
  [OccurrenceCategory.PrecisaMelhorar]: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: AlertTriangleIcon,
    iconColor: "text-yellow-500"
  },
  [OccurrenceCategory.ViolacaoPolitica]: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircleIcon,
    iconColor: "text-red-500"
  },
  [OccurrenceCategory.DesempenhoExcepcional]: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircleIcon,
    iconColor: "text-blue-500"
  }
};

interface OcorrenciaSelectorProps {
    ocorrencias: Occurrence[];
    selectedOcorrencias: RegisteredOccurrence[];
    onChange: (occurrenceId: string, details: string | null) => void;
}

export default function OcorrenciaSelector({ ocorrencias, selectedOcorrencias, onChange }: OcorrenciaSelectorProps) {

  const handleCheckboxChange = (occurrenceId, checked) => {
    if (checked) {
      onChange(occurrenceId, ""); // Add with empty details
    } else {
      onChange(occurrenceId, null); // Remove
    }
  };

  const handleDetalhesChange = (occurrenceId, details) => {
    onChange(occurrenceId, details);
  };
  
  const groupedOcorrencias = ocorrencias.reduce((acc, ocorrencia) => {
    const category = ocorrencia.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ocorrencia);
    return acc;
  }, {} as Record<OccurrenceCategory, Occurrence[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedOcorrencias).map(([category, ocorrenciasList]) => {
        const config = categoryConfig[category];
        if (!config) return null;

        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <config.icon className={`w-5 h-5 ${config.iconColor}`} />
              <h4 className="font-medium text-gray-900 capitalize">
                {category}
              </h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {ocorrenciasList.map((ocorrencia) => {
                const isSelected = selectedOcorrencias.some(o => o.occurrenceId === ocorrencia.id);
                const selectedOcorrencia = selectedOcorrencias.find(o => o.occurrenceId === ocorrencia.id);

                return (
                  <div key={ocorrencia.id} className="space-y-3">
                    <div className={`p-3 border rounded-lg transition-all duration-200 ${
                      isSelected ? `${config.color} border-current` : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleCheckboxChange(ocorrencia.id, e.target.checked)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{ocorrencia.name}</p>
                            {ocorrencia.impact !== 0 && (
                              <Badge 
                                className={`text-xs ${
                                  ocorrencia.impact > 0 ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'
                                }`}
                              >
                                {ocorrencia.impact > 0 ? '+' : ''}{ocorrencia.impact}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{ocorrencia.description}</p>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="ml-6">
                        <Label className="text-sm font-medium">Detalhes da Ocorrência</Label>
                        <Textarea
                          placeholder="Descreva detalhes específicos desta ocorrência..."
                          value={selectedOcorrencia?.details || ""}
                          onChange={(e) => handleDetalhesChange(ocorrencia.id, e.target.value)}
                          className="mt-1 h-20"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedOcorrencias.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangleIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Nenhuma ocorrência selecionada</p>
          <p className="text-xs mt-1">Selecione ocorrências relevantes observadas durante o turno</p>
        </div>
      )}
    </div>
  );
}