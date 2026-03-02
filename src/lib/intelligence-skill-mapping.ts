/**
 * Intelligence-Skill Mapping Utility
 *
 * Maps Multiple Intelligence domains to relevant skills and competencies
 * that individuals with high scores in each domain typically excel at.
 */

export type IntelligenceScores = Record<string, number>

export interface IntelligenceSkillEntry {
  domain: string
  score: number
  skills: string[]
}

/**
 * Skill mapping for each intelligence domain
 * Each domain maps to an array of relevant skills
 */
export const intelligenceSkillMapping: Record<string, string[]> = {
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
    'Personal growth planning',
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
    'Sports performance',
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
    'Critical thinking',
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
    'Editing and proofreading',
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
    'Audio production',
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
    'Pattern design',
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
    'Sustainability practices',
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
    'Networking',
  ],
}

/**
 * Normalise any known domain key variant to the UPPER_SNAKE key used
 * in intelligenceSkillMapping.  Handles:
 *   - UPPER_SNAKE  ("BODILY_KINESTHETIC")   — returned as-is
 *   - lowercase kebab  ("bodily-kinesthetic") — from stored API records
 *   - plain lowercase  ("intrapersonal")      — from stored API records
 */
const DOMAIN_ALIAS: Record<string, string> = {
  'intrapersonal': 'INTRAPERSONAL',
  'bodily-kinesthetic': 'BODILY_KINESTHETIC',
  'logical-mathematical': 'LOGICAL_MATHEMATICAL',
  'linguistic': 'LINGUISTIC',
  'musical': 'MUSICAL',
  'spatial': 'SPATIAL',
  'naturalistic': 'NATURALISTIC',
  'interpersonal': 'INTERPERSONAL',
}

function normaliseDomain(domain: string): string {
  return DOMAIN_ALIAS[domain] ?? domain
}

/**
 * Get skills for a specific intelligence domain
 *
 * @param domain - The intelligence domain code (any casing variant)
 * @returns Array of skills associated with the domain
 */
export function getSkillsForDomain(domain: string): string[] {
  return intelligenceSkillMapping[normaliseDomain(domain)] || []
}

/**
 * Get skills mapped to intelligence scores
 * Prioritizes skills from domains with higher scores
 *
 * @param intelligenceScores - Object mapping domains to scores
 * @param topN - Number of top intelligences to consider (default: 3)
 * @returns Array of {domain, score, skills} objects sorted by score
 */
export function getIntelligenceSkillMapping(
  intelligenceScores: IntelligenceScores,
  topN = 3
): IntelligenceSkillEntry[] {
  if (!intelligenceScores || Object.keys(intelligenceScores).length === 0) {
    return []
  }

  // Get top N intelligences, normalising domain keys to UPPER_SNAKE
  const sortedDomains = Object.entries(intelligenceScores)
    .map(([domain, score]) => ({ domain: normaliseDomain(domain), score: Number(score) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  // Map each domain to its skills
  return sortedDomains.map(({ domain, score }) => ({
    domain,
    score,
    skills: getSkillsForDomain(domain),
  }))
}

/**
 * Get all skills for top intelligences, flattened and deduplicated
 *
 * @param intelligenceScores - Object mapping domains to scores
 * @param topN - Number of top intelligences to consider (default: 3)
 * @returns Array of unique skills from top intelligences
 */
export function getTopSkills(intelligenceScores: IntelligenceScores, topN = 3) {
  const mapping = getIntelligenceSkillMapping(intelligenceScores, topN)
  const allSkills = mapping.flatMap(item => item.skills)
  // Remove duplicates while preserving order
  return [...new Set(allSkills)]
}
