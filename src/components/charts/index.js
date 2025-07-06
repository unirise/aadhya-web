// Export all chart components for easy importing
export { default as SampleLineChart } from './SampleLineChart'
export { default as SampleBarChart } from './SampleBarChart'
export { default as SamplePieChart } from './SamplePieChart'
export { default as ChartWrapper } from './ChartWrapper'

// Chart utilities and constants
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
}

export const CHART_THEMES = {
  light: {
    background: '#ffffff',
    text: '#1f2937',
    grid: '#e5e7eb',
    tooltip: '#f9fafb',
    border: '#e5e7eb',
  },
  dark: {
    background: '#1f2937',
    text: '#f9fafb',
    grid: '#374151',
    tooltip: '#374151',
    border: '#4b5563',
  },
}

// Common chart configurations
export const DEFAULT_CHART_CONFIG = {
  height: 400,
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  tooltip: {
    contentStyle: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
  },
  legend: {
    verticalAlign: 'bottom',
    height: 36,
  },
}

// Sample data generators for testing
export const generateSampleData = (type = 'line', count = 7) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  switch (type) {
    case 'line':
      return Array.from({ length: count }, (_, i) => ({
        name: months[i],
        users: Math.floor(Math.random() * 500) + 100,
        posts: Math.floor(Math.random() * 1000) + 50,
        views: Math.floor(Math.random() * 3000) + 500,
      }))

    case 'bar':
      return Array.from({ length: count }, (_, i) => ({
        name: months[i],
        revenue: Math.floor(Math.random() * 5000) + 1000,
        expenses: Math.floor(Math.random() * 4000) + 500,
        profit: Math.floor(Math.random() * 2000) - 500,
      }))

    case 'pie':
      return [
        {
          name: 'Desktop',
          value: Math.floor(Math.random() * 30) + 30,
          color: CHART_COLORS.primary,
        },
        {
          name: 'Mobile',
          value: Math.floor(Math.random() * 25) + 25,
          color: CHART_COLORS.secondary,
        },
        {
          name: 'Tablet',
          value: Math.floor(Math.random() * 20) + 10,
          color: CHART_COLORS.accent,
        },
        {
          name: 'Other',
          value: Math.floor(Math.random() * 15) + 5,
          color: CHART_COLORS.danger,
        },
      ]

    default:
      return []
  }
}
