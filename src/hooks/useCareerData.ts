import { useMemo, useCallback } from 'react'
import { useIntelligenceScores } from '@/hooks/useProfileScores'
import { getTopIntelligences } from '@/lib/mi-scoring'
import { getIntelligenceSkillMapping } from '@/lib/intelligence-skill-mapping'
import {
  getSkillsVocationalMapping,
  deriveHybridRoles,
  getVocationalPathsForSkill,
} from '@/lib/skills-vocational-mapping'
import {
  mapRolesToNSQF,
  mapHybridRolesToNSQF,
} from '@/lib/nsqf-role-mapping'

const DOMAIN_SHORT_NAME: Record<string, string> = {
  INTERPERSONAL: 'Interpersonal',
  BODILY_KINESTHETIC: 'Bodily-Kinesthetic',
  LOGICAL_MATHEMATICAL: 'Logical-Mathematical',
  LINGUISTIC: 'Linguistic',
  MUSICAL: 'Musical',
  SPATIAL: 'Spatial',
  NATURALISTIC: 'Naturalistic',
  INTRAPERSONAL: 'Intrapersonal',
}

export function useCareerData() {
  const intQuery = useIntelligenceScores()
  const scores = intQuery.data?.intelligences ?? null

  const topIntelligences = useMemo(() => {
    if (!scores) return []
    return getTopIntelligences(scores, 3)
  }, [scores])

  const intelligenceSkillMapping = useMemo(() => {
    if (!scores) return []
    return getIntelligenceSkillMapping(scores, 3)
  }, [scores])

  const skillsVocationalMapping = useMemo(() => {
    if (!intelligenceSkillMapping.length) return []
    return getSkillsVocationalMapping(intelligenceSkillMapping).slice(0, 8)
  }, [intelligenceSkillMapping])

  const rolesByIntelligence = useMemo(() => {
    if (!intelligenceSkillMapping.length) return {}
    const map: Record<string, string[]> = {}
    intelligenceSkillMapping.forEach(({ domain, skills }) => {
      const name = DOMAIN_SHORT_NAME[domain] || domain
      if (!map[name]) map[name] = []
      skills.forEach(skill => {
        const paths = getVocationalPathsForSkill(skill)
        if (paths?.length) {
          paths.forEach(role => {
            if (!map[name].includes(role)) map[name].push(role)
          })
        }
      })
    })
    Object.keys(map).forEach(k => {
      map[k] = map[k].slice(0, 5)
    })
    return map
  }, [intelligenceSkillMapping])

  const nsqfRolesByIntelligence = useMemo(() => {
    if (!Object.keys(rolesByIntelligence).length) return {}
    return mapRolesToNSQF(rolesByIntelligence)
  }, [rolesByIntelligence])

  const hybridRoles = useMemo(() => {
    if (topIntelligences.length < 2) return []
    return deriveHybridRoles(topIntelligences.map(i => i.domain))
  }, [topIntelligences])

  const nsqfHybridRoles = useMemo(() => {
    if (!hybridRoles.length) return []
    return mapHybridRolesToNSQF(hybridRoles.flatMap(h => h.roles || []))
  }, [hybridRoles])

  const allNSQFRoles = useMemo(() => {
    const regular = Object.values(nsqfRolesByIntelligence).flat()
    return [...regular, ...nsqfHybridRoles]
  }, [nsqfRolesByIntelligence, nsqfHybridRoles])

  const handleRetry = useCallback(() => {
    if (intQuery.isError) intQuery.refetch()
  }, [intQuery])

  return {
    isLoading: intQuery.isLoading,
    hasError: intQuery.isError,
    errorMessage: intQuery.error?.message || 'Failed to load career data',
    handleRetry,
    scores,
    topIntelligences,
    intelligenceSkillMapping,
    skillsVocationalMapping,
    rolesByIntelligence,
    nsqfRolesByIntelligence,
    hybridRoles,
    nsqfHybridRoles,
    allNSQFRoles,
  }
}
