import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import {
  BRAND_SHOWCASE_ASSETS,
  CERTIFICATIONS,
  EDUCATION_TIMELINE,
  FEATURED_PROJECTS,
  HACKATHONS,
  INTERNSHIPS,
  PROFILE_DATA,
  ProjectItem,
  VENTURE_SPOTLIGHT,
} from '../data/portfolioData';
import { StrMonogram } from './StrMonogram';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onFilterBySkill: (skill: string) => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onFilterBySkill,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#070a13]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="str-glass-card w-full max-w-2xl rounded-2xl p-6 sm:p-8 border border-[#d4af37]/40 bg-[#0b1120]/95 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/15 pb-4">
          <div>
            <p className="text-xs text-[#d4af37] font-medium tracking-wider uppercase">
              {project.index} · {project.domain} · {project.subCategory}
            </p>
            <h3
              id="modal-project-title"
              className="font-display text-2xl font-bold text-[#f8fafc] mt-1"
            >
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study modal"
            className="p-2 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#e2e8f0] leading-relaxed">
          <p className="text-base text-[#f8fafc]">{project.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#070a13]/70 border border-white/10 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                Operational Problem
              </p>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#070a13]/70 border border-white/10 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
                System Architecture
              </p>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {project.architectureOverview}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#e5c158]">
              Core Capabilities & Engineering Highlights
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#cbd5e1]">
              {project.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#d4af37] font-mono">0{i + 1}.</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold">
                Project Impact ·{' '}
                <span className="font-mono text-[#e5c158] tabular-nums">
                  {project.quantifiedImpact.value}
                </span>{' '}
                {project.quantifiedImpact.label}
              </p>
              <p className="text-xs text-[#94a3b8]">
                {project.quantifiedImpact.context}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {project.techStack.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => {
                    onClose();
                    onFilterBySkill(tech);
                  }}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#1c3242]/60 text-[#38bdf8] hover:bg-[#d4af37]/20 hover:text-[#e5c158] transition-colors cursor-pointer"
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BrandShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRAND_SWATCHES = [
  { name: 'Midnight Obsidian', hex: '#070A13', role: 'Primary Canvas' },
  { name: 'Deep Slate Surface', hex: '#0B1120', role: 'Elevated Structure' },
  { name: 'Cyber Slate Teal', hex: '#1C3242', role: 'Secondary Accent' },
  { name: 'Metallic Luxury Gold', hex: '#D4AF37', role: 'Primary Brand Accent' },
  { name: 'Luminous AI Cyan', hex: '#38BDF8', role: 'Interactive Beam Glow' },
  { name: 'Soft Cream White', hex: '#F8FAFC', role: 'Primary Typography' },
];

export const BrandShowcaseModal: React.FC<BrandShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="STR Legacy Brand Identity System"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#070a13]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="str-glass-card w-full max-w-4xl rounded-2xl p-6 sm:p-8 border border-[#d4af37]/40 bg-[#0b1120]/95 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-4">
          <div className="flex items-center gap-3">
            <StrMonogram className="w-12 h-6" glow />
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-[0.16em] text-[#f8fafc]">
                STR LEGACY — Visual Identity System
              </h3>
              <p className="text-xs text-[#94a3b8]">
                Official Brand Architecture & Chromatic Specification for Silambarasan C
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-Resolution Brand Reference Plates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BRAND_SHOWCASE_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl overflow-hidden border border-[#d4af37]/20 bg-[#070a13] flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#0b1120]">
                <img
                  src={asset.src}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-sm font-semibold text-[#f8fafc]">
                  {asset.title}
                </h4>
                <p className="text-xs text-[#94a3b8]">{asset.subtitle}</p>
                <p className="text-[11px] text-[#d4af37] pt-1 font-mono">
                  {asset.paletteNote}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Color Swatches */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#e5c158]">
            Brand Chromatic Tokens (Click to Copy HEX)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BRAND_SWATCHES.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => copyColor(swatch.hex)}
                className="p-3 rounded-xl bg-[#070a13]/90 border border-white/10 hover:border-[#d4af37]/50 text-left transition-all cursor-pointer group"
              >
                <div
                  className="w-full h-8 rounded-lg mb-2 border border-white/15"
                  style={{ backgroundColor: swatch.hex }}
                />
                <p className="text-xs font-semibold text-[#f8fafc] truncate">
                  {swatch.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono text-[#94a3b8]">
                    {copiedHex === swatch.hex ? 'Copied!' : swatch.hex}
                  </span>
                  {copiedHex === swatch.hex ? (
                    <Check className="w-3 h-3 text-[#d4af37]" />
                  ) : (
                    <Copy className="w-3 h-3 text-[#94a3b8] opacity-60 group-hover:opacity-100" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeDossierModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadResume = () => {
    const resumeContent = `====================================================================
SILAMBARASAN C — STR LEGACY
AI & Data Science Student | AI Developer | Aspiring AI Product Manager | Student Entrepreneur
Location: ${PROFILE_DATA.location}
Email: ${PROFILE_DATA.email} | Phone: ${PROFILE_DATA.phone}
GitHub: ${PROFILE_DATA.githubUrl}
LinkedIn: ${PROFILE_DATA.linkedinUrl}
====================================================================

CAREER OBJECTIVE & VISION
${PROFILE_DATA.careerVision.statement}

EDUCATION
${EDUCATION_TIMELINE.map(
  (ed) => `- ${ed.degree} | ${ed.institution} (${ed.period}) — ${ed.scoreLabel}: ${ed.scoreValue}`
).join('\n')}

FEATURED AI & PRODUCT PROJECTS
${FEATURED_PROJECTS.map(
  (p) =>
    `${p.index}. ${p.title} (${p.domain} | ${p.subCategory})\n   Summary: ${p.summary}\n   Tech Stack: ${p.techStack.join(', ')}`
).join('\n\n')}

INTERNSHIPS
${INTERNSHIPS.map((i) => `- ${i.role} — ${i.company} (${i.period}, ${i.mode})`).join('\n')}

CERTIFICATIONS
${CERTIFICATIONS.map((c) => `- ${c.title} (${c.issuer}, ${c.year})`).join('\n')}

HACKATHONS & ACHIEVEMENTS
${HACKATHONS.map((h) => `- ${h.title} (${h.organizer}) — ${h.roleOrSubmission}: ${h.milestone}`).join('\n')}

ENTREPRENEURSHIP
${VENTURE_SPOTLIGHT.companyName} — ${VENTURE_SPOTLIGHT.role}
Tagline: "${VENTURE_SPOTLIGHT.tagline}"
${VENTURE_SPOTLIGHT.summary}
====================================================================`;

    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Silambarasan_C_STR_Legacy_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Silambarasan C Executive Resume Dossier"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#070a13]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="str-glass-card w-full max-w-3xl rounded-2xl p-6 sm:p-8 border border-[#d4af37]/40 bg-[#0b1120]/95 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37]/15 text-[#d4af37]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-[#f8fafc]">
                Executive Resume Dossier
              </h3>
              <p className="text-xs text-[#94a3b8]">
                {PROFILE_DATA.fullName} · B.Tech AI & Data Science (CGPA 7.5)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#070a13]/80 border border-white/10 space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[#d4af37]">
              Academic Profile
            </p>
            <p className="text-sm font-semibold text-[#f8fafc]">
              B.Tech — AI & Data Science
            </p>
            <p className="text-[#94a3b8]">
              Muthayammal Engineering College (2024–2028) · CGPA: 7.5
            </p>
            <p className="text-[#94a3b8]">
              Class XII: 80.33% (482/600) · Class X: 71.4% (357/500)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#070a13]/80 border border-white/10 space-y-2">
            <p className="font-semibold uppercase tracking-wider text-[#38bdf8]">
              Industry & Venture Highlights
            </p>
            <p className="text-[#f8fafc]">
              • Founder & CEO, VK Flora Pedal Enterprises
            </p>
            <p className="text-[#94a3b8]">
              • MERN Stack Intern — Sysslan IT Solutions
            </p>
            <p className="text-[#94a3b8]">
              • Android Dev Intern — Oasis Infobyte
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070a13]/80 border border-white/10 space-y-2 text-xs">
          <p className="font-semibold uppercase tracking-wider text-[#e5c158]">
            8 Applied AI & Product Systems
          </p>
          <p className="text-[#cbd5e1] leading-relaxed">
            GlucoTwin AI 2.0 · ZYVEX ColdChain Ledger · MediStock Sentinel AI ·
            LogiMind AI · ZYVEX Student Ambassador Portal · RouteWise AI ·
            ChargeGap AI · ZYVEX SpendSentinel
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
          <p className="text-xs text-[#94a3b8]">
            Exports a formatted plain-text CV dossier ready for ATS & recruiter review.
          </p>
          <button
            type="button"
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Resume Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download CV Dossier (.TXT)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export interface CollaborationModule {
  id: string;
  title: string;
  roleTrack: string;
  requiredSkills: string[];
  deliverable: string;
}

export const PROJECT_COLLABORATION_MODULES: Record<string, CollaborationModule[]> = {
  'glucotwin-ai': [
    {
      id: 'gt-ml-calibration',
      title: 'Post-Meal Glycemic Excursion Predictor',
      roleTrack: 'AI & Predictive Modeling',
      requiredSkills: ['Python', 'Scikit-learn', 'Machine Learning', 'Predictive Analytics'],
      deliverable: 'Refine multi-horizon insulin & carbohydrate response curves on synthetic cohorts.',
    },
    {
      id: 'gt-fastapi-stream',
      title: 'FastAPI Telemetry & Time-Series Endpoint Layer',
      roleTrack: 'Backend & API Engineering',
      requiredSkills: ['Python', 'FastAPI', 'SQLite', 'REST API'],
      deliverable: 'Optimize low-latency continuous glucose monitoring (CGM) query endpoints.',
    },
    {
      id: 'gt-clinician-ux',
      title: 'Clinician Decision-Support Triage Interface',
      roleTrack: 'Product & Frontend UX',
      requiredSkills: ['HTML5', 'CSS3', 'JavaScript', 'Product Thinking', 'Data Analysis'],
      deliverable: 'Design intuitive alert thresholds and glycemic variability charts for clinicians.',
    },
  ],
  'zyvex-coldchain': [
    {
      id: 'cc-hash-verifier',
      title: 'Cryptographic Custody Hash-Chain Engine',
      roleTrack: 'Backend & Systems Security',
      requiredSkills: ['Python', 'SQLite', 'REST API'],
      deliverable: 'Strengthen tamper-evident block verification across multi-custody handoffs.',
    },
    {
      id: 'cc-excursion-rules',
      title: 'Thermal Drift & Excursion Alert Classifier',
      roleTrack: 'AI & Supply Chain Analytics',
      requiredSkills: ['Python', 'Predictive Analytics', 'Data Analysis', 'Problem Solving'],
      deliverable: 'Model cumulative thermal exposure budgets for biologic and vaccine vials.',
    },
    {
      id: 'cc-audit-portal',
      title: 'Batch Compliance & Regulatory Audit View',
      roleTrack: 'Web & Product',
      requiredSkills: ['HTML5', 'CSS3', 'JavaScript', 'Product Thinking'],
      deliverable: 'Build one-click batch compliance certificates for pharmacy receiving docks.',
    },
  ],
  'medistock-sentinel': [
    {
      id: 'ms-agent-core',
      title: 'Autonomous FEFO Replenishment Agent',
      roleTrack: 'Agentic AI Workflows',
      requiredSkills: ['Python', 'AI Agents', 'FastAPI', 'Problem Solving'],
      deliverable: 'Orchestrate autonomous reorder triggers when safety-stock thresholds dip.',
    },
    {
      id: 'ms-demand-forecast',
      title: 'Seasonal Drug Velocity & Expiry Forecaster',
      roleTrack: 'Machine Learning & Data Science',
      requiredSkills: ['Python', 'Scikit-learn', 'Predictive Analytics', 'Data Analysis'],
      deliverable: 'Train consumption velocity regressors to flag 30-day expiry risk batches.',
    },
    {
      id: 'ms-inventory-schema',
      title: 'Multi-Warehouse SQLite Batch Ledger',
      roleTrack: 'Backend & Database',
      requiredSkills: ['SQLite', 'FastAPI', 'REST API'],
      deliverable: 'Structure normalized lot-tracking schemas with instant batch recall queries.',
    },
  ],
  'logimind-ai': [
    {
      id: 'lm-delay-classifier',
      title: 'Route Congestion & Delay Risk Classifier',
      roleTrack: 'Machine Learning',
      requiredSkills: ['Python', 'Scikit-learn', 'Predictive Analytics', 'Machine Learning'],
      deliverable: 'Predict transit bottleneck probabilities across weather and hub variables.',
    },
    {
      id: 'lm-fleet-allocator',
      title: 'Constraint-Based Vehicle Allocation Heuristic',
      roleTrack: 'Algorithmic Optimization & API',
      requiredSkills: ['Python', 'FastAPI', 'Data Analysis', 'Problem Solving'],
      deliverable: 'Match cargo payload weights to optimal fleet capacity to cut idle overhead.',
    },
    {
      id: 'lm-dispatcher-console',
      title: 'Live Fleet Turnaround KPI Console',
      roleTrack: 'Product & Web',
      requiredSkills: ['JavaScript', 'HTML5', 'CSS3', 'Product Thinking'],
      deliverable: 'Visualize fleet utilization and dispatch SLA adherence in real time.',
    },
  ],
  'zyvex-ambassador': [
    {
      id: 'za-gamified-engine',
      title: 'Gamified Milestone & Leaderboard Engine',
      roleTrack: 'Frontend & Platform Logic',
      requiredSkills: ['JavaScript', 'HTML5', 'CSS3', 'REST API'],
      deliverable: 'Build real-time point attribution and tier progression badges for ambassadors.',
    },
    {
      id: 'za-cohort-workflow',
      title: 'Campus Event Pipeline & Referral Attribution',
      roleTrack: 'Product Management & Growth',
      requiredSkills: ['Product Thinking', 'Team Leadership', 'Data Analysis', 'Netlify'],
      deliverable: 'Streamline multi-campus onboarding funnels and conversion tracking.',
    },
  ],
  'routewise-ai': [
    {
      id: 'rw-tsp-solver',
      title: 'Multi-Stop Time-Window Sequence Optimizer',
      roleTrack: 'Algorithms & AI',
      requiredSkills: ['Python', 'Problem Solving', 'Predictive Analytics', 'Data Analysis'],
      deliverable: 'Minimize last-mile travel distance under strict delivery SLA time windows.',
    },
    {
      id: 'rw-manifest-ui',
      title: 'Interactive Route Comparison & Driver Manifest',
      roleTrack: 'Web & API Integration',
      requiredSkills: ['JavaScript', 'REST API', 'HTML5', 'CSS3'],
      deliverable: 'Render before/after route savings and exportable field driver manifests.',
    },
  ],
  'chargegap-ai': [
    {
      id: 'cg-spatial-scoring',
      title: 'Geospatial EV Corridor Accessibility Model',
      roleTrack: 'Data Science & ML',
      requiredSkills: ['Python', 'Scikit-learn', 'Data Analysis', 'Predictive Analytics'],
      deliverable: 'Score underserved highway corridors using traffic density and grid proximity.',
    },
    {
      id: 'cg-roi-simulator',
      title: 'Fast-Charger Siting ROI & Utilization Simulator',
      roleTrack: 'Product Strategy & Research',
      requiredSkills: ['Product Thinking', 'Research', 'Data Analysis'],
      deliverable: 'Quantify station utilization uplift and payback horizons for new EV hubs.',
    },
  ],
  'zyvex-spendsentinel': [
    {
      id: 'ss-anomaly-detector',
      title: 'Recurring Spend Leakage & Anomaly Detector',
      roleTrack: 'AI Analytics & Python',
      requiredSkills: ['Python', 'Data Analysis', 'Predictive Analytics', 'Machine Learning'],
      deliverable: 'Flag statistical category drift and forgotten subscription charges automatically.',
    },
    {
      id: 'ss-cashflow-ui',
      title: 'Personal Burn-Rate & Budget Drift Visualizer',
      roleTrack: 'Frontend & FinTech UX',
      requiredSkills: ['JavaScript', 'HTML5', 'CSS3', 'Product Thinking'],
      deliverable: 'Craft clean monthly cash-flow projections and actionable savings prompts.',
    },
  ],
};

const COLLABORATOR_SKILL_OPTIONS = [
  'Python',
  'FastAPI',
  'Scikit-learn',
  'Machine Learning',
  'AI Agents',
  'Predictive Analytics',
  'Data Analysis',
  'SQLite',
  'REST API',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Product Thinking',
  'Problem Solving',
  'Research',
];

interface OfferHelpModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onApplyToContactForm: (subject: string, message: string) => void;
}

export const OfferHelpModal: React.FC<OfferHelpModalProps> = ({
  project,
  onClose,
  onApplyToContactForm,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python',
    'FastAPI',
    'Product Thinking',
  ]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [collaboratorName, setCollaboratorName] = useState<string>('');

  // Pre-select the project's top skills when modal opens for a project
  useEffect(() => {
    if (!project) return;
    const initialSkills = project.techStack.filter((t) =>
      COLLABORATOR_SKILL_OPTIONS.includes(t)
    );
    if (initialSkills.length > 0) {
      setSelectedSkills(initialSkills.slice(0, 3));
    }
    const modules = PROJECT_COLLABORATION_MODULES[project.id] || [];
    if (modules.length > 0) {
      setSelectedModuleIds([modules[0].id]);
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const projectModules = PROJECT_COLLABORATION_MODULES[project.id] || [];

  // Score and sort modules based on overlap with the user's self-identified skills
  const scoredModules = projectModules
    .map((mod) => {
      const matchedSkills = mod.requiredSkills.filter((req) =>
        selectedSkills.some((sel) => sel.toLowerCase() === req.toLowerCase())
      );
      const matchPercent =
        mod.requiredSkills.length > 0
          ? Math.round((matchedSkills.length / mod.requiredSkills.length) * 100)
          : 50;
      return {
        ...mod,
        matchedSkills,
        matchPercent,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleModule = (modId: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
    );
  };

  const chosenModules = scoredModules.filter((m) =>
    selectedModuleIds.includes(m.id)
  );
  const activeModulesForDispatch =
    chosenModules.length > 0 ? chosenModules : scoredModules.slice(0, 1);

  const generatedSubject = `Offer Help — ${project.title} (${activeModulesForDispatch
    .map((m) => m.title)
    .join(', ')})`;

  const generatedMessage = `Hi Silambarasan,

I would like to collaborate and offer help on ${project.title} (${project.domain} · ${project.subCategory}).

• My Self-Identified Skills: ${
    selectedSkills.length > 0 ? selectedSkills.join(', ') : 'General Engineering & Product'
  }
• Matched Project Module(s) I Can Assist With:
${activeModulesForDispatch
  .map(
    (m) =>
      `  - ${m.title} [${m.roleTrack}] (${m.matchPercent}% Skill Match): ${m.deliverable}`
  )
  .join('\n')}

Let's connect to discuss the architecture and next milestones!`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#070a13]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="str-glass-card w-full max-w-3xl rounded-2xl p-6 sm:p-8 border border-[#d4af37]/45 bg-[#0b1120]/95 space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#d4af37]/20 pb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[#d4af37]">
              Collaborative Skill-Matching Engine · {project.index}
            </p>
            <h3
              id="offer-help-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-[#f8fafc] mt-1"
            >
              Offer Help — {project.title}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Select your skills below to match with specific engineering & product modules for {project.title}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Offer Help modal"
            className="p-2 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Self-Identify Your Skill Set */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#e5c158]">
              1. Select Your Self-Identified Skills ({selectedSkills.length} selected)
            </span>
            <button
              type="button"
              onClick={() => setSelectedSkills(project.techStack)}
              className="text-[#38bdf8] hover:underline cursor-pointer text-[11px]"
            >
              Match Project Stack
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COLLABORATOR_SKILL_OPTIONS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              const isProjectCore = project.techStack.some(
                (t) => t.toLowerCase() === skill.toLowerCase()
              );
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#d4af37] text-[#070a13] font-semibold shadow-[0_0_12px_rgba(212,175,55,0.28)]'
                      : isProjectCore
                      ? 'bg-[#070a13] text-[#e5c158] border border-[#d4af37]/35 hover:border-[#d4af37]'
                      : 'bg-[#070a13]/70 text-[#94a3b8] border border-white/10 hover:text-[#f8fafc]'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Suggested Project Modules Ranked by Skill Match */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#38bdf8]">
              2. Suggested Project Modules Ranked by Your Skill Match
            </span>
            <span className="text-[#94a3b8] text-[11px]">
              Click any module to include in your collaboration offer
            </span>
          </div>

          <div className="space-y-3">
            {scoredModules.map((mod) => {
              const isChosen = selectedModuleIds.includes(mod.id);
              return (
                <div
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') toggleModule(mod.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isChosen
                      ? 'bg-[#1c3242]/45 border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                      : 'bg-[#070a13]/75 border-white/10 hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                          isChosen
                            ? 'bg-[#d4af37] text-[#070a13]'
                            : 'border border-white/25 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <h4 className="text-sm font-bold text-[#f8fafc]">
                        {mod.title}
                      </h4>
                      <span className="text-xs text-[#94a3b8]">
                        · {mod.roleTrack}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        mod.matchPercent >= 50
                          ? 'text-[#e5c158]'
                          : 'text-[#94a3b8]'
                      }`}
                    >
                      {mod.matchPercent}% Skill Match
                    </span>
                  </div>

                  <p className="text-xs text-[#cbd5e1] mt-1.5 pl-6">
                    {mod.deliverable}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2.5 pl-6 text-[11px] font-mono">
                    <span className="text-[#94a3b8]">Module Skills:</span>
                    {mod.requiredSkills.map((reqSkill, idx) => {
                      const isMatched = mod.matchedSkills.includes(reqSkill);
                      return (
                        <React.Fragment key={reqSkill}>
                          <span
                            className={
                              isMatched
                                ? 'text-[#38bdf8] font-semibold'
                                : 'text-[#94a3b8]'
                            }
                          >
                            {reqSkill}
                            {isMatched ? ' ✓' : ''}
                          </span>
                          {idx < mod.requiredSkills.length - 1 && (
                            <span aria-hidden="true" className="text-white/20">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Pre-Filled Subject Line Preview & Dispatch Actions */}
        <div className="p-4 rounded-xl bg-[#070a13]/90 border border-[#d4af37]/25 space-y-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]">
            Pre-Filled Dispatch Subject Line
          </p>
          <p className="text-xs sm:text-sm font-medium text-[#f8fafc] break-words">
            {generatedSubject}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
          <a
            href={`mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
              generatedSubject
            )}&body=${encodeURIComponent(generatedMessage)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#070a13] hover:bg-[#1c3242]/70 text-[#e5c158] border border-[#d4af37]/35 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Direct Email Client</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() =>
                onApplyToContactForm(generatedSubject, generatedMessage)
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Continue to Contact Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

