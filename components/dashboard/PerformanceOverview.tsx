import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DetailedFeedback, Employee } from '../../types';
import { TargetIcon } from "../icons";

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


const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#9E9E9E'];

interface PerformanceOverviewProps {
    feedbacks: DetailedFeedback[];
    employees: Employee[];
    isLoading: boolean;
}

export default function PerformanceOverview({ feedbacks, isLoading }: PerformanceOverviewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const generatePerformanceData = () => {
    const categories = {
      excelente: { name: 'Excelente (8-10)', count: 0 },
      bom: { name: 'Bom (6-7.9)', count: 0 },
      precisa_melhorar: { name: 'Precisa Melhorar (4-5.9)', count: 0 },
      critico: { name: 'Crítico (0-3.9)', count: 0 }
    };

    feedbacks.forEach(feedback => {
      const score = feedback.finalScore || 0;
      if (score >= 8) categories.excelente.count++;
      else if (score >= 6) categories.bom.count++;
      else if (score >= 4) categories.precisa_melhorar.count++;
      else categories.critico.count++;
    });

    return [
      { name: categories.excelente.name, value: categories.excelente.count, color: COLORS[0] },
      { name: categories.bom.name, value: categories.bom.count, color: COLORS[1] },
      { name: categories.precisa_melhorar.name, value: categories.precisa_melhorar.count, color: COLORS[2] },
      { name: categories.critico.name, value: categories.critico.count, color: COLORS[3] }
    ].filter(item => item.value > 0);
  };

  const performanceData = generatePerformanceData();
  const totalFeedbacks = feedbacks.length;

  // FIX: Add optional types to props to match how Recharts passes them to custom components.
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalFeedbacks > 0 ? ((data.value / totalFeedbacks) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} feedback{data.value !== 1 ? 's' : ''} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TargetIcon className="w-5 h-5 text-purple-500" />
          Visão Geral de Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {performanceData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TargetIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum feedback com pontuação disponível</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Distribuição de Performance</h4>
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Total de Feedbacks:</span>
                  <span>{totalFeedbacks}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}