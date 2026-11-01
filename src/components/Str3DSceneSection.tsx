import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Rotate3d,
} from 'lucide-react';
import { FEATURED_PROJECTS, ProjectItem } from '../data/portfolioData';

export type FinishPreset = 'gold' | 'cyber' | 'obsidian';
export type CameraPreset = 'isometric' | 'top' | 'front';

interface Str3DSceneSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

// Pre-allocated math helpers outside the render loop (Zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3(0, 0.25, 0);
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _dummyColor = new THREE.Color();

/**
 * Builds the 3D AI Futuristic Cyber-Stencil letter "S" shape
 * Features 45-degree octagonal chamfers, angled terminal slashes, and razor-sharp tech facets
 */
function createLetterSShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.68, 0.96);
  s.lineTo(-0.42, 0.96);
  s.lineTo(-0.70, 0.68);
  s.lineTo(-0.70, 0.20);
  s.lineTo(-0.46, -0.04);
  s.lineTo(0.36, -0.16);
  s.lineTo(0.42, -0.22);
  s.lineTo(0.42, -0.56);
  s.lineTo(0.32, -0.66);
  s.lineTo(-0.48, -0.66);
  s.lineTo(-0.70, -0.96);
  s.lineTo(0.42, -0.96);
  s.lineTo(0.70, -0.68);
  s.lineTo(0.70, -0.14);
  s.lineTo(0.46, 0.10);
  s.lineTo(-0.36, 0.22);
  s.lineTo(-0.42, 0.28);
  s.lineTo(-0.42, 0.56);
  s.lineTo(-0.32, 0.66);
  s.lineTo(0.48, 0.66);
  s.closePath();
  return s;
}

/**
 * Builds the glowing AI neural core inlay strip for the futuristic "S"
 */
function createLetterSCoreShape(): THREE.Shape {
  const core = new THREE.Shape();
  core.moveTo(0.46, 0.85);
  core.lineTo(-0.36, 0.85);
  core.lineTo(-0.56, 0.65);
  core.lineTo(-0.56, 0.26);
  core.lineTo(-0.38, 0.08);
  core.lineTo(0.44, -0.04);
  core.lineTo(0.56, -0.16);
  core.lineTo(0.56, -0.62);
  core.lineTo(0.36, -0.82);
  core.lineTo(-0.46, -0.82);
  core.lineTo(-0.38, -0.74);
  core.lineTo(0.32, -0.74);
  core.lineTo(0.46, -0.60);
  core.lineTo(0.46, -0.20);
  core.lineTo(0.36, -0.10);
  core.lineTo(-0.44, 0.02);
  core.lineTo(-0.48, 0.22);
  core.lineTo(-0.48, 0.60);
  core.lineTo(-0.32, 0.76);
  core.lineTo(0.40, 0.76);
  core.closePath();
  return core;
}

/**
 * Builds the 3D AI Futuristic Cyber-Stencil letter "T" shape
 * Features swept 45-degree wingtips, central AI crown notch, hollow neural slot, and spear-point base
 */
function createLetterTShape(): THREE.Shape {
  const t = new THREE.Shape();
  t.moveTo(-0.19, -0.76);
  t.lineTo(0.0, -0.98);
  t.lineTo(0.19, -0.76);
  t.lineTo(0.19, 0.48);
  t.lineTo(0.33, 0.62);
  t.lineTo(0.64, 0.62);
  t.lineTo(0.84, 0.96);
  t.lineTo(0.26, 0.96);
  t.lineTo(0.16, 0.85);
  t.lineTo(-0.16, 0.85);
  t.lineTo(-0.26, 0.96);
  t.lineTo(-0.84, 0.96);
  t.lineTo(-0.64, 0.62);
  t.lineTo(-0.33, 0.62);
  t.lineTo(-0.19, 0.48);
  t.closePath();

  // Precision futuristic vertical slot cutout inside the T stem
  const stemSlot = new THREE.Path();
  stemSlot.moveTo(-0.055, 0.42);
  stemSlot.lineTo(0.055, 0.42);
  stemSlot.lineTo(0.055, -0.56);
  stemSlot.lineTo(0.0, -0.64);
  stemSlot.lineTo(-0.055, -0.56);
  stemSlot.closePath();
  t.holes.push(stemSlot);

  return t;
}

/**
 * Builds the glowing AI neural core inlay for the futuristic "T" crossbar
 */
