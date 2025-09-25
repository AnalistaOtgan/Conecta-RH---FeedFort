import React from "react";
import { Activity, ObservedActivity } from "../../types";
import { StarIcon, XIcon } from "../icons";

// Helper components
const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>{children}</div>;
const CardHeader: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>{children}</label>;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`} {...props} />;
const Badge: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;

const atributoColors: {[key: string]: string} = {
  Comunicação: "bg-blue-100 text-blue-800",
  Organização: "bg-purple-100 text-purple-800",
  Iniciativa: "bg-yellow-100 text-yellow-800",
  'Trabalho em Equipe': "bg-green-100 text-green-800",
};

interface AtividadeSelectorProps {
    atividades: Activity[];
    selectedAtividades: ObservedActivity[];
    onChange: (activityId: string, rating: number | null, observations?: string) => void;
}

export default function AtividadeSelector({ atividades, selectedAtividades, onChange }: AtividadeSelectorProps) {
  const handleRatingChange = (activityId: string, rating: number) => {
    const observations = selectedAtividades.find(a => a.activityId === activityId)?.observations || "";
    onChange(activityId, rating, observations);
  };

  const handleObservacoesChange = (activityId: string, observations: string) => {
    const atividade = selectedAtividades.find(a => a.activityId === activityId);
    if (atividade) {
      onChange(activityId, atividade.rating, observations);
    }
  };

  const removeAtividade = (activityId: string) => {
    onChange(activityId, null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Selecione as Atividades Observadas</h4>
        <div className="grid md:grid-cols-2 gap-3">
          {atividades.map((atividade) => {
            const isSelected = selectedAtividades.some(a => a.activityId === atividade.id);
            return (
              <div
                key={atividade.id}
                onClick={() => {
                  if (!isSelected) {
                    onChange(atividade.id, 5, "");
                  }
                }}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? "border-blue-300 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{atividade.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{atividade.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Badge className={atributoColors[atividade.attribute]}>
                      {atividade.attribute}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      Peso {atividade.weight}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedAtividades.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium text-gray-900">Pontuação das Atividades</h4>
          {selectedAtividades.map((selected) => {
            const atividade = atividades.find(a => a.id === selected.activityId);
            if (!atividade) return null;

            return (
              <Card key={atividade.id} className="border-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">{atividade.name}</CardTitle>
                    <button
                      type="button"
                      onClick={() => removeAtividade(atividade.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">
                        Pontuação: {selected.rating}/10
                      </Label>
                      <div className="flex items-center gap-1">
                        {[...Array(selected.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                         {[...Array(10 - selected.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      value={selected.rating}
                      onChange={(e) => handleRatingChange(atividade.id, parseInt(e.target.value, 10))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Observações Específicas</Label>
                    <Textarea
                      placeholder="Detalhe observações sobre esta atividade..."
                      value={selected.observations || ""}
                      onChange={(e) => handleObservacoesChange(atividade.id, e.target.value)}
                      className="mt-1 h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}