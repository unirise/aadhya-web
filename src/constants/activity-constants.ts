import {
  Brain,
  Calculator,
  BookOpen,
  Music,
  Eye,
  Leaf,
  Users,
  Ear,
  Mic,
  PersonStanding,
  Wind,
  Hand,
  LucideIcon,
} from 'lucide-react'

export const DOMAINS = [
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'physical', label: 'Physical' },
] as const

export const ATTRIBUTES_BY_DOMAIN: Record<
  string,
  { value: string; label: string; icon?: LucideIcon }[]
> = {
  intelligence: [
    { value: 'linguistic', label: 'Linguistic Intelligence', icon: BookOpen },
    {
      value: 'logical-mathematical',
      label: 'Logical-Mathematical Intelligence',
      icon: Calculator,
    },
    { value: 'spatial', label: 'Spatial Intelligence', icon: Eye },
    { value: 'musical', label: 'Musical Intelligence', icon: Music },
    {
      value: 'bodily-kinesthetic',
      label: 'Bodily-Kinesthetic Intelligence',
      icon: PersonStanding,
    },
    {
      value: 'interpersonal',
      label: 'Interpersonal Intelligence',
      icon: Users,
    },
    {
      value: 'intrapersonal',
      label: 'Intrapersonal Intelligence',
      icon: Brain,
    },
    { value: 'naturalistic', label: 'Naturalistic Intelligence', icon: Leaf },
  ],
  physical: [
    { value: 'vision', label: 'Vision', icon: Eye },
    { value: 'hearing', label: 'Hearing', icon: Ear },
    { value: 'speech', label: 'Speech', icon: Mic },
    { value: 'intellectual', label: 'Intellectual', icon: Brain },
    { value: 'smell', label: 'Smell', icon: Wind },
    { value: 'touch', label: 'Touch', icon: Hand },
    { value: 'movement', label: 'Movement', icon: PersonStanding },
  ],
}

// Legacy flat list (kept for backwards compatibility)
export const ATTRIBUTES = ATTRIBUTES_BY_DOMAIN.intelligence

export const ACTIVITY_TYPES = [{ value: 'mcq', label: 'MCQ' }] as const
