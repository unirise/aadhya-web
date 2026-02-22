/**
 * Skills to Vocational Mapping Utility
 *
 * Maps skills to relevant vocational/career paths that individuals
 * with those skills typically excel in.
 *
 * This mapping is India-relevant, inclusion-friendly, and skills-first (not degree-first),
 * designed for PwDs, NEP 2020 pathways, CSR skilling, and livelihoods design.
 */

/**
 * Skill-to-Vocational Role Mapping (Primary)
 * Each skill maps to an array of relevant vocational roles
 * Roles are skill-first, not degree-first
 */
export const skillVocationalMapping = {
  // -----------------------------
  // INTERPERSONAL SKILLS
  // -----------------------------
  'Active listening': [
    'Customer Support Executive',
    'Community Outreach Assistant',
    'Peer Mentor',
  ],
  'Empathic communication': [
    'NGO Field Worker',
    'CSR Program Coordinator (Junior)',
    'Front Desk Executive',
  ],
  'Group facilitation': [
    'Training Assistant',
    'Workshop Facilitator',
    'Community Program Assistant',
  ],
  'Team coordination': [
    'Project Coordination Executive',
    'Operations Assistant',
    'Event Coordination Assistant',
  ],
  'Conflict resolution': [
    'Community Liaison Officer (Junior)',
    'HR Support Assistant',
  ],
  'Peer mentoring': ['Peer Tutor', 'Learning Support Assistant'],
  'Stakeholder engagement': ['CSR Field Coordinator', 'NGO Program Assistant'],
  'Collaborative problem solving': [
    'Program Monitoring Assistant',
    'Operations Coordinator (Junior)',
  ],
  // Map old skill names to new ones for backward compatibility
  Empathy: [
    'Customer Support Executive',
    'Community Outreach Assistant',
    'NGO Field Worker',
    'CSR Program Coordinator (Junior)',
    'Front Desk Executive',
  ],
  'Team collaboration': [
    'Project Coordination Executive',
    'Operations Assistant',
    'Event Coordination Assistant',
  ],
  Communication: [
    'Customer Support Executive',
    'Front Desk Executive',
    'Community Outreach Assistant',
  ],
  'Relationship building': [
    'CSR Field Coordinator',
    'NGO Program Assistant',
    'Community Outreach Assistant',
  ],
  'Emotional intelligence': [
    'HR Support Assistant',
    'Community Liaison Officer (Junior)',
    'CSR Program Coordinator (Junior)',
  ],
  Networking: [
    'CSR Field Coordinator',
    'NGO Program Assistant',
    'Community Outreach Assistant',
  ],
  'Social awareness': [
    'NGO Field Worker',
    'Community Outreach Assistant',
    'CSR Program Coordinator (Junior)',
  ],
  Leadership: [
    'Project Coordination Executive',
    'Operations Coordinator (Junior)',
    'Team Lead (after experience)',
  ],

  // -----------------------------
  // BODILY–KINESTHETIC SKILLS
  // -----------------------------
  'Hands-on assembly': ['Assembly Technician', 'Production Line Associate'],
  'Tool handling': ['Workshop Assistant', 'Maintenance Assistant'],
  'Physical task execution': [
    'Warehouse Operations Assistant',
    'Field Operations Assistant',
  ],
  'Prototyping and fabrication': ['Maker Space Assistant', 'Lab Assistant'],
  'Demonstration-based instruction': [
    'Training Assistant',
    'Skill Demonstrator',
  ],
  'Repair and maintenance': [
    'Repair Technician (Junior)',
    'Maintenance Support Staff',
  ],
  // Map old skill names to new ones for backward compatibility
  'Manual dexterity': [
    'Assembly Technician',
    'Workshop Assistant',
    'Repair Technician (Junior)',
  ],
  'Hand-eye coordination': [
    'Assembly Technician',
    'Production Line Associate',
    'Repair Technician (Junior)',
  ],
  'Physical coordination': [
    'Assembly Technician',
    'Production Line Associate',
    'Warehouse Operations Assistant',
  ],
  Craftsmanship: [
    'Maker Space Assistant',
    'Workshop Assistant',
    'Lab Assistant',
  ],
  'Tactile learning': [
    'Training Assistant',
    'Skill Demonstrator',
    'Workshop Assistant',
  ],

  // -----------------------------
  // LOGICAL–MATHEMATICAL SKILLS
  // -----------------------------
  'Logical reasoning': [
    'Junior Process Analyst',
    'Operations Analyst (Entry-level)',
  ],
  'Cause–effect analysis': [
    'Quality Control Assistant',
    'Testing & Inspection Assistant',
  ],
  'Structured problem solving': [
    'Technical Support Assistant',
    'Process Improvement Assistant',
  ],
  'Process optimization': [
    'Production Planning Assistant',
    'Operations Support Executive',
  ],
  'Basic data interpretation': ['MIS Executive', 'Data Support Associate'],
  'Estimation and measurement': [
    'Inventory Analyst (Entry-level)',
    'Billing & Accounts Assistant',
  ],
  // Map old skill names to new ones for backward compatibility
  'Problem solving': [
    'Technical Support Assistant',
    'Process Improvement Assistant',
    'Junior Process Analyst',
  ],
  'Logical analysis': [
    'Junior Process Analyst',
    'Operations Analyst (Entry-level)',
    'Quality Control Assistant',
  ],
  'Data analysis': [
    'MIS Executive',
    'Data Support Associate',
    'Operations Analyst (Entry-level)',
  ],
  'Critical thinking': [
    'Quality Control Assistant',
    'Process Improvement Assistant',
    'Technical Support Assistant',
  ],
  'Pattern recognition': [
    'Quality Control Assistant',
    'Testing & Inspection Assistant',
    'Operations Analyst (Entry-level)',
  ],
  'Mathematical reasoning': [
    'Inventory Analyst (Entry-level)',
    'Billing & Accounts Assistant',
    'Operations Analyst (Entry-level)',
  ],
  'Quantitative skills': [
    'Billing & Accounts Assistant',
    'Inventory Analyst (Entry-level)',
    'MIS Executive',
  ],

  // Intrapersonal skills (keeping for backward compatibility)
  'Self-reflection': [
    'Counselor',
    'Life Coach',
    'Therapist',
    'Psychologist',
    'Spiritual Advisor',
  ],
  'Emotional awareness': [
    'Counselor',
    'Social Worker',
    'HR Specialist',
    'Therapist',
    'Life Coach',
  ],
  'Goal setting': [
    'Project Manager',
    'Business Consultant',
    'Life Coach',
    'Executive Coach',
    'Career Counselor',
  ],
  'Self-motivation': [
    'Entrepreneur',
    'Sales Professional',
    'Freelancer',
    'Business Owner',
    'Independent Contractor',
  ],
  'Personal values alignment': [
    'Ethics Officer',
    'Non-profit Manager',
    'Social Worker',
    'Humanitarian Worker',
    'Community Organizer',
  ],
  Introspection: [
    'Writer',
    'Philosopher',
    'Researcher',
    'Therapist',
    'Academic',
  ],
  'Self-discipline': [
    'Athlete',
    'Military Officer',
    'Law Enforcement',
    'Pilot',
    'Surgeon',
  ],
  'Independent thinking': [
    'Researcher',
    'Scientist',
    'Philosopher',
    'Writer',
    'Entrepreneur',
  ],
  Metacognition: [
    'Educator',
    'Researcher',
    'Cognitive Scientist',
    'Learning Specialist',
    'Academic',
  ],
  'Personal growth planning': [
    'Life Coach',
    'Career Counselor',
    'HR Development',
    'Training Specialist',
    'Wellness Coach',
  ],

  // Other skills (keeping for backward compatibility)
  'Athletic performance': [
    'Professional Athlete',
    'Sports Coach',
    'Fitness Trainer',
    'Sports Medicine',
    'Athletic Director',
  ],
  'Body movement control': [
    'Dancer',
    'Yoga Instructor',
    'Physical Therapist',
    'Choreographer',
    'Movement Therapist',
  ],
  'Physical expression': [
    'Dancer',
    'Actor',
    'Mime Artist',
    'Performance Artist',
    'Athlete',
  ],
  'Dance and movement': [
    'Dancer',
    'Choreographer',
    'Dance Instructor',
    'Movement Therapist',
    'Performance Artist',
  ],
  'Sports performance': [
    'Athlete',
    'Sports Coach',
    'Sports Analyst',
    'Athletic Trainer',
    'Sports Psychologist',
  ],
  'Scientific thinking': [
    'Scientist',
    'Researcher',
    'Engineer',
    'Medical Researcher',
    'Academic',
  ],
  'Abstract reasoning': [
    'Philosopher',
    'Mathematician',
    'Theoretical Physicist',
    'Researcher',
    'Academic',
  ],
  'Algorithmic thinking': [
    'Software Engineer',
    'Computer Scientist',
    'Data Scientist',
    'AI Specialist',
    'Cryptographer',
  ],
  'Reading comprehension': [
    'Editor',
    'Researcher',
    'Academic',
    'Lawyer',
    'Journalist',
  ],
  'Writing skills': [
    'Writer',
    'Journalist',
    'Editor',
    'Content Creator',
    'Technical Writer',
  ],
  'Verbal communication': [
    'Teacher',
    'Public Speaker',
    'Sales Professional',
    'Lawyer',
    'Broadcaster',
  ],
  Storytelling: [
    'Writer',
    'Screenwriter',
    'Journalist',
    'Content Creator',
    'Marketing Professional',
  ],
  'Language learning': [
    'Translator',
    'Language Teacher',
    'Interpreter',
    'Linguist',
    'Diplomat',
  ],
  'Vocabulary building': [
    'Writer',
    'Editor',
    'Teacher',
    'Lexicographer',
    'Academic',
  ],
  'Persuasive speaking': [
    'Lawyer',
    'Sales Professional',
    'Politician',
    'Public Speaker',
    'Marketing Professional',
  ],
  'Poetry and literature': [
    'Writer',
    'Poet',
    'Literary Critic',
    'Editor',
    'Academic',
  ],
  'Public speaking': [
    'Public Speaker',
    'Politician',
    'Teacher',
    'Broadcaster',
    'Motivational Speaker',
  ],
  'Editing and proofreading': [
    'Editor',
    'Proofreader',
    'Content Manager',
    'Technical Writer',
    'Publishing Professional',
  ],
  'Musical composition': [
    'Composer',
    'Music Producer',
    'Songwriter',
    'Arranger',
    'Music Director',
  ],
  'Rhythm recognition': [
    'Musician',
    'Drummer',
    'Music Producer',
    'Sound Engineer',
    'Music Therapist',
  ],
  'Pitch discrimination': [
    'Singer',
    'Music Producer',
    'Sound Engineer',
    'Music Teacher',
    'Tuner',
  ],
  'Instrumental performance': [
    'Musician',
    'Orchestra Member',
    'Session Musician',
    'Music Teacher',
    'Performer',
  ],
  Singing: [
    'Singer',
    'Vocal Coach',
    'Music Teacher',
    'Performer',
    'Recording Artist',
  ],
  'Music theory': [
    'Music Teacher',
    'Composer',
    'Musicologist',
    'Academic',
    'Music Director',
  ],
  'Sound pattern recognition': [
    'Sound Engineer',
    'Music Producer',
    'Audio Engineer',
    'Music Therapist',
    'Acoustician',
  ],
  'Musical memory': [
    'Musician',
    'Conductor',
    'Music Teacher',
    'Performer',
    'Music Therapist',
  ],
  'Harmony understanding': [
    'Composer',
    'Arranger',
    'Music Teacher',
    'Music Director',
    'Music Producer',
  ],
  'Audio production': [
    'Music Producer',
    'Sound Engineer',
    'Audio Engineer',
    'Recording Engineer',
    'Music Technician',
  ],
  'Visual thinking': [
    'Designer',
    'Architect',
    'Artist',
    'Animator',
    'Visualizer',
  ],
  'Spatial reasoning': [
    'Architect',
    'Engineer',
    'Pilot',
    'Surgeon',
    'Designer',
  ],
  '3D visualization': [
    '3D Artist',
    'Architect',
    'Game Designer',
    'Animator',
    'CAD Designer',
  ],
  'Graphic design': [
    'Graphic Designer',
    'UI/UX Designer',
    'Brand Designer',
    'Illustrator',
    'Art Director',
  ],
  Architecture: [
    'Architect',
    'Urban Planner',
    'Interior Designer',
    'Landscape Architect',
    'Building Designer',
  ],
  Navigation: [
    'Pilot',
    'Navigator',
    'Maritime Officer',
    'Logistics Coordinator',
    'Surveyor',
  ],
  'Artistic creation': [
    'Artist',
    'Illustrator',
    'Sculptor',
    'Painter',
    'Creative Director',
  ],
  'Map reading': [
    'Cartographer',
    'Surveyor',
    'Geographer',
    'Urban Planner',
    'Logistics Specialist',
  ],
  'Visual memory': [
    'Artist',
    'Designer',
    'Photographer',
    'Forensic Artist',
    'Medical Illustrator',
  ],
  'Pattern design': [
    'Textile Designer',
    'Fashion Designer',
    'Graphic Designer',
    'Interior Designer',
    'Product Designer',
  ],
  'Nature observation': [
    'Biologist',
    'Ecologist',
    'Naturalist',
    'Wildlife Photographer',
    'Field Researcher',
  ],
  'Environmental awareness': [
    'Environmental Scientist',
    'Conservationist',
    'Environmental Consultant',
    'Park Ranger',
    'Sustainability Specialist',
  ],
  'Species classification': [
    'Biologist',
    'Zoologist',
    'Botanist',
    'Taxonomist',
    'Museum Curator',
  ],
  'Ecological understanding': [
    'Ecologist',
    'Environmental Scientist',
    'Conservation Biologist',
    'Environmental Consultant',
    'Researcher',
  ],
  Gardening: [
    'Horticulturist',
    'Landscape Designer',
    'Botanist',
    'Agricultural Specialist',
    'Garden Designer',
  ],
  'Animal care': [
    'Veterinarian',
    'Zookeeper',
    'Animal Trainer',
    'Wildlife Rehabilitator',
    'Animal Behaviorist',
  ],
  'Outdoor skills': [
    'Outdoor Guide',
    'Park Ranger',
    'Wilderness Instructor',
    'Adventure Guide',
    'Survival Instructor',
  ],
  Conservation: [
    'Conservationist',
    'Environmental Scientist',
    'Wildlife Manager',
    'Park Ranger',
    'Environmental Policy',
  ],
  'Natural pattern recognition': [
    'Ecologist',
    'Meteorologist',
    'Geologist',
    'Researcher',
    'Naturalist',
  ],
  'Sustainability practices': [
    'Sustainability Consultant',
    'Environmental Manager',
    'Green Building Specialist',
    'Renewable Energy Specialist',
    'Environmental Policy',
  ],
}

