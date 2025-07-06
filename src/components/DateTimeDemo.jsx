import { useState, useEffect } from 'react'
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatTimeAgo,
  formatUTC,
  now,
  today,
  DATE_FORMATS,
} from '../lib/dateUtils'

function DateTimeDemo() {
  const [currentTime, setCurrentTime] = useState(now())
  const [selectedDate, setSelectedDate] = useState(today())

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Date & Time Demo with Day.js</h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Interactive demonstration of Day.js date formatting and manipulation
        features
      </p>

      {/* Current Time Display */}
      <div
        style={{
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <h3
          style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}
        >
          Live Current Time
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <strong>Standard:</strong> {formatDateTime(currentTime)}
          </div>
          <div>
            <strong>Date Only:</strong> {formatDate(currentTime)}
          </div>
          <div>
            <strong>Time Only:</strong> {formatTime(currentTime)}
          </div>
          <div>
            <strong>UTC:</strong> {formatUTC(currentTime)}
          </div>
        </div>
      </div>

      {/* Date Input and Formatting */}
      <div
        style={{
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #dbeafe',
        }}
      >
        <h3
          style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}
        >
          Interactive Date Formatting
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor='date-input'
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Select Date:
          </label>
          <input
            id='date-input'
            type='date'
            value={formatDate(selectedDate, DATE_FORMATS.ISO)}
            onChange={e => setSelectedDate(new Date(e.target.value))}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '12px',
          }}
        >
          <div>
            <strong>Short Format:</strong>{' '}
            {formatDate(selectedDate, DATE_FORMATS.SHORT)}
          </div>
          <div>
            <strong>Medium Format:</strong>{' '}
            {formatDate(selectedDate, DATE_FORMATS.MEDIUM)}
          </div>
          <div>
            <strong>Long Format:</strong>{' '}
            {formatDate(selectedDate, DATE_FORMATS.LONG)}
          </div>
          <div>
            <strong>ISO Format:</strong>{' '}
            {formatDate(selectedDate, DATE_FORMATS.ISO)}
          </div>
          <div>
            <strong>Relative Time:</strong> {formatRelativeTime(selectedDate)}
          </div>
          <div>
            <strong>Smart Format:</strong> {formatTimeAgo(selectedDate)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateTimeDemo
