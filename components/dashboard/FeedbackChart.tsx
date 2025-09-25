import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { DetailedFeedback } from '../../types';
import { TrendingUpIcon } from '../icons';

// Replicating Skeleton from example
const Skeleton: React.FC<{className?: string}> = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>
    {children}
  </div>
);
const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 pb-4 ${className}`}>{children}</div>;
const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// Date helpers to replace date-fns
const subDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - days);
  return newDate;
};

const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const dates = [];
  let currentDate = new Date(start);
  while(currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const formatDate = (date: Date, formatStr: string): string => {
  if(formatStr === 'yyyy-MM-dd') {
      return date.toISOString().split('T')[0];
  }
  if(formatStr === 'dd/MM') {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  return date.toLocaleDateString('pt-BR');
};


interface FeedbackChartProps {
    feedbacks: DetailedFeedback[];
    isLoading: boolean;
}

export default function FeedbackChart({ feedbacks, isLoading }: FeedbackChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const generateChartData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, 6);
    const dateRange = eachDayOfInterval(startDate, endDate);

    return dateRange.map(date => {
      const dateStr = formatDate(date, 'yyyy-MM-dd');
      const dayFeedbacks = feedbacks.filter(feedback => feedback.date.startsWith(dateStr));
      
      const avgScore = dayFeedbacks.length > 0 
        ? dayFeedbacks.reduce((sum, f) => sum + (f.finalScore || 0), 0) / dayFeedbacks.length
        : 0;

      return {
        date: formatDate(date, 'dd/MM'),
        fullDate: dateStr,
        feedbacks: dayFeedbacks.length,
        averageScore: Number(avgScore.toFixed(1))
      };
    });
  };

  const chartData = generateChartData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-blue-500" />
            Tendência de Feedback - Última Semana
          </CardTitle>
          <div className="text-sm text-gray-500">
            Total: {feedbacks.length} feedbacks
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Quantidade de Feedbacks</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                <YAxis tick={{ fontSize: 12 }} stroke="#666" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value) => [value, 'Feedbacks']}
                />
                <Bar dataKey="feedbacks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Pontuação Média</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
                  formatter={(value) => [value, 'Pontuação Média']}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#4CAF50', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}