/**
 * Hybrid Role Mapping
 * Maps combinations of intelligences to hybrid vocational roles
 */
export const hybridRoleMapping = {
  'Interpersonal+Bodily-Kinesthetic': [
    'Training Assistant / Instructor Aide',
    'Community Workshop Facilitator',
    'Sports / Activity Coach Assistant',
    'Skill Demonstrator (ITI / NGO / CSR labs)',
    'Event Setup & Coordination Assistant',
  ],
  'Interpersonal+Logical-Mathematical': [
    'Program Monitoring Assistant',
    'Project Coordination Executive',
    'Participatory Research Assistant',
    'Operations Coordinator (Junior)',
    'Team Lead (after experience)',
  ],
  'Bodily-Kinesthetic+Logical-Mathematical': [
    'Technical Support Assistant',
    'Maintenance Troubleshooter',
    'Quality & Testing Technician',
    'Process Improvement Assistant',
    'Applied STEM Lab Assistant',
  ],
}

/**
 * Entry-Level vs Growth Pathways
 * Maps roles to their career progression levels
 */
export const rolePathways = {
  // Entry-Level (0–2 years)
  entryLevel: [
    'Workshop Assistant',
    'Field Coordinator',
    'Assembly Technician',
    'Customer Support Associate',
    'Training Assistant',
    'Community Outreach Assistant',
    'CSR Program Coordinator (Junior)',
    'Front Desk Executive',
    'NGO Field Worker',
    'Peer Mentor',
    'Workshop Facilitator',
    'Community Program Assistant',
    'Operations Assistant',
    'Event Coordination Assistant',
    'HR Support Assistant',
    'Peer Tutor',
    'Learning Support Assistant',
    'CSR Field Coordinator',
    'NGO Program Assistant',
    'Program Monitoring Assistant',
    'Operations Coordinator (Junior)',
    'Production Line Associate',
    'Maintenance Assistant',
    'Warehouse Operations Assistant',
    'Field Operations Assistant',
    'Maker Space Assistant',
    'Lab Assistant',
    'Skill Demonstrator',
    'Repair Technician (Junior)',
    'Maintenance Support Staff',
    'Junior Process Analyst',
    'Operations Analyst (Entry-level)',
    'Quality Control Assistant',
    'Testing & Inspection Assistant',
    'Technical Support Assistant',
    'Process Improvement Assistant',
    'Production Planning Assistant',
    'Operations Support Executive',
    'MIS Executive',
    'Data Support Associate',
    'Inventory Analyst (Entry-level)',
    'Billing & Accounts Assistant',
  ],
  // Growth Roles (2–5 years, with mentoring)
  growth: [
    'Senior Technician',
    'Program Officer',
    'Operations Supervisor',
    'Community Lead',
    'Technical Trainer',
    'Project Coordination Executive',
    'CSR Program Coordinator',
    'Training Facilitator',
    'Community Workshop Facilitator',
    'Sports / Activity Coach Assistant',
    'Event Setup & Coordination Assistant',
    'Program Monitoring Assistant',
    'Participatory Research Assistant',
    'Team Lead (after experience)',
    'Maintenance Troubleshooter',
    'Quality & Testing Technician',
    'Applied STEM Lab Assistant',
  ],
  // Leadership / Specialist (5+ years)
  leadership: [
    'Training Manager',
    'Project Manager',
    'Production Supervisor',
    'CSR Program Lead',
    'Social Enterprise Founder / Partner',
    'Operations Manager',
    'Community Program Manager',
    'Senior Program Officer',
    'Technical Training Manager',
  ],
}

