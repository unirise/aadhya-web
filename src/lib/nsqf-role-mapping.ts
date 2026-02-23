/**
 * NSQF-aligned Role Mapping Utility
 *
 * Maps vocational paths to NSQF (National Skills Qualification Framework)
 * aligned roles and qualifications.
 *
 * NSQF: National Skills Qualification Framework
 */

/**
 * Role → NSQF level mapping
 * Maps vocational roles to NSQF levels based on skill complexity, autonomy, and responsibility.
 * NSQF levels indicate skill complexity and autonomy — not a ceiling on potential.
 */
export const ROLE_TO_NSQF = {
  // -----------------------------
  // INTERPERSONAL / SERVICE ROLES
  // -----------------------------
  'Customer Support Executive': 4,
  'Front Desk Executive': 4,
  'Community Outreach Assistant': 4,
  'NGO Field Worker': 4,
  'Peer Mentor': 3,
  'Buddy Facilitator': 3,
  'Training Assistant': 5,
  'Workshop Facilitator': 5,
  'CSR Program Coordinator (Junior)': 5,
  'Project Coordination Executive': 6,
  'Community Liaison Officer (Junior)': 5,
  'HR Support Assistant': 4,

  // -----------------------------
  // BODILY–KINESTHETIC ROLES
  // -----------------------------
  'Production Line Associate': 3,
  'Assembly Technician': 4,
  'Workshop Assistant': 3,
  'Lab Assistant': 4,
  'Maker Space Assistant': 4,
  'Repair & Maintenance Assistant': 4,
  'Repair Technician (Junior)': 5,
  'Maintenance Support Staff': 4,
  'Warehouse Operations Assistant': 3,
  'Field Operations Assistant': 4,

  // -----------------------------
  // LOGICAL / PROCESS ROLES
  // -----------------------------
  'Inventory Analyst (Entry-level)': 4,
  'Billing & Accounts Assistant': 4,
  'Quality Control Assistant': 4,
  'Testing & Inspection Assistant': 4,
  'Junior Process Analyst': 5,
  'Operations Assistant': 4,
  'MIS Executive': 5,
  'Data Support Associate': 5,
  'Operations Analyst (Entry-level)': 5,
  'Process Improvement Assistant': 5,

  // -----------------------------
  // HYBRID ROLES
  // -----------------------------
  'Technical Support Assistant': 5,
  'Program Monitoring Assistant': 5,
  'Operations Coordinator (Junior)': 6,
}

/**
 * NSQF role mapping for vocational paths
 * Each vocational path maps to NSQF-aligned roles/qualifications
 */
