import type { LucideIcon } from 'lucide-react'
import type { UseQueryResult } from '@tanstack/react-query'

export interface DomainProfileConfig {
  domain: 'intelligence' | 'physical'
  title: string
  icon: LucideIcon
  color: string
  basePath: string
  attributes: { value: string; label: string; icon?: LucideIcon }[]
}

export type ScoresQuery = UseQueryResult<Record<string, number> | undefined, Error>
