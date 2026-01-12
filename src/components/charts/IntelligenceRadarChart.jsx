import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { getIntelligenceIcon } from '../../lib/intelligence-icons'

/**
 * Intelligence Radar Chart Component
 * Displays multiple intelligence scores in a radar/spider chart format
 */
function IntelligenceRadarChart({
  scores,
  domainDisplayNames = {},
  height = 400,
}) {
  // Transform scores object into array format for recharts
  // Order domains consistently for better visualization
  const domainOrder = [
    'LINGUISTIC',
    'LOGICAL_MATHEMATICAL',
    'SPATIAL',
    'BODILY_KINESTHETIC',
    'MUSICAL',
    'INTERPERSONAL',
    'INTRAPERSONAL',
    'NATURALISTIC',
  ]

  const chartData = domainOrder
    .filter(domain => scores && scores[domain] !== undefined)
    .map(domain => {
      const displayName = domainDisplayNames[domain] || domain
      const IconComponent = getIntelligenceIcon(domain)
      // Use full display name as label
      return {
        domain,
        label: displayName,
        fullName: displayName,
        score: Math.round(scores[domain]),
        fullScore: scores[domain],
        IconComponent,
      }
    })

  // Custom tooltip
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
          <p style={{ margin: 0, fontWeight: 'bold', color: '#1f2937' }}>
            {data.fullName}
          </p>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#3b82f6',
            }}
          >
            {data.fullScore.toFixed(1)}
          </p>
        </div>
      )
    }
    return null
  }

  if (!scores || Object.keys(scores).length === 0) {
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

  // Custom tick renderer to show icons instead of labels
  const renderCustomTick = ({ payload, x, y, index }) => {
    const data = chartData[index]
    const IconComponent = data?.IconComponent
    
    if (!IconComponent) {
      // Fallback to text if no icon available
      return (
        <g>
          <text
            x={x}
            y={y}
            textAnchor='middle'
            fill='#1f2937'
            fontSize='11'
            fontWeight='600'
          >
            {data?.fullName || payload.value || ''}
          </text>
        </g>
      )
    }

    // Calculate icon position - adjust based on angle to keep icons outside the chart
    // The x, y coordinates are already positioned on the circle, we just need to center the icon
    const iconSize = 24
    const iconOffset = iconSize / 2

    // Render icon centered at the tick position
    return (
      <g transform={`translate(${x}, ${y})`}>
        <foreignObject 
          x={-iconOffset} 
          y={-iconOffset} 
          width={iconSize} 
          height={iconSize}
          style={{ overflow: 'visible' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${iconSize}px`,
              height: `${iconSize}px`,
            }}
          >
            <IconComponent size={iconSize} color='#3b82f6' />
          </div>
        </foreignObject>
      </g>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={height}>
      <RadarChart
        data={chartData}
        margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
      >
        <PolarGrid stroke='#e5e7eb' />
        <PolarAngleAxis
          dataKey='label'
          tick={renderCustomTick}
          tickLine={{ stroke: '#9ca3af' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickCount={6}
        />
        <Radar
          name='Score'
          dataKey='score'
          stroke='#3b82f6'
          fill='#3b82f6'
          fillOpacity={0.4}
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType='circle'
          formatter={() => 'Intelligence Score'}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default IntelligenceRadarChart
