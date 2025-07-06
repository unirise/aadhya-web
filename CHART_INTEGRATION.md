# Chart Integration Guide - Recharts

This project includes Recharts for powerful and flexible data visualization.

## 🚀 Quick Start

### Using Pre-built Charts

```javascript
// Import individual charts
import { SampleLineChart, SampleBarChart, SamplePieChart } from './components/charts'

// Use in your component
<SampleLineChart data={yourData} height={400} />
<SampleBarChart data={yourData} height={400} />
<SamplePieChart data={yourData} height={400} />
```

### Using Chart Wrapper (Recommended)

```javascript
import { ChartWrapper } from './components/charts'

// Basic usage
<ChartWrapper type="line" height={400} />

// With custom data and controls
<ChartWrapper
    type="bar"
    data={yourData}
    height={400}
    title="Sales Dashboard"
    showControls={true}
/>

// With loading and error states
<ChartWrapper
    type="pie"
    isLoading={isLoading}
    error={error}
    data={data}
/>
```

## 📁 File Structure

```
src/components/charts/
├── SampleLineChart.jsx    # Line chart component
├── SampleBarChart.jsx     # Bar chart component
├── SamplePieChart.jsx     # Pie chart component
├── ChartWrapper.jsx       # Wrapper with controls & states
└── index.js              # Exports & utilities
```

## 📊 Available Charts

### Line Chart

- **Purpose:** Show trends over time
- **Data Format:** `[{ name: 'Jan', users: 400, posts: 240 }]`
- **Use Cases:** Analytics, performance metrics, growth trends

### Bar Chart

- **Purpose:** Compare categories
- **Data Format:** `[{ name: 'Jan', revenue: 4000, expenses: 2400 }]`
- **Use Cases:** Sales comparison, revenue analysis, category performance

### Pie Chart

- **Purpose:** Show proportions
- **Data Format:** `[{ name: 'Desktop', value: 45, color: '#3b82f6' }]`
- **Use Cases:** Market share, user demographics, device distribution

## 🎨 Customization

### Colors

```javascript
import { CHART_COLORS } from "./components/charts";

// Available colors
CHART_COLORS.primary; // #3b82f6 (blue)
CHART_COLORS.secondary; // #10b981 (green)
CHART_COLORS.accent; // #f59e0b (yellow)
CHART_COLORS.danger; // #ef4444 (red)
```

### Themes

```javascript
import { CHART_THEMES } from "./components/charts";

// Light theme
CHART_THEMES.light.background; // #ffffff
CHART_THEMES.light.text; // #1f2937

// Dark theme
CHART_THEMES.dark.background; // #1f2937
CHART_THEMES.dark.text; // #f9fafb
```

### Custom Chart

```javascript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

## 📝 Data Integration

### With TanStack Query

```javascript
import { useStats } from "../hooks/useQueries";
import { ChartWrapper } from "../components/charts";

function Dashboard() {
  const { data: stats, isLoading, error } = useStats();

  return (
    <ChartWrapper
      type="line"
      data={stats}
      isLoading={isLoading}
      error={error?.message}
      title="Real-time Analytics"
    />
  );
}
```

### Sample Data Generator

```javascript
import { generateSampleData } from "./components/charts";

// Generate sample data for testing
const lineData = generateSampleData("line", 7); // 7 months of line data
const barData = generateSampleData("bar", 6); // 6 months of bar data
const pieData = generateSampleData("pie"); // Pie chart data
```

## 🔧 Features

✅ **Responsive Design** - Charts adapt to screen size
✅ **Interactive Tooltips** - Hover for detailed information
✅ **Loading States** - Built-in loading indicators
✅ **Error Handling** - Graceful error display
✅ **Chart Controls** - Switch between chart types
✅ **Customizable Colors** - Predefined color schemes
✅ **Animation Support** - Smooth transitions
✅ **Accessibility** - Screen reader friendly

## 📱 Responsive Behavior

- **Desktop:** Full-featured charts with all controls
- **Tablet:** Optimized touch interactions
- **Mobile:** Simplified layout, essential features only

## 🎯 Current Status

✅ Recharts installed and configured
✅ Sample charts implemented (Line, Bar, Pie)
✅ Chart wrapper with controls ready
✅ Loading and error states
✅ Responsive design
✅ Color themes and utilities
✅ Sample data generators
✅ Documentation complete

Your charts are ready to use! Visit the Home page to see them in action.
