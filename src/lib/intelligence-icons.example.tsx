/**
 * Example usage of intelligence icons
 *
 * This file demonstrates how to use the intelligence icon pack
 * in your React components.
 */

import {
  getIntelligenceIcon,
  getAllIntelligenceIcons,
} from './intelligence-icons'

// Example 1: Get and render a single icon
function ExampleSingleIcon({ domain }) {
  const IconComponent = getIntelligenceIcon(domain)

  if (!IconComponent) {
    return <span>No icon available</span>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IconComponent size={24} color='#3b82f6' />
      <span>{domain}</span>
    </div>
  )
}

// Example 2: Render all intelligence icons
function ExampleAllIcons() {
  const allIcons = getAllIntelligenceIcons()

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
      }}
    >
      {Object.entries(allIcons).map(([domain, IconComponent]) => (
        <div
          key={domain}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <IconComponent size={32} color='#6366f1' />
          <div>
            <div style={{ fontWeight: 'bold' }}>{domain}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Example 3: Using in a card component
function ExampleIntelligenceCard({ domain, displayName, score }) {
  const IconComponent = getIntelligenceIcon(domain)

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        {IconComponent && <IconComponent size={28} color='#3b82f6' />}
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          {displayName}
        </h3>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
        {score}
      </div>
    </div>
  )
}

export { ExampleSingleIcon, ExampleAllIcons, ExampleIntelligenceCard }