/**
 * Inclusive Design Notes
 * Training modes and PwD suitability information
 */
export const inclusiveDesignNotes = {
  trainingModes: [
    'Apprenticeships',
    'On-the-job training',
    'Peer learning',
    'Demonstration + practice',
    'Task-based certification (not exam-heavy)',
  ],
  pwDSuitability: {
    locomotorDisabilities: [
      'Workshop Assistant (with adaptations)',
      'Training Assistant',
      'Program Monitoring Assistant',
      'MIS Executive',
      'Data Support Associate',
      'Customer Support Executive',
      'Front Desk Executive',
    ],
    hearingDisabilities: [
      'Workshop Assistant (visual + hands-on learning)',
      'Assembly Technician',
      'Production Line Associate',
      'Lab Assistant',
      'Maker Space Assistant',
      'Quality Control Assistant',
      'Testing & Inspection Assistant',
    ],
    mildIntellectualDisabilities: [
      'Assembly Technician (structured, repetitive tasks)',
      'Production Line Associate',
      'Warehouse Operations Assistant',
      'Data Support Associate',
      'Billing & Accounts Assistant',
    ],
    neurodiverseLearners: [
      'Technical Support Assistant (clear processes)',
      'Quality Control Assistant',
      'Process Improvement Assistant',
      'Operations Analyst (Entry-level)',
      'MIS Executive',
    ],
  },
}

