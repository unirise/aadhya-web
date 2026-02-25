/**
 * Intelligence-Teaching Styles Mapping Utility
 *
 * Maps Multiple Intelligence domains to recommended teaching styles
 * that work best for learners with high scores in each domain.
 */

export type IntelligenceScores = Record<string, number>

export interface IntelligenceTeachingStyleEntry {
  domain: string
  score: number
  teachingStyles: string[]
}

/**
 * Teaching styles mapping for each intelligence domain
 * Each domain maps to an array of recommended teaching approaches
 */
export const intelligenceTeachingStyles: Record<string, string[]> = {
  INTRAPERSONAL: [
    'Self-paced learning - Allow them to learn at their own speed',
    'Journaling and reflection - Encourage writing about their learning',
    'Independent study - Provide opportunities for solo exploration',
    'Goal-setting activities - Help them set personal learning goals',
    'Quiet study time - Create calm, distraction-free environments',
    'Personal projects - Let them choose topics that interest them',
    'Metacognitive strategies - Teach them how to think about thinking',
  ],
  BODILY_KINESTHETIC: [
    'Hands-on activities - Use physical objects and manipulatives',
    'Movement-based learning - Incorporate body movement into lessons',
    'Experiments and demonstrations - Let them do, not just watch',
    'Role-playing and drama - Act out concepts and scenarios',
    'Building and creating - Construct models and prototypes',
    'Field trips - Take learning outside the classroom',
    'Physical games - Turn lessons into active games',
  ],
  LOGICAL_MATHEMATICAL: [
    'Problem-solving approach - Present challenges to solve',
    'Step-by-step instruction - Break concepts into logical sequences',
    'Puzzles and brain teasers - Engage their analytical thinking',
    'Data analysis activities - Work with numbers and patterns',
    'Cause-and-effect exploration - Show relationships and connections',
    'Experiments with variables - Test hypotheses systematically',
    'Coding and logic games - Use structured thinking activities',
  ],
  LINGUISTIC: [
    'Reading and writing - Use books, articles, and written exercises',
    'Discussions and debates - Encourage talking about ideas',
    'Storytelling - Use narratives to explain concepts',
    'Verbal explanations - Speak clearly and use rich vocabulary',
    'Poetry and wordplay - Make language fun and creative',
    'Note-taking - Encourage writing down key points',
    'Presentations - Let them explain concepts to others',
  ],
  MUSICAL: [
    'Rhythmic learning - Use beats and rhythms to teach',
    'Songs and mnemonics - Set information to music',
    'Audio-based instruction - Use recordings and podcasts',
    'Sound patterns - Help them recognize patterns in sounds',
    'Musical instruments - Incorporate music-making activities',
    'Chanting and repetition - Use rhythmic repetition',
    'Background music - Play music during study time',
  ],
  SPATIAL: [
    'Visual aids - Use charts, graphs, and diagrams',
    'Mind maps - Create visual representations of ideas',
    "Pictures and illustrations - Show, don't just tell",
    'Color coding - Use colors to organize information',
    '3D models - Build and manipulate physical representations',
    'Video content - Use visual media and animations',
    'Drawing and sketching - Let them create visual notes',
  ],
  NATURALISTIC: [
    'Outdoor learning - Take lessons outside when possible',
    'Nature-based examples - Connect concepts to the natural world',
    'Real-world connections - Show how learning applies to life',
    'Classification activities - Sort and categorize like a scientist',
    'Environmental projects - Engage with nature and ecosystems',
    'Animal and plant studies - Use living examples',
    'Field observations - Encourage careful observation of nature',
  ],
  INTERPERSONAL: [
    'Group work - Organize collaborative activities',
    'Peer teaching - Let students teach each other',
    'Discussions and sharing - Encourage talking and listening',
    'Team projects - Work together on assignments',
    'Role-playing scenarios - Practice social situations',
    'Cooperative games - Learn through group activities',
    'Mentoring - Pair with older students or mentors',
  ],
}

/**
 * Get teaching styles for a specific intelligence domain
 *
 * @param domain - The intelligence domain code
 * @returns Array of teaching styles associated with the domain
 */
export function getTeachingStylesForDomain(domain: string): string[] {
  return intelligenceTeachingStyles[domain] || []
}

/**
 * Get teaching styles mapped to top intelligences
 *
 * @param intelligenceScores - Object mapping domains to scores
 * @param topN - Number of top intelligences to consider (default: 3)
 * @returns Array of {domain, score, teachingStyles} objects sorted by score
 */
export function getIntelligenceTeachingStyles(
  intelligenceScores: IntelligenceScores,
  topN = 3
): IntelligenceTeachingStyleEntry[] {
  if (!intelligenceScores || Object.keys(intelligenceScores).length === 0) {
    return []
  }

  // Get top N intelligences
  const sortedDomains = Object.entries(intelligenceScores)
    .map(([domain, score]) => ({ domain, score: Number(score) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  // Map each domain to its teaching styles
  return sortedDomains.map(({ domain, score }) => ({
    domain,
    score,
    teachingStyles: getTeachingStylesForDomain(domain),
  }))
}