export const nsqfRoleMapping = {
  // Counseling and Therapy
  Counselor: [
    'NSQF Level 5: Career Counselor',
    'NSQF Level 6: Mental Health Counselor',
    'NSQF Level 7: Senior Counselor',
  ],
  'Life Coach': [
    'NSQF Level 5: Life Skills Coach',
    'NSQF Level 6: Professional Life Coach',
  ],
  Therapist: [
    'NSQF Level 6: Occupational Therapist',
    'NSQF Level 7: Clinical Therapist',
  ],
  Psychologist: [
    'NSQF Level 7: Counseling Psychologist',
    'NSQF Level 8: Clinical Psychologist',
  ],
  'Social Worker': [
    'NSQF Level 5: Community Social Worker',
    'NSQF Level 6: Professional Social Worker',
    'NSQF Level 7: Senior Social Worker',
  ],

  // Business and Management
  'Project Manager': [
    'NSQF Level 6: Project Management Professional',
    'NSQF Level 7: Senior Project Manager',
  ],
  'Business Consultant': [
    'NSQF Level 7: Business Strategy Consultant',
    'NSQF Level 8: Senior Business Consultant',
  ],
  'Executive Coach': [
    'NSQF Level 6: Executive Coach',
    'NSQF Level 7: Senior Executive Coach',
  ],
  Entrepreneur: [
    'NSQF Level 5: Small Business Owner',
    'NSQF Level 6: Business Entrepreneur',
    'NSQF Level 7: Enterprise Entrepreneur',
  ],
  'Business Owner': [
    'NSQF Level 5: Small Business Owner',
    'NSQF Level 6: Business Owner',
  ],
  Executive: [
    'NSQF Level 7: Business Executive',
    'NSQF Level 8: Senior Executive',
  ],
  Manager: ['NSQF Level 6: Operations Manager', 'NSQF Level 7: Senior Manager'],
  'Team Leader': [
    'NSQF Level 5: Team Leader',
    'NSQF Level 6: Senior Team Leader',
  ],
  Director: ['NSQF Level 8: Director', 'NSQF Level 9: Senior Director'],

  // Sales and Marketing
  'Sales Professional': [
    'NSQF Level 4: Sales Associate',
    'NSQF Level 5: Sales Executive',
    'NSQF Level 6: Sales Manager',
  ],
  'Marketing Professional': [
    'NSQF Level 5: Marketing Associate',
    'NSQF Level 6: Marketing Executive',
    'NSQF Level 7: Marketing Manager',
  ],
  'Public Relations': [
    'NSQF Level 5: PR Associate',
    'NSQF Level 6: PR Executive',
    'NSQF Level 7: PR Manager',
  ],
  'Communications Manager': [
    'NSQF Level 6: Communications Executive',
    'NSQF Level 7: Communications Manager',
  ],
  'Social Media Manager': [
    'NSQF Level 5: Social Media Specialist',
    'NSQF Level 6: Social Media Manager',
  ],
  'Community Manager': [
    'NSQF Level 5: Community Coordinator',
    'NSQF Level 6: Community Manager',
  ],
  'Account Manager': [
    'NSQF Level 5: Account Executive',
    'NSQF Level 6: Account Manager',
  ],
  'Business Development': [
    'NSQF Level 5: Business Development Executive',
    'NSQF Level 6: Business Development Manager',
  ],
  'Networking Professional': [
    'NSQF Level 5: Networking Specialist',
    'NSQF Level 6: Professional Networker',
  ],

  // Healthcare
  Nurse: [
    'NSQF Level 5: Staff Nurse',
    'NSQF Level 6: Senior Nurse',
    'NSQF Level 7: Nursing Supervisor',
  ],
  Surgeon: [
    'NSQF Level 8: General Surgeon',
    'NSQF Level 9: Specialist Surgeon',
  ],
  Dentist: [
    'NSQF Level 7: General Dentist',
    'NSQF Level 8: Specialist Dentist',
  ],
  Veterinarian: [
    'NSQF Level 7: Veterinary Doctor',
    'NSQF Level 8: Specialist Veterinarian',
  ],

  // Education and Training
  Teacher: [
    'NSQF Level 5: Primary Teacher',
    'NSQF Level 6: Secondary Teacher',
    'NSQF Level 7: Senior Teacher',
  ],
  Educator: ['NSQF Level 6: Educator', 'NSQF Level 7: Senior Educator'],
  'Language Teacher': [
    'NSQF Level 5: Language Instructor',
    'NSQF Level 6: Language Teacher',
  ],
  'Music Teacher': [
    'NSQF Level 5: Music Instructor',
    'NSQF Level 6: Music Teacher',
  ],
  'Dance Instructor': [
    'NSQF Level 4: Dance Instructor',
    'NSQF Level 5: Professional Dance Instructor',
  ],
  'Training Specialist': [
    'NSQF Level 5: Training Associate',
    'NSQF Level 6: Training Specialist',
    'NSQF Level 7: Senior Training Specialist',
  ],
  Facilitator: [
    'NSQF Level 5: Workshop Facilitator',
    'NSQF Level 6: Professional Facilitator',
  ],
  Trainer: [
    'NSQF Level 5: Skills Trainer',
    'NSQF Level 6: Professional Trainer',
  ],
  'Workshop Leader': [
    'NSQF Level 5: Workshop Facilitator',
    'NSQF Level 6: Workshop Leader',
  ],

  // Technology and Engineering
  Engineer: [
    'NSQF Level 6: Junior Engineer',
    'NSQF Level 7: Engineer',
    'NSQF Level 8: Senior Engineer',
  ],
  'Software Engineer': [
    'NSQF Level 5: Junior Software Developer',
    'NSQF Level 6: Software Engineer',
    'NSQF Level 7: Senior Software Engineer',
  ],
  'Computer Scientist': [
    'NSQF Level 7: Computer Scientist',
    'NSQF Level 8: Senior Computer Scientist',
  ],
  'Data Scientist': [
    'NSQF Level 6: Data Analyst',
    'NSQF Level 7: Data Scientist',
    'NSQF Level 8: Senior Data Scientist',
  ],
  'Data Analyst': [
    'NSQF Level 5: Junior Data Analyst',
    'NSQF Level 6: Data Analyst',
    'NSQF Level 7: Senior Data Analyst',
  ],
  'Business Analyst': [
    'NSQF Level 5: Business Analyst',
    'NSQF Level 6: Senior Business Analyst',
  ],
  'AI Specialist': [
    'NSQF Level 7: AI Specialist',
    'NSQF Level 8: Senior AI Specialist',
  ],
  Cryptographer: [
    'NSQF Level 7: Cryptographer',
    'NSQF Level 8: Senior Cryptographer',
  ],
  'Video Game Designer': [
    'NSQF Level 5: Game Designer',
    'NSQF Level 6: Senior Game Designer',
  ],

  // Science and Research
  Scientist: [
    'NSQF Level 7: Research Scientist',
    'NSQF Level 8: Senior Scientist',
  ],
  Researcher: [
    'NSQF Level 6: Research Associate',
    'NSQF Level 7: Researcher',
    'NSQF Level 8: Senior Researcher',
  ],
  'Medical Researcher': [
    'NSQF Level 7: Medical Researcher',
    'NSQF Level 8: Senior Medical Researcher',
  ],
  Academic: [
    'NSQF Level 7: Assistant Professor',
    'NSQF Level 8: Associate Professor',
    'NSQF Level 9: Professor',
  ],
  Biologist: ['NSQF Level 6: Biologist', 'NSQF Level 7: Senior Biologist'],
  Ecologist: ['NSQF Level 6: Ecologist', 'NSQF Level 7: Senior Ecologist'],
  'Environmental Scientist': [
    'NSQF Level 6: Environmental Scientist',
    'NSQF Level 7: Senior Environmental Scientist',
  ],
  Zoologist: ['NSQF Level 6: Zoologist', 'NSQF Level 7: Senior Zoologist'],
  Botanist: ['NSQF Level 6: Botanist', 'NSQF Level 7: Senior Botanist'],
  Geologist: ['NSQF Level 6: Geologist', 'NSQF Level 7: Senior Geologist'],
  Meteorologist: [
    'NSQF Level 6: Meteorologist',
    'NSQF Level 7: Senior Meteorologist',
  ],

  // Finance and Accounting
  Accountant: [
    'NSQF Level 5: Junior Accountant',
    'NSQF Level 6: Accountant',
    'NSQF Level 7: Senior Accountant',
  ],
  'Financial Analyst': [
    'NSQF Level 5: Financial Analyst',
    'NSQF Level 6: Senior Financial Analyst',
  ],
  Statistician: [
    'NSQF Level 6: Statistician',
    'NSQF Level 7: Senior Statistician',
  ],
  Economist: ['NSQF Level 7: Economist', 'NSQF Level 8: Senior Economist'],
  Actuary: ['NSQF Level 7: Actuary', 'NSQF Level 8: Senior Actuary'],

  // Creative and Arts
  Writer: [
    'NSQF Level 5: Content Writer',
    'NSQF Level 6: Professional Writer',
    'NSQF Level 7: Senior Writer',
  ],
  Journalist: [
    'NSQF Level 5: Junior Journalist',
    'NSQF Level 6: Journalist',
    'NSQF Level 7: Senior Journalist',
  ],
  Editor: [
    'NSQF Level 5: Assistant Editor',
    'NSQF Level 6: Editor',
    'NSQF Level 7: Senior Editor',
  ],
  'Content Creator': [
    'NSQF Level 4: Content Creator',
    'NSQF Level 5: Professional Content Creator',
  ],
  'Technical Writer': [
    'NSQF Level 5: Technical Writer',
    'NSQF Level 6: Senior Technical Writer',
  ],
  Poet: ['NSQF Level 5: Poet', 'NSQF Level 6: Professional Poet'],
  Screenwriter: [
    'NSQF Level 5: Screenwriter',
    'NSQF Level 6: Professional Screenwriter',
  ],
  Artist: ['NSQF Level 5: Visual Artist', 'NSQF Level 6: Professional Artist'],
  Illustrator: [
    'NSQF Level 5: Illustrator',
    'NSQF Level 6: Professional Illustrator',
  ],
  Painter: ['NSQF Level 4: Painter', 'NSQF Level 5: Professional Painter'],
  Sculptor: ['NSQF Level 5: Sculptor', 'NSQF Level 6: Professional Sculptor'],
  Musician: ['NSQF Level 5: Musician', 'NSQF Level 6: Professional Musician'],
  Singer: ['NSQF Level 4: Singer', 'NSQF Level 5: Professional Singer'],
  Composer: ['NSQF Level 6: Composer', 'NSQF Level 7: Senior Composer'],
  'Music Producer': [
    'NSQF Level 5: Music Producer',
    'NSQF Level 6: Senior Music Producer',
  ],
  Dancer: ['NSQF Level 4: Dancer', 'NSQF Level 5: Professional Dancer'],
  Choreographer: [
    'NSQF Level 5: Choreographer',
    'NSQF Level 6: Senior Choreographer',
  ],
  Actor: ['NSQF Level 4: Actor', 'NSQF Level 5: Professional Actor'],
  Photographer: [
    'NSQF Level 4: Photographer',
    'NSQF Level 5: Professional Photographer',
  ],

  // Design
  Designer: ['NSQF Level 5: Designer', 'NSQF Level 6: Senior Designer'],
  'Graphic Designer': [
    'NSQF Level 5: Graphic Designer',
    'NSQF Level 6: Senior Graphic Designer',
  ],
  'UI/UX Designer': [
    'NSQF Level 5: UI/UX Designer',
    'NSQF Level 6: Senior UI/UX Designer',
  ],
  Architect: ['NSQF Level 7: Architect', 'NSQF Level 8: Senior Architect'],
  'Interior Designer': [
    'NSQF Level 5: Interior Designer',
    'NSQF Level 6: Senior Interior Designer',
  ],
  'Fashion Designer': [
    'NSQF Level 5: Fashion Designer',
    'NSQF Level 6: Senior Fashion Designer',
  ],
  'Product Designer': [
    'NSQF Level 5: Product Designer',
    'NSQF Level 6: Senior Product Designer',
  ],
  '3D Artist': ['NSQF Level 5: 3D Artist', 'NSQF Level 6: Senior 3D Artist'],
  Animator: ['NSQF Level 5: Animator', 'NSQF Level 6: Senior Animator'],
  'CAD Designer': [
    'NSQF Level 5: CAD Designer',
    'NSQF Level 6: Senior CAD Designer',
  ],

  // Skilled Trades
  Mechanic: ['NSQF Level 4: Mechanic', 'NSQF Level 5: Senior Mechanic'],
  Carpenter: ['NSQF Level 4: Carpenter', 'NSQF Level 5: Master Carpenter'],
  Craftsman: ['NSQF Level 4: Craftsman', 'NSQF Level 5: Master Craftsman'],
  Jeweler: ['NSQF Level 4: Jeweler', 'NSQF Level 5: Master Jeweler'],
  Potter: ['NSQF Level 4: Potter', 'NSQF Level 5: Master Potter'],
  Blacksmith: ['NSQF Level 4: Blacksmith', 'NSQF Level 5: Master Blacksmith'],
  Chef: [
    'NSQF Level 4: Cook',
    'NSQF Level 5: Chef',
    'NSQF Level 6: Master Chef',
  ],

  // Sports and Fitness
  Athlete: ['NSQF Level 4: Athlete', 'NSQF Level 5: Professional Athlete'],
  'Professional Athlete': [
    'NSQF Level 5: Professional Athlete',
    'NSQF Level 6: Elite Athlete',
  ],
  'Sports Coach': [
    'NSQF Level 5: Sports Coach',
    'NSQF Level 6: Senior Sports Coach',
  ],
  'Fitness Trainer': [
    'NSQF Level 4: Fitness Trainer',
    'NSQF Level 5: Professional Fitness Trainer',
  ],
  'Personal Trainer': [
    'NSQF Level 4: Personal Trainer',
    'NSQF Level 5: Professional Personal Trainer',
  ],
  'Physical Therapist': [
    'NSQF Level 6: Physical Therapist',
    'NSQF Level 7: Senior Physical Therapist',
  ],
  'Occupational Therapist': [
    'NSQF Level 6: Occupational Therapist',
    'NSQF Level 7: Senior Occupational Therapist',
  ],
  'Massage Therapist': [
    'NSQF Level 4: Massage Therapist',
    'NSQF Level 5: Professional Massage Therapist',
  ],
  'Yoga Instructor': [
    'NSQF Level 4: Yoga Instructor',
    'NSQF Level 5: Professional Yoga Instructor',
  ],
  'Martial Arts Instructor': [
    'NSQF Level 4: Martial Arts Instructor',
    'NSQF Level 5: Master Instructor',
  ],

  // Legal and Public Service
  Lawyer: ['NSQF Level 7: Advocate', 'NSQF Level 8: Senior Advocate'],
  Mediator: ['NSQF Level 5: Mediator', 'NSQF Level 6: Professional Mediator'],
  Diplomat: ['NSQF Level 7: Diplomat', 'NSQF Level 8: Senior Diplomat'],
  Politician: [
    'NSQF Level 6: Public Representative',
    'NSQF Level 7: Senior Public Representative',
  ],
  'Public Speaker': [
    'NSQF Level 5: Public Speaker',
    'NSQF Level 6: Professional Public Speaker',
  ],
  'Motivational Speaker': [
    'NSQF Level 5: Motivational Speaker',
    'NSQF Level 6: Professional Motivational Speaker',
  ],

  // Transportation
  Pilot: ['NSQF Level 6: Commercial Pilot', 'NSQF Level 7: Senior Pilot'],
  Navigator: ['NSQF Level 5: Navigator', 'NSQF Level 6: Senior Navigator'],

  // Military and Security
  'Military Officer': [
    'NSQF Level 6: Military Officer',
    'NSQF Level 7: Senior Military Officer',
  ],
  'Law Enforcement': [
    'NSQF Level 5: Police Officer',
    'NSQF Level 6: Senior Police Officer',
  ],

  // Environmental and Conservation
  Conservationist: [
    'NSQF Level 5: Conservation Officer',
    'NSQF Level 6: Conservationist',
    'NSQF Level 7: Senior Conservationist',
  ],
  'Park Ranger': [
    'NSQF Level 4: Park Ranger',
    'NSQF Level 5: Senior Park Ranger',
  ],
  'Wildlife Photographer': [
    'NSQF Level 5: Wildlife Photographer',
    'NSQF Level 6: Professional Wildlife Photographer',
  ],
  Zookeeper: ['NSQF Level 4: Zookeeper', 'NSQF Level 5: Senior Zookeeper'],
  'Animal Trainer': [
    'NSQF Level 4: Animal Trainer',
    'NSQF Level 5: Professional Animal Trainer',
  ],
  'Wildlife Rehabilitator': [
    'NSQF Level 5: Wildlife Rehabilitator',
    'NSQF Level 6: Senior Wildlife Rehabilitator',
  ],
  Horticulturist: [
    'NSQF Level 5: Horticulturist',
    'NSQF Level 6: Senior Horticulturist',
  ],
  'Landscape Designer': [
    'NSQF Level 5: Landscape Designer',
    'NSQF Level 6: Senior Landscape Designer',
  ],
  'Garden Designer': [
    'NSQF Level 4: Garden Designer',
    'NSQF Level 5: Professional Garden Designer',
  ],
  'Agricultural Specialist': [
    'NSQF Level 5: Agricultural Specialist',
    'NSQF Level 6: Senior Agricultural Specialist',
  ],
  'Outdoor Guide': [
    'NSQF Level 4: Outdoor Guide',
    'NSQF Level 5: Professional Outdoor Guide',
  ],
  'Wilderness Instructor': [
    'NSQF Level 5: Wilderness Instructor',
    'NSQF Level 6: Senior Wilderness Instructor',
  ],
  'Adventure Guide': [
    'NSQF Level 4: Adventure Guide',
    'NSQF Level 5: Professional Adventure Guide',
  ],
  'Survival Instructor': [
    'NSQF Level 5: Survival Instructor',
    'NSQF Level 6: Senior Survival Instructor',
  ],

  // Other Professional Roles
  'HR Specialist': [
    'NSQF Level 5: HR Associate',
    'NSQF Level 6: HR Specialist',
    'NSQF Level 7: Senior HR Specialist',
  ],
  Coordinator: [
    'NSQF Level 4: Coordinator',
    'NSQF Level 5: Senior Coordinator',
  ],
  'Event Planner': [
    'NSQF Level 4: Event Coordinator',
    'NSQF Level 5: Event Planner',
    'NSQF Level 6: Senior Event Planner',
  ],
  Translator: ['NSQF Level 5: Translator', 'NSQF Level 6: Senior Translator'],
  Interpreter: [
    'NSQF Level 5: Interpreter',
    'NSQF Level 6: Senior Interpreter',
  ],
  Linguist: ['NSQF Level 6: Linguist', 'NSQF Level 7: Senior Linguist'],
  Philosopher: [
    'NSQF Level 7: Philosopher',
    'NSQF Level 8: Senior Philosopher',
  ],
  Mathematician: [
    'NSQF Level 7: Mathematician',
    'NSQF Level 8: Senior Mathematician',
  ],
  'Theoretical Physicist': [
    'NSQF Level 8: Theoretical Physicist',
    'NSQF Level 9: Senior Theoretical Physicist',
  ],
  Consultant: ['NSQF Level 6: Consultant', 'NSQF Level 7: Senior Consultant'],
  'Policy Analyst': [
    'NSQF Level 6: Policy Analyst',
    'NSQF Level 7: Senior Policy Analyst',
  ],
  Broadcaster: [
    'NSQF Level 5: Broadcaster',
    'NSQF Level 6: Senior Broadcaster',
  ],
  Cartographer: [
    'NSQF Level 5: Cartographer',
    'NSQF Level 6: Senior Cartographer',
  ],
  Surveyor: ['NSQF Level 5: Surveyor', 'NSQF Level 6: Senior Surveyor'],
  Geographer: ['NSQF Level 6: Geographer', 'NSQF Level 7: Senior Geographer'],
  'Urban Planner': [
    'NSQF Level 6: Urban Planner',
    'NSQF Level 7: Senior Urban Planner',
  ],
  'Logistics Coordinator': [
    'NSQF Level 5: Logistics Coordinator',
    'NSQF Level 6: Senior Logistics Coordinator',
  ],
  'Logistics Specialist': [
    'NSQF Level 5: Logistics Specialist',
    'NSQF Level 6: Senior Logistics Specialist',
  ],
  Freelancer: [
    'NSQF Level 4: Freelancer',
    'NSQF Level 5: Professional Freelancer',
  ],
  'Independent Contractor': [
    'NSQF Level 4: Independent Contractor',
    'NSQF Level 5: Professional Independent Contractor',
  ],
  'Ethics Officer': [
    'NSQF Level 6: Ethics Officer',
    'NSQF Level 7: Senior Ethics Officer',
  ],
  'Non-profit Manager': [
    'NSQF Level 5: Non-profit Coordinator',
    'NSQF Level 6: Non-profit Manager',
  ],
  'Humanitarian Worker': [
    'NSQF Level 5: Humanitarian Worker',
    'NSQF Level 6: Senior Humanitarian Worker',
  ],
  'Community Organizer': [
    'NSQF Level 4: Community Organizer',
    'NSQF Level 5: Senior Community Organizer',
  ],
  'Spiritual Advisor': [
    'NSQF Level 5: Spiritual Advisor',
    'NSQF Level 6: Senior Spiritual Advisor',
  ],
  'Career Counselor': [
    'NSQF Level 5: Career Counselor',
    'NSQF Level 6: Senior Career Counselor',
  ],
  'Wellness Coach': [
    'NSQF Level 4: Wellness Coach',
    'NSQF Level 5: Professional Wellness Coach',
  ],
  'Sports Medicine': [
    'NSQF Level 6: Sports Medicine Specialist',
    'NSQF Level 7: Senior Sports Medicine Specialist',
  ],
  'Athletic Director': [
    'NSQF Level 6: Athletic Director',
    'NSQF Level 7: Senior Athletic Director',
  ],
  'Sports Analyst': [
    'NSQF Level 5: Sports Analyst',
    'NSQF Level 6: Senior Sports Analyst',
  ],
  'Athletic Trainer': [
    'NSQF Level 4: Athletic Trainer',
    'NSQF Level 5: Professional Athletic Trainer',
  ],
  'Sports Psychologist': [
    'NSQF Level 6: Sports Psychologist',
    'NSQF Level 7: Senior Sports Psychologist',
  ],
  'Learning Specialist': [
    'NSQF Level 5: Learning Specialist',
    'NSQF Level 6: Senior Learning Specialist',
  ],
  'Cognitive Scientist': [
    'NSQF Level 7: Cognitive Scientist',
    'NSQF Level 8: Senior Cognitive Scientist',
  ],
  'Vocal Coach': [
    'NSQF Level 4: Vocal Coach',
    'NSQF Level 5: Professional Vocal Coach',
  ],
  Musicologist: [
    'NSQF Level 6: Musicologist',
    'NSQF Level 7: Senior Musicologist',
  ],
  'Sound Engineer': [
    'NSQF Level 5: Sound Engineer',
    'NSQF Level 6: Senior Sound Engineer',
  ],
  'Audio Engineer': [
    'NSQF Level 5: Audio Engineer',
    'NSQF Level 6: Senior Audio Engineer',
  ],
  'Recording Engineer': [
    'NSQF Level 5: Recording Engineer',
    'NSQF Level 6: Senior Recording Engineer',
  ],
  'Music Technician': [
    'NSQF Level 4: Music Technician',
    'NSQF Level 5: Senior Music Technician',
  ],
  Tuner: ['NSQF Level 3: Tuner', 'NSQF Level 4: Professional Tuner'],
  Acoustician: [
    'NSQF Level 6: Acoustician',
    'NSQF Level 7: Senior Acoustician',
  ],
  'Music Director': [
    'NSQF Level 6: Music Director',
    'NSQF Level 7: Senior Music Director',
  ],
  Songwriter: [
    'NSQF Level 5: Songwriter',
    'NSQF Level 6: Professional Songwriter',
  ],
  Arranger: ['NSQF Level 5: Arranger', 'NSQF Level 6: Senior Arranger'],
  'Orchestra Member': [
    'NSQF Level 5: Orchestra Member',
    'NSQF Level 6: Principal Orchestra Member',
  ],
  'Session Musician': [
    'NSQF Level 4: Session Musician',
    'NSQF Level 5: Professional Session Musician',
  ],
  Performer: [
    'NSQF Level 4: Performer',
    'NSQF Level 5: Professional Performer',
  ],
  'Recording Artist': [
    'NSQF Level 5: Recording Artist',
    'NSQF Level 6: Professional Recording Artist',
  ],
  Conductor: ['NSQF Level 6: Conductor', 'NSQF Level 7: Senior Conductor'],
  Visualizer: ['NSQF Level 5: Visualizer', 'NSQF Level 6: Senior Visualizer'],
  'Game Designer': [
    'NSQF Level 5: Game Designer',
    'NSQF Level 6: Senior Game Designer',
  ],
  'Forensic Artist': [
    'NSQF Level 5: Forensic Artist',
    'NSQF Level 6: Senior Forensic Artist',
  ],
  'Medical Illustrator': [
    'NSQF Level 5: Medical Illustrator',
    'NSQF Level 6: Senior Medical Illustrator',
  ],
  'Textile Designer': [
    'NSQF Level 4: Textile Designer',
    'NSQF Level 5: Professional Textile Designer',
  ],
  'Brand Designer': [
    'NSQF Level 5: Brand Designer',
    'NSQF Level 6: Senior Brand Designer',
  ],
  'Art Director': [
    'NSQF Level 6: Art Director',
    'NSQF Level 7: Senior Art Director',
  ],
  'Creative Director': [
    'NSQF Level 7: Creative Director',
    'NSQF Level 8: Senior Creative Director',
  ],
  'Landscape Architect': [
    'NSQF Level 6: Landscape Architect',
    'NSQF Level 7: Senior Landscape Architect',
  ],
  'Building Designer': [
    'NSQF Level 5: Building Designer',
    'NSQF Level 6: Senior Building Designer',
  ],
  'Maritime Officer': [
    'NSQF Level 5: Maritime Officer',
    'NSQF Level 6: Senior Maritime Officer',
  ],
  Naturalist: ['NSQF Level 5: Naturalist', 'NSQF Level 6: Senior Naturalist'],
  'Field Researcher': [
    'NSQF Level 5: Field Researcher',
    'NSQF Level 6: Senior Field Researcher',
  ],
  'Conservation Biologist': [
    'NSQF Level 6: Conservation Biologist',
    'NSQF Level 7: Senior Conservation Biologist',
  ],
  'Environmental Consultant': [
    'NSQF Level 6: Environmental Consultant',
    'NSQF Level 7: Senior Environmental Consultant',
  ],
  'Environmental Manager': [
    'NSQF Level 6: Environmental Manager',
    'NSQF Level 7: Senior Environmental Manager',
  ],
  'Sustainability Specialist': [
    'NSQF Level 5: Sustainability Specialist',
    'NSQF Level 6: Senior Sustainability Specialist',
  ],
  'Sustainability Consultant': [
    'NSQF Level 6: Sustainability Consultant',
    'NSQF Level 7: Senior Sustainability Consultant',
  ],
  'Green Building Specialist': [
    'NSQF Level 6: Green Building Specialist',
    'NSQF Level 7: Senior Green Building Specialist',
  ],
  'Renewable Energy Specialist': [
    'NSQF Level 6: Renewable Energy Specialist',
    'NSQF Level 7: Senior Renewable Energy Specialist',
  ],
  'Environmental Policy': [
    'NSQF Level 6: Environmental Policy Analyst',
    'NSQF Level 7: Senior Environmental Policy Analyst',
  ],
  Taxonomist: ['NSQF Level 6: Taxonomist', 'NSQF Level 7: Senior Taxonomist'],
  'Museum Curator': [
    'NSQF Level 6: Museum Curator',
    'NSQF Level 7: Senior Museum Curator',
  ],
  'Animal Behaviorist': [
    'NSQF Level 6: Animal Behaviorist',
    'NSQF Level 7: Senior Animal Behaviorist',
  ],
  'Wildlife Manager': [
    'NSQF Level 5: Wildlife Manager',
    'NSQF Level 6: Senior Wildlife Manager',
  ],
  'Team Builder': [
    'NSQF Level 5: Team Builder',
    'NSQF Level 6: Senior Team Builder',
  ],
  'Organizational Development': [
    'NSQF Level 6: Organizational Development Specialist',
    'NSQF Level 7: Senior Organizational Development Specialist',
  ],
  'Leadership Consultant': [
    'NSQF Level 6: Leadership Consultant',
    'NSQF Level 7: Senior Leadership Consultant',
  ],
  Coach: ['NSQF Level 4: Coach', 'NSQF Level 5: Professional Coach'],
  Lexicographer: [
    'NSQF Level 6: Lexicographer',
    'NSQF Level 7: Senior Lexicographer',
  ],
  'Literary Critic': [
    'NSQF Level 6: Literary Critic',
    'NSQF Level 7: Senior Literary Critic',
  ],
  'Publishing Professional': [
    'NSQF Level 5: Publishing Associate',
    'NSQF Level 6: Publishing Professional',
  ],
  'Content Manager': [
    'NSQF Level 5: Content Manager',
    'NSQF Level 6: Senior Content Manager',
  ],
  Proofreader: [
    'NSQF Level 4: Proofreader',
    'NSQF Level 5: Professional Proofreader',
  ],
  'Movement Therapist': [
    'NSQF Level 5: Movement Therapist',
    'NSQF Level 6: Senior Movement Therapist',
  ],
  'Music Therapist': [
    'NSQF Level 5: Music Therapist',
    'NSQF Level 6: Senior Music Therapist',
  ],
  'Mime Artist': [
    'NSQF Level 4: Mime Artist',
    'NSQF Level 5: Professional Mime Artist',
  ],
  'Performance Artist': [
    'NSQF Level 4: Performance Artist',
    'NSQF Level 5: Professional Performance Artist',
  ],
  'HR Development': [
    'NSQF Level 5: HR Development Associate',
    'NSQF Level 6: HR Development Specialist',
  ],
}