/**
 * Get vocational paths for a specific skill
 *
 * @param {string} skill - The skill name
 * @returns {Array<string>} Array of vocational paths associated with the skill
 */
export function getVocationalPathsForSkill(skill) {
  return skillVocationalMapping[skill] || []
}

/**
 * Get vocational paths mapped to skills from intelligence-skill mapping
 *
 * @param {Array<Object>} intelligenceSkillMapping - Array of {domain, score, skills} objects
 * @returns {Array<Object>} Array of {skill, vocationalPaths} objects
 */
export function getSkillsVocationalMapping(intelligenceSkillMapping) {
  if (!intelligenceSkillMapping || intelligenceSkillMapping.length === 0) {
    return []
  }

  // Collect all skills from the intelligence-skill mapping
  const allSkills = intelligenceSkillMapping.flatMap(item => item.skills)

  // Create a map of unique skills to their vocational paths
  const skillVocationalMap = new Map()

  allSkills.forEach(skill => {
    if (!skillVocationalMap.has(skill)) {
      const vocationalPaths = getVocationalPathsForSkill(skill)
      if (vocationalPaths.length > 0) {
        skillVocationalMap.set(skill, vocationalPaths)
      }
    }
  })

  // Convert to array format
  return Array.from(skillVocationalMap.entries()).map(
    ([skill, vocationalPaths]) => ({
      skill,
      vocationalPaths,
    })
  )
}

