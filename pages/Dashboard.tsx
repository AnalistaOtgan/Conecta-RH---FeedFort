import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DetailedFeedback, Employee } from "../types";
import { useData } from "../context/DataContext";
import { 
  TrendingUpIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  AwardIcon,
  ChevronRightIcon,
  StarIcon,
  CalendarIcon,
  TargetIcon
} from "../components/icons";

import StatsCard from "../components/dashboard/StatsCard";
import FeedbackChart from "../components/dashboard/FeedbackChart";
import TopPerformers from "../components/dashboard/TopPerformers";
import RecentFeedbacks from "../components/dashboard/RecentFeedbacks";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="p-6 pb-4">{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${className}`} {...props}>{children}</button>;


export default function Dashboard() {
  const { feedbacks: allFeedbacks, employees: allEmployees } = useData();
  const [feedbacks, setFeedbacks] = useState<DetailedFeedback[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might have more complex loading logic
    // For now, we just use the data from the context
    setFeedbacks(allFeedbacks);
    setEmployees(allEmployees);
    setIsLoading(false);
  }, [allFeedbacks, allEmployees]);

  const getRecentFeedbacks = (days: number) => {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    return feedbacks.filter(feedback => new Date(feedback.date) > sinceDate);
  };

  const calculateAverageScore = () => {
    if (feedbacks.length === 0) return 0;
    const totalScore = feedbacks.reduce((sum, feedback) => sum + (feedback.finalScore || 0), 0);
    return (totalScore / feedbacks.length).toFixed(1);
  };

  const getTodayFeedbacks = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    return feedbacks.filter(feedback => feedback.date.startsWith(todayStr)).length;
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Bem-vindo ao Dashboard
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Acompanhe o desempenho e feedback da sua equipe em tempo real
          </p>
        </div>
        <Link to="/feedback">
          <Button className="bg-brand-blue text-white hover:bg-brand-dark-blue w-full sm:w-auto">
            <MessageSquareIcon className="w-4 h-4 mr-2" />
            Novo Feedback
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Total de Feedback"
          value={feedbacks.length.toString()}
          icon={MessageSquareIcon}
          trend="+12% esta semana"
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Funcionários Ativos"
          value={employees.filter(f => f.status === 'Ativo').length.toString()}
          icon={UsersIcon}
          trend="2 novos este mês"
          color="green"
          isLoading={isLoading}
        />
        <StatsCard
          title="Pontuação Média"
          value={`${calculateAverageScore()}/10`}
          icon={StarIcon}
          trend="+0.3 pontos"
          color="yellow"
          isLoading={isLoading}
        />
        <StatsCard
          title="Feedback Hoje"
          value={getTodayFeedbacks().toString()}
          icon={CalendarIcon}
          trend="Meta: 15 feedbacks"
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <FeedbackChart 
            feedbacks={feedbacks}
            isLoading={isLoading}
          />
          
          <div className="block xl:hidden">
            <TopPerformers 
              feedbacks={feedbacks}
              employees={employees}
              isLoading={isLoading}
            />
          </div>
          
          <PerformanceOverview 
            feedbacks={feedbacks}
            employees={employees}
            isLoading={isLoading}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="hidden xl:block">
            <TopPerformers 
              feedbacks={feedbacks}
              employees={employees}
              isLoading={isLoading}
            />
          </div>
          
          <RecentFeedbacks 
            feedbacks={getRecentFeedbacks(30)}
            employees={employees}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TargetIcon className="w-5 h-5 text-blue-500" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/feedback">
              <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <MessageSquareIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-sm sm:text-base">Dar Feedback</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
            </Link>

            <Link to="/reports">
              <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <TrendingUpIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-sm sm:text-base">Ver Relatórios</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
              </div>
            </Link>

            <Link to="/employees">
              <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <UsersIcon className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-sm sm:text-base">Gerenciar Equipe</span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}