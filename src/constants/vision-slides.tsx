import {
  Sparkles,
  Mic,
  BookOpen,
  Keyboard,
  Github,
  GraduationCap,
  Accessibility,
  Brain,
  Users,
  Play,
  Heart,
  Wand2,
  MessageSquare,
  FileText,
  Headphones,
  Shapes,
  BookMarked,
  Globe,
  Scale,
  Server,
  Hand,
  ScanEye,
  Gamepad2,
  GitBranch,
  Shield,
  Building2,
  Award,
  Code2,
  Briefcase,
  Compass,
  Layers,
  Focus,
  Languages,
  Fingerprint,
  ClipboardCheck,
  Shuffle,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import type { DotData, MediaItem } from '@/types/dot'

export interface VisionSlide {
  id: number
  icon: LucideIcon
  label: string
  title: string
  subtitle?: string
  paragraphs: string[]
  media?: MediaItem[]
  sidebarDots?: DotData[]
  textInput?: {
    storageKey: string
    placeholder?: string
  }
}

export const visionSlides: VisionSlide[] = [
  {
    id: 0,
    icon: Sparkles,
    label: 'Welcome',
    title: 'What would you like to explore today?',
    subtitle: 'Aadya — a platform that adapts to you.',
    paragraphs: [
      'Aadya is built on a simple idea: every learner is unique. The way you think, the way you absorb information, the way you express yourself — all of it matters. This platform is designed to meet you where you are.',
      'What follows is a walkthrough of what Aadya aims to become — a showcase of the capabilities we are building, one step at a time.',
    ],
    textInput: {
      storageKey: 'aadhya-user-name',
      placeholder: 'What is your name?',
    },
    sidebarDots: [
      {
        id: 'sidebar-0-0',
        icon: Heart,
        label: 'Why Personalization?',
        title: 'Why Personalization?',
        subtitle:
          'Research shows learners retain 60% more when content matches their cognitive style.',
        largeText:
          'Personalization is not a luxury — it is how learning actually works. Decades of cognitive science show that when content aligns with how a learner thinks, processes, and expresses, retention and comprehension improve dramatically. Aadya is built on this principle from the ground up.',
      },
      {
        id: 'sidebar-0-1',
        icon: Users,
        label: 'Who Is This For?',
        title: 'Who Is This For?',
        subtitle:
          'Students, educators, parents, and anyone who believes learning should have no barriers.',
        largeText:
          'Aadya is designed for every stakeholder in the learning journey — students who deserve content that fits them, educators who need tools that adapt, parents who want visibility into progress, and communities who believe access to quality education is a right, not a privilege.',
      },
      {
        id: 'sidebar-0-2',
        icon: Play,
        label: 'Try It Now',
        title: 'Try It Now',
        subtitle:
          'Jump into a live demo and experience adaptive content generation firsthand.',
        largeText:
          'The best way to understand Aadya is to use it. Enter your name above and walk through this presentation — each slide showcases a different capability. By the end, you will have experienced the adaptive, multimodal, and accessible features that define the platform.',
      },
    ],
  },
  {
    id: 1,
    icon: Brain,
    label: 'AI Content',
    title: 'AI-Driven Content Generation',
    subtitle:
      'You choose how you want to learn. AI builds the content to match.',
    paragraphs: [
      'At the heart of Aadya is an AI content generation pipeline. When a learner selects how they want to consume content — text, voice, images, stories, or video — the system generates material tailored to that preference in real time.',
      'This is not about replacing educators. It is about giving every student access to content in the format that works best for them, powered by intelligent generation that understands context and adapts to individual needs.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'ai-content-pipeline',
        category: 'explainer',
        diagram: `graph LR
    A[Learner Profile] --> B[Content Engine]
    B --> C[Text]
    B --> D[Audio]
    B --> E[Visuals]
    B --> F[Story]
    B --> G[Video]
    C --> H[Personalized Lesson]
    D --> H
    E --> H
    F --> H
    G --> H
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style H fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b
    style F fill:#f1f5f9,stroke:#64748b
    style G fill:#f1f5f9,stroke:#64748b`,
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-1-0',
        icon: Wand2,
        label: 'How It Generates',
        title: 'How It Generates',
        subtitle:
          'A multi-stage pipeline: topic analysis, format selection, content synthesis, and quality review.',
        largeText:
          'Content generation follows a structured pipeline — first the topic is analysed for key concepts, then the preferred format is selected, content is synthesised using large language models, and finally a quality review pass ensures accuracy, coherence, and age-appropriateness before delivery.',
      },
      {
        id: 'sidebar-1-1',
        icon: MessageSquare,
        label: 'Prompt Engineering',
        title: 'Prompt Engineering',
        subtitle:
          'Every generation is guided by carefully crafted prompts tuned for age, level, and learning style.',
        largeText:
          "Behind every piece of generated content is a carefully engineered prompt that encodes the learner's age, reading level, preferred modality, and cognitive style. These prompts are continuously refined based on learner outcomes and educator feedback to improve quality over time.",
      },
      {
        id: 'sidebar-1-2',
        icon: Shield,
        label: 'Content Safety',
        title: 'Content Safety',
        subtitle:
          'Built-in guardrails ensure generated content is age-appropriate, accurate, and bias-aware.',
        largeText:
          'Every piece of generated content passes through safety filters that check for age-appropriateness, factual accuracy, cultural sensitivity, and potential bias. Content that does not meet these standards is flagged, revised, or blocked before it reaches the learner.',
      },
    ],
  },
  {
    id: 2,
    icon: BookOpen,
    label: 'Multimodal',
    title: 'Text, Voice, Images, Story, Video',
    subtitle:
      'Every format, eventually. Because learning is not one-size-fits-all.',
    paragraphs: [
      'Some people learn best by reading. Others need to hear it. Some need to see a diagram. Others connect with a narrative. And some need to watch it unfold in a video.',
      'Aadya is being built to support all of these modalities. Text and basic visuals are live today. Voice, rich media, story-driven content, and generated video are on the roadmap — each one expanding how learners can engage with material.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'ai-pipeline',
        category: 'explainer',
        diagram: `graph LR
    A[Learner Preference] --> B[AI Pipeline]
    B --> C[Text Content]
    B --> D[Audio Narration]
    B --> E[Visual Aids]
    B --> F[Story Format]
    B --> G[Video Lessons]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b
    style F fill:#f1f5f9,stroke:#64748b
    style G fill:#f1f5f9,stroke:#64748b`,
      },
      {
        type: 'image',
        src: '/media/vision/multimodal/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
      {
        type: 'image',
        src: '/media/vision/multimodal/image/explainer.png',
        alt: 'AI Content Generation',
        category: 'explainer',
      },
      {
        type: 'video',
        src: '/media/vision/multimodal/video/explainer.mp4',
        alt: 'AI Content Generation',
        category: 'video',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-2-0',
        icon: FileText,
        label: 'Text & Reading',
        title: 'Text & Reading',
        subtitle:
          'Adaptive reading levels, simplified language options, and structured text layouts.',
        largeText:
          "Text content dynamically adjusts to the learner's reading level — vocabulary complexity, sentence length, and conceptual density all shift to match. Simplified language modes and structured layouts with clear headings make even dense material approachable.",
      },
      {
        id: 'sidebar-2-1',
        icon: Headphones,
        label: 'Audio & Voice',
        title: 'Audio & Voice',
        subtitle:
          'AI-narrated lessons with natural speech, adjustable pace, and multilingual support.',
        largeText:
          'AI-generated narration delivers lessons in natural, expressive speech. Learners can adjust playback speed, pause and resume, and switch between languages. Voice is especially powerful for learners with visual impairments or those who absorb information better through listening.',
      },
      {
        id: 'sidebar-2-2',
        icon: BookMarked,
        label: 'Story Mode',
        title: 'Story Mode',
        subtitle:
          'Complex topics wrapped in narrative — characters, conflict, resolution — making abstract ideas tangible.',
        largeText:
          'Story mode transforms abstract concepts into narratives with characters, settings, and arcs. A lesson on photosynthesis becomes a journey through a leaf. Fractions become a baker dividing dough. Narrative makes learning memorable by anchoring facts in emotional context.',
      },
    ],
  },
  {
    id: 3,
    icon: Accessibility,
    label: 'Accessible',
    title: 'Accessible by Design',
    subtitle: 'Keyboard. Mouse. Voice. Eye-tracking. Every input matters.',
    paragraphs: [
      'Accessibility is not an afterthought in Aadya — it is foundational. The platform is fully navigable via keyboard and mouse today, with complete focus management and ARIA support throughout.',
      'On the roadmap: voice control for hands-free navigation and eye-tracking support for learners with motor disabilities. The goal is simple — if you can perceive and intend, Aadya should be able to respond.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'accessibility-io',
        category: 'explainer',
        diagram: `graph LR
    A[Input Methods] --> B[Keyboard]
    A --> C[Mouse / Touch]
    A --> D[Voice Control]
    A --> E[Eye Tracking]
    F[Output Methods] --> G[Visual Display]
    F --> H[Screen Reader]
    F --> I[Audio Narration]
    F --> J[Haptic Feedback]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style F fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#10b981,stroke:#059669,color:#fff
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b
    style G fill:#10b981,stroke:#059669,color:#fff
    style H fill:#10b981,stroke:#059669,color:#fff
    style I fill:#f1f5f9,stroke:#64748b
    style J fill:#f1f5f9,stroke:#64748b`,
      },
      {
        type: 'image',
        src: '/media/vision/accessible/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-3-0',
        icon: Shapes,
        label: 'WCAG Compliance',
        title: 'WCAG Compliance',
        subtitle:
          'Following WCAG 2.1 AA standards — contrast ratios, focus indicators, semantic HTML throughout.',
        largeText:
          'Aadya targets WCAG 2.1 AA compliance across the entire platform. This means sufficient colour contrast ratios, visible focus indicators on every interactive element, semantic HTML structure, and meaningful alt text — ensuring the interface is usable by everyone regardless of ability.',
      },
      {
        id: 'sidebar-3-1',
        icon: ScanEye,
        label: 'Screen Readers',
        title: 'Screen Readers',
        subtitle:
          'Full ARIA labelling, live regions, and landmark roles so screen readers narrate every interaction.',
        largeText:
          'Every interactive element carries proper ARIA labels, roles, and states. Live regions announce dynamic content changes. Landmark roles structure the page so screen reader users can navigate efficiently. The goal is that a screen reader user has the same learning experience as a sighted user.',
      },
      {
        id: 'sidebar-3-2',
        icon: Hand,
        label: 'Motor Accessibility',
        title: 'Motor Accessibility',
        subtitle:
          'Large click targets, switch device compatibility, and planned eye-gaze navigation for motor-impaired learners.',
        largeText:
          'All interactive elements have generous click targets (minimum 44x44px). The interface supports switch devices and alternative input methods. Planned eye-gaze navigation will allow learners with severe motor impairments to control the entire platform through eye movement alone.',
      },
    ],
  },
  {
    id: 4,
    icon: Mic,
    label: 'Every I/O',
    title: 'Every Input, Every Output',
    subtitle: 'AI translates between any input and any output format.',
    paragraphs: [
      'The vision is radical: every form of input should be supported, and every form of output should be possible. A learner speaks — the system responds with text, diagrams, or video. A learner types — the system narrates back.',
      'AI acts as the universal translator between modalities. This is not just about accessibility — it is about removing every barrier between a learner and understanding.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'io-translator',
        category: 'explainer',
        diagram: `graph LR
    subgraph Inputs
    A[Text]
    B[Voice]
    C[Touch]
    D[Eye Gaze]
    E[Gesture]
    end
    subgraph AI Engine
    F[Universal Translator]
    end
    subgraph Outputs
    G[Text]
    H[Audio]
    I[Images]
    J[Video]
    K[Haptics]
    end
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    F --> G
    F --> H
    F --> I
    F --> J
    F --> K
    style F fill:#7c3aed,stroke:#6d28d9,color:#fff`,
      },
      {
        type: 'image',
        src: '/media/vision/io/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
      {
        type: 'image',
        src: '/media/vision/io/image/explainer.png',
        alt: 'AI Content Generation',
        category: 'explainer',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-4-0',
        icon: MessageSquare,
        label: 'Voice Commands',
        title: 'Voice Commands',
        subtitle:
          'Navigate, answer questions, and control the interface entirely through speech.',
        largeText:
          'Voice command support means learners can navigate between slides, answer questions, select options, and control playback entirely through speech. This is critical for hands-free learning, learners with motor disabilities, and young children who cannot yet type.',
      },
      {
        id: 'sidebar-4-1',
        icon: Gamepad2,
        label: 'Gesture Control',
        title: 'Gesture Control',
        subtitle:
          'Camera-based hand and body gesture recognition for interactive, physical learning experiences.',
        largeText:
          'Using camera-based recognition, learners can interact with content through hand gestures and body movement. Swipe to navigate, point to select, raise a hand to answer — gesture control turns learning into a physical, embodied experience that is especially engaging for younger learners.',
      },
      {
        id: 'sidebar-4-2',
        icon: Globe,
        label: 'Language Bridge',
        title: 'Language Bridge',
        subtitle:
          'Input in one language, receive output in another — real-time translation across all modalities.',
        largeText:
          'The language bridge allows a learner to speak in Hindi and receive a written response in English, or type in Tamil and hear an audio explanation in Marathi. Real-time translation across all input and output modalities breaks down language barriers completely.',
      },
    ],
  },
  {
    id: 5,
    icon: Github,
    label: 'Open Source',
    title: 'Completely Open Source',
    subtitle: 'Every bit of code is publicly available. No exceptions.',
    paragraphs: [
      'Aadya is fully open source. Every component, every service, every pipeline — the entire codebase is publicly available. This is a deliberate choice: education technology should be transparent, auditable, and community-owned.',
      'We believe that the best educational tools are built in the open. Schools, governments, and communities should be able to inspect, modify, and deploy this technology without vendor lock-in or hidden costs.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'open-source-arch',
        category: 'explainer',
        diagram: `graph TD
    A[Aadya Codebase] --> B[Frontend - React/TypeScript]
    A --> C[Backend - APIs]
    A --> D[AI Pipelines]
    A --> E[Infrastructure]
    B --> F[Public Repository]
    C --> F
    D --> F
    E --> F
    F --> G[Community Contributions]
    F --> H[School Deployments]
    F --> I[Government Audits]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style G fill:#f1f5f9,stroke:#64748b
    style H fill:#f1f5f9,stroke:#64748b
    style I fill:#f1f5f9,stroke:#64748b`,
      },
      {
        type: 'image',
        src: '/media/vision/opensource/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-5-0',
        icon: GitBranch,
        label: 'Contributing',
        title: 'Contributing',
        subtitle:
          'Fork, build, submit a PR — detailed contribution guides for developers at every skill level.',
        largeText:
          'Contributing to Aadya is straightforward — fork the repository, follow the setup guide, pick an issue, and submit a pull request. Detailed contribution guides, code style documentation, and mentorship from maintainers ensure developers at every skill level can meaningfully contribute.',
      },
      {
        id: 'sidebar-5-1',
        icon: Scale,
        label: 'License & Governance',
        title: 'License & Governance',
        subtitle:
          'Open governance model ensuring the project stays community-driven and free from corporate capture.',
        largeText:
          'Aadya operates under an open governance model with transparent decision-making, community voting on major changes, and licensing that ensures the project can never be captured by a single corporate entity. The code belongs to the community.',
      },
      {
        id: 'sidebar-5-2',
        icon: Server,
        label: 'Self-Hosting',
        title: 'Self-Hosting',
        subtitle:
          'Deploy Aadya on your own infrastructure — Docker, Kubernetes, or bare metal. Your data stays yours.',
        largeText:
          'Aadya can be deployed on your own infrastructure using Docker, Kubernetes, or bare metal. Complete documentation covers setup, configuration, and maintenance. Your data never leaves your servers — full data sovereignty for schools, districts, and governments.',
      },
    ],
  },
  {
    id: 6,
    icon: GraduationCap,
    label: 'PurpleTech',
    title: 'PurpleTech Program',
    subtitle: 'Students building the platform — for credit, under NEP.',
    paragraphs: [
      'The PurpleTech program is where education meets practice. Engineering students contribute to Aadya as part of their internship hours under the National Education Policy (NEP). They are not doing busywork — they are building production software that serves real learners.',
      'This creates a virtuous cycle: students gain real-world experience while contributing to a platform that helps other students learn. The code they write ships. The features they build are used. Their work matters.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'purpletech-cycle',
        category: 'explainer',
        diagram: `graph LR
    A[Engineering Students] --> B[PurpleTech Internship]
    B --> C[Real Code Contributions]
    C --> D[Aadya Platform]
    D --> E[Serves Learners]
    E -->|Inspires| A
    B --> F[NEP Credit Hours]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#10b981,stroke:#059669,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f1f5f9,stroke:#64748b`,
      },
      {
        type: 'image',
        src: '/media/vision/purpletech/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-6-0',
        icon: Award,
        label: 'NEP Framework',
        title: 'NEP Framework',
        subtitle:
          'How PurpleTech maps to NEP 2020 internship and credit requirements for engineering programs.',
        largeText:
          'PurpleTech is structured to satisfy NEP 2020 internship and credit requirements for engineering students. Each contribution is tracked, reviewed, and mapped to learning outcomes — students earn academic credit while building real software that impacts real learners.',
      },
      {
        id: 'sidebar-6-1',
        icon: Code2,
        label: 'What Students Build',
        title: 'What Students Build',
        subtitle:
          'Real features — accessibility modules, AI pipelines, UI components — not toy projects.',
        largeText:
          'PurpleTech interns work on production features — accessibility modules, AI content pipelines, responsive UI components, and testing infrastructure. These are not sandboxed exercises. The code ships, the features are used, and students see their work make a real difference.',
      },
      {
        id: 'sidebar-6-2',
        icon: Briefcase,
        label: 'Career Impact',
        title: 'Career Impact',
        subtitle:
          'Production code on GitHub, mentorship from senior engineers, and a portfolio that stands out.',
        largeText:
          'Graduates of PurpleTech leave with production code on their GitHub profile, experience with modern development practices, mentorship relationships with senior engineers, and a portfolio of shipped features that distinguishes them in the job market.',
      },
    ],
  },
  {
    id: 7,
    icon: Languages,
    label: 'स्थानीयकरण',
    title: 'स्थानीयकरण और अंतर्राष्ट्रीयकरण',
    subtitle: 'हर भाषा, हर संस्कृति — सबके लिए शिक्षा।',
    paragraphs: [
      'आद्या सिर्फ़ अंग्रेज़ी तक सीमित नहीं है। हम एक ऐसा मंच बना रहे हैं जो हर भाषा और संस्कृति को अपनाता है। हिंदी, तमिल, बंगाली, मराठी — हर बच्चे को अपनी मातृभाषा में सीखने का अधिकार है।',
      'अंतर्राष्ट्रीयकरण का अर्थ है कि यह मंच किसी भी देश, किसी भी भाषा में काम कर सके। स्थानीयकरण का अर्थ है कि सामग्री, उदाहरण, और संदर्भ — सब कुछ स्थानीय संस्कृति से जुड़ा हो। यह अनुवाद नहीं, अनुकूलन है।',
    ],
    media: [
      {
        type: 'diagram',
        id: 'i18n-l10n',
        category: 'explainer',
        diagram: `graph TD
    A[अंतर्राष्ट्रीयकरण - i18n] --> B[हिंदी]
    A --> C[तमिल]
    A --> D[बंगाली]
    A --> E[मराठी]
    A --> F[तेलुगु]
    A --> G[और भी भाषाएँ...]
    H[स्थानीयकरण - l10n] --> I[स्थानीय उदाहरण]
    H --> J[सांस्कृतिक संदर्भ]
    H --> K[क्षेत्रीय पाठ्यक्रम]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style H fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#f1f5f9,stroke:#64748b
    style C fill:#f1f5f9,stroke:#64748b
    style D fill:#f1f5f9,stroke:#64748b
    style E fill:#f1f5f9,stroke:#64748b
    style F fill:#f1f5f9,stroke:#64748b
    style G fill:#f1f5f9,stroke:#64748b
    style I fill:#10b981,stroke:#059669,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
    style K fill:#10b981,stroke:#059669,color:#fff`,
      },
      {
        type: 'image',
        src: '/media/vision/internationalisation/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
      {
        type: 'image',
        src: '/media/vision/internationalisation/image/explainer.png',
        alt: 'AI Content Generation',
        category: 'explainer',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-7-0',
        icon: Globe,
        label: 'बहुभाषी समर्थन',
        title: 'बहुभाषी समर्थन',
        subtitle:
          'AI-संचालित अनुवाद और मातृभाषा में सामग्री निर्माण — हर भाषा में गुणवत्ता बनाए रखते हुए।',
        largeText:
          'AI-संचालित अनुवाद इंजन हर भाषा में उच्च-गुणवत्ता सामग्री उत्पन्न करता है — यह केवल शब्दों का अनुवाद नहीं, बल्कि अर्थ, संदर्भ, और शैक्षिक स्तर को बनाए रखते हुए मातृभाषा में मूल सामग्री का निर्माण करता है।',
      },
      {
        id: 'sidebar-7-1',
        icon: Compass,
        label: 'सांस्कृतिक अनुकूलन',
        title: 'सांस्कृतिक अनुकूलन',
        subtitle:
          'सिर्फ़ शब्दों का अनुवाद नहीं — उदाहरण, कहानियाँ, और संदर्भ स्थानीय संस्कृति से जुड़े होते हैं।',
        largeText:
          'सांस्कृतिक अनुकूलन का अर्थ है कि गणित के उदाहरण स्थानीय मुद्रा और माप प्रणाली का उपयोग करें, कहानियाँ स्थानीय परंपराओं से जुड़ी हों, और विज्ञान के प्रयोग स्थानीय रूप से उपलब्ध सामग्री का उपयोग करें।',
      },
      {
        id: 'sidebar-7-2',
        icon: BookOpen,
        label: 'क्षेत्रीय पाठ्यक्रम',
        title: 'क्षेत्रीय पाठ्यक्रम',
        subtitle:
          'CBSE, ICSE, राज्य बोर्ड — हर बोर्ड के पाठ्यक्रम के अनुसार सामग्री, स्थानीय भाषा में।',
        largeText:
          'आद्या CBSE, ICSE, और विभिन्न राज्य बोर्डों के पाठ्यक्रम का समर्थन करता है। सामग्री प्रत्येक बोर्ड के विशिष्ट पाठ्यक्रम, अध्याय क्रम, और परीक्षा पैटर्न के अनुसार तैयार की जाती है — सब कुछ शिक्षार्थी की पसंदीदा भाषा में।',
      },
    ],
  },
  {
    id: 8,
    icon: Fingerprint,
    label: 'Pehchan',
    title: 'Pehchan — Understanding, Not Testing',
    subtitle:
      'Assessments woven into learning that map who a child is, not what they score.',
    paragraphs: [
      'Pehchan is our assessment system, and it works nothing like a traditional test. There are no final marks, no pass or fail. Instead, different types of questions are woven between learning content — multiple choice, open-ended reflections, drag-and-drop activities, and observational prompts.',
      'Each response updates our internal understanding of the child — their strengths, preferences, pace, and areas where they need support. This evolving map directly influences what content is shown next. A child who responds well to visual explanations gets more diagrams. A child who thrives on stories gets narrative-driven lessons. Pehchan does not judge — it listens, learns, and adapts.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'pehchan-flow',
        category: 'explainer',
        diagram: `graph LR
    A[Learning Content] --> B[Pehchan Assessment]
    B --> C[Response Captured]
    C --> D[Learner Map Updated]
    D --> E[Content Adapted]
    E --> A
    B --> F[Multiple Choice]
    B --> G[Open Reflection]
    B --> H[Activity-Based]
    D --> I[Strengths]
    D --> J[Preferences]
    D --> K[Pace & Support]
    style A fill:#10b981,stroke:#059669,color:#fff
    style B fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#f59e0b,stroke:#d97706,color:#fff
    style E fill:#10b981,stroke:#059669,color:#fff
    style F fill:#f1f5f9,stroke:#64748b
    style G fill:#f1f5f9,stroke:#64748b
    style H fill:#f1f5f9,stroke:#64748b
    style I fill:#f1f5f9,stroke:#64748b
    style J fill:#f1f5f9,stroke:#64748b
    style K fill:#f1f5f9,stroke:#64748b`,
      },
      {
        type: 'image',
        src: '/media/vision/pehachan/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-8-0',
        icon: ClipboardCheck,
        label: 'Not a Test',
        title: 'Not a Test',
        subtitle:
          'No marks, no grades — just questions that help us understand how a child learns best.',
        largeText:
          'Traditional tests measure what a child got wrong. Pehchan measures how a child thinks. There are no scores displayed, no rankings, no pass or fail. Every question is designed to reveal cognitive preferences, learning pace, and conceptual understanding — information that feeds directly into content personalisation.',
      },
      {
        id: 'sidebar-8-1',
        icon: Shuffle,
        label: 'Woven Into Learning',
        title: 'Woven Into Learning',
        subtitle:
          'Assessments appear naturally between content — no separate test sessions, no exam anxiety.',
        largeText:
          'Pehchan assessments are embedded seamlessly between learning content. A child reads a passage, then answers a reflective question. They watch a video, then complete a sorting activity. There is no "test mode" — assessment is a natural, low-pressure part of the learning flow, reducing anxiety and producing more authentic responses.',
      },
      {
        id: 'sidebar-8-2',
        icon: BarChart3,
        label: 'The Learner Map',
        title: 'The Learner Map',
        subtitle:
          'An evolving internal profile that shapes what content appears next for each child.',
        largeText:
          'Every Pehchan response updates an internal learner map — a multidimensional profile covering cognitive style, modality preference, subject strengths, attention patterns, and areas needing support. This map is never static; it evolves with every interaction, ensuring the content a child sees is always aligned with who they are right now.',
      },
    ],
  },
  {
    id: 9,
    icon: Keyboard,
    label: 'The Dot',
    title: 'The Unified Dot System',
    subtitle: 'One component. Every size. Every context.',
    paragraphs: [
      'Everything you see in Aadya is a Dot. The navigation icons, the content cards, the footer indicators — they are all the same component rendered at different sizes. A Dot at 40 pixels shows an icon. At 150 pixels, it shows a title. At 400 pixels, it becomes a full content panel with media.',
      'This is not just an engineering choice — it is a design philosophy. By unifying the entire interface into a single responsive primitive, we ensure consistency, accessibility, and adaptability across every screen size and interaction mode.',
    ],
    media: [
      {
        type: 'diagram',
        id: 'dot-tiers',
        category: 'explainer',
        diagram: `graph LR
    A["Dot (xs < 80px)"] -->|grows| B["Dot (sm 80-149px)"]
    B -->|grows| C["Dot (md 150-249px)"]
    C -->|grows| D["Dot (lg 250-399px)"]
    D -->|grows| E["Dot (xl 400px+)"]
    A -.- F[Icon only]
    B -.- G[Icon + Label]
    C -.- H[Title + Subtitle]
    D -.- I[Full Text]
    E -.- J[Media + Content]
    style A fill:#7c3aed,stroke:#6d28d9,color:#fff
    style B fill:#7c3aed,stroke:#6d28d9,color:#fff
    style C fill:#7c3aed,stroke:#6d28d9,color:#fff
    style D fill:#7c3aed,stroke:#6d28d9,color:#fff
    style E fill:#7c3aed,stroke:#6d28d9,color:#fff`,
      },
      {
        type: 'image',
        src: '/media/vision/dot/image/simple.png',
        alt: 'AI Content Generation',
        category: 'simple',
      },
    ],
    sidebarDots: [
      {
        id: 'sidebar-9-0',
        icon: Layers,
        label: 'Tier Breakpoints',
        title: 'Tier Breakpoints',
        subtitle:
          'Five size tiers — xs, sm, md, lg, xl — each revealing progressively richer content as space allows.',
        largeText:
          'The Dot component responds to its container width through five tiers: xs shows only an icon, sm adds a label, md reveals title and subtitle, lg displays full text content, and xl renders media, diagrams, and interactive elements. This progressive disclosure keeps the interface clean at every scale.',
      },
      {
        id: 'sidebar-9-1',
        icon: Focus,
        label: 'Focus Management',
        title: 'Focus Management',
        subtitle:
          'Every Dot is keyboard-navigable with visible focus rings, ARIA roles, and screen reader announcements.',
        largeText:
          'Every Dot in the system is a focusable, keyboard-navigable element with visible focus rings, proper ARIA roles and states, and screen reader announcements on interaction. Focus management is centralised so that navigation between Dots is predictable, consistent, and accessible.',
      },
      {
        id: 'sidebar-9-2',
        icon: Building2,
        label: 'Design Philosophy',
        title: 'Design Philosophy',
        subtitle:
          'One primitive, infinite contexts — the Dot is not a component library, it is a way of thinking about UI.',
        largeText:
          'The Dot is not a component library — it is a design philosophy. By reducing the entire interface to a single responsive primitive, every screen, layout, and interaction mode is handled by the same code. This eliminates inconsistency, simplifies maintenance, and ensures that accessibility is built in once and works everywhere.',
      },
    ],
  },
]
