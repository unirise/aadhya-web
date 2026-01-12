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
 * Hybrid Roles Chart
 * Shows the number of roles for each hybrid intelligence combination
 */
function HybridRolesChart({ data = [], height = 400 }) {
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
    name: item.combination.length > 25 ? `${item.combination.substring(0, 25)}...` : item.combination,
    fullName: item.combination,
    roles: item.roles?.length || 0,
    description: item.description,
  }))

  const colors = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff']

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
            maxWidth: '300px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
            {data.fullName}
          </p>
          {data.description && (
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontStyle: 'italic' }}>
              {data.description}
            </p>
          )}
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#8b5cf6' }}>
            {data.roles} Role{data.roles !== 1 ? 's' : ''}
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
        <Bar dataKey='roles' radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default HybridRolesChart


