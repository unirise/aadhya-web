import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

// Sample data for line chart
const sampleLineData = [
    { name: 'Jan', users: 400, posts: 240, views: 2400 },
    { name: 'Feb', users: 300, posts: 139, views: 2210 },
    { name: 'Mar', users: 200, posts: 980, views: 2290 },
    { name: 'Apr', users: 278, posts: 390, views: 2000 },
    { name: 'May', users: 189, posts: 480, views: 2181 },
    { name: 'Jun', users: 239, posts: 380, views: 2500 },
    { name: 'Jul', users: 349, posts: 430, views: 2100 },
]

function SampleLineChart({ data = sampleLineData, height = 400 }) {
    return (
        <div style={{ width: '100%', padding: '20px' }}>
            <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
                Monthly Analytics - Line Chart
            </h3>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="posts"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SampleLineChart
