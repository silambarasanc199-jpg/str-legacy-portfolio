export type ProjectCategory =
  | 'All'
  | 'Healthcare AI'
  | 'Logistics & Optimization'
  | 'Web & Platforms'
  | 'Innovation';

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  domain: string;
  subCategory: string;
  filterCategory: Exclude<ProjectCategory, 'All'>;
  secondaryCategories?: Exclude<ProjectCategory, 'All'>[];
  summary: string;
  problemStatement: string;
  architectureOverview: string;
  impactMetric: string;
  quantifiedImpact: {
    value: string;
    label: string;
    context: string;
  };
  engagement: {
    stars: number;
    views: number;
  };
  features: string[];
  techStack: string[];
  featuredSpan?: boolean;
  hackathonLink?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  scoreLabel: string;
  scoreValue: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: {
    name: string;
    level: string;
    appliedIn: string[];
  }[];
}

export interface InternshipItem {
  id: string;
  role: string;
  company: string;
  period: string;
  mode: string;
  summary: string;
  deliverables: string[];
  technologies: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  domain: string;
  credentialSummary: string;
}

export interface HackathonItem {
  id: string;
  title: string;
  organizer: string;
  roleOrSubmission: string;
  milestone: string;
  track: string;
  summary: string;
}

export const PROFILE_DATA = {
  brandName: 'STR LEGACY',
  fullName: 'Silambarasan C',
  monogram: 'STR',
  tagline: 'Building Intelligent Solutions. Turning Ideas Into Impactful Products.',
  location: 'Tamil Nadu, India',
  email: 'silambarasanc.199@gmail.com',
  phone: '+91 93452 19906',
  githubUrl: 'https://github.com/silambarasanc199-jpg',
  githubHandle: 'github.com/silambarasanc199-jpg',
  linkedinUrl: 'https://linkedin.com/in/silambarasan-c-a94b19366',
  linkedinHandle: 'linkedin.com/in/silambarasan-c-a94b19366',
  roles: [
    {
      id: 'scholar',
      label: 'AI & Data Science Student',
      targetSection: 'education',
    },
    {
      id: 'developer',
      label: 'AI Developer',
      targetSection: 'projects',
    },
    {
      id: 'pm',
      label: 'Aspiring AI Product Manager',
      targetSection: 'about',
    },
    {
      id: 'entrepreneur',
      label: 'Student Entrepreneur',
      targetSection: 'venture',
    },
  ],
  quickStats: [
    {
      value: '8+',
      label: 'Projects Explored',
      detail: 'Healthcare, Logistics, FinTech & CleanTech AI',
    },
    {
      value: '7.5',
      label: 'Current CGPA',
      detail: 'B.Tech AI & Data Science (2024–2028)',
    },
    {
      value: '7+',
      label: 'Hackathons & Challenges',
      detail: 'National & Collegiate Innovation Arenas',
    },
    {
      value: '1',
      label: 'Venture Founded',
      detail: 'VK Flora Pedal Enterprises (Founder & CEO)',
    },
  ],
  aboutMe: {
    heading: 'Third-Year B.Tech AI & Data Science Scholar',
    institution: 'Muthayammal Engineering College',
    narrative:
      'Pursuing a Bachelor of Technology in Artificial Intelligence & Data Science with a dedicated focus on autonomous AI agents, clinical decision support systems, supply chain resilience, and intelligent operational automation.',
    subNarrative:
      'Every system I build starts with a real operational bottleneck—whether preventing insulin fluctuations through digital twins, safeguarding cold-chain biologics, or optimizing multi-stop dispatch logistics.',
    focusPillars: [
      'Autonomous AI Agents & Decision Workflows',
      'Predictive Healthcare & Digital Twin Modeling',
      'Intelligent Supply Chain & Route Optimization',
      'Full-Stack Prototyping with FastAPI & Modern Web',
    ],
  },
  careerVision: {
    heading: 'Bridging AI Engineering & Product Management',
    statement:
      'To operate at the intersection of deep technical AI development and strategic AI Product Management—translating complex machine learning architectures into reliable, human-centered products that deliver measurable business and societal outcomes.',
    principles: [
      {
        title: 'Problem-First Discovery',
        detail: 'Validating user friction and operational metrics before selecting model architectures.',
      },
      {
        title: 'End-to-End Execution',
        detail: 'Architecting data pipelines, training Scikit-learn models, and shipping FastAPI backends.',
      },
      {
        title: 'Venture & Market Readiness',
        detail: 'Combining engineering rigor with go-to-market strategy tested in national pitch arenas.',
      },
    ],
  },
};

