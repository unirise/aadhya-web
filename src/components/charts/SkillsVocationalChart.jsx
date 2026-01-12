import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

/**
 * Skills to Vocational Paths Chart
 * Shows the number of vocational paths available for each skill
 */
function SkillsVocationalChart({ data = [], height = 400 }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: height,
          color: '#6b7280',
        }}
      >
        No data available
      </div>
    )
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    name: item.skill.length > 20 ? `${item.skill.substring(0, 20)}...` : item.skill,
    fullName: item.skill,
    paths: item.vocationalPaths?.length || 0,
  }))

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#84cc16']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
            {data.fullName}
          </p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>
            {data.paths} Career Path{data.paths !== 1 ? 's' : ''}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
        <XAxis
          dataKey='name'
          stroke='#6b7280'
          fontSize={12}
          angle={-45}
          textAnchor='end'
          height={80}
        />
        <YAxis stroke='#6b7280' fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='paths' radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SkillsVocationalChart


