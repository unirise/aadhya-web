import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

/**
 * Roles by Intelligence Distribution Chart
 * Shows the distribution of roles across different intelligence types
 */
function RolesByIntelligenceChart({ data = {}, height = 400 }) {
  if (!data || Object.keys(data).length === 0) {
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
  const chartData = Object.entries(data)
    .map(([intelligence, roles]) => ({
      name: intelligence,
      value: roles?.length || 0,
      roles: roles || [],
    }))
    .filter(item => item.value > 0)

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
  ]

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
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px',
            }}
          >
            {data.name} Intelligence
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '8px',
            }}
          >
            {data.value} Role{data.value !== 1 ? 's' : ''}
          </p>
          {data.roles && data.roles.length > 0 && (
            <div
              style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px',
                }}
              >
                Sample roles:
              </p>
              {data.roles.slice(0, 3).map((role, idx) => (
                <p
                  key={idx}
                  style={{
                    margin: '2px 0',
                    fontSize: '11px',
                    color: '#4b5563',
                  }}
                >
                  • {role}
                </p>
              ))}
              {data.roles.length > 3 && (
                <p
                  style={{
                    margin: '2px 0',
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontStyle: 'italic',
                  }}
                >
                  +{data.roles.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    _percent,
    name,
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill='#1f2937'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        fontSize={12}
        fontWeight='600'
      >
        {name.split(' ')[0]}
      </text>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={120}
          fill='#8884d8'
          dataKey='value'
          stroke='#fff'
          strokeWidth={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign='bottom'
          height={36}
          iconType='circle'
          formatter={value => `${value} Intelligence`}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default RolesByIntelligenceChart