/**
 * Get NSQF roles for a specific vocational path
 *
 * @param {string} vocationalPath - The vocational path name
 * @returns {Array<string>} Array of NSQF-aligned roles associated with the vocational path
 */
export function getNSQFRolesForVocationalPath(vocationalPath) {
  return nsqfRoleMapping[vocationalPath] || []
}

/**
 * Get NSQF roles mapped to vocational paths from skills-vocational mapping
 *
 * @param {Array<Object>} skillsVocationalMapping - Array of {skill, vocationalPaths} objects
 * @returns {Array<Object>} Array of {vocationalPath, nsqfRoles} objects
 */
export function getNSQFRoleMapping(skillsVocationalMapping) {
  if (!skillsVocationalMapping || skillsVocationalMapping.length === 0) {
    return []
  }

  // Collect all vocational paths from the skills-vocational mapping
  const allVocationalPaths = skillsVocationalMapping.flatMap(
    item => item.vocationalPaths
  )

  // Create a map of unique vocational paths to their NSQF roles
  const vocationalNSQFMap = new Map()

  allVocationalPaths.forEach(path => {
    if (!vocationalNSQFMap.has(path)) {
      const nsqfRoles = getNSQFRolesForVocationalPath(path)
      if (nsqfRoles.length > 0) {
        vocationalNSQFMap.set(path, nsqfRoles)
      }
    }
  })

  // Convert to array format
  return Array.from(vocationalNSQFMap.entries()).map(
    ([vocationalPath, nsqfRoles]) => ({
      vocationalPath,
      nsqfRoles,
    })
  )
}

