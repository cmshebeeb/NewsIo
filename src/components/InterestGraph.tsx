import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TrendData {
  date: string;
  value: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface SurveyTrend {
  date: string;
  satisfaction: number;
  engagement: number;
  relevance: number;
}

interface PersonalizationScore {
  date: string;
  score: number;
  interactions: number;
}

interface InterestData {
  category: string;
  percentage: number;
  previousPercentage: number;
}

interface InterestGraphProps {
  data: InterestData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const InterestGraph: React.FC<InterestGraphProps> = ({ data }) => {
  const [activeGraph, setActiveGraph] = useState<'interests' | 'survey' | 'personalization' | 'categories'>('interests');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Mock data - Replace with real data from your backend
  const interestTrends: TrendData[] = [
    { date: '2024-01', value: 65 },
    { date: '2024-02', value: 72 },
    { date: '2024-03', value: 68 },
    { date: '2024-04', value: 85 },
    { date: '2024-05', value: 90 },
  ];

  const categoryDistribution: CategoryData[] = [
    { name: 'Technology', value: 35 },
    { name: 'Science', value: 25 },
    { name: 'Business', value: 20 },
    { name: 'Politics', value: 15 },
    { name: 'Entertainment', value: 5 },
  ];

  const surveyTrends: SurveyTrend[] = [
    { date: '2024-01', satisfaction: 4.2, engagement: 3.8, relevance: 4.0 },
    { date: '2024-02', satisfaction: 4.3, engagement: 4.0, relevance: 4.1 },
    { date: '2024-03', satisfaction: 4.4, engagement: 4.2, relevance: 4.3 },
    { date: '2024-04', satisfaction: 4.6, engagement: 4.4, relevance: 4.5 },
    { date: '2024-05', satisfaction: 4.8, engagement: 4.6, relevance: 4.7 },
  ];

  const personalizationScores: PersonalizationScore[] = [
    { date: '2024-01', score: 72, interactions: 45 },
    { date: '2024-02', score: 75, interactions: 52 },
    { date: '2024-03', score: 78, interactions: 58 },
    { date: '2024-04', score: 82, interactions: 65 },
    { date: '2024-05', score: 88, interactions: 75 },
  ];

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const containerClasses = isFullScreen
    ? 'fixed inset-0 z-50 bg-white p-8'
    : 'space-y-4';

  const graphHeight = isFullScreen ? 'calc(100vh - 200px)' : '400px';

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No interest data available. Start exploring topics!</p>
      </div>
    );
  }

  return (
    <>
      <div className={containerClasses}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveGraph('interests')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeGraph === 'interests'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Interest Trends
            </button>
            <button
              onClick={() => setActiveGraph('survey')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeGraph === 'survey'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Survey Impact
            </button>
            <button
              onClick={() => setActiveGraph('personalization')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeGraph === 'personalization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Personalization Score
            </button>
            <button
              onClick={() => setActiveGraph('categories')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeGraph === 'categories'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Categories
            </button>
          </div>
          <button
            onClick={toggleFullScreen}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isFullScreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className={`bg-white rounded-lg p-4 shadow ${isFullScreen ? 'h-full' : ''}`}>
          {activeGraph === 'interests' && (
            <div style={{ height: graphHeight }}>
              <h3 className="text-lg font-semibold mb-4">Interest Trend Over Time</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interestTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Interest Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeGraph === 'survey' && (
            <div style={{ height: graphHeight }}>
              <h3 className="text-lg font-semibold mb-4">Survey Metrics Impact</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={surveyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="satisfaction"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Satisfaction"
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Engagement"
                  />
                  <Area
                    type="monotone"
                    dataKey="relevance"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Content Relevance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeGraph === 'personalization' && (
            <div style={{ height: graphHeight }}>
              <h3 className="text-lg font-semibold mb-4">Personalization Progress</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={personalizationScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="score"
                    fill="#8884d8"
                    name="Personalization Score"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="interactions"
                    fill="#82ca9d"
                    name="User Interactions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeGraph === 'categories' && (
            <div style={{ height: graphHeight }}>
              <h3 className="text-lg font-semibold mb-4">Interest Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isFullScreen ? 200 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                      name,
                    }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#666"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {`${name} (${(percent * 100).toFixed(0)}%)`}
                        </text>
                      );
                    }}
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Existing Data Summary */}
          <div className="space-y-4">
            {data.map((item) => {
              const trend = item.percentage - item.previousPercentage;
              const trendColor = trend >= 0 ? 'text-green-600' : 'text-red-600';
              const barColor = trend >= 0 ? 'bg-green-600' : 'bg-red-600';

              return (
                <div key={item.category} className="space-y-2">
                  {/* Category and Trend Display */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.category}</span>
                    <span className={`flex items-center ${trendColor}`} aria-label={`Trend: ${trend}%`}>
                      {trend >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(trend.toFixed(1)))}%
                    </span>
                  </div>

                  {/* Trend Bar */}
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor}`}
                      style={{ width: `${item.percentage}%`, transition: 'width 0.5s ease-in-out' }}
                      aria-label={`Current interest: ${item.percentage}%`}
                    />
                  </div>

                  {/* Data Summary */}
                  <div className="text-sm text-gray-500">
                    Current: {item.percentage}% | Previous: {item.previousPercentage}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFullScreen}
        />
      )}
    </>
  );
};