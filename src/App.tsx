/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  Flower2,
  FolderGit2,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react';
import {
  CERTIFICATIONS,
  EDUCATION_TIMELINE,
  FEATURED_PROJECTS,
  HACKATHONS,
  INTERESTS_AND_STRENGTHS,
  INTERNSHIPS,
  PROFILE_DATA,
  ProjectCategory,
  ProjectItem,
  SKILL_CATEGORIES,
  VENTURE_SPOTLIGHT,
} from './data/portfolioData';
import { HeroSpotlight } from './components/HeroSpotlight';
import { TiltGlassCard } from './components/TiltGlassCard';
import { Str3DSceneSection } from './components/Str3DSceneSection';
import { Skills3DParticleGraph } from './components/Skills3DParticleGraph';
import {
  BrandShowcaseModal,
  OfferHelpModal,
  ProjectCaseStudyModal,
  ResumeDossierModal,
} from './components/PortfolioModals';

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'All',
  'Healthcare AI',
  'Logistics & Optimization',
  'Web & Platforms',
  'Innovation',
];

export default function App() {
  // Interactive states
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);
  const [activeSkillTab, setActiveSkillTab] = useState<string>('all');
  const [activeEducationId, setActiveEducationId] = useState<string>(
    EDUCATION_TIMELINE[0].id
  );
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(
    null
  );
  const [offerHelpProject, setOfferHelpProject] = useState<ProjectItem | null>(
    null
  );
  const [isBrandModalOpen, setIsBrandModalOpen] = useState<boolean>(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string>(
    INTERESTS_AND_STRENGTHS.interests[0].id
  );
  const [selectedStrengthId, setSelectedStrengthId] = useState<string>(
    INTERESTS_AND_STRENGTHS.strengths[0].id
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [starredProjects, setStarredProjects] = useState<Record<string, boolean>>({});
  const [projectViewsDelta, setProjectViewsDelta] = useState<Record<string, number>>({});
  const [contactInquiry, setContactInquiry] = useState({
    name: '',
    subject: 'AI Product & Engineering Collaboration',
    message: '',
    submitted: false,
  });

  const handleToggleProjectStar = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    setStarredProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleOpenProjectCaseStudy = (project: ProjectItem) => {
    setProjectViewsDelta((prev) => ({
      ...prev,
      [project.id]: (prev[project.id] || 0) + 1,
    }));
    setActiveProjectModal(project);
  };

  const handleOfferHelp = (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();
    setOfferHelpProject(project);
  };

  const handleApplyOfferHelpToContact = (subject: string, message: string) => {
    setContactInquiry((prev) => ({
      ...prev,
      subject,
      message,
      submitted: false,
    }));
    setOfferHelpProject(null);
    scrollToSection('contact');
    setTimeout(() => {
      const nameInput = document.getElementById('sender-name');
      if (nameInput) nameInput.focus();
    }, 450);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyText = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFilterProjectsBySkill = (skillName: string) => {
    setSelectedCategory('All');
    setActiveSkillFilter(skillName);
    scrollToSection('projects');
  };

  // Filtered projects computation
  const filteredProjects = useMemo(() => {
    return FEATURED_PROJECTS.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.filterCategory === selectedCategory ||
        (project.secondaryCategories &&
          project.secondaryCategories.includes(selectedCategory));

      if (!matchesCategory) return false;

      if (activeSkillFilter) {
        const normalizedSkill = activeSkillFilter.toLowerCase();
        const inTechStack = project.techStack.some((t) =>
          t.toLowerCase().includes(normalizedSkill)
        );
        const skillCatMatch = SKILL_CATEGORIES.flatMap((c) => c.skills).find(
          (s) => s.name.toLowerCase() === normalizedSkill
        );
        const inAppliedList = skillCatMatch
          ? skillCatMatch.appliedIn.some((appTitle) =>
              appTitle.toLowerCase().includes(project.title.toLowerCase())
            )
          : false;

        return inTechStack || inAppliedList;
      }

      return true;
    });
  }, [selectedCategory, activeSkillFilter]);

  // Visible skill categories
  const visibleSkillCategories = useMemo(() => {
    if (activeSkillTab === 'all') return SKILL_CATEGORIES;
    return SKILL_CATEGORIES.filter((cat) => cat.id === activeSkillTab);
  }, [activeSkillTab]);

  const currentInterest =
    INTERESTS_AND_STRENGTHS.interests.find((i) => i.id === selectedInterestId) ||
    INTERESTS_AND_STRENGTHS.interests[0];

  const currentStrength =
    INTERESTS_AND_STRENGTHS.strengths.find((s) => s.id === selectedStrengthId) ||
    INTERESTS_AND_STRENGTHS.strengths[0];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInquiry.name.trim()) return;
    setContactInquiry((prev) => ({ ...prev, submitted: true }));
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-[#f8fafc] flex flex-col">
      {/* TOP BAR CONTRACT: Strictly 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between gap-8 px-6 lg:px-12 bg-[#070a13]/85 backdrop-blur-md border-b border-[#d4af37]/15">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-base sm:text-lg font-extrabold uppercase tracking-[0.2em] text-gold-sheen whitespace-nowrap shrink-0"
        >
          STR LEGACY
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#94a3b8]"
        >
          <a
            href="#spatial-3d"
            className="hover:text-[#e5c158] transition-colors underline-offset-8 hover:underline whitespace-nowrap shrink-0"
          >
            3D Scene
          </a>
          <a
            href="#about"
            className="hover:text-[#f8fafc] transition-colors underline-offset-8 hover:underline whitespace-nowrap shrink-0"
          >
            About
          </a>
          <a
            href="#skills"
            className="hover:text-[#f8fafc] transition-colors underline-offset-8 hover:underline whitespace-nowrap shrink-0"
          >
            Skills
          </a>
          <a
            href="#projects"
            className="hover:text-[#f8fafc] transition-colors underline-offset-8 hover:underline whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#venture"
            className="hover:text-[#f8fafc] transition-colors underline-offset-8 hover:underline whitespace-nowrap shrink-0"
          >
            Venture
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#070a13] bg-[#d4af37] hover:bg-[#e5c158] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Download Resume
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main id="top" className="flex-1">
        {/* HERO SECTION WITH DYNAMIC FLASHLIGHT REVEAL */}
        <HeroSpotlight
          onNavigate={scrollToSection}
          onOpenBrandShowcase={() => setIsBrandModalOpen(true)}
        />

        {/* EDITORIAL MARQUEE RIBBON DIVIDER */}
        <div
          aria-hidden="true"
          className="border-b border-[#d4af37]/15 bg-[#070a13] py-3 overflow-hidden select-none"
        >
          <div className="animate-marquee flex items-center gap-10 text-xs font-mono uppercase tracking-[0.22em] text-[#94a3b8]">
            <span>01. Healthcare Digital Twins</span>
            <span className="text-[#d4af37]">·</span>
            <span>02. Cold-Chain Cryptographic Ledgers</span>
            <span className="text-[#38bdf8]">·</span>
            <span>03. Autonomous Inventory Sentinels</span>
            <span className="text-[#d4af37]">·</span>
            <span>04. Predictive Fleet & Route Optimization</span>
            <span className="text-[#38bdf8]">·</span>
            <span>05. AI Product Management & Venture Execution</span>
            <span className="text-[#d4af37]">·</span>
            <span>01. Healthcare Digital Twins</span>
            <span className="text-[#d4af37]">·</span>
            <span>02. Cold-Chain Cryptographic Ledgers</span>
            <span className="text-[#38bdf8]">·</span>
            <span>03. Autonomous Inventory Sentinels</span>
            <span className="text-[#d4af37]">·</span>
            <span>04. Predictive Fleet & Route Optimization</span>
            <span className="text-[#38bdf8]">·</span>
            <span>05. AI Product Management & Venture Execution</span>
          </div>
        </div>

        {/* INTERACTIVE THREE.JS 3D SCENE & 360° 3D ROTATION VIEWPORT */}
        <Str3DSceneSection onSelectProject={handleOpenProjectCaseStudy} />

        {/* SECTION A: ABOUT & CAREER VISION */}
        <section
          id="about"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              01. Executive Profile & Direction
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              About & Career Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: About Me */}
            <TiltGlassCard className="p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                  <span className="text-[#d4af37] font-semibold uppercase tracking-wider">
                    About Silambarasan C
                  </span>
                  <span>{PROFILE_DATA.aboutMe.institution}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f8fafc]">
                  {PROFILE_DATA.aboutMe.heading}
                </h3>

                <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                  {PROFILE_DATA.aboutMe.narrative}
                </p>

                <p className="text-sm text-[#94a3b8] leading-relaxed">
                  {PROFILE_DATA.aboutMe.subNarrative}
                </p>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/15 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#e5c158]">
                  Primary Technical Domains
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#e2e8f0]">
                  {PROFILE_DATA.aboutMe.focusPillars.map((pillar, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-[#070a13]/60 border border-white/5"
                    >
                      <span className="font-mono text-[#d4af37] mr-1.5">
                        0{index + 1}.
                      </span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltGlassCard>

            {/* Right Card: Career Objective & Vision */}
            <TiltGlassCard className="p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                  <span className="text-[#38bdf8] font-semibold uppercase tracking-wider">
                    Career Objective & North Star
                  </span>
                  <span>AI Engineering × Product Strategy</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f8fafc]">
                  {PROFILE_DATA.careerVision.heading}
                </h3>

                <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                  {PROFILE_DATA.careerVision.statement}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#d4af37]/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
                  Operating Pillars
                </p>
                <div className="space-y-2.5">
                  {PROFILE_DATA.careerVision.principles.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#070a13]/60 border border-white/5 space-y-1"
                    >
                      <p className="text-xs font-semibold text-[#f8fafc]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TiltGlassCard>
          </div>
        </section>

        {/* SECTION B: EDUCATION TIMELINE */}
        <section
          id="education"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              02. Academic Pedigree
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              Education Timeline
            </h2>
          </div>

          <div className="relative pl-6 sm:pl-10 border-l border-[#d4af37]/30 space-y-8">
            {EDUCATION_TIMELINE.map((edu, index) => {
              const isSelected = activeEducationId === edu.id;
              return (
                <div key={edu.id} className="relative">
                  {/* Glowing Step Indicator Node */}
                  <button
                    type="button"
                    onClick={() => setActiveEducationId(edu.id)}
                    aria-label={`Select ${edu.degree}`}
                    className={`absolute -left-[33px] sm:-left-[49px] top-6 w-4 h-4 rounded-full border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37] border-[#f8fafc] shadow-[0_0_16px_rgba(212,175,55,0.85)] scale-110'
                        : 'bg-[#070a13] border-[#d4af37]/60 hover:border-[#d4af37]'
                    }`}
                  />

                  <TiltGlassCard
                    onClick={() => setActiveEducationId(edu.id)}
                    className={`p-6 sm:p-7 transition-all ${
                      isSelected
                        ? 'border-[#d4af37]/50 bg-[#0e1629]/85'
                        : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
                          <span className="font-mono text-[#d4af37]">
                            STEP 0{index + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{edu.period}</span>
                          <span aria-hidden="true">·</span>
                          <span>{edu.status}</span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-[#f8fafc] mt-1">
                          {edu.degree}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#cbd5e1] mt-0.5">
                          {edu.institution} · {edu.location}
                        </p>
                      </div>

                      <div className="md:text-right shrink-0">
                        <p className="text-[11px] uppercase tracking-wider text-[#94a3b8]">
                          {edu.scoreLabel}
                        </p>
                        <p className="font-mono text-lg sm:text-xl font-bold text-[#e5c158] tabular-nums">
                          {edu.scoreValue}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#94a3b8]">
                      {edu.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5">
                          <span className="text-[#38bdf8] font-mono">—</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </TiltGlassCard>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION C: TECHNICAL & PROFESSIONAL SKILLS */}
        <section
          id="skills"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                03. Capability Matrix
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
                style={{ textWrap: 'balance' }}
              >
                Technical & Professional Skills
              </h2>
              <p className="text-sm text-[#94a3b8]">
                Click any skill below to filter the Featured Projects matrix by real applied implementation.
              </p>
            </div>

            {/* Interactive Skill Domain Filter Bar */}
            <div
              role="tablist"
              aria-label="Skill Categories"
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0b1120] border border-[#d4af37]/20"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeSkillTab === 'all'}
                onClick={() => setActiveSkillTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSkillTab === 'all'
                    ? 'bg-[#d4af37] text-[#070a13] font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                All Domains
              </button>
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSkillTab === cat.id}
                  onClick={() => setActiveSkillTab(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeSkillTab === cat.id
                      ? 'bg-[#d4af37] text-[#070a13] font-semibold'
                      : 'text-[#94a3b8] hover:text-[#f8fafc]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE PARTICLE-BASED 3D SKILL & PROJECT SYNAPSE GRAPH */}
          <Skills3DParticleGraph
            activeSkillTab={activeSkillTab}
            activeSkillFilter={activeSkillFilter}
            onSelectSkill={handleFilterProjectsBySkill}
            onOpenProject={handleOpenProjectCaseStudy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSkillCategories.map((category, idx) => (
              <TiltGlassCard
                key={category.id}
                className={`p-6 flex flex-col justify-between space-y-5 ${
                  visibleSkillCategories.length === 5 && idx === 0
                    ? 'md:col-span-2 lg:col-span-2'
                    : ''
                }`}
              >
                <div className="space-y-1.5 border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span className="font-mono text-[#d4af37]">
                      DOMAIN 0{idx + 1}
                    </span>
                    <span className="font-mono tabular-nums">
                      {category.skills.length} Competencies
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#f8fafc]">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#94a3b8]">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {category.skills.map((skill) => {
                    const isSelectedSkill = activeSkillFilter === skill.name;
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => handleFilterProjectsBySkill(skill.name)}
                        className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                          isSelectedSkill
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f8fafc]'
                            : 'bg-[#070a13]/65 border-white/5 hover:border-[#d4af37]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-[#f8fafc] truncate">
                            {skill.name}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        </div>
                        <p className="text-[11px] text-[#38bdf8] mt-0.5">
                          {skill.level}
                        </p>
                        <p className="text-[11px] text-[#94a3b8] mt-1 truncate">
                          Applied: {skill.appliedIn.slice(0, 2).join(' · ')}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </TiltGlassCard>
            ))}
          </div>
        </section>

        {/* SECTION D: FEATURED PROJECTS (WITH INTERACTIVE CATEGORY FILTER) */}
        <section
          id="projects"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                04. Engineered Systems & Prototypes
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
                style={{ textWrap: 'balance' }}
              >
                Featured Projects
              </h2>
              <p className="text-sm text-[#94a3b8]">
                Select any category or click a project card to inspect its full system architecture and problem-solution case study.
              </p>
            </div>

            {/* Interactive Category Filter Buttons */}
            <div
              role="tablist"
              aria-label="Project Category Filter"
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#0b1120] border border-[#d4af37]/20"
            >
              {PROJECT_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveSkillFilter(null);
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#d4af37] text-[#070a13] shadow-[0_0_16px_rgba(212,175,55,0.28)]'
                        : 'text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Skill Filter Banner (if triggered from Skills section) */}
          {activeSkillFilter && (
            <div className="mb-8 p-4 rounded-xl bg-[#1c3242]/40 border border-[#38bdf8]/40 flex items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#e2e8f0]">
                Filtering projects demonstrating{' '}
                <span className="font-semibold text-[#38bdf8]">
                  {activeSkillFilter}
                </span>{' '}
                ({filteredProjects.length} matched)
              </div>
              <button
                type="button"
                onClick={() => setActiveSkillFilter(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#070a13] text-[#f8fafc] hover:text-[#e5c158] border border-white/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Skill Filter</span>
              </button>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {filteredProjects.map((project) => {
              const isStarred = Boolean(starredProjects[project.id]);
              const starCount = project.engagement.stars + (isStarred ? 1 : 0);
              const viewCount =
                project.engagement.views + (projectViewsDelta[project.id] || 0);

              return (
                <TiltGlassCard
                  key={project.id}
                  onClick={() => handleOpenProjectCaseStudy(project)}
                  className="p-7 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Quiet 1-line text kicker + Interactive Stars/Views Engagement Counter */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#94a3b8]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#d4af37]">
                          {project.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#e5c158] font-medium">
                          {project.domain}
                        </span>
                        <span aria-hidden="true">/</span>
                        <span className="text-[#38bdf8]">{project.subCategory}</span>
                      </div>

                      {/* Visual Stars & Views Engagement Counter */}
                      <div className="inline-flex items-center gap-2.5 bg-[#070a13]/80 border border-[#d4af37]/25 rounded-lg px-2.5 py-1 font-mono text-xs tabular-nums">
                        <button
                          type="button"
                          onClick={(e) => handleToggleProjectStar(e, project.id)}
                          aria-label={
                            isStarred
                              ? `Unstar ${project.title}`
                              : `Star ${project.title}`
                          }
                          title="Click to star this project"
                          className={`inline-flex items-center gap-1 transition-colors cursor-pointer ${
                            isStarred
                              ? 'text-[#e5c158] font-semibold'
                              : 'text-[#cbd5e1] hover:text-[#e5c158]'
                          }`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isStarred
                                ? 'fill-[#d4af37] text-[#d4af37]'
                                : 'text-[#d4af37]'
                            }`}
                          />
                          <span>{starCount.toLocaleString()}</span>
                        </button>

                        <span aria-hidden="true" className="text-white/15">
                          |
                        </span>

                        <span
                          className="inline-flex items-center gap-1 text-[#94a3b8]"
                          title="Total project case study views"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>{viewCount.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    {/* Primary Project Title */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#f8fafc] group-hover:text-[#e5c158] transition-colors">
                        {project.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-[#94a3b8] group-hover:text-[#e5c158] transition-colors shrink-0 mt-1">
                        <span>Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Summary Description */}
                    <p className="text-sm text-[#cbd5e1] leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Data-Driven Project Impact Metric Strip */}
                    <div className="py-3.5 border-y border-[#d4af37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d4af37]">
                          Project Impact
                        </span>
                        <p className="text-xs text-[#94a3b8]">
                          {project.quantifiedImpact.context}
                        </p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <span className="font-mono text-xl sm:text-2xl font-bold text-[#e5c158] tabular-nums">
                          {project.quantifiedImpact.value}
                        </span>
                        <span className="block text-[11px] font-medium text-[#f8fafc]">
                          {project.quantifiedImpact.label}
                        </span>
                      </div>
                    </div>

                    {/* Key Features Bullet Points */}
                    <ul className="space-y-2 pt-1 text-xs sm:text-sm text-[#94a3b8]">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#d4af37] font-mono shrink-0">
                            •
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer: Clean Unboxed Tech Stack Metadata, Hackathon Reference & Offer Help Action */}
                  <div className="pt-4 border-t border-[#d4af37]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[#38bdf8]">
                        {project.techStack.map((tech, idx) => (
                          <React.Fragment key={tech}>
                            <span>{tech}</span>
                            {idx < project.techStack.length - 1 && (
                              <span aria-hidden="true" className="text-[#94a3b8]/50">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {project.hackathonLink && (
                        <p className="text-[11px] text-[#e5c158]">
                          Milestone: {project.hackathonLink}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleOfferHelp(e, project)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#e5c158] hover:text-[#070a13] border border-[#d4af37]/40 text-xs font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Offer Help</span>
                    </button>
                  </div>
                </TiltGlassCard>
              );
            })}
          </div>
        </section>

        {/* SECTION E: EXPERIENCE & CERTIFICATIONS */}
        <section
          id="experience"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              05. Industry Training & Credentials
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              Experience & Certifications
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Internships */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5c158]">
                Software Engineering Internships
              </h3>

              {INTERNSHIPS.map((intern) => (
                <TiltGlassCard key={intern.id} className="p-6 sm:p-7 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3.5">
                    <div>
                      <h4 className="font-display text-lg sm:text-xl font-bold text-[#f8fafc]">
                        {intern.role}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#d4af37] font-medium mt-0.5">
                        {intern.company}
                      </p>
                    </div>
                    <div className="text-xs text-[#94a3b8] font-mono sm:text-right">
                      <p className="text-[#f8fafc]">{intern.period}</p>
                      <p className="text-[#38bdf8]">{intern.mode}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#cbd5e1] leading-relaxed">
                    {intern.summary}
                  </p>

                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#94a3b8]">
                    {intern.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#d4af37] font-mono">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-[#38bdf8]">
                    {intern.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {idx < intern.technologies.length - 1 && (
                          <span aria-hidden="true" className="text-[#94a3b8]/50">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </TiltGlassCard>
              ))}
            </div>

            {/* Right 5 Columns: Certifications */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38bdf8]">
                Verified Certifications & Credentials
              </h3>

              <div className="space-y-4">
                {CERTIFICATIONS.map((cert, index) => (
                  <TiltGlassCard key={cert.id} className="p-5 sm:p-6 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                      <span className="font-mono text-[#d4af37]">
                        CREDENTIAL 0{index + 1} · {cert.year}
                      </span>
                      <span className="text-[#38bdf8]">{cert.domain}</span>
                    </div>

                    <h4 className="font-display text-base sm:text-lg font-bold text-[#f8fafc]">
                      {cert.title}
                    </h4>

                    <p className="text-xs font-medium text-[#e5c158]">
                      Issued by {cert.issuer}
                    </p>

                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {cert.credentialSummary}
                    </p>
                  </TiltGlassCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F: HACKATHONS & COMPETITIONS */}
        <section
          id="hackathons"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              06. Competitive Innovation Arena
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              Hackathons & Competitions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HACKATHONS.map((hack, idx) => (
              <TiltGlassCard
                key={hack.id}
                className={`p-6 flex flex-col justify-between space-y-4 ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2 border-[#d4af37]/35' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#94a3b8]">
                    <span className="font-mono text-[#d4af37]">
                      ARENA 0{idx + 1} · {hack.organizer}
                    </span>
                    <span className="text-[#38bdf8] font-medium">
                      {hack.track}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#f8fafc]">
                    {hack.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-semibold text-[#e5c158]">
                    {hack.roleOrSubmission} — {hack.milestone}
                  </p>

                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {hack.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#94a3b8]">
                  <span>Verified Competition Record</span>
                  <Trophy className="w-4 h-4 text-[#d4af37]" />
                </div>
              </TiltGlassCard>
            ))}
          </div>
        </section>

        {/* SECTION G: ENTREPRENEURSHIP SPOTLIGHT — VK FLORA PEDAL ENTERPRISES */}
        <section
          id="venture"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              07. Entrepreneurship Spotlight
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              Founder & Venture Leadership
            </h2>
          </div>

          <TiltGlassCard className="p-8 sm:p-10 lg:p-12 border border-[#d4af37]/45 bg-gradient-to-br from-[#0e1629]/90 via-[#0b1120]/95 to-[#1c3242]/50 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#d4af37]/25 pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#e5c158] font-semibold">
                  <span>{VENTURE_SPOTLIGHT.role}</span>
                  <span aria-hidden="true">·</span>
                  <span>Student-Founded Enterprise</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-[0.12em] text-gold-sheen">
                  {VENTURE_SPOTLIGHT.companyName}
                </h3>
                <p className="text-base sm:text-lg italic text-[#f8fafc] font-medium">
                  “{VENTURE_SPOTLIGHT.tagline}”
                </p>
              </div>

              <div className="flex flex-wrap gap-6 shrink-0">
                {VENTURE_SPOTLIGHT.metrics.map((m, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-wider text-[#94a3b8]">
                      {m.label}
                    </p>
                    <p className="text-sm font-semibold text-[#e5c158]">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#e2e8f0] max-w-3xl leading-relaxed">
              {VENTURE_SPOTLIGHT.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VENTURE_SPOTLIGHT.highlights.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#070a13]/75 border border-[#d4af37]/20 space-y-2"
                >
                  <p className="text-xs font-mono text-[#d4af37]">
                    PILLAR 0{idx + 1}
                  </p>
                  <h4 className="font-display text-base font-bold text-[#f8fafc]">
                    {pillar.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </TiltGlassCard>
        </section>

        {/* SECTION H: PROFESSIONAL INTERESTS & PERSONAL STRENGTHS */}
        <section
          id="interests"
          className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
        >
          <div className="max-w-2xl mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
              08. Strategic Focus & Character
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
              style={{ textWrap: 'balance' }}
            >
              Professional Interests & Personal Strengths
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Select any interest or personal strength to inspect how it manifests in Silambarasan’s engineering and venture work.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professional Interests Interactive Explorer */}
            <TiltGlassCard className="p-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4af37]">
                  Professional Interests
                </p>

                <div className="flex flex-wrap gap-2">
                  {INTERESTS_AND_STRENGTHS.interests.map((interest) => {
                    const active = selectedInterestId === interest.id;
                    return (
                      <button
                        key={interest.id}
                        type="button"
                        onClick={() => setSelectedInterestId(interest.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#d4af37] text-[#070a13] shadow-[0_0_16px_rgba(212,175,55,0.3)]'
                            : 'bg-[#070a13]/80 text-[#cbd5e1] border border-[#d4af37]/20 hover:border-[#d4af37]/50'
                        }`}
                      >
                        {interest.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#070a13]/80 border border-white/10 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#e5c158]">
                  Active Focus: {currentInterest.label}
                </p>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {currentInterest.evidence}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-[#38bdf8]">
                  {currentInterest.relatedItems.map((item, idx) => (
                    <React.Fragment key={item}>
                      <span>{item}</span>
                      {idx < currentInterest.relatedItems.length - 1 && (
                        <span aria-hidden="true" className="text-[#94a3b8]/50">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </TiltGlassCard>

            {/* Personal Strengths Interactive Explorer */}
            <TiltGlassCard className="p-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#38bdf8]">
                  Personal Strengths
                </p>

                <div className="flex flex-wrap gap-2">
                  {INTERESTS_AND_STRENGTHS.strengths.map((strength) => {
                    const active = selectedStrengthId === strength.id;
                    return (
                      <button
                        key={strength.id}
                        type="button"
                        onClick={() => setSelectedStrengthId(strength.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#38bdf8] text-[#070a13] shadow-[0_0_16px_rgba(56,189,248,0.3)]'
                            : 'bg-[#070a13]/80 text-[#cbd5e1] border border-[#38bdf8]/20 hover:border-[#38bdf8]/50'
                        }`}
                      >
                        {strength.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#070a13]/80 border border-white/10 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">
                  Demonstrated Trait: {currentStrength.label}
                </p>
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                  {currentStrength.evidence}
                </p>
              </div>
            </TiltGlassCard>
          </div>
        </section>
      </main>

      {/* SECTION I: FOOTER & CONTACT HUB */}
      <footer
        id="contact"
        className="bg-[#0b1120] border-t border-[#d4af37]/25 pt-16 pb-12"
      >
        <div className="max-w-[1280px] mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: One-Click Copy Contact Cards */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                  09. Direct Communication Hub
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]">
                  Connect With Silambarasan C
                </h2>
                <p className="text-sm text-[#94a3b8]">
                  Available for AI Product Management roles, AI/ML engineering internships, hackathon collaborations, and venture partnerships.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Card with One-Click Copy */}
                <button
                  type="button"
                  onClick={() => handleCopyText('email', PROFILE_DATA.email)}
                  className="str-glass-card p-5 rounded-xl text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span className="inline-flex items-center gap-1.5 text-[#d4af37] font-semibold uppercase tracking-wider">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Address</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#e5c158]">
                      {copiedField === 'email' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                          <span>Click to Copy</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-[#f8fafc] truncate">
                    {PROFILE_DATA.email}
                  </p>
                </button>

                {/* Phone Card with One-Click Copy */}
                <button
                  type="button"
                  onClick={() => handleCopyText('phone', PROFILE_DATA.phone)}
                  className="str-glass-card p-5 rounded-xl text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span className="inline-flex items-center gap-1.5 text-[#38bdf8] font-semibold uppercase tracking-wider">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Direct Phone</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#38bdf8]">
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                          <span>Click to Copy</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-[#f8fafc] tabular-nums">
                    {PROFILE_DATA.phone}
                  </p>
                </button>

                {/* Location Card */}
                <div className="str-glass-card p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span className="inline-flex items-center gap-1.5 text-[#e5c158] font-semibold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Base Location</span>
                    </span>
                    <span className="text-[11px] font-mono">IST (UTC+5:30)</span>
                  </div>
                  <p className="text-sm font-semibold text-[#f8fafc]">
                    {PROFILE_DATA.location}
                  </p>
                </div>

                {/* Social Profiles Card */}
                <div className="str-glass-card p-5 rounded-xl space-y-2 flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                    Verified Networks
                  </span>
                  <div className="flex items-center gap-4 pt-1 text-xs font-semibold">
                    <a
                      href={PROFILE_DATA.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#f8fafc] hover:text-[#d4af37] transition-colors"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <span aria-hidden="true" className="text-white/20">
                      ·
                    </span>
                    <a
                      href={PROFILE_DATA.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#f8fafc] hover:text-[#38bdf8] transition-colors"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume Dossier</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#070a13] hover:bg-[#1c3242]/60 text-[#f8fafc] border border-[#d4af37]/30 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Inspect Brand System</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Quick Dispatch Note Composer */}
            <div className="lg:col-span-5">
              <div className="str-glass-card p-6 sm:p-7 rounded-2xl space-y-4">
                <h3 className="font-display text-base font-bold uppercase tracking-[0.14em] text-[#f8fafc]">
                  Direct Collaboration Dispatch
                </h3>

                {contactInquiry.submitted ? (
                  <div className="p-5 rounded-xl bg-[#070a13]/90 border border-[#d4af37]/40 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                      Dispatch Ready
                    </p>
                    <p className="text-sm text-[#f8fafc]">
                      Thank you, {contactInquiry.name}. Your inquiry regarding{' '}
                      <span className="text-[#e5c158]">
                        {contactInquiry.subject}
                      </span>{' '}
                      has been formatted.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
                          `${contactInquiry.subject} — from ${contactInquiry.name}`
                        )}&body=${encodeURIComponent(contactInquiry.message)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#d4af37] text-[#070a13] text-xs font-semibold"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Launch Mail Client</span>
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setContactInquiry({
                            name: '',
                            subject: 'AI Product & Engineering Collaboration',
                            message: '',
                            submitted: false,
                          })
                        }
                        className="text-xs text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
                      >
                        Reset Form
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                    <div>
                      <label
                        htmlFor="sender-name"
                        className="block text-xs text-[#94a3b8] mb-1"
                      >
                        Your Name or Organization
                      </label>
                      <input
                        id="sender-name"
                        type="text"
                        required
                        value={contactInquiry.name}
                        onChange={(e) =>
                          setContactInquiry((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g. Recruiter / Product Lead"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a13]/90 border border-white/10 focus:border-[#d4af37] focus:outline-none text-xs sm:text-sm text-[#f8fafc]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-topic"
                        className="block text-xs text-[#94a3b8] mb-1"
                      >
                        Subject Line
                      </label>
                      <input
                        id="inquiry-topic"
                        type="text"
                        list="inquiry-topic-presets"
                        required
                        value={contactInquiry.subject}
                        onChange={(e) =>
                          setContactInquiry((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        placeholder="e.g. Offer Help — GlucoTwin AI 2.0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a13]/90 border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-xs sm:text-sm text-[#e5c158] font-medium"
                      />
                      <datalist id="inquiry-topic-presets">
                        <option value="AI Product & Engineering Collaboration" />
                        <option value="AI / Data Science Internship Opportunity" />
                        <option value="VK Flora Pedal Enterprises Inquiry" />
                        <option value="Hackathon & Venture Pitch" />
                      </datalist>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-message"
                        className="block text-xs text-[#94a3b8] mb-1"
                      >
                        Message Note
                      </label>
                      <textarea
                        id="inquiry-message"
                        rows={3}
                        value={contactInquiry.message}
                        onChange={(e) =>
                          setContactInquiry((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        placeholder="Share project details, role scope, or venture ideas..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#070a13]/90 border border-white/10 focus:border-[#d4af37] focus:outline-none text-xs sm:text-sm text-[#f8fafc] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1c3242] hover:bg-[#d4af37] text-[#f8fafc] hover:text-[#070a13] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Prepare Direct Dispatch</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94a3b8]">
            <p className="font-medium text-[#f8fafc]">
              © 2026 STR LEGACY • Crafted by Silambarasan C
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#top"
                className="hover:text-[#e5c158] transition-colors"
              >
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE MODALS */}
      <ProjectCaseStudyModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        onFilterBySkill={handleFilterProjectsBySkill}
      />

      <BrandShowcaseModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />

      <ResumeDossierModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      <OfferHelpModal
        project={offerHelpProject}
        onClose={() => setOfferHelpProject(null)}
        onApplyToContactForm={handleApplyOfferHelpToContact}
      />
    </div>
  );
}