/**
 * Get all unique vocational paths from skills
 *
 * @param {Array<Object>} intelligenceSkillMapping - Array of {domain, score, skills} objects
 * @returns {Array<string>} Array of unique vocational paths
 */
export function getAllVocationalPaths(intelligenceSkillMapping) {
  const skillsVocationalMapping = getSkillsVocationalMapping(
    intelligenceSkillMapping
  )
  const allPaths = skillsVocationalMapping.flatMap(item => item.vocationalPaths)
  // Remove duplicates while preserving order
  return [...new Set(allPaths)]
}

/**
 * Derive hybrid roles based on top intelligences
 *
 * @param {Array<string>} topIntelligenceDomains - Array of intelligence domain codes
 * @returns {Array<Object>} Array of {combination, roles} objects
 */
export function deriveHybridRoles(topIntelligenceDomains) {
  if (!topIntelligenceDomains || topIntelligenceDomains.length < 2) {
    return []
  }

  const hybridRoles = []
  const domainMap = {
    INTERPERSONAL: 'Interpersonal',
    BODILY_KINESTHETIC: 'Bodily-Kinesthetic',
    LOGICAL_MATHEMATICAL: 'Logical-Mathematical',
  }

  const mappedDomains = topIntelligenceDomains
    .map(domain => domainMap[domain])
    .filter(Boolean)

  // Check for Interpersonal + Bodily-Kinesthetic
  if (
    mappedDomains.includes('Interpersonal') &&
    mappedDomains.includes('Bodily-Kinesthetic')
  ) {
    hybridRoles.push({
      combination: 'Interpersonal + Bodily-Kinesthetic',
      description: 'People + Action Roles',
      roles: hybridRoleMapping['Interpersonal+Bodily-Kinesthetic'],
    })
  }

  // Check for Interpersonal + Logical-Mathematical
  if (
    mappedDomains.includes('Interpersonal') &&
    mappedDomains.includes('Logical-Mathematical')
  ) {
    hybridRoles.push({
      combination: 'Interpersonal + Logical-Mathematical',
      description: 'People + Thinking Roles',
      roles: hybridRoleMapping['Interpersonal+Logical-Mathematical'],
    })
  }

  // Check for Bodily-Kinesthetic + Logical-Mathematical
  if (
    mappedDomains.includes('Bodily-Kinesthetic') &&
    mappedDomains.includes('Logical-Mathematical')
  ) {
    hybridRoles.push({
      combination: 'Bodily-Kinesthetic + Logical-Mathematical',
      description: 'Hands-on + Problem Solving Roles',
      roles: hybridRoleMapping['Bodily-Kinesthetic+Logical-Mathematical'],
    })
  }

  return hybridRoles
}

/**
 * Categorize roles by pathway level
 *
 * @param {Array<string>} roles - Array of role names
 * @returns {Object} Object with entryLevel, growth, and leadership arrays
 */
export function categorizeRolesByPathway(roles) {
  const categorized = {
    entryLevel: [],
    growth: [],
    leadership: [],
  }

  roles.forEach(role => {
    if (rolePathways.entryLevel.includes(role)) {
      categorized.entryLevel.push(role)
    } else if (rolePathways.growth.includes(role)) {
      categorized.growth.push(role)
    } else if (rolePathways.leadership.includes(role)) {
      categorized.leadership.push(role)
    } else {
      // Default to entry level if not found
      categorized.entryLevel.push(role)
    }
  })

  return categorized
}

/**
 * Get inclusive design information
 *
 * @returns {Object} Object with trainingModes and pwDSuitability
 */
export function getInclusiveDesignInfo() {
  return inclusiveDesignNotes
}
