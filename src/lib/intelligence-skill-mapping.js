/**
 * Intelligence-Skill Mapping Utility
 * 
 * Maps Multiple Intelligence domains to relevant skills and competencies
 * that individuals with high scores in each domain typically excel at.
 */

/**
 * Skill mapping for each intelligence domain
 * Each domain maps to an array of relevant skills
 */
export const intelligenceSkillMapping = {
  INTRAPERSONAL: [
    'Self-reflection',
    'Emotional awareness',
    'Goal setting',
    'Self-motivation',
    'Personal values alignment',
    'Introspection',
    'Self-discipline',
    'Independent thinking',
    'Metacognition',
    'Personal growth planning'
  ],
  BODILY_KINESTHETIC: [
    'Physical coordination',
    'Athletic performance',
    'Manual dexterity',
    'Hand-eye coordination',
    'Body movement control',
    'Tactile learning',
    'Physical expression',
    'Dance and movement',
    'Craftsmanship',
    'Sports performance'
  ],
  LOGICAL_MATHEMATICAL: [
    'Problem solving',
    'Mathematical reasoning',
    'Logical analysis',
    'Pattern recognition',
    'Data analysis',
    'Scientific thinking',
    'Abstract reasoning',
    'Quantitative skills',
    'Algorithmic thinking',
    'Critical thinking'
  ],
  LINGUISTIC: [
    'Reading comprehension',
    'Writing skills',
    'Verbal communication',
    'Storytelling',
    'Language learning',
    'Vocabulary building',
    'Persuasive speaking',
    'Poetry and literature',
    'Public speaking',
    'Editing and proofreading'
  ],
  MUSICAL: [
    'Musical composition',
    'Rhythm recognition',
    'Pitch discrimination',
    'Instrumental performance',
    'Singing',
    'Music theory',
    'Sound pattern recognition',
    'Musical memory',
    'Harmony understanding',
    'Audio production'
  ],
  SPATIAL: [
    'Visual thinking',
    'Spatial reasoning',
    '3D visualization',
    'Graphic design',
    'Architecture',
    'Navigation',
    'Artistic creation',
    'Map reading',
    'Visual memory',
    'Pattern design'
  ],
  NATURALISTIC: [
    'Nature observation',
    'Environmental awareness',
    'Species classification',
    'Ecological understanding',
    'Gardening',
    'Animal care',
    'Outdoor skills',
    'Conservation',
    'Natural pattern recognition',
    'Sustainability practices'
  ],
  INTERPERSONAL: [
    'Empathy',
    'Team collaboration',
    'Conflict resolution',
    'Social awareness',
    'Leadership',
    'Communication',
    'Relationship building',
    'Group facilitation',
    'Emotional intelligence',
    'Networking'
  ]
}

/**
 * Get skills for a specific intelligence domain
 * 
 * @param {string} domain - The intelligence domain code
 * @returns {Array<string>} Array of skills associated with the domain
 */
export function getSkillsForDomain(domain) {
  return intelligenceSkillMapping[domain] || []
}

/**
 * Get skills mapped to intelligence scores
 * Prioritizes skills from domains with higher scores
 * 
 * @param {Object} intelligenceScores - Object mapping domains to scores
 * @param {number} topN - Number of top intelligences to consider (default: 3)
 * @returns {Array<Object>} Array of {domain, displayName, score, skills} objects sorted by score
 */
export function getIntelligenceSkillMapping(intelligenceScores, topN = 3) {
  if (!intelligenceScores || Object.keys(intelligenceScores).length === 0) {
    return []
  }

  // Get top N intelligences
  const sortedDomains = Object.entries(intelligenceScores)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  // Map each domain to its skills
  return sortedDomains.map(({ domain, score }) => ({
    domain,
    score,
    skills: getSkillsForDomain(domain)
  }))
}

/**
 * Get all skills for top intelligences, flattened and deduplicated
 * 
 * @param {Object} intelligenceScores - Object mapping domains to scores
 * @param {number} topN - Number of top intelligences to consider (default: 3)
 * @returns {Array<string>} Array of unique skills from top intelligences
 */
export function getTopSkills(intelligenceScores, topN = 3) {
  const mapping = getIntelligenceSkillMapping(intelligenceScores, topN)
  const allSkills = mapping.flatMap(item => item.skills)
  // Remove duplicates while preserving order
  return [...new Set(allSkills)]
}

