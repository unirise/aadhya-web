import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Sample data for bar chart
const sampleBarData = [
  { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
  { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
  { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
  { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
  { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
]

function SampleBarChart({ data = sampleBarData, height = 400 }) {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
        Monthly Revenue vs Expenses - Bar Chart
      </h3>
      <ResponsiveContainer width='100%' height={height}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
          <XAxis dataKey='name' stroke='#6b7280' fontSize={12} />
          <YAxis stroke='#6b7280' fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => [
              `$${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Legend />
          <Bar
            dataKey='revenue'
            fill='#3b82f6'
            name='Revenue'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='expenses'
            fill='#ef4444'
            name='Expenses'
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='profit'
            fill='#10b981'
            name='Profit'
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SampleBarChart
