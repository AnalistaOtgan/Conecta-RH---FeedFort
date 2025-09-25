import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from '../icons';

// Replicating Skeleton from example
const Skeleton: React.FC<{className?: string}> = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const colorVariants = {
  blue: {
    light: "bg-blue-50",
    icon: "text-blue-500"
  },
  green: {
    light: "bg-green-50",
    icon: "text-green-500"
  },
  yellow: {
    light: "bg-yellow-50", 
    icon: "text-yellow-500"
  },
  purple: {
    light: "bg-purple-50",
    icon: "text-purple-500" 
  }
};

interface StatsCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: string;
    color?: keyof typeof colorVariants;
    isLoading: boolean;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`bg-white rounded-xl border border-brand-gray shadow-sm ${className}`}>
    {children}
  </div>
);
const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <div className={`p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);


export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue",
  isLoading 
}: StatsCardProps) {
  const colors = colorVariants[color];
  const isPositiveTrend = trend?.includes('+') || trend?.includes('Meta');

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
              <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
              <Skeleton className="h-2 sm:h-3 w-14 sm:w-20" />
            </div>
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                {isPositiveTrend ? (
                  <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                ) : (
                  <TrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                )}
                <span className={`font-medium truncate ${
                  isPositiveTrend ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 lg:p-4 ${colors.light} rounded-full flex-shrink-0`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${colors.icon}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}