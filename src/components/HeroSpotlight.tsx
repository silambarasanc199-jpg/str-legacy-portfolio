import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Compass, FolderGit2, Mail, MapPin, Sparkles } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import { StrMonogram } from './StrMonogram';

interface HeroSpotlightProps {
  onNavigate: (sectionId: string) => void;
  onOpenBrandShowcase: () => void;
}

const CIRCUIT_NODES = [
  { cx: 180, cy: 160, r: 4, tone: 'cyan' },
  { cx: 340, cy: 120, r: 3.5, tone: 'gold' },
  { cx: 520, cy: 210, r: 4.5, tone: 'cyan' },
  { cx: 720, cy: 140, r: 4, tone: 'gold' },
  { cx: 920, cy: 200, r: 4.5, tone: 'cyan' },
  { cx: 1120, cy: 150, r: 3.5, tone: 'gold' },
  { cx: 1260, cy: 260, r: 4, tone: 'cyan' },
  { cx: 240, cy: 380, r: 4.5, tone: 'gold' },
  { cx: 450, cy: 420, r: 4, tone: 'cyan' },
  { cx: 990, cy: 410, r: 4, tone: 'gold' },
  { cx: 1190, cy: 450, r: 4.5, tone: 'cyan' },
  { cx: 310, cy: 620, r: 3.5, tone: 'cyan' },
  { cx: 610, cy: 660, r: 4.5, tone: 'gold' },
  { cx: 850, cy: 650, r: 4, tone: 'cyan' },
  { cx: 1090, cy: 620, r: 3.5, tone: 'gold' },
];

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  onNavigate,
  onOpenBrandShowcase,
}) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerActiveRef = useRef<boolean>(false);
  const targetPosRef = useRef<{ x: number; y: number }>({ x: 720, y: 360 });
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 720, y: 360 });
  const lastEmitPosRef = useRef<{ x: number; y: number }>({ x: 720, y: 360 });
  const [activeRole, setActiveRole] = useState<string>('developer');

  useEffect(() => {
    const el = heroRef.current;
    const canvas = trailCanvasRef.current;
    if (!el || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const syncCanvasSize = () => {
      if (!heroRef.current || !trailCanvasRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      trailCanvasRef.current.width = Math.max(1, Math.floor(r.width * dpr));
      trailCanvasRef.current.height = Math.max(1, Math.floor(r.height * dpr));
    };

    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);

    const rect = el.getBoundingClientRect();
    currentPosRef.current = { x: rect.width * 0.5, y: rect.height * 0.42 };
    targetPosRef.current = { x: rect.width * 0.5, y: rect.height * 0.42 };
    lastEmitPosRef.current = { ...currentPosRef.current };

    const particles: TrailParticle[] = [];
    const trailPoints: TrailPoint[] = [];
    const maxParticles = 64;
    const palette = ['#d4af37', '#e5c158', '#38bdf8', '#f8fafc'];

    let animationFrameId: number;
    const startTime = performance.now();

    const spawnParticles = (x: number, y: number, dx: number, dy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.9;
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed - dx * 0.04,
          vy: Math.sin(angle) * speed - dy * 0.04 - 0.15,
          size: 1.2 + Math.random() * 2.2,
          alpha: 0.65 + Math.random() * 0.3,
          decay: 0.012 + Math.random() * 0.014,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const updateSpotlight = (now: number) => {
      if (!heroRef.current) return;
      const bounds = heroRef.current.getBoundingClientRect();

      if (!pointerActiveRef.current) {
        // Smooth autonomous Lissajous figure-8 ambient trajectory for mobile or idle states
        const elapsed = (now - startTime) * 0.00075;
        const centerX = bounds.width * 0.5;
        const centerY = bounds.height * 0.44;
        const radiusX = Math.min(bounds.width * 0.34, 420);
        const radiusY = Math.min(bounds.height * 0.26, 210);

        targetPosRef.current = {
          x: centerX + Math.sin(elapsed) * radiusX,
          y: centerY + Math.sin(elapsed * 2) * radiusY,
        };
      }

      // Smooth 60fps spring interpolation
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.14;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.14;

      const curX = currentPosRef.current.x;
      const curY = currentPosRef.current.y;

      heroRef.current.style.setProperty('--spot-x', `${curX.toFixed(1)}px`);
      heroRef.current.style.setProperty('--spot-y', `${curY.toFixed(1)}px`);

      // Render HTML5 Canvas Particle Light Trail
      if (ctx && trailCanvasRef.current) {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, bounds.width, bounds.height);
        ctx.globalCompositeOperation = 'lighter';

        const dx = curX - lastEmitPosRef.current.x;
        const dy = curY - lastEmitPosRef.current.y;
        const dist = Math.hypot(dx, dy);

        // Record ribbon trail point and emit particles along movement
        trailPoints.push({ x: curX, y: curY, age: 0 });
        if (trailPoints.length > 26) {
          trailPoints.shift();
        }

        if (dist > 2.2) {
          const emitCount = Math.min(3, Math.ceil(dist / 12));
          spawnParticles(curX, curY, dx, dy, emitCount);
          lastEmitPosRef.current = { x: curX, y: curY };
        } else if (Math.random() < 0.18) {
          // Subtle ambient micro-sparkle around the active focal point
          spawnParticles(curX, curY, 0, 0, 1);
        }

        // 1. Draw tapering luminous light-trail ribbon
        if (trailPoints.length > 2) {
          for (let i = 1; i < trailPoints.length; i++) {
            const p0 = trailPoints[i - 1];
            const p1 = trailPoints[i];
            p1.age += 1;
            const progress = i / trailPoints.length;
            const lineAlpha = Math.max(0, progress * 0.36);

            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle =
              i % 2 === 0
                ? `rgba(212, 175, 55, ${lineAlpha.toFixed(3)})`
                : `rgba(56, 189, 248, ${(lineAlpha * 0.85).toFixed(3)})`;
            ctx.lineWidth = progress * 2.6;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // 2. Update & draw particles + subtle constellation micro-links
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97;
          p.vy *= 0.97;
          p.alpha -= p.decay;

          if (p.alpha <= 0.01) {
            particles.splice(i, 1);
            continue;
          }

          // Connect nearby particles with ultra-fine cyber filaments
          if (i > 0) {
            const neighbor = particles[i - 1];
            const linkDist = Math.hypot(p.x - neighbor.x, p.y - neighbor.y);
            if (linkDist < 46) {
              const linkAlpha = (1 - linkDist / 46) * p.alpha * 0.22;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(neighbor.x, neighbor.y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${linkAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }

          // Particle core & soft glow halo
          ctx.globalAlpha = p.alpha * 0.32;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Subtle cursor focal ring
        const cursorGrad = ctx.createRadialGradient(curX, curY, 1, curX, curY, 24);
        cursorGrad.addColorStop(0, 'rgba(229, 193, 88, 0.38)');
        cursorGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.14)');
        cursorGrad.addColorStop(1, 'rgba(7, 10, 19, 0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = cursorGrad;
        ctx.beginPath();
        ctx.arc(curX, curY, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    animationFrameId = requestAnimationFrame(updateSpotlight);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', syncCanvasSize);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    pointerActiveRef.current = true;
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerLeave = () => {
    pointerActiveRef.current = false;
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '42%',
        } as React.CSSProperties
      }
      className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#070a13] border-b border-[#d4af37]/15 select-none"
    >
      {/* 1. BASE HIDDEN / DIM BLUEPRINT & CIRCUIT LAYER */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(28, 50, 66, 0.32) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(28, 50, 66, 0.32) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Base Dimmed SVG Circuit & Central Geometric Monogram */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15"
      >
        <StrMonogram className="w-[460px] md:w-[680px] h-auto" variant="subtle" />
      </div>

      {/* 2. SPOTLIGHT / FLASHLIGHT REVEAL LAYER (ILLUMINATED UNDER CURSOR OR AMBIENT BEAM) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 380px at var(--spot-x) var(--spot-y), rgba(212, 175, 55, 0.14), rgba(56, 189, 248, 0.07) 42%, transparent 80%)`,
        }}
      />

      {/* Masked Golden Circuit Network + Luminous Cyan Constellation Nodes + Illuminated Monogram */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: `radial-gradient(circle 380px at var(--spot-x) var(--spot-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, transparent 82%)`,
          maskImage: `radial-gradient(circle 380px at var(--spot-x) var(--spot-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 45%, transparent 82%)`,
        }}
      >
        {/* Illuminated Fine Gold Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(212, 175, 55, 0.22) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.16) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* SVG Golden Circuit Network & Cyan Constellation Nodes */}
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Golden Circuit Traces */}
          <g stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.55">
            <path d="M 80 160 H 180 L 240 220 H 420 L 520 210" />
            <path d="M 340 120 L 410 190 H 640 L 720 140 H 920" />
            <path d="M 920 200 L 1010 150 H 1120 L 1260 260 H 1380" />
            <path d="M 140 440 L 240 380 H 450 L 560 470 H 880 L 990 410 H 1190" />
            <path d="M 210 680 L 310 620 H 610 L 690 570 H 850 L 940 620 H 1090" />
          </g>

          {/* Luminous Cyan Constellation Connections */}
          <g stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="4 6" strokeOpacity="0.65">
            <line x1="180" y1="160" x2="340" y2="120" />
            <line x1="520" y1="210" x2="720" y2="140" />
            <line x1="720" y1="140" x2="920" y2="200" />
            <line x1="920" y1="200" x2="990" y2="410" />
            <line x1="240" y1="380" x2="450" y2="420" />
            <line x1="450" y1="420" x2="610" y2="660" />
            <line x1="850" y1="650" x2="990" y2="410" />
            <line x1="1120" y1="150" x2="1190" y2="450" />
          </g>

          {/* Glowing Nodes */}
          {CIRCUIT_NODES.map((node, idx) => (
            <g key={idx}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r * 2.8}
                fill={node.tone === 'cyan' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(212, 175, 55, 0.24)'}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={node.tone === 'cyan' ? '#38bdf8' : '#e5c158'}
              />
            </g>
          ))}
        </svg>

        {/* Illuminated Center STR Monogram */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <StrMonogram className="w-[460px] md:w-[680px] h-auto" glow variant="cyan-gold" />
        </div>
      </div>

      {/* 2.5 HTML5 CANVAS PARTICLE-BASED LIGHT TRAIL OVERLAY */}
      <canvas
        ref={trailCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] w-full h-full"
      />

      {/* 3. HERO CONTENT OVERLAY */}
      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-6 pt-12 pb-10 lg:pt-16 lg:pb-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left 8 Columns: Brand Emblem, Name, Interactive Role Selector, Tagline, CTAs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Brand Emblem Lockup */}
            <div className="inline-flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-[#0b1120]/90 border border-[#d4af37]/30 shadow-inner">
                <StrMonogram className="w-14 h-7" glow variant="gold" />
              </div>
              <div>
                <p
                  className="font-display text-sm md:text-base font-bold uppercase tracking-[0.22em] text-gold-sheen"
                >
                  {PROFILE_DATA.brandName}
                </p>
                <p className="text-xs text-[#94a3b8] tracking-wide">
                  Personal Engineering & Venture Monograph
                </p>
              </div>
            </div>

            {/* Primary Display Name */}
            <div className="space-y-3">
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold uppercase tracking-[0.14em] text-[#f8fafc] leading-[1.08]"
                style={{ textWrap: 'balance' }}
              >
                {PROFILE_DATA.fullName}
              </h1>

              {/* Interactive Role Selector Strip (Functional Filter/Jump Controls) */}
              <div
                role="group"
                aria-label="Professional Focus Areas"
                className="flex flex-wrap items-center gap-2 pt-1"
              >
                {PROFILE_DATA.roles.map((role) => {
                  const isSelected = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setActiveRole(role.id);
                        onNavigate(role.targetSection);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#d4af37]/20 text-[#e5c158] border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.18)]'
                          : 'bg-[#0b1120]/80 text-[#94a3b8] border border-[#d4af37]/15 hover:text-[#f8fafc] hover:border-[#d4af37]/40'
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tagline */}
            <p
              className="text-lg sm:text-xl text-[#e2e8f0] font-normal max-w-2xl leading-relaxed"
              style={{ textWrap: 'balance' }}
            >
              {PROFILE_DATA.tagline}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] font-semibold text-sm tracking-wide shadow-[0_0_28px_rgba(212,175,55,0.35)] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Explore Projects</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0e1629]/75 hover:bg-[#1c3242]/70 text-[#f8fafc] font-semibold text-sm tracking-wide border border-[#d4af37]/30 hover:border-[#d4af37]/60 backdrop-blur-md transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>Contact Silambarasan</span>
              </button>

              <button
                type="button"
                onClick={onOpenBrandShowcase}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-medium text-[#94a3b8] hover:text-[#e5c158] border border-transparent hover:border-[#d4af37]/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Brand Identity System</span>
              </button>
            </div>

            {/* Quick Location & Social Strip */}
            <div className="pt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-[#94a3b8]">
              <span className="inline-flex items-center gap-1.5 text-[#f8fafc]">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{PROFILE_DATA.location}</span>
              </span>
              <span aria-hidden="true" className="text-[#d4af37]/40">
                |
              </span>
              <a
                href={PROFILE_DATA.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#e5c158] transition-colors underline-offset-4 hover:underline"
              >
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <span aria-hidden="true" className="text-[#d4af37]/40">
                |
              </span>
              <a
                href={PROFILE_DATA.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#38bdf8] transition-colors underline-offset-4 hover:underline"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right 4 Columns: Interactive STR Legacy Command Card */}
          <div className="lg:col-span-4">
            <div className="str-glass-card rounded-2xl p-6 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#d4af37]/15 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#d4af37] font-semibold">
                    Spotlight Telemetry
                  </p>
                  <h2 className="text-base font-semibold text-[#f8fafc] mt-0.5">
                    Interactive Circuit Canvas
                  </h2>
                </div>
                <Compass className="w-5 h-5 text-[#38bdf8]" />
              </div>

              {/* Brand Workstation Visual Preview */}
              <div
                onClick={onOpenBrandShowcase}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenBrandShowcase();
                }}
                className="group relative rounded-xl overflow-hidden border border-[#d4af37]/20 bg-[#0b1120] aspect-[16/10] cursor-pointer"
              >
                <img
                  src="/assets/aistudio/str_background_hero_section_3b4512b2.jpg"
                  alt="STR Legacy Ultra-Wide Portfolio Concept"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/30 to-transparent flex items-end justify-between p-3.5">
                  <div>
                    <p className="text-xs font-semibold text-[#f8fafc]">
                      STR LEGACY Visual Architecture
                    </p>
                    <p className="text-[11px] text-[#94a3b8]">
                      Click to inspect brand plates
                    </p>
                  </div>
                  <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#e5c158] border border-[#d4af37]/40">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#94a3b8]">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>Current Academic Standing</span>
                  <span className="text-[#f8fafc] font-mono tabular-nums">B.Tech AI & DS (Yr 3)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span>Primary Architecture</span>
                  <span className="text-[#e5c158]">Python · FastAPI · ML Agents</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Venture Leadership</span>
                  <span className="text-[#38bdf8]">VK Flora Pedal Enterprises</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FULL-WIDTH QUICK STATS BAR BELOW HERO SPLIT */}
      <div className="relative z-10 border-t border-[#d4af37]/15 bg-[#0b1120]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PROFILE_DATA.quickStats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#d4af37] font-mono tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#f8fafc]">
                  {stat.label}
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
