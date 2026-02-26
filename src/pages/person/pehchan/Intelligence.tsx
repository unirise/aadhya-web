import { Brain } from 'lucide-react'
import DomainProfile from './DomainProfile'
import { useIntelligenceScores } from '@/hooks/useProfileScores'
import { ATTRIBUTES_BY_DOMAIN } from '@/constants/activity-constants'
import type { DomainProfileConfig } from '@/types/domain-profile'

const config: DomainProfileConfig = {
  domain: 'intelligence',
  title: 'Intelligence',
  icon: Brain,
  color: '#2563eb',
  basePath: '/pehachan/intelligence',
  attributes: ATTRIBUTES_BY_DOMAIN.intelligence,
}

function Intelligence() {
  const query = useIntelligenceScores()
  const scoresQuery = {
    ...query,
    data: query.data?.intelligences,
  } as ReturnType<typeof query> & { data: Record<string, number> | undefined }

  return <DomainProfile config={config} scoresQuery={scoresQuery} />
}

export default Intelligence
