import { useState } from 'react'
import SampleLineChart from './SampleLineChart'
import SampleBarChart from './SampleBarChart'
import SamplePieChart from './SamplePieChart'

/**
 * Chart Wrapper Component for future charting features
 * This component serves as a container for different chart types
 * and provides common functionality like loading states, error handling, etc.
 */
function ChartWrapper({
    type = 'line',
    data = null,
    height = 400,
    title = null,
    isLoading = false,
    error = null,
    showControls = true
}) {
    const [selectedChart, setSelectedChart] = useState(type)

    const chartTypes = [
        { id: 'line', label: 'Line Chart', component: SampleLineChart },
        { id: 'bar', label: 'Bar Chart', component: SampleBarChart },
        { id: 'pie', label: 'Pie Chart', component: SamplePieChart },
    ]

    const getCurrentChart = () => {
        const chartType = chartTypes.find(ct => ct.id === selectedChart)
        return chartType ? chartType.component : SampleLineChart
    }

    const ChartComponent = getCurrentChart()

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: height,
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 12px'
                    }}></div>
                    <p>Loading chart data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: height,
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
            }}>
                <div style={{ textAlign: 'center', color: '#dc2626' }}>
                    <p>Error loading chart: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        }}>
            {/* Chart Header */}
            {(title || showControls) && (
                <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {title && (
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                            {title}
                        </h2>
                    )}

                    {showControls && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {chartTypes.map(chartType => (
                                <button
                                    key={chartType.id}
                                    onClick={() => setSelectedChart(chartType.id)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: selectedChart === chartType.id ? '#3b82f6' : '#f3f4f6',
                                        color: selectedChart === chartType.id ? 'white' : '#6b7280',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {chartType.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Chart Content */}
            <div style={{ minHeight: height }}>
                <ChartComponent data={data} height={height} />
            </div>
        </div>
    )
}

export default ChartWrapper
