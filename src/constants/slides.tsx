import {
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Lightbulb,
  Zap,
  Database,
  Settings,
} from 'lucide-react'

export interface Slide {
  id: number
  icon: any
  label: string
  title: string
  subtitle?: string
  paragraphs: string[]
  diagram?: string
}

export const slides: Slide[] = [
  {
    id: 0,
    icon: Home,
    label: 'DEVPODS',
    title: 'What are DevPods?',
    subtitle: 'A thoughtful approach to development teams in the AI era.',
    paragraphs: [
      "Think of DevPods as teams that have already built their working relationships. They're groups of specialists who have collaborated on projects together before, so they understand each other's strengths and communication styles. This means they can start contributing to your project immediately.",
      "We structure our billing on a fixed monthly cost with bi-weekly check-ins. You won't need to worry about recruitment, lengthy onboarding, or helping new team members get to know each other.",
    ],
    diagram: `graph LR
    A[Your Project] --> B[DevPod Team]
    B --> C[Immediate Delivery]
    B --> D[Fixed Costs]
    B --> E[Pre-Aligned Unit]
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b`,
  },
  {
    id: 1,
    icon: TrendingUp,
    label: 'Growth',
    title: 'Scaling Made Simple',
    subtitle:
      "Sometimes one Pod isn't quite enough, but you're not ready for two full teams yet.",
    paragraphs: [
      'Our flexible model allows you to scale gradually. Need extra frontend expertise? We can add specialists to your existing Pod without disrupting the team dynamic.',
      'You maintain consistency while gaining exactly the capabilities you need, when you need them.',
    ],
    diagram: `graph TB
    A[Single Pod] --> B{Growth Need}
    B -->|Add Specialist| C[Enhanced Pod]
    B -->|Full Team| D[Multiple Pods]
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff`,
  },
  {
    id: 2,
    icon: Users,
    label: 'Pods',
    title: 'Our Team Structure',
    subtitle:
      "Curious about our team structure? We'll explain why we use specialists and how this makes sense for our model.",
    paragraphs: [
      'Each Pod is composed of specialists who have worked together on multiple projects. This creates a foundation of trust and efficiency that traditional team building takes months to achieve.',
      'Our specialists bring deep expertise in their domains while understanding how to collaborate effectively within their Pod.',
    ],
    diagram: `graph TD
    A[DevPod] --> B[Frontend Specialist]
    A --> C[Backend Specialist]
    A --> D[DevOps Specialist]
    A --> E[Designer]
    B -.collaboration.- C
    C -.collaboration.- D
    D -.collaboration.- E
    E -.collaboration.- B
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f1f5f9,stroke:#64748b
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b`,
  },
  {
    id: 3,
    icon: DollarSign,
    label: 'Financials',
    title: 'Transparent Pricing',
    subtitle:
      "Let's talk about pricing. We'll walk you through how our model works.",
    paragraphs: [
      "Fixed monthly cost with bi-weekly check-ins. No hidden fees, no surprises. You know exactly what you're paying for.",
      'This predictable pricing model helps you budget effectively while ensuring consistent output from your dedicated team.',
    ],
    diagram: `graph LR
    A[Fixed Cost] --> B[Bi-weekly Checkins]
    B --> C[Predictable Budget]
    C --> D[Consistent Output]
    style A fill:#10b981,stroke:#059669,color:#fff
    style B fill:#3b82f6,stroke:#2563eb,color:#fff
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b`,
  },
  {
    id: 4,
    icon: Target,
    label: 'What',
    title: 'What We Build',
    subtitle: 'From MVPs to enterprise solutions.',
    paragraphs: [
      'We specialize in building production-ready applications across web, mobile, and cloud platforms. Our Pods have experience with modern tech stacks and can adapt to your specific requirements.',
      'Whether you need a rapid prototype or a scalable enterprise system, we bring the right expertise to your project.',
    ],
    diagram: `graph TB
    A[Your Vision] --> B[MVP]
    B --> C[Iteration]
    C --> D[Production]
    D --> E[Scale]
    style A fill:#f59e0b,stroke:#d97706,color:#fff
    style B fill:#3b82f6,stroke:#2563eb,color:#fff
    style C fill:#3b82f6,stroke:#2563eb,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff`,
  },
  {
    id: 5,
    icon: Zap,
    label: 'Speed',
    title: 'Fast Time to Value',
    subtitle: 'Start seeing results in weeks, not months.',
    paragraphs: [
      'Because our Pods are pre-aligned, you skip the traditional team formation phase. We can begin delivering value from week one.',
      "Our iterative approach with bi-weekly check-ins ensures you're always aligned with progress and can adjust priorities as needed.",
    ],
    diagram: `timeline
    title Project Timeline
    Week 1 : Kickoff : Planning
    Week 2 : First Delivery : Checkpoint
    Week 4 : Feature Complete : Checkpoint
    Week 6 : Production Ready : Launch`,
  },
  {
    id: 6,
    icon: Lightbulb,
    label: 'Innovation',
    title: 'AI-Augmented Development',
    subtitle: 'Leveraging AI tools for better outcomes.',
    paragraphs: [
      "Our teams use cutting-edge AI tools to enhance productivity and code quality. This isn't about replacing developers—it's about augmenting their capabilities.",
      'The result is faster development cycles, fewer bugs, and more time for creative problem-solving.',
    ],
    diagram: `graph LR
    A[Developer] --> B[AI Tools]
    B --> C[Enhanced Productivity]
    B --> D[Higher Quality]
    B --> E[Faster Delivery]
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff`,
  },
  {
    id: 7,
    icon: Database,
    label: 'Stack',
    title: 'Modern Tech Stack',
    subtitle: 'We work with the tools that matter.',
    paragraphs: [
      'React, TypeScript, Node.js, Python, AWS, Azure—our Pods have deep expertise in modern development stacks and can adapt to your existing infrastructure.',
      'We believe in using the right tool for the job, not forcing a one-size-fits-all approach.',
    ],
    diagram: `graph TB
    A[Frontend] --> B[React/TypeScript]
    C[Backend] --> D[Node.js/Python]
    E[Cloud] --> F[AWS/Azure]
    G[Database] --> H[PostgreSQL/MongoDB]
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style C fill:#3b82f6,stroke:#2563eb,color:#fff
    style E fill:#3b82f6,stroke:#2563eb,color:#fff
    style G fill:#3b82f6,stroke:#2563eb,color:#fff`,
  },
  {
    id: 8,
    icon: Settings,
    label: 'Process',
    title: 'Our Development Process',
    subtitle: 'Agile, transparent, and collaborative.',
    paragraphs: [
      "We work in two-week sprints with regular check-ins. You'll always know what's being worked on, what's been completed, and what's coming next.",
      'Our process is designed to be flexible enough to accommodate changes while maintaining momentum and delivering consistent results.',
    ],
    diagram: `graph TB
    A[Sprint Planning] --> B[Development]
    B --> C[Review]
    C --> D[Deploy]
    D --> A
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff`,
  },
]
