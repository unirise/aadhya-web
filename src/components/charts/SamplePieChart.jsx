import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

// Sample data for pie chart
const samplePieData = [
  { name: 'Desktop', value: 45, color: '#3b82f6' },
  { name: 'Mobile', value: 35, color: '#10b981' },
  { name: 'Tablet', value: 15, color: '#f59e0b' },
  { name: 'Other', value: 5, color: '#ef4444' },
]

function SamplePieChart({ data = samplePieData, height = 400 }) {
  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
        Device Usage Distribution - Pie Chart
      </h3>
      <ResponsiveContainer width='100%' height={height}>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill='#8884d8'
            dataKey='value'
            stroke='#fff'
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Legend verticalAlign='bottom' height={36} iconType='circle' />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SamplePieChart