/**
 * Get all unique NSQF roles from vocational paths
 *
 * @param {Array<Object>} skillsVocationalMapping - Array of {skill, vocationalPaths} objects
 * @returns {Array<string>} Array of unique NSQF roles
 */
export function getAllNSQFRoles(skillsVocationalMapping) {
  const nsqfRoleMapping = getNSQFRoleMapping(skillsVocationalMapping)
  const allRoles = nsqfRoleMapping.flatMap(item => item.nsqfRoles)
  // Remove duplicates while preserving order
  return [...new Set(allRoles)]
}

/**
 * Maps roles to NSQF levels per intelligence domain.
 * Returns structured NSQF-aligned role mapping.
 *
 * @param {Object} rolesByIntelligence - Object mapping intelligence domains to arrays of roles
 * @param {Object} roleNsqfMap - Object mapping role names to NSQF levels (defaults to ROLE_TO_NSQF)
 * @returns {Object} Object mapping intelligence domains to arrays of {role, nsqf_level} objects
 */
export function mapRolesToNSQF(
  rolesByIntelligence,
  roleNsqfMap = ROLE_TO_NSQF
) {
  const nsqfMapping = {}

  for (const [intelligence, roles] of Object.entries(rolesByIntelligence)) {
    nsqfMapping[intelligence] = []

    for (const role of roles) {
      const nsqfLevel = roleNsqfMap[role] ?? null
      nsqfMapping[intelligence].push({
        role,
        nsqf_level: nsqfLevel,
      })
    }
  }

  return nsqfMapping
}

/**
 * Maps hybrid roles to NSQF levels.
 *
 * @param {Array<string>} hybridRoles - Array of hybrid role names
 * @param {Object} roleNsqfMap - Object mapping role names to NSQF levels (defaults to ROLE_TO_NSQF)
 * @returns {Array<Object>} Array of {role, nsqf_level} objects
 */
export function mapHybridRolesToNSQF(hybridRoles, roleNsqfMap = ROLE_TO_NSQF) {
  return hybridRoles.map(role => ({
    role,
    nsqf_level: roleNsqfMap[role] ?? null,
  }))
}

/**
 * Get NSQF level for a specific role
 *
 * @param {string} role - The role name
 * @returns {number|null} NSQF level for the role, or null if not mapped
 */
export function getNSQFLevelForRole(role) {
  return ROLE_TO_NSQF[role] ?? null
}
