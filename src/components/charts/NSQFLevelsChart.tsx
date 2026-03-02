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
 * NSQF Levels Distribution Chart
 * Shows the distribution of roles across NSQF levels
 */
function NSQFLevelsChart({ data = [], height = 400 }) {
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

  // Count roles by NSQF level
  const levelCounts = {}
  data.forEach(role => {
    const level =
      role.nsqf_level !== null ? `Level ${role.nsqf_level}` : 'Not Mapped'
    levelCounts[level] = (levelCounts[level] || 0) + 1
  })

  // Transform to chart data
  const chartData = Object.entries(levelCounts)
    .map(([level, count]) => ({
      level,
      count,
    }))
    .sort((a, b) => {
      // Sort by level number, with "Not Mapped" at the end
      if (a.level === 'Not Mapped') return 1
      if (b.level === 'Not Mapped') return -1
      const aNum = parseInt(a.level.replace('Level ', ''))
      const bNum = parseInt(b.level.replace('Level ', ''))
      return aNum - bNum
    })

  const colors = {
    'Level 1': '#3b82f6',
    'Level 2': '#10b981',
    'Level 3': '#f59e0b',
    'Level 4': '#8b5cf6',
    'Level 5': '#ef4444',
    'Level 6': '#06b6d4',
    'Level 7': '#ec4899',
    'Not Mapped': '#9ca3af',
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: any }>
  }) => {
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
          <p
            style={{
              margin: 0,
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '4px',
            }}
          >
            {data.level}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#3b82f6',
            }}
          >
            {data.count} Role{data.count !== 1 ? 's' : ''}
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
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
        <XAxis dataKey='level' stroke='#6b7280' fontSize={12} />
        <YAxis stroke='#6b7280' fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey='count' radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[entry.level] || '#6b7280'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default NSQFLevelsChart
