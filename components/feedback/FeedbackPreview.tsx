import React from "react";
import { Employee, Activity, Occurrence } from "../../types";
import { StarIcon, UsersIcon, CalendarIcon, AwardIcon } from "../icons";

// Helper components
const Card: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>{children}</div>;
const CardHeader: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="p-6 pb-4">{children}</div>;
const CardTitle: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Badge: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;

export default function FeedbackPreview({ 
  feedbackData, 
  activities, 
  occurrences, 
  employees, 
  finalScore 
}) {
  const employee = employees.find(f => f.id === feedbackData.employeeId);

  const getScoreColor = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AwardIcon className="w-5 h-5 text-purple-500" />
          Resumo do Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Pontuação Geral</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {finalScore.toFixed(1)}/10
          </div>
          <Badge className={getScoreColor(finalScore)}>
            {finalScore >= 8 ? 'Excelente' : 
             finalScore >= 6 ? 'Bom' : 
             finalScore >= 4 ? 'Regular' : 'Precisa Melhorar'}
          </Badge>
        </div>

        {employee && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{employee.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>{new Date(feedbackData.feedbackDate).toLocaleDateString('pt-BR')} - {feedbackData.shift}</span>
            </div>
          </div>
        )}

        {feedbackData.observedActivities.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Atividades ({feedbackData.observedActivities.length})
            </h4>
            <div className="space-y-2">
              {feedbackData.observedActivities.map((activity) => {
                const activityInfo = activities.find(a => a.id === activity.activityId);
                if (!activityInfo) return null;

                return (
                  <div key={activity.activityId} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{activityInfo.name}</span>
                    <Badge className="ml-2 bg-gray-100 text-gray-800">
                      {activity.rating}/10
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {feedbackData.occurrences.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Ocorrências ({feedbackData.occurrences.length})
            </h4>
            <div className="space-y-1">
              {feedbackData.occurrences.map((occurrence) => {
                const occurrenceInfo = occurrences.find(o => o.id === occurrence.occurrenceId);
                if (!occurrenceInfo) return null;

                return (
                  <div key={occurrence.occurrenceId} className="text-sm text-gray-600">
                    • {occurrenceInfo.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {feedbackData.qualitativeFeedback && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
            <p className="text-sm text-gray-600 line-clamp-4">
              {feedbackData.qualitativeFeedback}
            </p>
          </div>
        )}

        {!feedbackData.employeeId && (
          <div className="text-center py-4 text-gray-500">
            <UsersIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Selecione um funcionário para ver o resumo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}