function createLetterTCoreShape(): THREE.Shape {
  const core = new THREE.Shape();
  core.moveTo(-0.62, 0.74);
  core.lineTo(0.62, 0.74);
  core.lineTo(0.68, 0.83);
  core.lineTo(-0.68, 0.83);
  core.closePath();
  return core;
}

/**
 * Builds the 3D AI Futuristic Cyber-Stencil letter "R" shape
 * Features 45-degree octagonal P-bowl, architectural top-left bevel cut, and high-speed angled leg slash
 */
function createLetterRShape(): THREE.Shape {
  const r = new THREE.Shape();
  r.moveTo(-0.66, -0.96);
  r.lineTo(-0.66, 0.76);
  r.lineTo(-0.46, 0.96);
  r.lineTo(0.38, 0.96);
  r.lineTo(0.68, 0.66);
  r.lineTo(0.68, 0.18);
  r.lineTo(0.42, -0.08);
  r.lineTo(0.32, -0.08);
  r.lineTo(0.74, -0.96);
  r.lineTo(0.38, -0.96);
  r.lineTo(0.0, -0.14);
  r.lineTo(-0.36, -0.14);
  r.lineTo(-0.36, -0.96);
  r.closePath();

  // Octagonal chamfered counter hole inside the upper loop of R
  const hole = new THREE.Path();
  hole.moveTo(-0.36, 0.66);
  hole.lineTo(0.24, 0.66);
  hole.lineTo(0.38, 0.52);
  hole.lineTo(0.38, 0.28);
  hole.lineTo(0.24, 0.14);
  hole.lineTo(-0.36, 0.14);
  hole.closePath();

  r.holes.push(hole);
  return r;
}

/**
 * Builds the glowing AI neural core inlay for the futuristic "R" spine & leg
 */
function createLetterRCoreShape(): THREE.Shape {
  const core = new THREE.Shape();
  core.moveTo(-0.54, -0.82);
  core.lineTo(-0.54, 0.70);
  core.lineTo(-0.40, 0.84);
  core.lineTo(0.30, 0.84);
  core.lineTo(0.24, 0.75);
  core.lineTo(-0.36, 0.75);
  core.lineTo(-0.45, 0.66);
  core.lineTo(-0.45, -0.82);
  core.closePath();
  return core;
}

/**
 * Creates a procedural high-resolution technical dial texture with STR LEGACY markings
 */
function createProceduralDialTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 1024, 1024);
    const cx = 512;
    const cy = 512;

    // Outer technical gold ring
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 464, 0, Math.PI * 2);
    ctx.stroke();

    // Inner cyan ring
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.48)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 376, 0, Math.PI * 2);
    ctx.stroke();

    // Degree ticks around perimeter
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const rInner = isMajor ? 416 : 438;
      const rOuter = 456;

      ctx.strokeStyle = isMajor
        ? 'rgba(229, 193, 88, 0.9)'
        : 'rgba(148, 163, 184, 0.38)';
      ctx.lineWidth = isMajor ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }

    // Crosshairs
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 350, cy);
    ctx.lineTo(cx + 350, cy);
    ctx.moveTo(cx, cy - 350);
    ctx.lineTo(cx, cy + 350);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a procedural metallic badge texture with AI futuristic stencil typography for the front plinth plate
 */
function createLegacyPlinthTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, 1024, 256);

    // Chamfered cyber border frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(44, 18);
    ctx.lineTo(980, 18);
    ctx.lineTo(1006, 44);
    ctx.lineTo(1006, 212);
    ctx.lineTo(980, 238);
    ctx.lineTo(44, 238);
    ctx.lineTo(18, 212);
    ctx.lineTo(18, 44);
    ctx.closePath();
    ctx.stroke();

    // Inner cyan accent corner brackets
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, 960, 192);

    ctx.fillStyle = '#e5c158';
    ctx.font = '800 76px "Syne", "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S T R  ·  A I  L E G A C Y', 512, 130);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a soft radial contact shadow texture
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Str3DSceneSection: React.FC<Str3DSceneSectionProps> = ({
  onSelectProject,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  // Interactive HUD states
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [explodedAmount, setExplodedAmount] = useState<number>(0.12);
  const [finishPreset, setFinishPreset] = useState<FinishPreset>('gold');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  // Mutable refs synchronized with the Three.js loop
  const stateRef = useRef({
    autoRotate: true,
    explodedAmount: 0.12,
    finishPreset: 'gold' as FinishPreset,
    cameraPreset: 'front' as CameraPreset,
    rotationSpeed: 1.0,
    activeNodeIndex: 0,
    cameraTransitionActive: false,
  });

  useEffect(() => {
    stateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.explodedAmount = explodedAmount;
  }, [explodedAmount]);

  useEffect(() => {
    stateRef.current.finishPreset = finishPreset;
  }, [finishPreset]);

  useEffect(() => {
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.cameraTransitionActive = true;
  }, [cameraPreset]);

  useEffect(() => {
    stateRef.current.rotationSpeed = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    stateRef.current.activeNodeIndex = activeNodeIndex;
  }, [activeNodeIndex]);

  // Keyboard shortcut 'H' to toggle HUD drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 'h' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        setHudCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection from GPU renderer string
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
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
      setWebglReady(false);
      return;
    }

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 620;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    // 2. Scene, Fog & Studio Environment Reflection (RoomEnvironment)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a13);
    scene.fog = new THREE.FogExp2(0x070a13, 0.038);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(0, 0.85, 6.8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.25, 0);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.4;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.49;

    const cancelCameraTransition = () => {
      stateRef.current.cameraTransitionActive = false;
    };
    controls.addEventListener('start', cancelCameraTransition);

    // 4. Balanced 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x070a13, 0.7);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3d1, 2.6);
    keyLight.position.set(5, 8, 7);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    const d = 5.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const warmFillLight = new THREE.PointLight(0xd4af37, 2.1, 14);
    warmFillLight.position.set(0, 1.8, 3.2);
    scene.add(warmFillLight);

    // 5. PBR Materials Library
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const dialTexture = createProceduralDialTexture(maxAniso);
    const plinthBadgeTexture = createLegacyPlinthTexture(maxAniso);
    const shadowTexture = createContactShadowTexture();

    const primaryGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.16,
      anisotropy: 0.8,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
    });

    const secondarySlateMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c3242,
      metalness: 0.68,
      roughness: 0.44,
      clearcoat: 0.35,
    });

    const accentCyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.55,
      metalness: 0.45,
      roughness: 0.2,
    });

    const activeNodeMat = new THREE.MeshStandardMaterial({
      color: 0xf5d97e,
      emissive: 0xd4af37,
      emissiveIntensity: 0.95,
      metalness: 0.85,
      roughness: 0.15,
    });

    const plinthPlateMat = new THREE.MeshStandardMaterial({
      map: plinthBadgeTexture,
      metalness: 0.5,
      roughness: 0.3,
    });

    // 6. Grounding & Contact Shadow + Technical Dial Plane
    const groundGroup = new THREE.Group();
    groundGroup.position.y = -1.75;
    scene.add(groundGroup);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 8.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.65,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    groundGroup.add(shadowPlane);

    const dialMaterial = new THREE.MeshBasicMaterial({
      map: dialTexture,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const dialPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 7.0), dialMaterial);
    dialPlane.rotation.x = -Math.PI / 2;
    dialPlane.position.y = 0.03;
    groundGroup.add(dialPlane);

    // 7. Composite Multi-Part 3D "STR" Letter Monogram Sculpture
    const rootAssembly = new THREE.Group();
    scene.add(rootAssembly);

    // Part 1: Architectural Pedestal Plinth Base
    const pedestalBaseGeo = new THREE.CylinderGeometry(2.15, 2.45, 0.34, 64);
    const pedestalBase = new THREE.Mesh(pedestalBaseGeo, secondarySlateMat);
    pedestalBase.position.y = -1.56;
    pedestalBase.castShadow = !isSoftwareGl;
    pedestalBase.receiveShadow = !isSoftwareGl;
    rootAssembly.add(pedestalBase);

    // Part 2: Pedestal Gold Crown Bevel Ring
    const crownRingGeo = new THREE.TorusGeometry(2.12, 0.055, 20, 64);
    const crownRing = new THREE.Mesh(crownRingGeo, primaryGoldMat);
    crownRing.rotation.x = Math.PI / 2;
    crownRing.position.y = -1.38;
    rootAssembly.add(crownRing);

    // Part 3: Front "STR LEGACY" Engraved Nameplate on Plinth
    const nameplateGeo = new THREE.BoxGeometry(2.3, 0.44, 0.14);
    const nameplateMesh = new THREE.Mesh(nameplateGeo, [
      primaryGoldMat,
      primaryGoldMat,
      primaryGoldMat,
      primaryGoldMat,
      plinthPlateMat,
      secondarySlateMat,
    ]);
    nameplateMesh.position.set(0, -1.12, 1.35);
    nameplateMesh.rotation.x = -0.18;
    rootAssembly.add(nameplateMesh);

    // Part 4, 5, 6: Precision Extruded 3D AI Futuristic "S", "T", "R" Letters Group
    const strLettersGroup = new THREE.Group();
    strLettersGroup.position.y = 0.32;
    rootAssembly.add(strLettersGroup);

    // Sharp 1-segment 45-degree architectural cyber bevels
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.44,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.048,
      bevelThickness: 0.058,
      curveSegments: 4,
    };

    const backplateExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.04,
      curveSegments: 4,
    };

    const coreExtrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.02,
      curveSegments: 4,
    };

    const cyberEdgeLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.58,
    });

    // 3D AI Futuristic Letter "S" (Chamfered Body + Slate Backplate + Glowing Cyan Neural Core Inlay + Cyber Edge Highlights)
    const sShape = createLetterSShape();
    const sGeo = new THREE.ExtrudeGeometry(sShape, extrudeSettings);
    sGeo.translate(0, 0, -0.22);
    const sBackGeo = new THREE.ExtrudeGeometry(sShape, backplateExtrudeSettings);
    sBackGeo.translate(0, 0, -0.08);
    const sCoreGeo = new THREE.ExtrudeGeometry(
      createLetterSCoreShape(),
      coreExtrudeSettings
    );
    sCoreGeo.translate(0, 0, -0.04);
    const sEdgesGeo = new THREE.EdgesGeometry(sGeo, 24);

    const letterSGroup = new THREE.Group();
    const letterSMesh = new THREE.Mesh(sGeo, primaryGoldMat);
    letterSMesh.castShadow = !isSoftwareGl;
    const letterSEdges = new THREE.LineSegments(sEdgesGeo, cyberEdgeLineMat);
    letterSMesh.add(letterSEdges);
    const letterSBackMesh = new THREE.Mesh(sBackGeo, secondarySlateMat);
    letterSBackMesh.position.z = -0.24;
    const letterSCoreMesh = new THREE.Mesh(sCoreGeo, accentCyanMat);
    letterSCoreMesh.position.z = 0.27;
    letterSGroup.add(letterSMesh, letterSBackMesh, letterSCoreMesh);
    letterSGroup.position.set(-1.46, 0, 0.08);
    strLettersGroup.add(letterSGroup);

    // 3D AI Futuristic Letter "T" (Swept Wing Cyber Crossbar + Hollow Neural Slot + Glowing Core Inlay)
    const tShape = createLetterTShape();
    const tGeo = new THREE.ExtrudeGeometry(tShape, extrudeSettings);
    tGeo.translate(0, 0, -0.22);
    const tBackGeo = new THREE.ExtrudeGeometry(tShape, backplateExtrudeSettings);
    tBackGeo.translate(0, 0, -0.08);
    const tCoreGeo = new THREE.ExtrudeGeometry(
      createLetterTCoreShape(),
      coreExtrudeSettings
    );
    tCoreGeo.translate(0, 0, -0.04);
    const tEdgesGeo = new THREE.EdgesGeometry(tGeo, 24);

    const letterTGroup = new THREE.Group();
    const letterTMesh = new THREE.Mesh(tGeo, primaryGoldMat);
    letterTMesh.castShadow = !isSoftwareGl;
    const letterTEdges = new THREE.LineSegments(tEdgesGeo, cyberEdgeLineMat);
    letterTMesh.add(letterTEdges);
    const letterTBackMesh = new THREE.Mesh(tBackGeo, accentCyanMat);
    letterTBackMesh.position.z = -0.24;
    const letterTCoreMesh = new THREE.Mesh(tCoreGeo, activeNodeMat);
    letterTCoreMesh.position.z = 0.27;
    letterTGroup.add(letterTMesh, letterTBackMesh, letterTCoreMesh);
    letterTGroup.position.set(0, 0.12, 0.22);
    strLettersGroup.add(letterTGroup);

    // 3D AI Futuristic Letter "R" (Octagonal P-Bowl + Angled Slash Leg + Glowing Cyan Neural Core Inlay)
    const rShape = createLetterRShape();
    const rGeo = new THREE.ExtrudeGeometry(rShape, extrudeSettings);
    rGeo.translate(0, 0, -0.22);
    const rBackGeo = new THREE.ExtrudeGeometry(rShape, backplateExtrudeSettings);
    rBackGeo.translate(0, 0, -0.08);
    const rCoreGeo = new THREE.ExtrudeGeometry(
      createLetterRCoreShape(),
      coreExtrudeSettings
    );
    rCoreGeo.translate(0, 0, -0.04);
    const rEdgesGeo = new THREE.EdgesGeometry(rGeo, 24);

    const letterRGroup = new THREE.Group();
    const letterRMesh = new THREE.Mesh(rGeo, primaryGoldMat);
    letterRMesh.castShadow = !isSoftwareGl;
    const letterREdges = new THREE.LineSegments(rEdgesGeo, cyberEdgeLineMat);
    letterRMesh.add(letterREdges);
    const letterRBackMesh = new THREE.Mesh(rBackGeo, secondarySlateMat);
    letterRBackMesh.position.z = -0.24;
    const letterRCoreMesh = new THREE.Mesh(rCoreGeo, accentCyanMat);
    letterRCoreMesh.position.z = 0.27;
    letterRGroup.add(letterRMesh, letterRBackMesh, letterRCoreMesh);
    letterRGroup.position.set(1.46, 0, 0.08);
    strLettersGroup.add(letterRGroup);

    // Part 7: Framing Orbital Halo Ring & 24 Instanced Studs around the 3D STR Monogram
    const orbitalHaloGeo = new THREE.TorusGeometry(2.55, 0.045, 20, 96);
    const orbitalHalo = new THREE.Mesh(orbitalHaloGeo, primaryGoldMat);
    orbitalHalo.position.y = 0.25;
    rootAssembly.add(orbitalHalo);

    const studGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.16, 12);
    const studCount = 24;
    const studInstanced = new THREE.InstancedMesh(
      studGeo,
      accentCyanMat,
      studCount
    );
    for (let i = 0; i < studCount; i++) {
      const angle = (i / studCount) * Math.PI * 2;
      _dummyPos.set(Math.cos(angle) * 2.55, Math.sin(angle) * 2.55, 0);
      _dummyQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
      const scaleVar = 0.9 + (i % 3) * 0.1;
      _dummyScale.set(scaleVar, scaleVar, scaleVar);
      _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
      studInstanced.setMatrixAt(i, _dummyMatrix);
      _dummyColor.setHex(i % 2 === 0 ? 0x38bdf8 : 0xe5c158);
      studInstanced.setColorAt(i, _dummyColor);
    }
    studInstanced.instanceMatrix.needsUpdate = true;
    if (studInstanced.instanceColor) studInstanced.instanceColor.needsUpdate = true;
    studInstanced.computeBoundingSphere();
    orbitalHalo.add(studInstanced);

    // Part 8: Tilted Cyber Equator Ring
    const equatorRingGeo = new THREE.TorusGeometry(2.85, 0.03, 16, 96);
    const equatorRing = new THREE.Mesh(equatorRingGeo, accentCyanMat);
    equatorRing.position.y = 0.25;
    equatorRing.rotation.x = Math.PI * 0.38;
    rootAssembly.add(equatorRing);

    // Part 9: 8 Orbiting Project Telemetry Nodes (Interactive Raycast Targets on Layer 1)
    const nodesGroup = new THREE.Group();
    nodesGroup.position.y = 0.25;
    rootAssembly.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.18, 1);

    FEATURED_PROJECTS.forEach((proj, idx) => {
      const mesh = new THREE.Mesh(
        nodeGeo,
        idx === 0 ? activeNodeMat : accentCyanMat
      );
      mesh.userData = { projectIndex: idx, projectId: proj.id };
      mesh.layers.enable(1);
      nodesGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Raycaster restricted to Layer 1 for picking project nodes or letters
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodeMeshes, false);
      if (hits.length > 0) {
        const hitIndex = hits[0].object.userData.projectIndex;
        if (typeof hitIndex === 'number') {
          setActiveNodeIndex(hitIndex);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // 8. Animation & Software-WebGL Paced Render Loop
    const clock = new THREE.Clock();
    let currentExploded = stateRef.current.explodedAmount;
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
        explodedAmount: targetExploded,
        finishPreset: currentFinish,
        cameraPreset: camPreset,
        rotationSpeed: speedMult,
        activeNodeIndex: selectedIdx,
        cameraTransitionActive,
      } = stateRef.current;

      // Smooth exponential damping on Exploded View Slider
      currentExploded = THREE.MathUtils.damp(
        currentExploded,
        targetExploded,
        5.5,
        delta
      );

      // Update Material Finish Swatch smoothly
      if (currentFinish === 'gold') {
        primaryGoldMat.color.setHex(0xd4af37);
        primaryGoldMat.metalness = 0.94;
        primaryGoldMat.roughness = 0.16;
        secondarySlateMat.color.setHex(0x1c3242);
      } else if (currentFinish === 'cyber') {
        primaryGoldMat.color.setHex(0x38bdf8);
        primaryGoldMat.metalness = 0.86;
        primaryGoldMat.roughness = 0.18;
        secondarySlateMat.color.setHex(0x0f172a);
      } else {
        primaryGoldMat.color.setHex(0x1e293b);
        primaryGoldMat.metalness = 0.9;
        primaryGoldMat.roughness = 0.24;
        secondarySlateMat.color.setHex(0xd4af37);
      }

      // Exploded-View 3-layer kinematic separation of S - T - R futuristic letters, backplates & front AI neural cores
      letterSGroup.position.set(
        -1.46 - currentExploded * 0.72,
        Math.sin(elapsed * 1.4) * 0.05,
        0.08 + currentExploded * 0.25
      );
      letterSBackMesh.position.z = -0.24 - currentExploded * 0.44;
      letterSCoreMesh.position.z = 0.27 + currentExploded * 0.38;

      letterTGroup.position.set(
        0,
        0.12 + currentExploded * 0.55 + Math.cos(elapsed * 1.4) * 0.05,
        0.22 + currentExploded * 0.52
      );
      letterTBackMesh.position.z = -0.24 - currentExploded * 0.48;
      letterTCoreMesh.position.z = 0.27 + currentExploded * 0.42;

      letterRGroup.position.set(
        1.46 + currentExploded * 0.72,
        Math.sin(elapsed * 1.4 + 1.2) * 0.05,
        0.08 + currentExploded * 0.25
      );
      letterRBackMesh.position.z = -0.24 - currentExploded * 0.44;
      letterRCoreMesh.position.z = 0.27 + currentExploded * 0.38;

      pedestalBase.position.y = -1.56 - currentExploded * 0.45;
      crownRing.position.y = -1.38 - currentExploded * 0.3;
      nameplateMesh.position.z = 1.35 + currentExploded * 0.55;
      orbitalHalo.scale.setScalar(1 + currentExploded * 0.2);

      // 3D Rotation of the STR Monogram Sculpture & Orbital Rings
      const rotStep = shouldRotate ? delta * 0.5 * speedMult : 0;
      strLettersGroup.rotation.y += rotStep;

      orbitalHalo.rotation.y -= rotStep * 0.65;
      orbitalHalo.rotation.z = Math.sin(elapsed * 0.5) * 0.14;

      equatorRing.rotation.z += rotStep * 0.9;
      dialPlane.rotation.z = elapsed * 0.08;

      // Orbit the 8 Project Telemetry Nodes around the 3D STR letters
      const orbitRadius = 3.05 + currentExploded * 0.75;
      nodeMeshes.forEach((mesh, idx) => {
        const angle =
          elapsed * 0.32 * (shouldRotate ? speedMult : 0) +
          (idx / 8) * Math.PI * 2;
        const yOffset =
          Math.sin(elapsed * 1.5 + idx) * (0.28 + currentExploded * 0.25);
        mesh.position.set(
          Math.cos(angle) * orbitRadius,
          yOffset,
          Math.sin(angle) * orbitRadius
        );
        mesh.rotation.y += delta * 1.2;
        mesh.rotation.x += delta * 0.8;

        const isSelected = idx === selectedIdx;
        mesh.material = isSelected ? activeNodeMat : accentCyanMat;
        const targetNodeScale = isSelected ? 1.45 : 1.0;
        mesh.scale.setScalar(
          THREE.MathUtils.damp(mesh.scale.x, targetNodeScale, 8, delta)
        );
      });

      // Smooth Camera Preset Transitions
      if (cameraTransitionActive) {
        if (camPreset === 'front') {
          _targetCamPos.set(0, 0.85, 6.8);
        } else if (camPreset === 'isometric') {
          _targetCamPos.set(5.4, 3.2, 6.2);
        } else {
          _targetCamPos.set(0.01, 8.4, 1.2);
        }

        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          _targetCamPos.x,
          4.5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          _targetCamPos.y,
          4.5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          _targetCamPos.z,
          4.5,
          delta
        );
        controls.target.lerp(_targetLookAt, 1 - Math.exp(-5 * delta));

        if (camera.position.distanceTo(_targetCamPos) < 0.05) {
          stateRef.current.cameraTransitionActive = false;
        }
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
      const newW = container.clientWidth || 1200;
      const newH = container.clientHeight || 620;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', cancelCameraTransition);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();

      // Dispose geometries, materials, and textures
      pedestalBaseGeo.dispose();
      crownRingGeo.dispose();
      nameplateGeo.dispose();
      sGeo.dispose();
      sBackGeo.dispose();
      sCoreGeo.dispose();
      sEdgesGeo.dispose();
      tGeo.dispose();
      tBackGeo.dispose();
      tCoreGeo.dispose();
      tEdgesGeo.dispose();
      rGeo.dispose();
      rBackGeo.dispose();
      rCoreGeo.dispose();
      rEdgesGeo.dispose();
      orbitalHaloGeo.dispose();
      studGeo.dispose();
      equatorRingGeo.dispose();
      nodeGeo.dispose();

      primaryGoldMat.dispose();
      secondarySlateMat.dispose();
      accentCyanMat.dispose();
      activeNodeMat.dispose();
      plinthPlateMat.dispose();
      dialMaterial.dispose();
      cyberEdgeLineMat.dispose();

      dialTexture.dispose();
      plinthBadgeTexture.dispose();
      shadowTexture.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  const activeProject =
    FEATURED_PROJECTS[activeNodeIndex] || FEATURED_PROJECTS[0];

  return (
    <section
      id="spatial-3d"
      className="max-w-[1280px] mx-auto px-6 py-20 lg:py-24 border-b border-white/5"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
            Interactive Three.js 3D Monogram · 360° 3D Rotation
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em] text-[#f8fafc]"
            style={{ textWrap: 'balance' }}
          >
            STR 3D Extruded Letter Monogram & Project Constellation
          </h2>
          <p className="text-sm text-[#94a3b8]">
            Rotate the 3D beveled S · T · R letter sculpture 360° in real time, separate the interlocking letter layers with the Explode slider, or click any orbiting project node.
          </p>
        </div>

        {/* Active 3D Node Quick Readout */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0b1120] border border-[#d4af37]/30 shrink-0">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37]">
              Selected 3D Node {activeProject.index} / 08
            </p>
            <p className="text-sm font-bold text-[#f8fafc]">
              {activeProject.title}
            </p>
            <p className="text-xs text-[#38bdf8] font-mono tabular-nums">
              Impact: {activeProject.quantifiedImpact.value}{' '}
              {activeProject.quantifiedImpact.label}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectProject(activeProject)}
            className="px-3.5 py-2 rounded-lg bg-[#d4af37] hover:bg-[#e5c158] text-[#070a13] text-xs font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Inspect Node
          </button>
        </div>
      </div>

      {/* 3D VIEWPORT CONTAINER (Unobstructed Center + Collapsible Bottom Dock) */}
      <div className="relative w-full h-[560px] sm:h-[640px] rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#070a13] shadow-[0_0_50px_rgba(7,10,19,0.9)]">
        {/* Top-Left Minimal Spec Header Overlay (Solid/Opaque Surface — No backdrop-filter over WebGL) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#070a13]/90 border border-[#d4af37]/25">
          <Rotate3d className="w-4 h-4 text-[#d4af37]" />
          <div className="text-xs">
            <span className="font-semibold text-[#f8fafc]">
              3D Extruded S · T · R Monogram
            </span>
            <span className="text-[#94a3b8] ml-2 hidden sm:inline">
              · Drag to Orbit 360° · Scroll to Zoom · Click Orbiting Nodes
            </span>
          </div>
        </div>

        {/* Isolated Empty WebGL Canvas Mount Ref */}
        {webglReady ? (
          <div
            ref={canvasMountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            aria-label="Interactive Three.js 3D STR Letter Monogram Scene"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0b1120]">
            <Rotate3d className="w-10 h-10 text-[#d4af37] mb-3" />
            <p className="text-base font-semibold text-[#f8fafc]">
              3D STR Letter Monogram Preview
            </p>
            <p className="text-xs text-[#94a3b8] max-w-md mt-1">
              Interactive Three.js PBR 3D S · T · R letter sculpture representing Silambarasan C’s STR LEGACY brand.
            </p>
          </div>
        )}

        {/* COLLAPSIBLE BOTTOM CONTROL DOCK (Zero Viewport Occlusion, No backdrop-filter over WebGL) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-[920px] flex flex-col items-center">
          {/* Collapse / Expand Toggle Tab */}
          <button
            type="button"
            onClick={() => setHudCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-t-xl bg-[#0b1120] border border-b-0 border-[#d4af37]/30 text-[11px] font-mono text-[#e5c158] hover:text-[#f8fafc] transition-colors cursor-pointer"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls (H)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls (H)</span>
              </>
            )}
          </button>

          {/* Main Horizontal Control Dock */}
          {!hudCollapsed && (
            <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-[#0b1120]/95 border border-[#d4af37]/35 shadow-2xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* 1. 3D Rotation Toggle & Speed */}
                <div className="md:col-span-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoRotate((prev) => !prev)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      autoRotate
                        ? 'bg-[#d4af37] text-[#070a13]'
                        : 'bg-[#070a13] text-[#94a3b8] border border-white/10 hover:text-[#f8fafc]'
                    }`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>{autoRotate ? '3D Rotate: ON' : '3D Rotate: OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setRotationSpeed((prev) =>
                        prev === 1 ? 2 : prev === 2 ? 0.5 : 1
                      )
                    }
                    className="px-2.5 py-2 rounded-xl bg-[#070a13] text-[#38bdf8] border border-white/10 hover:border-[#38bdf8]/40 text-xs font-mono tabular-nums cursor-pointer whitespace-nowrap shrink-0"
                    title="Cycle 3D rotation speed"
                  >
                    {rotationSpeed}x
                  </button>
                </div>

                {/* 2. Exploded-View Kinematic Slider for S · T · R Letters */}
                <div className="md:col-span-4 flex items-center gap-2.5 bg-[#070a13] px-3 py-2 rounded-xl border border-white/10">
                  <Layers className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <label
                    htmlFor="exploded-slider"
                    className="text-[11px] font-medium text-[#cbd5e1] whitespace-nowrap shrink-0"
                  >
                    Explode STR
                  </label>
                  <input
                    id="exploded-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedAmount}
                    onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-[#e5c158] tabular-nums w-9 text-right shrink-0">
                    {Math.round(explodedAmount * 100)}%
                  </span>
                </div>

                {/* 3. PBR Material Finish Switcher */}
                <div className="md:col-span-3 flex items-center gap-1 bg-[#070a13] p-1 rounded-xl border border-white/10">
                  {(
                    [
                      { id: 'gold', label: 'Gold' },
                      { id: 'cyber', label: 'Cyber' },
                      { id: 'obsidian', label: 'Stealth' },
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setFinishPreset(preset.id)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        finishPreset === preset.id
                          ? 'bg-[#1c3242] text-[#e5c158] border border-[#d4af37]/40'
                          : 'text-[#94a3b8] hover:text-[#f8fafc]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* 4. Camera Angle Presets */}
                <div className="md:col-span-2 flex items-center gap-1 bg-[#070a13] p-1 rounded-xl border border-white/10">
                  {(
                    [
                      { id: 'front', label: 'Front' },
                      { id: 'isometric', label: 'Iso' },
                      { id: 'top', label: 'Top' },
                    ] as const
                  ).map((cam) => (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraPreset(cam.id)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        cameraPreset === cam.id
                          ? 'bg-[#d4af37] text-[#070a13]'
                          : 'text-[#94a3b8] hover:text-[#f8fafc]'
                      }`}
                    >
                      {cam.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Constellation Selector Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                {FEATURED_PROJECTS.map((proj, idx) => {
                  const isSelected = idx === activeNodeIndex;
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => setActiveNodeIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-[#d4af37]/20 text-[#e5c158] border border-[#d4af37]'
                          : 'bg-[#070a13] text-[#94a3b8] border border-white/5 hover:text-[#f8fafc]'
                      }`}
                    >
                      {proj.index}. {proj.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