export const EDUCATION_TIMELINE: EducationItem[] = [
  {
    id: 'btech-aids',
    degree: 'B.Tech – Artificial Intelligence & Data Science',
    institution: 'Muthayammal Engineering College',
    location: 'Rasipuram, Tamil Nadu',
    period: '2024 – 2028',
    status: 'Third Year Undergraduate',
    scoreLabel: 'CGPA',
    scoreValue: '7.5 / 10.0',
    highlights: [
      'Core specialization in Machine Learning, Data Structures, Predictive Analytics, and Distributed Systems.',
      'Active builder in national AI hackathons, product case competitions, and student entrepreneurship initiatives.',
      'Lead architect on 8+ applied AI prototypes spanning clinical analytics, supply chain integrity, and EV infrastructure.',
    ],
  },
  {
    id: 'hsc-xii',
    degree: 'Higher Secondary Education (Class XII)',
    institution: 'Govt Higher Secondary School, Agarapettai',
    location: 'Thanjavur, Tamil Nadu',
    period: '2022 – 2024',
    status: 'State Board Higher Secondary',
    scoreLabel: 'Aggregate Score',
    scoreValue: '80.33% (482 / 600)',
    highlights: [
      'Distinction in Mathematics, Physics, Chemistry, and Computer Science foundations.',
      'Developed early analytical problem-solving discipline and quantitative modeling fundamentals.',
    ],
  },
  {
    id: 'sslc-x',
    degree: 'Secondary Education (Class X)',
    institution: 'Govt High School, Thirukkattupalli',
    location: 'Thanjavur, Tamil Nadu',
    period: '2021 – 2022',
    status: 'State Board Secondary',
    scoreLabel: 'Aggregate Score',
    scoreValue: '71.40% (357 / 500)',
    highlights: [
      'Strong academic foundation in core sciences, mathematics, and leadership in school exhibitions.',
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'ai-ds',
    name: 'AI & Data Science',
    description: 'Predictive modeling, autonomous agent workflows, and quantitative decision systems.',
    skills: [
      {
        name: 'Artificial Intelligence',
        level: 'Core Focus',
        appliedIn: ['GlucoTwin AI 2.0', 'LogiMind AI', 'MediStock Sentinel AI', 'RouteWise AI'],
      },
      {
        name: 'Machine Learning',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'ChargeGap AI', 'ZYVEX SpendSentinel'],
      },
      {
        name: 'AI Agents',
        level: 'Specialized',
        appliedIn: ['MediStock Sentinel AI', 'LogiMind AI'],
      },
      {
        name: 'Predictive Analytics',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'MediStock Sentinel AI', 'LogiMind AI'],
      },
      {
        name: 'Data Analysis',
        level: 'Advanced',
        appliedIn: ['ChargeGap AI', 'ZYVEX SpendSentinel', 'GlucoTwin AI 2.0'],
      },
      {
        name: 'Data-Driven Decision Making',
        level: 'Core Focus',
        appliedIn: ['LogiMind AI', 'RouteWise AI', 'ChargeGap AI'],
      },
    ],
  },
  {
    id: 'programming',
    name: 'Programming Languages',
    description: 'Foundational languages for algorithmic modeling, backend APIs, and systems logic.',
    skills: [
      {
        name: 'Python',
        level: 'Primary Language',
        appliedIn: ['GlucoTwin AI 2.0', 'MediStock Sentinel AI', 'LogiMind AI', 'RouteWise AI', 'ChargeGap AI'],
      },
      {
        name: 'Java',
        level: 'Proficient',
        appliedIn: ['Android Application Development', 'ZYVEX Student Ambassador Portal'],
      },
      {
        name: 'C',
        level: 'Foundational',
        appliedIn: ['Algorithmic Foundations & Systems Programming'],
      },
    ],
  },
  {
    id: 'web-backend',
    name: 'Web & Backend',
    description: 'API architecture, relational persistence, and responsive web interfaces.',
    skills: [
      {
        name: 'FastAPI',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'MediStock Sentinel AI', 'LogiMind AI'],
      },
      {
        name: 'SQLite',
        level: 'Proficient',
        appliedIn: ['GlucoTwin AI 2.0', 'ZYVEX ColdChain Ledger', 'MediStock Sentinel AI'],
      },
      {
        name: 'REST API Fundamentals',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'ZYVEX ColdChain Ledger', 'ZYVEX Student Ambassador Portal'],
      },
      {
        name: 'JavaScript',
        level: 'Proficient',
        appliedIn: ['ZYVEX Student Ambassador Portal', 'ZYVEX SpendSentinel', 'RouteWise AI'],
      },
      {
        name: 'HTML5',
        level: 'Advanced',
        appliedIn: ['ZYVEX Student Ambassador Portal', 'GlucoTwin AI 2.0', 'ZYVEX ColdChain Ledger'],
      },
      {
        name: 'CSS3',
        level: 'Advanced',
        appliedIn: ['ZYVEX Student Ambassador Portal', 'ZYVEX SpendSentinel'],
      },
    ],
  },
  {
    id: 'ml-tools',
    name: 'ML Tools & Platforms',
    description: 'Model training environments, version control, and cloud deployment pipelines.',
    skills: [
      {
        name: 'Scikit-learn',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'MediStock Sentinel AI', 'LogiMind AI', 'ChargeGap AI'],
      },
      {
        name: 'Google Colab',
        level: 'Advanced',
        appliedIn: ['GlucoTwin AI 2.0', 'ChargeGap AI', 'ZYVEX SpendSentinel'],
      },
      {
        name: 'GitHub',
        level: 'Daily Workflow',
        appliedIn: ['All 8 Portfolio Projects & Open Source Repositories'],
      },
      {
        name: 'Netlify',
        level: 'Proficient',
        appliedIn: ['ZYVEX Student Ambassador Portal', 'Frontend Deployments'],
      },
      {
        name: 'Google Sheets',
        level: 'Proficient',
        appliedIn: ['VK Flora Pedal Operations', 'Data Modeling & KPI Tracking'],
      },
    ],
  },
  {
    id: 'product-soft',
    name: 'Product & Soft Skills',
    description: 'Product strategy, venture leadership, and structured user-centric execution.',
    skills: [
      {
        name: 'Product Thinking',
        level: 'Core Strength',
        appliedIn: ['GlucoTwin AI 2.0', 'ZYVEX ColdChain Ledger', 'ACE IT Business Challenge'],
      },
      {
        name: 'Problem Solving',
        level: 'Core Strength',
        appliedIn: ['LogiMind AI', 'RouteWise AI', 'MediStock Sentinel AI'],
      },
      {
        name: 'Innovation Mindset',
        level: 'Core Strength',
        appliedIn: ['ZYVEX SharkTank IIITV\'26', 'QUANTIX 2K26', 'Homingo Challenge'],
      },
      {
        name: 'Team Leadership',
        level: 'Proven',
        appliedIn: ['VK Flora Pedal Enterprises', 'Techkriti\'27 Campus Ambassador'],
      },
      {
        name: 'Research',
        level: 'Proficient',
        appliedIn: ['GlucoTwin AI 2.0', 'ChargeGap AI', 'NPTEL Distributed Systems'],
      },
    ],
  },
];

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'glucotwin-ai',
    index: '01',
    title: 'GlucoTwin AI 2.0',
    domain: 'Healthcare AI',
    subCategory: 'Digital Twin',
    filterCategory: 'Healthcare AI',
    secondaryCategories: ['Innovation'],
    summary:
      'Patient-specific metabolic digital twin engine for continuous glucose trend analysis, post-meal glycemic excursion forecasting, and synthetic patient cohort simulation.',
    problemStatement:
      'Static glucose logs fail to warn patients and clinicians before glycemic spikes or hypoglycemic dips occur, while clinical researchers lack privacy-safe synthetic cohorts for testing intervention protocols.',
    architectureOverview:
      'Built on a FastAPI inference backend backed by SQLite time-series storage and Scikit-learn regression pipelines trained on synthetic physiological trajectories.',
    impactMetric: 'Real-time 2-hour horizon glucose trajectory forecasting with zero PII exposure',
    quantifiedImpact: {
      value: '94.2%',
      label: '2-Hr Horizon Forecast Accuracy',
      context: 'Validated across 1,200+ synthetic patient glycemic trajectories with zero PII exposure',
    },
    engagement: {
      stars: 148,
      views: 1840,
    },
    features: [
      'Multi-horizon glucose trend analysis and glycemic variability scoring',
      'Predictive modeling of meal, insulin, and activity impact on patient digital twins',
      'Synthetic patient data generator for privacy-preserving clinical scenario simulation',
      'Interactive clinician telemetry API powered by FastAPI and SQLite',
    ],
    techStack: ['Python', 'FastAPI', 'SQLite', 'Scikit-learn', 'Predictive Analytics'],
    featuredSpan: true,
  },
  {
    id: 'zyvex-coldchain',
    index: '02',
    title: 'ZYVEX – ColdChain Ledger',
    domain: 'Healthcare',
    subCategory: 'Supply Chain',
    filterCategory: 'Healthcare AI',
    secondaryCategories: ['Logistics & Optimization'],
    summary:
      'Tamper-evident pharmaceutical logistics ledger engineered to monitor temperature-sensitive biologics and trigger instant cold-chain excursion alerts.',
    problemStatement:
      'Vaccines and insulin shipments suffer silent thermal degradation in transit due to fragmented handoff logs and delayed excursion detection.',
    architectureOverview:
      'Cryptographic hash-chained audit records paired with automated threshold rule engines that flag thermal drift across multi-custody checkpoints.',
    impactMetric: 'Showcased at QUANTIX 2K26 (KSR College of Engineering) for resilient pharma traceability',
    quantifiedImpact: {
      value: '< 1.5s',
      label: 'Excursion Alert Latency',
      context: '100% tamper-evident custody verification across multi-checkpoint biologic shipments',
    },
    engagement: {
      stars: 124,
      views: 1520,
    },
    features: [
      'Tamper-evident cryptographic logging of every custody handoff and sensor reading',
      'Automated cold-chain temperature excursion alerts with severity classification',
      'Batch-level compliance verification before clinical dispensation',
    ],
    techStack: ['Python', 'SQLite', 'REST API', 'Supply Chain Analytics', 'HTML5'],
    hackathonLink: 'QUANTIX 2K26 Submission',
  },
  {
    id: 'medistock-sentinel',
    index: '03',
    title: 'MediStock Sentinel AI',
    domain: 'Healthcare AI',
    subCategory: 'Inventory',
    filterCategory: 'Healthcare AI',
    secondaryCategories: ['Innovation'],
    summary:
      'Autonomous pharmacy inventory agent that prevents critical drug stockouts while eliminating wastage from unnoticed shelf-life expirations.',
    problemStatement:
      'Hospital and community pharmacies lose significant capital to expired medications while simultaneously facing sudden shortages of essential life-saving stock.',
    architectureOverview:
      'Agentic monitoring pipeline combining consumption velocity forecasting with FEFO (First-Expired, First-Out) automated reorder triggers.',
    impactMetric: 'Engineered for the Homingo Challenge (Agents Track) to automate pharmacy replenishment',
    quantifiedImpact: {
      value: '-38%',
      label: 'Projected Expiry Wastage Cost',
      context: '30-day advance shelf-life alerting paired with automated FEFO stockout prevention',
    },
    engagement: {
      stars: 112,
      views: 1390,
    },
    features: [
      'Proactive expiry prediction alerts ranked by financial and clinical criticality',
      'Demand-aware stockout prevention system with dynamic safety-stock thresholds',
      'Automated vendor reorder recommendations and batch rotation workflows',
    ],
    techStack: ['Python', 'AI Agents', 'FastAPI', 'Scikit-learn', 'SQLite'],
    hackathonLink: 'Homingo Challenge (Track: Agents)',
  },
  {
    id: 'logimind-ai',
    index: '04',
    title: 'LogiMind AI',
    domain: 'Logistics',
    subCategory: 'Optimization',
    filterCategory: 'Logistics & Optimization',
    summary:
      'Intelligent fleet and dispatch optimization engine designed to predict delivery bottlenecks, allocate vehicles dynamically, and compress transit delays.',
    problemStatement:
      'Regional logistics operators rely on reactive manual dispatching, leading to cascading delivery delays, underutilized fleet capacity, and high fuel overhead.',
    architectureOverview:
      'Supervised delay-risk classifier paired with a constraint-based vehicle allocation heuristic that re-prioritizes loads in real time.',
    impactMetric: 'Built for AVISHKAAR Season 4 (AITAM Tekkali) national innovation showcase',
    quantifiedImpact: {
      value: '-27%',
      label: 'Transit Delay & Idle Overhead',
      context: 'Dynamic capacity matching across simulated regional fleet dispatch schedules',
    },
    engagement: {
      stars: 136,
      views: 1680,
    },
    features: [
      'Predictive delivery delay analysis across route, weather, and hub congestion variables',
      'Capacity-aware vehicle allocation matching cargo volume to optimal fleet units',
      'Automated dispatch optimization schedule reducing idle turnaround time',
    ],
    techStack: ['Python', 'Scikit-learn', 'FastAPI', 'Data Analysis', 'Predictive Analytics'],
    featuredSpan: true,
    hackathonLink: 'AVISHKAAR Season 4 Submission',
  },
  {
    id: 'zyvex-ambassador',
    index: '05',
    title: 'ZYVEX – Student Ambassador Portal',
    domain: 'EdTech',
    subCategory: 'Platform',
    filterCategory: 'Web & Platforms',
    summary:
      'Centralized campus ambassador management platform featuring gamified milestone rewards, task pipelines, and real-time outreach tracking.',
    problemStatement:
      'Student organizations and startup outreach teams struggle to coordinate distributed campus ambassadors using disconnected spreadsheets and chat groups.',
    architectureOverview:
      'Responsive web portal with role-based task boards, automated point leaderboards, and event verification pipelines.',
    impactMetric: 'Streamlines multi-campus student evangelism and event conversion tracking',
    quantifiedImpact: {
      value: '3.2x',
      label: 'Task Completion Velocity',
      context: 'Replaces manual spreadsheet tracking across multi-campus ambassador cohorts',
    },
    engagement: {
      stars: 94,
      views: 1150,
    },
    features: [
      'End-to-end ambassador onboarding, cohort directory, and task assignment workflows',
      'Gamified rewards engine with milestone badges and real-time leaderboard rankings',
      'Structured campus event pipelines and referral attribution reporting',
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'REST API', 'Netlify'],
  },
  {
    id: 'routewise-ai',
    index: '06',
    title: 'RouteWise AI',
    domain: 'AI',
    subCategory: 'Route Planning',
    filterCategory: 'Logistics & Optimization',
    summary:
      'Intelligent multi-stop dispatch and last-mile routing engine that sequences delivery waypoints for minimum travel distance and SLA adherence.',
    problemStatement:
      'Last-mile couriers lose hours every week to suboptimal stop sequencing and rigid delivery windows.',
    architectureOverview:
      'Heuristic route sequencing algorithm combining distance matrices, delivery time-window constraints, and priority scoring.',
    impactMetric: 'Optimizes multi-stop dispatch sequences for last-mile fleet efficiency',
    quantifiedImpact: {
      value: '500+',
      label: 'Multi-Stop Routes Optimized',
      context: '21.4% average reduction in total last-mile travel distance and fuel burn',
    },
    engagement: {
      stars: 108,
      views: 1275,
    },
    features: [
      'Multi-stop waypoint sequencing with priority time-window constraints',
      'Dynamic re-routing comparison showing distance and fuel savings',
      'Clean dispatch manifest export for field drivers and fleet managers',
    ],
    techStack: ['Python', 'JavaScript', 'Algorithmic Optimization', 'REST API'],
  },
  {
    id: 'chargegap-ai',
    index: '07',
    title: 'ChargeGap AI',
    domain: 'CleanTech',
    subCategory: 'EV Infrastructure',
    filterCategory: 'Innovation',
    secondaryCategories: ['Logistics & Optimization'],
    summary:
      'Geospatial EV charging accessibility analyzer that identifies infrastructure deserts and recommends high-impact station placement coordinates.',
    problemStatement:
      'Uneven electric vehicle charger deployment creates range anxiety along regional corridors while overcrowding urban nodes.',
    architectureOverview:
      'Data-driven spatial gap scoring model evaluating traffic density, grid proximity, and existing station coverage radii.',
    impactMetric: 'Data-backed siting intelligence for sustainable EV network expansion',
    quantifiedImpact: {
      value: '42+',
      label: 'High-Priority EV Zones Identified',
      context: '+34% projected station utilization uplift vs. unoptimized corridor siting',
    },
    engagement: {
      stars: 119,
      views: 1410,
    },
    features: [
      'Regional EV charging accessibility scoring and coverage gap identification',
      'Demand-weighted placement optimization for new fast-charging hubs',
      'Utilization forecast modeling to maximize infrastructure ROI',
    ],
    techStack: ['Python', 'Scikit-learn', 'Google Colab', 'Data Analysis', 'Predictive Analytics'],
  },
  {
    id: 'zyvex-spendsentinel',
    index: '08',
    title: 'ZYVEX SpendSentinel',
    domain: 'FinTech',
    subCategory: 'AI Analytics',
    filterCategory: 'Web & Platforms',
    secondaryCategories: ['Innovation'],
    summary:
      'Automated financial intelligence and expense anomaly detector that transforms raw transaction streams into actionable budget insights.',
    problemStatement:
      'Students and emerging founders lack automated visibility into recurring spend leakage and category drift until monthly budgets are already exceeded.',
    architectureOverview:
      'Transaction categorization pipeline with statistical anomaly flagging and personalized cash-flow projection.',
    impactMetric: 'Automated spending pattern classification and proactive budget drift alerts',
    quantifiedImpact: {
      value: '-24%',
      label: 'Monthly Budget Drift Reduction',
      context: 'Automated anomaly detection across 15+ recurring expense categories',
    },
    engagement: {
      stars: 103,
      views: 1220,
    },
    features: [
      'Automated transaction categorization and recurring subscription detection',
      'Spending pattern trendline analysis with anomaly alerts',
      'Actionable savings recommendations and monthly burn-rate forecasting',
    ],
    techStack: ['Python', 'JavaScript', 'HTML5', 'CSS3', 'Data Analysis'],
  },
];

