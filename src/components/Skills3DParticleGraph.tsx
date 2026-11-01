import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ArrowUpRight, Cpu, FolderGit2, Rotate3d, Sparkles } from 'lucide-react';
import {
  FEATURED_PROJECTS,
  ProjectItem,
  SKILL_CATEGORIES,
} from '../data/portfolioData';

export interface FlattenedSkillNode {
  index: number;
  name: string;
  level: string;
  categoryId: string;
  categoryName: string;
  appliedIn: string[];
  matchedProjects: ProjectItem[];
  colorHex: number;
  position: THREE.Vector3;
}

interface Skills3DParticleGraphProps {
  activeSkillTab: string;
  activeSkillFilter: string | null;
  onSelectSkill: (skillName: string) => void;
  onOpenProject: (project: ProjectItem) => void;
}

const DOMAIN_COLORS: Record<string, number> = {
  'ai-ds': 0xd4af37, // Metallic Gold
  programming: 0x38bdf8, // Luminous Cyan
  'web-backend': 0xe5c158, // Secondary Gold
  'ml-tools': 0x60a5fa, // Electric Sky
  'product-soft': 0x2dd4bf, // Cyber Teal
};

// Pre-allocated math helpers outside render loop (Zero GC)
const _projVec = new THREE.Vector3();
const _satTarget = new THREE.Vector3();

/**
 * Generates a procedural soft glowing particle sprite texture (Zero external 404s)
 */
