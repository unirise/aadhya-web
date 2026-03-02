import { Dumbbell } from 'lucide-react'
import DomainProfile from './DomainProfile'
import { usePhysicalScores } from '@/hooks/useProfileScores'
import { ATTRIBUTES_BY_DOMAIN } from '@/constants/activity-constants'
import type { DomainProfileConfig } from '@/types/domain-profile'

const config: DomainProfileConfig = {
  domain: 'physical',
  title: 'Physical',
  icon: Dumbbell,
  color: '#059669',
  basePath: '/pehachan/physical',
  attributes: ATTRIBUTES_BY_DOMAIN.physical,
}

function Physical() {
  const query = usePhysicalScores()
  const scoresQuery = {
    ...query,
    data: query.data?.physical,
  } as ReturnType<typeof query> & { data: Record<string, number> | undefined }

  return <DomainProfile config={config} scoresQuery={scoresQuery} />
}

export default Physical