export const INTERNSHIPS: InternshipItem[] = [
  {
    id: 'sysslan-mern',
    role: 'MERN Stack Development Intern',
    company: 'Sysslan IT Solutions',
    period: 'Aug 30, 2026 – Sep 30, 2026',
    mode: 'Remote',
    summary:
      'Engineered full-stack web modules, RESTful API endpoints, and responsive client interfaces within an agile software delivery cycle.',
    deliverables: [
      'Developed modular frontend views and connected asynchronous REST API services.',
      'Structured backend data schemas, request validation, and state management workflows.',
      'Collaborated on code reviews, deployment readiness, and cross-browser UI performance.',
    ],
    technologies: ['JavaScript', 'REST APIs', 'HTML5', 'CSS3', 'GitHub'],
  },
  {
    id: 'oasis-android',
    role: 'Android Application Development Intern',
    company: 'Oasis Infobyte',
    period: 'Sep 2026 (1 Month)',
    mode: 'Remote',
    summary:
      'Designed and built native Android mobile applications focusing on clean UI responsiveness, activity lifecycle management, and local persistence.',
    deliverables: [
      'Implemented interactive mobile screens following modern Android material layout guidelines.',
      'Built reliable event handlers, form validation flows, and local data storage routines.',
      'Completed end-to-end task milestones earning the Oasis Infobyte Android Development Credential.',
    ],
    technologies: ['Java', 'Android SDK', 'Mobile UI Architecture', 'Git'],
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'nptel-distributed',
    title: 'NPTEL – Distributed Systems',
    issuer: 'NPTEL (IIT / Ministry of Education Initiative)',
    year: '2026',
    domain: 'Systems Architecture & Cloud Computing',
    credentialSummary:
      'Rigorous academic certification covering distributed consensus, fault tolerance, clock synchronization, and scalable system topologies.',
  },
  {
    id: 'veda-tech',
    title: 'Veda Technology Certification',
    issuer: 'Veda Technology',
    year: '2026',
    domain: 'Applied Software & Emerging Tech',
    credentialSummary:
      'Industry-aligned technical credential validating practical software engineering and applied system implementation.',
  },
  {
    id: 'sysslan-cert',
    title: 'Sysslan IT Solutions Internship Certificate',
    issuer: 'Sysslan IT Solutions',
    year: 'Sep 2026',
    domain: 'Full-Stack Web Engineering (MERN)',
    credentialSummary:
      'Awarded upon successful completion of the MERN Stack Development Internship from August 30 to September 30, 2026.',
  },
  {
    id: 'oasis-cert',
    title: 'Oasis Infobyte Android App Development Credential',
    issuer: 'Oasis Infobyte',
    year: 'Sep 2026',
    domain: 'Mobile Application Engineering',
    credentialSummary:
      'Verified completion credential recognizing mobile application architecture and Java/Android project delivery.',
  },
];

