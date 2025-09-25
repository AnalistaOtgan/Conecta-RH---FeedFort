import React from "react";
import { DetailedFeedback, Employee } from '../../types';
import { AwardIcon, StarIcon } from "../icons";

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
const Avatar: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>;
const AvatarFallback: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => <span className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>{children}</span>;


interface TopPerformersProps {
    feedbacks: DetailedFeedback[];
    employees: Employee[];
    isLoading: boolean;
}

export default function TopPerformers({ feedbacks, employees, isLoading }: TopPerformersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const calculatePerformance = () => {
    const performanceMap = new Map();

    employees.forEach(func => {
      const funcFeedbacks = feedbacks.filter(fb => fb.employeeId === func.id);
      if (funcFeedbacks.length > 0) {
        const avgScore = funcFeedbacks.reduce((sum, fb) => sum + (fb.finalScore || 0), 0) / funcFeedbacks.length;
        
        performanceMap.set(func.id, {
          employee: func,
          averageScore: Number(avgScore.toFixed(1)),
          feedbackCount: funcFeedbacks.length
        });
      }
    });

    return Array.from(performanceMap.values())
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 5);
  };

  const topPerformers = calculatePerformance();

  const getScoreColor = (score) => {
    if (score >= 8) return "bg-green-100 text-green-800";
    if (score >= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPositionIcon = (index) => {
    if (index === 0) return <AwardIcon className="w-4 h-4 text-yellow-500" />;
    if (index === 1) return <AwardIcon className="w-4 h-4 text-gray-400" />;
    if (index === 2) return <AwardIcon className="w-4 h-4 text-orange-400" />;
    return <StarIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AwardIcon className="w-5 h-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topPerformers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <StarIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>Nenhum feedback registrado ainda</p>
          </div>
        ) : (
          topPerformers.map((performer, index) => (
            <div 
              key={performer.employee.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                {getPositionIcon(index)}
                <span className="text-sm font-medium text-gray-500">
                  #{index + 1}
                </span>
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {performer.employee.initials || '??'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {performer.employee.name}
                </p>
                <p className="text-sm text-gray-500">
                  {performer.feedbackCount} feedback{performer.feedbackCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              <Badge className={getScoreColor(performer.averageScore)}>
                {performer.averageScore}/10
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}