import React from "react";
import { DetailedFeedback, Employee } from '../../types';
import { MessageSquareIcon, ClockIcon } from "../icons";

// Replicating Skeleton from example
const Skeleton: React.FC<{className?: string}> = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-6 pb-4">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Badge: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>;


interface RecentFeedbacksProps {
    feedbacks: DetailedFeedback[];
    employees: Employee[];
    isLoading: boolean;
}

export default function RecentFeedbacks({ feedbacks, employees, isLoading }: RecentFeedbacksProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedbacks Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(f => f.id === employeeId);
    return employee?.name || 'Funcionário não encontrado';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatRelativeTime = (dateStr) => {
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareIcon className="w-5 h-5 text-blue-500" />
          Feedbacks Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedbacks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquareIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhum feedback recente</p>
          </div>
        ) : (
          feedbacks.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((feedback) => (
            <div 
              key={feedback.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                  {getEmployeeName(feedback.employeeId)}
                </p>
                {feedback.finalScore && (
                  <Badge className={getScoreColor(feedback.finalScore)}>
                    {feedback.finalScore}/10
                  </Badge>
                )}
              </div>
              
              {feedback.qualitative && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {feedback.qualitative.substring(0, 100)}
                  {feedback.qualitative.length > 100 ? '...' : ''}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {formatRelativeTime(feedback.date)}
                </div>
                {feedback.activities?.length > 0 && (
                  <span>
                    {feedback.activities.length} atividade{feedback.activities.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}