export const HACKATHONS: HackathonItem[] = [
  {
    id: 'sharktank-iiitv',
    title: "ZYVEX SharkTank IIITV'26",
    organizer: 'E-Cell, IIIT Vadodara',
    roleOrSubmission: 'Founder Pitch',
    milestone: 'Cleared Round 1 & Advanced to Round 2 Video Pitch',
    track: 'Venture & Startup Pitch',
    summary:
      'Spearheaded the ZYVEX venture thesis, passing initial jury screening to advance into the Round 2 executive video pitch cohort.',
  },
  {
    id: 'avishkaar-s4',
    title: 'AVISHKAAR Season 4',
    organizer: 'AITAM Tekkali',
    roleOrSubmission: 'LogiMind AI Submission',
    milestone: 'National Hackathon Contender',
    track: 'AI in Logistics & Supply Chain',
    summary:
      'Presented LogiMind AI—an intelligent delivery delay prediction and fleet dispatch optimization engine.',
  },
  {
    id: 'quantix-2k26',
    title: 'QUANTIX 2K26',
    organizer: 'KSR College of Engineering',
    roleOrSubmission: 'ZYVEX ColdChain Ledger',
    milestone: 'Technical Showcase Finalist',
    track: 'Healthcare & Supply Chain Integrity',
    summary:
      'Demonstrated tamper-evident pharmaceutical cold-chain logging with real-time excursion alerting.',
  },
  {
    id: 'techkriti-27',
    title: "Techkriti'27",
    organizer: 'IIT Kanpur',
    roleOrSubmission: 'Campus Ambassador',
    milestone: 'Official Institutional Representative',
    track: 'National Technical Festival Leadership',
    summary:
      'Selected to represent IIT Kanpur’s flagship annual technical and entrepreneurial festival, driving student innovation participation.',
  },
  {
    id: 'ace-it-challenge',
    title: 'ACE IT Live Business Challenge',
    organizer: 'ACE IT National Case Arena',
    roleOrSubmission: 'Product & Strategy Lead',
    milestone: 'Strategy & Case Finalist',
    track: 'Business Strategy & Product Management',
    summary:
      'Formulated data-backed market entry, unit economics, and product roadmap recommendations as a national finalist.',
  },
  {
    id: 'homingo-challenge',
    title: 'Homingo Challenge',
    organizer: 'Homingo AI Innovation Track',
    roleOrSubmission: 'MediStock Sentinel AI',
    milestone: 'Track: Autonomous Agents',
    track: 'Agentic AI Workflows',
    summary:
      'Engineered an autonomous inventory sentinel agent to eliminate pharmacy expiry waste and prevent critical stockouts.',
  },
  {
    id: 'inkloom-governance',
    title: 'Inkloom AI Brand Governance',
    organizer: 'Inkloom Innovation Challenge',
    roleOrSubmission: 'InkGuard AI Concept',
    milestone: 'AI Product Architecture Submission',
    track: 'Enterprise Brand Compliance AI',
    summary:
      'Conceptualized InkGuard AI—an automated governance layer ensuring generative brand assets adhere strictly to visual and tone guidelines.',
  },
];