function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(229, 193, 88, 0.75)');
    grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(1, 'rgba(7, 10, 19, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Skills3DParticleGraph: React.FC<Skills3DParticleGraphProps> = ({
  activeSkillTab,
  activeSkillFilter,
  onSelectSkill,
  onOpenProject,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredSkillIdx, setHoveredSkillIdx] = useState<number>(0);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  // Build flattened list of all 23 skills with Fibonacci 3D sphere coordinates & matched projects
  const allSkillNodes = useMemo<FlattenedSkillNode[]>(() => {
    const list: FlattenedSkillNode[] = [];
    const rawSkills: {
      name: string;
      level: string;
      categoryId: string;
      categoryName: string;
      appliedIn: string[];
    }[] = [];

    SKILL_CATEGORIES.forEach((cat) => {
      cat.skills.forEach((sk) => {
        rawSkills.push({
          name: sk.name,
          level: sk.level,
          categoryId: cat.id,
          categoryName: cat.name,
          appliedIn: sk.appliedIn,
        });
      });
    });

    const total = rawSkills.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const radius = 2.55;

    rawSkills.forEach((item, idx) => {
      // Fibonacci sphere distribution
      const i = idx + 0.5;
      const phi = Math.acos(1 - (2 * i) / total);
      const theta = (2 * Math.PI * i) / goldenRatio;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.cos(phi) * 0.85;
      const z = radius * Math.sin(theta) * Math.sin(phi);

      const normalizedName = item.name.toLowerCase();
      const matchedProjects = FEATURED_PROJECTS.filter((proj) => {
        const inStack = proj.techStack.some((t) =>
          t.toLowerCase().includes(normalizedName)
        );
        const inApplied = item.appliedIn.some((appTitle) =>
          appTitle.toLowerCase().includes(proj.title.toLowerCase())
        );
        return inStack || inApplied;
      });

      list.push({
        index: idx,
        name: item.name,
        level: item.level,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        appliedIn: item.appliedIn,
        matchedProjects,
        colorHex: DOMAIN_COLORS[item.categoryId] || 0xd4af37,
        position: new THREE.Vector3(x, y, z),
      });
    });

    return list;
  }, []);

  // Mutable ref for the Three.js loop
  const stateRef = useRef({
    autoRotate: true,
    activeSkillTab: 'all',
    hoveredSkillIdx: 0,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.activeSkillTab = activeSkillTab;
    // Automatically focus first skill in the selected tab
    if (activeSkillTab !== 'all') {
      const firstInTab = allSkillNodes.find(
        (n) => n.categoryId === activeSkillTab
      );
      if (firstInTab) {
        setHoveredSkillIdx(firstInTab.index);
        stateRef.current.hoveredSkillIdx = firstInTab.index;
      }
    }
  }, [activeSkillTab, allSkillNodes]);

  useEffect(() => {
    stateRef.current.hoveredSkillIdx = hoveredSkillIdx;
  }, [hoveredSkillIdx]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection
    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 480;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a13);
    scene.fog = new THREE.FogExp2(0x070a13, 0.048);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 6.9);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.8;
    controls.maxDistance = 12;

    // Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x070a13, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3d1, 2.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // Root Graph Group
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // 1. Ambient 3D Particle Cloud (PointsMaterial with procedural glow texture)
    const particleTex = createParticleGlowTexture();
    const bgParticleCount = 260;
    const bgPositions = new Float32Array(bgParticleCount * 3);
    const bgColors = new Float32Array(bgParticleCount * 3);
    const cGold = new THREE.Color(0xd4af37);
    const cCyan = new THREE.Color(0x38bdf8);

    for (let i = 0; i < bgParticleCount; i++) {
      const r = 1.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      bgPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      bgPositions[i * 3 + 1] = r * Math.cos(phi) * 0.85;
      bgPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = i % 2 === 0 ? cGold : cCyan;
      bgColors[i * 3] = c.r;
      bgColors[i * 3 + 1] = c.g;
      bgColors[i * 3 + 2] = c.b;
    }

    const bgParticleGeo = new THREE.BufferGeometry();
    bgParticleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(bgPositions, 3)
    );
    bgParticleGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgParticleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const bgParticleSystem = new THREE.Points(bgParticleGeo, bgParticleMat);
    graphGroup.add(bgParticleSystem);

    // 2. Central Knowledge Core Wireframe Sphere
    const coreWireGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0x1c3242,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreWireMesh = new THREE.Mesh(coreWireGeo, coreWireMat);
    graphGroup.add(coreWireMesh);

    // 3. Synaptic Network Edges Connecting Related Skill Nodes
    const edgeVertices: number[] = [];
    for (let i = 0; i < allSkillNodes.length; i++) {
      for (let j = i + 1; j < allSkillNodes.length; j++) {
        const a = allSkillNodes[i];
        const b = allSkillNodes[j];
        const sameCategory = a.categoryId === b.categoryId;
        const dist = a.position.distanceTo(b.position);
        if (sameCategory || dist < 1.95) {
          edgeVertices.push(
            a.position.x,
            a.position.y,
            a.position.z,
            b.position.x,
            b.position.y,
            b.position.z
          );
        }
      }
    }

    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(edgeVertices, 3)
    );
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    graphGroup.add(edgeLines);

    // 4. Skill Technology Nodes (Interactive Raycast Targets on Layer 1)
    const skillMeshes: THREE.Mesh[] = [];
    const skillMaterials: THREE.MeshPhysicalMaterial[] = [];
    const nodeBaseGeo = new THREE.IcosahedronGeometry(0.18, 2);
    const haloRingGeo = new THREE.RingGeometry(0.24, 0.29, 32);
    const haloRingMat = new THREE.MeshBasicMaterial({
      color: 0xe5c158,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const activeHaloRing = new THREE.Mesh(haloRingGeo, haloRingMat);
    graphGroup.add(activeHaloRing);

    allSkillNodes.forEach((node) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: node.colorHex,
        emissive: node.colorHex,
        emissiveIntensity: 0.32,
        metalness: 0.78,
        roughness: 0.22,
        clearcoat: 0.6,
      });
      skillMaterials.push(mat);

      const mesh = new THREE.Mesh(nodeBaseGeo, mat);
      mesh.position.copy(node.position);
      mesh.userData = { skillIndex: node.index };
      mesh.layers.enable(1);
      graphGroup.add(mesh);
      skillMeshes.push(mesh);
    });

    // 5. Dynamic Pull-On-Hover Satellite Project Nodes & Golden Tether Lines
    // Up to 6 project satellites that pull toward the currently hovered skill node
    const maxSatellites = 6;
    const satelliteMeshes: THREE.Mesh[] = [];
    const satelliteGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satelliteMat = new THREE.MeshStandardMaterial({
      color: 0xf5d97e,
      emissive: 0xd4af37,
      emissiveIntensity: 0.95,
      metalness: 0.9,
      roughness: 0.15,
    });

    for (let i = 0; i < maxSatellites; i++) {
      const sat = new THREE.Mesh(satelliteGeo, satelliteMat);
      sat.position.set(0, 0, 0);
      graphGroup.add(sat);
      satelliteMeshes.push(sat);
    }

    const tetherPositions = new Float32Array(maxSatellites * 2 * 3);
    const tetherGeo = new THREE.BufferGeometry();
    tetherGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(tetherPositions, 3)
    );
    const tetherMat = new THREE.LineBasicMaterial({
      color: 0xe5c158,
      transparent: true,
      opacity: 0.85,
    });
    const tetherLines = new THREE.LineSegments(tetherGeo, tetherMat);
    graphGroup.add(tetherLines);

    // 6. Throttled Pointer Hover & Click Raycasting
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let lastRaycastTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycastTime < 32) return;
      lastRaycastTime = now;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(skillMeshes, false);

      if (hits.length > 0) {
        const hitIdx = hits[0].object.userData.skillIndex;
        if (typeof hitIdx === 'number') {
          setHoveredSkillIdx(hitIdx);
          stateRef.current.hoveredSkillIdx = hitIdx;
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      renderer.domElement.style.cursor = 'grab';
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(skillMeshes, false);
      if (hits.length > 0) {
        const hitIdx = hits[0].object.userData.skillIndex;
        if (typeof hitIdx === 'number') {
          setHoveredSkillIdx(hitIdx);
          stateRef.current.hoveredSkillIdx = hitIdx;
          const clickedNode = allSkillNodes[hitIdx];
          if (clickedNode) {
            onSelectSkill(clickedNode.name);
          }
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 7. Render & Physics Loop
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const {
        autoRotate: shouldRotate,
        activeSkillTab: currentTab,
        hoveredSkillIdx: activeIdx,
      } = stateRef.current;

      if (shouldRotate) {
        graphGroup.rotation.y += delta * 0.22;
      }
      bgParticleSystem.rotation.y -= delta * 0.05;
      coreWireMesh.rotation.x += delta * 0.18;
      coreWireMesh.rotation.y -= delta * 0.25;

      // Update skill node scales & brightness based on active domain tab and hover state
      skillMeshes.forEach((mesh, idx) => {
        const nodeData = allSkillNodes[idx];
        const mat = skillMaterials[idx];
        const isHovered = idx === activeIdx;
        const matchesTab =
          currentTab === 'all' || nodeData.categoryId === currentTab;

        const targetScale = isHovered ? 1.55 : matchesTab ? 1.05 : 0.55;
        mesh.scale.setScalar(
          THREE.MathUtils.damp(mesh.scale.x, targetScale, 8, delta)
        );

        mat.emissiveIntensity = isHovered ? 1.1 : matchesTab ? 0.38 : 0.08;
        mat.opacity = matchesTab ? 1.0 : 0.35;
        mat.transparent = !matchesTab;
      });

      // Pull Satellite Project Nodes toward the currently hovered Skill Node
      const hoveredMesh = skillMeshes[activeIdx];
      const hoveredData = allSkillNodes[activeIdx];

      if (hoveredMesh && hoveredData) {
        activeHaloRing.position.copy(hoveredMesh.position);
        activeHaloRing.lookAt(camera.position);

        const relatedCount = Math.min(
          maxSatellites,
          Math.max(1, hoveredData.appliedIn.length)
        );
        const posAttr = tetherGeo.getAttribute(
          'position'
        ) as THREE.BufferAttribute;

        for (let s = 0; s < maxSatellites; s++) {
          const satMesh = satelliteMeshes[s];
          if (s < relatedCount) {
            satMesh.visible = true;
            const orbitAngle = elapsed * 1.4 + (s / relatedCount) * Math.PI * 2;
            const pullRadius = 0.62;
            _satTarget.set(
              hoveredMesh.position.x + Math.cos(orbitAngle) * pullRadius,
              hoveredMesh.position.y + Math.sin(orbitAngle * 1.3) * 0.36,
              hoveredMesh.position.z + Math.sin(orbitAngle) * pullRadius
            );

            // Spring pull toward the hovered technology node
            satMesh.position.x = THREE.MathUtils.damp(
              satMesh.position.x,
              _satTarget.x,
              7.5,
              delta
            );
            satMesh.position.y = THREE.MathUtils.damp(
              satMesh.position.y,
              _satTarget.y,
              7.5,
              delta
            );
            satMesh.position.z = THREE.MathUtils.damp(
              satMesh.position.z,
              _satTarget.z,
              7.5,
              delta
            );
            satMesh.rotation.y += delta * 2.2;

            // Update tether line connecting hovered skill node -> pulled project satellite
            posAttr.setXYZ(
              s * 2,
              hoveredMesh.position.x,
              hoveredMesh.position.y,
              hoveredMesh.position.z
            );
            posAttr.setXYZ(
              s * 2 + 1,
              satMesh.position.x,
              satMesh.position.y,
              satMesh.position.z
            );
          } else {
            satMesh.visible = false;
            posAttr.setXYZ(s * 2, 0, 0, 0);
            posAttr.setXYZ(s * 2 + 1, 0, 0, 0);
          }
        }
        posAttr.needsUpdate = true;

        // Project hovered 3D node position to 2D viewport coordinates for floating callout
        hoveredMesh.getWorldPosition(_projVec);
        _projVec.project(camera);
        const screenX = ((_projVec.x + 1) / 2) * (container.clientWidth || width);
        const screenY = (-(_projVec.y - 1) / 2) * (container.clientHeight || height);

        setTooltipPos({
          x: Math.max(140, Math.min((container.clientWidth || width) - 140, screenX)),
          y: Math.max(60, Math.min((container.clientHeight || height) - 110, screenY)),
          visible: _projVec.z < 1,
        });
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 1100;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      controls.dispose();

      bgParticleGeo.dispose();
      bgParticleMat.dispose();
      particleTex.dispose();
      coreWireGeo.dispose();
      coreWireMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      nodeBaseGeo.dispose();
      haloRingGeo.dispose();
      haloRingMat.dispose();
      satelliteGeo.dispose();
      satelliteMat.dispose();
      tetherGeo.dispose();
      tetherMat.dispose();
      skillMaterials.forEach((m) => m.dispose());
      envTex.dispose();
      renderer.dispose();
    };
  }, [allSkillNodes]);

  const activeSkill = allSkillNodes[hoveredSkillIdx] || allSkillNodes[0];

  return (
    <div className="mb-10 rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#070a13] shadow-[0_0_40px_rgba(7,10,19,0.85)]">
      {/* Top Bar of the 3D Skill Graph */}
      <div className="px-5 py-3.5 bg-[#0b1120] border-b border-[#d4af37]/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs">
          <Cpu className="w-4 h-4 text-[#d4af37]" />
          <span className="font-semibold uppercase tracking-wider text-[#f8fafc]">
            Interactive 3D Technology & Project Synapse Graph
          </span>
          <span className="text-[#94a3b8] hidden sm:inline">
            · Hover any 3D node to pull related projects · Click to filter
          </span>
        </div>

        <div className="flex items-center gap-3">
          {activeSkillFilter && (
            <span className="text-xs font-mono text-[#38bdf8]">
              Filter Active: {activeSkillFilter}
            </span>
          )}
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              autoRotate
                ? 'bg-[#d4af37] text-[#070a13]'
                : 'bg-[#070a13] text-[#94a3b8] border border-white/10 hover:text-[#f8fafc]'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>{autoRotate ? 'Orbit: ON' : 'Orbit: Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas + Floating Project Pull Callout */}
      <div className="relative w-full h-[420px] sm:h-[460px] bg-[#070a13]">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D Particle Skill Graph"
        />

        {/* Floating 3D Node Callout Overlay (Tracks Hovered Technology Node) */}
        {tooltipPos.visible && activeSkill && (
          <div
            style={{
              transform: `translate3d(${Math.round(tooltipPos.x + 18)}px, ${Math.round(
                tooltipPos.y - 36
              )}px, 0)`,
            }}
            className="pointer-events-none absolute top-0 left-0 z-10 hidden md:block w-64 p-3 rounded-xl bg-[#0b1120]/95 border border-[#d4af37]/45 shadow-xl transition-transform duration-75"
          >
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#d4af37]">
              <span>{activeSkill.categoryName}</span>
              <span>{activeSkill.level}</span>
            </div>
            <p className="font-display text-sm font-bold text-[#f8fafc] mt-0.5">
              {activeSkill.name}
            </p>
            <p className="text-[11px] text-[#38bdf8] font-medium mt-1.5">
              Pulled Projects ({activeSkill.appliedIn.length}):
            </p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-[#cbd5e1]">
              {activeSkill.appliedIn.map((projTitle) => (
                <li key={projTitle} className="truncate">
                  • {projTitle}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Interactive Readout Dock: Displays Pulled Projects for Hovered Skill Node */}
      <div className="p-4 sm:p-5 bg-[#0b1120] border-t border-[#d4af37]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono uppercase tracking-wider text-[#d4af37]">
              Active 3D Skill Node:
            </span>
            <span className="font-display text-sm sm:text-base font-bold text-[#f8fafc]">
              {activeSkill.name}
            </span>
            <span className="text-[#94a3b8]">·</span>
            <span className="text-[#38bdf8] font-medium">{activeSkill.level}</span>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Domain: {activeSkill.categoryName} — Click any pulled project below to inspect its case study or filter all projects by {activeSkill.name}.
          </p>
        </div>

        {/* Pulled Project Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSkill.matchedProjects.length > 0 ? (
            activeSkill.matchedProjects.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => onOpenProject(proj)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070a13] hover:bg-[#1c3242]/80 text-[#e5c158] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{proj.title}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            ))
          ) : (
            activeSkill.appliedIn.map((title) => (
              <span
                key={title}
                className="px-3 py-1.5 rounded-lg bg-[#070a13] text-[#cbd5e1] border border-white/10 text-xs font-mono"
              >
                {title}
              </span>
            ))
          )}

          <button
            type="button"
            onClick={() => onSelectSkill(activeSkill.name)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Filter by {activeSkill.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
