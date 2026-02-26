import { useQuery } from '@tanstack/react-query'
import { activitiesApi } from '@/services/activitiesApi'
import type { IntelligencesResponse, PhysicalResponse } from '@/types'

const PROFILE_KEYS = {
  intelligence: ['profile', 'intelligence'] as const,
  physical: ['profile', 'physical'] as const,
}

/**
 * Maps all known API key variants to display names.
 * Backend may return UPPER_SNAKE (from JSON base scores) or
 * lowercase/kebab-case (from stored response records).
 */
const INTELLIGENCE_DISPLAY: Record<string, string> = {
  // UPPER_SNAKE (JSON metadata)
  LINGUISTIC: 'Linguistic',
  LOGICAL_MATHEMATICAL: 'Logical',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  BODILY_KINESTHETIC: 'Bodily-Kinesthetic',
  INTERPERSONAL: 'Interpersonal',
  INTRAPERSONAL: 'Intrapersonal',
  NATURALISTIC: 'Naturalistic',
  // lowercase kebab-case (stored records)
  'linguistic': 'Linguistic',
  'logical-mathematical': 'Logical',
  'musical': 'Musical',
  'spatial': 'Spatial',
  'bodily-kinesthetic': 'Bodily-Kinesthetic',
  'interpersonal': 'Interpersonal',
  'intrapersonal': 'Intrapersonal',
  'naturalistic': 'Naturalistic',
}

const PHYSICAL_DISPLAY: Record<string, string> = {
  vision: 'Vision',
  hearing: 'Hearing',
  speech: 'Speech',
  intellectual: 'Intellectual',
  locomotor: 'Locomotor',
  smell: 'Smell',
  touch: 'Touch',
  movement: 'Movement',
}

/** Convert an API domain key to a short display name */
export function displayName(
  key: string,
  domain: 'intelligence' | 'physical'
): string {
  const map = domain === 'intelligence' ? INTELLIGENCE_DISPLAY : PHYSICAL_DISPLAY
  if (map[key]) return map[key]
  // Fallback: title-case the key
  return key
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/** Convert a raw { apiKey: score } map to { DisplayName: score } */
export function toDisplayScores(
  raw: Record<string, number>,
  domain: 'intelligence' | 'physical'
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, score] of Object.entries(raw)) {
    result[displayName(key, domain)] = Math.round(score)
  }
  return result
}

/** Return top N names from a { name: score } map */
export function topN(scores: Record<string, number>, n: number): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([name]) => name)
}

export function useIntelligenceScores() {
  return useQuery<IntelligencesResponse, Error>({
    queryKey: PROFILE_KEYS.intelligence,
    queryFn: () => activitiesApi.fetchIntelligences(),
  })
}

export function usePhysicalScores() {
  return useQuery<PhysicalResponse, Error>({
    queryKey: PROFILE_KEYS.physical,
    queryFn: () => activitiesApi.fetchPhysical(),
  })
}