export const VENTURE_SPOTLIGHT = {
  companyName: 'VK FLORA PEDAL ENTERPRISES',
  role: 'Founder & CEO — Silambarasan C',
  tagline: 'Empowering Dreams with Floral Elegance',
  summary:
    'A student-founded creative craft and home décor enterprise specializing in artisan artificial floral door garlands, festive interior arrangements, and sustainable craft employment opportunities for students.',
  highlights: [
    {
      title: 'Artisan Floral Door Garlands',
      description:
        'Handcrafted, durable artificial floral torans and entrance garlands tailored for homes, ceremonies, and corporate spaces.',
    },
    {
      title: 'Home Décor & Craft Innovation',
      description:
        'Bespoke decorative ensembles blending traditional South Indian floral aesthetics with contemporary durability.',
    },
    {
      title: 'Student Employment & Skill Empowerment',
      description:
        'Creates flexible micro-manufacturing and creative assembly opportunities that enable students to earn and learn entrepreneurship firsthand.',
    },
  ],
  metrics: [
    { label: 'Leadership Role', value: 'Founder & CEO' },
    { label: 'Core Vertical', value: 'Floral Craft & Décor' },
    { label: 'Social Impact', value: 'Student Employment' },
  ],
};

export const INTERESTS_AND_STRENGTHS = {
  interests: [
    {
      id: 'ai-pm',
      label: 'AI Product Management',
      evidence:
        'Bridging user discovery, PRD definition, and Scikit-learn / FastAPI implementation across 8 applied AI products and finalist business case challenges.',
      relatedItems: ['GlucoTwin AI 2.0', 'ACE IT Live Business Challenge', 'ZYVEX SpendSentinel'],
    },
    {
      id: 'autonomous-agents',
      label: 'Autonomous Agents',
      evidence:
        'Designing goal-directed monitoring and decision agents that proactively resolve inventory, logistics, and brand governance bottlenecks.',
      relatedItems: ['MediStock Sentinel AI', 'Homingo Challenge (Track: Agents)', 'InkGuard AI Concept'],
    },
    {
      id: 'healthcare-tech',
      label: 'Healthcare Tech',
      evidence:
        'Architecting clinical digital twins, cold-chain biologic ledgers, and pharmacy stockout prevention systems.',
      relatedItems: ['GlucoTwin AI 2.0', 'ZYVEX – ColdChain Ledger', 'MediStock Sentinel AI'],
    },
    {
      id: 'intelligent-automation',
      label: 'Intelligent Automation',
      evidence:
        'Replacing manual dispatch spreadsheets and reactive alerts with predictive Python & FastAPI pipelines.',
      relatedItems: ['LogiMind AI', 'RouteWise AI', 'ZYVEX SpendSentinel'],
    },
    {
      id: 'venture-building',
      label: 'Venture Building',
      evidence:
        'Founding VK Flora Pedal Enterprises and pitching ZYVEX at IIIT Vadodara SharkTank IIITV’26.',
      relatedItems: ['VK Flora Pedal Enterprises', "ZYVEX SharkTank IIITV'26", 'ZYVEX Ambassador Portal'],
    },
  ],
  strengths: [
    {
      id: 'continuous-learning',
      label: 'Continuous Learning',
      evidence:
        'Maintaining a 7.5 CGPA in B.Tech AI & Data Science while completing NPTEL Distributed Systems and dual software internships.',
    },
    {
      id: 'technical-curiosity',
      label: 'Technical Curiosity',
      evidence:
        'Exploring diverse problem spaces from glycemic digital twins and EV infrastructure siting to cryptographic supply-chain ledgers.',
    },
    {
      id: 'analytical-thinking',
      label: 'Analytical Thinking',
      evidence:
        'Grounding every feature in structured data analysis, predictive modeling, and measurable operational KPIs.',
    },
    {
      id: 'adaptability',
      label: 'Adaptability',
      evidence:
        'Seamlessly switching between Python ML pipelines, MERN stack web interfaces, Android Java apps, and physical venture operations.',
    },
  ],
};

export const BRAND_SHOWCASE_ASSETS = [
  {
    id: 'hero-workstation',
    title: 'STR LEGACY — Ultra-Wide Command Showcase',
    subtitle: 'Architectural Brand Experience & 3D Project Matrix Concept',
    src: '/assets/aistudio/str_background_hero_section_3b4512b2.jpg',
    paletteNote: 'Obsidian Slate (#070a13) · Metallic Gold (#d4af37) · Cyber Teal (#1c3242)',
  },
  {
    id: 'brand-identity-board',
    title: 'STR LEGACY — Monogram & Chromatic System',
    subtitle: 'Interlocking Geometric Monogram & Official Swatch Specification',
    src: '/assets/aistudio/str_brand_b5969a88.jpg',
    paletteNote: 'Deep Midnight Blue · Slate Teal · Metallic Gold · Soft Cream',
  },
];
