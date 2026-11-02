import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Compass,
  RotateCw,
  Sun,
  Moon,
  CloudRain,
  Layers,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Camera,
  Shield,
  Zap,
  Activity,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Pre-allocate module-scope math objects to avoid GC in animation loop
const _targetLookAt = new THREE.Vector3(0, 0, 0);

interface Drone3DStudioProps {
  reducedMotion?: boolean;
}

export const Drone3DStudio: React.FC<Drone3DStudioProps> = ({ reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'flight' | 'layers' | 'optics' | 'lighting'>('flight');
  
  // Interactive State
  const [rotorsSpinning, setRotorsSpinning] = useState(false);
  const [explodedAmount, setExplodedAmount] = useState(0); // 0 to 1
  const [lightPreset, setLightPreset] = useState<'golden' | 'studio' | 'monsoon' | 'night'>('golden');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [gimbalPitch, setGimbalPitch] = useState(-15); // degrees (-90 to +20)
  const [hoverAltitude, setHoverAltitude] = useState(0); // 0 to 1.8 meters
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'front' | 'top' | 'sensor'>('orbit');
  const [fullscreen, setFullscreen] = useState(false);

  // Mutable refs to pass into Three.js render loop without remounting scene
  const stateRef = useRef({
    rotorsSpinning: false,
    explodedAmount: 0,
    gimbalPitch: -15,
    hoverAltitude: 0,
    cameraPreset: 'orbit' as 'orbit' | 'front' | 'top' | 'sensor',
    wireframeMode: false,
    lightPreset: 'golden' as 'golden' | 'studio' | 'monsoon' | 'night',
    reducedMotion: false
  });

  useEffect(() => {
    stateRef.current.rotorsSpinning = rotorsSpinning;
    stateRef.current.explodedAmount = explodedAmount;
    stateRef.current.gimbalPitch = gimbalPitch;
    stateRef.current.hoverAltitude = hoverAltitude;
    stateRef.current.cameraPreset = cameraPreset;
    stateRef.current.wireframeMode = wireframeMode;
    stateRef.current.lightPreset = lightPreset;
    stateRef.current.reducedMotion = reducedMotion;
  }, [rotorsSpinning, explodedAmount, gimbalPitch, hoverAltitude, cameraPreset, wireframeMode, lightPreset, reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090a);
    scene.fog = new THREE.FogExp2(0x07090a, 0.035);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 3.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment reflection using RoomEnvironment (Mandatory by Three.js skill)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe9be86, 0x14221a, 0.6);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    keyLight.position.set(4, 5, 3);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 15;
      const d = 3;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7ba294, 1.2);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const frontFillLight = new THREE.PointLight(0xd9803f, 0.8, 8);
    frontFillLight.position.set(0, 1, 3);
    scene.add(frontFillLight);

    // Procedural carbon fiber texture via Canvas
    const createCarbonTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#181b1d';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#22272b';
      for (let y = 0; y < 128; y += 8) {
        for (let x = 0; x < 128; x += 8) {
          if ((x + y) % 16 === 0) {
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(12, 12);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const carbonTex = createCarbonTexture();

    // Materials Library
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x222629,
      metalness: 0.35,
      roughness: 0.32,
      map: carbonTex
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f1113,
      metalness: 0.85,
      roughness: 0.2
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd9803f,
      metalness: 0.9,
      roughness: 0.25
    });

    const propMat = new THREE.MeshStandardMaterial({
      color: 0x15181a,
      metalness: 0.5,
      roughness: 0.2,
      transparent: true,
      opacity: 0.94
    });

    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x050b14,
      metalness: 0.1,
      roughness: 0.05,
      transmission: isSoftwareGl ? 0 : 0.92,
      ior: 1.55,
      thickness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const sensorSiliconMat = new THREE.MeshStandardMaterial({
      color: 0x1a2b3c,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0b1f2e,
      emissiveIntensity: 0.4
    });

    const ledRedMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x22ff44 });

    // Contact Shadow Plane beneath the drone
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const gradient = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0,0,0,0.75)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = gradient;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.6
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.01;
    scene.add(contactShadow);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0xd9803f, 0x1c3225);
    gridHelper.position.y = -0.02;
    scene.add(gridHelper);

    // ==========================================
    // PROCEDURAL 3D DRONE (Mavic Air 2 Class)
    // Multi-part THREE.Group hierarchy
    // ==========================================
    const droneRoot = new THREE.Group();
    droneRoot.position.set(0, 0.4, 0);
    scene.add(droneRoot);

    // Subsystem Groups for Exploded View
    const groupFuselage = new THREE.Group(); // Fuselage base & electronics
    const groupCanopy = new THREE.Group();   // Top aerodynamic shell
    const groupArms = new THREE.Group();     // 4 folding carbon arms + landing gear
    const groupMotors = new THREE.Group();   // 4 brushless motor assemblies
    const groupGimbal = new THREE.Group();   // 3-axis motorized gimbal & 4K camera
    const groupBattery = new THREE.Group();  // Intelligent LiPo flight pack

    droneRoot.add(groupFuselage);
    droneRoot.add(groupCanopy);
    droneRoot.add(groupArms);
    droneRoot.add(groupMotors);
    droneRoot.add(groupGimbal);
    droneRoot.add(groupBattery);

    // --- 1. Fuselage Bottom & Structure ---
    const lowerBodyGeo = new THREE.BoxGeometry(0.5, 0.12, 0.95);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
    lowerBody.castShadow = !isSoftwareGl;
    lowerBody.receiveShadow = !isSoftwareGl;
    groupFuselage.add(lowerBody);

    // Heat sink fins underside
    for (let i = -0.2; i <= 0.2; i += 0.08) {
      const finGeo = new THREE.BoxGeometry(0.24, 0.02, 0.02);
      const fin = new THREE.Mesh(finGeo, darkTrimMat);
      fin.position.set(0, -0.065, i);
      groupFuselage.add(fin);
    }

    // Downward Optical Flow & Ultrasonic Sensors
    const opticalSensorGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 16);
    const optLeft = new THREE.Mesh(opticalSensorGeo, darkTrimMat);
    optLeft.position.set(-0.08, -0.07, 0.1);
    const optRight = optLeft.clone();
    optRight.position.x = 0.08;
    groupFuselage.add(optLeft, optRight);

    // --- 2. Aerodynamic Top Canopy (Explodes Upward) ---
    const canopyShape = new THREE.Shape();
    canopyShape.moveTo(-0.25, -0.45);
    canopyShape.lineTo(0.25, -0.45);
    canopyShape.lineTo(0.2, 0.4);
    canopyShape.lineTo(-0.2, 0.4);
    canopyShape.closePath();
    const canopyExtrudeSettings = {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };
    const canopyGeo = new THREE.ExtrudeGeometry(canopyShape, canopyExtrudeSettings);
    canopyGeo.center();
    const canopy = new THREE.Mesh(canopyGeo, bodyMat);
    canopy.rotation.x = Math.PI / 2;
    canopy.position.y = 0.1;
    canopy.castShadow = !isSoftwareGl;
    groupCanopy.add(canopy);

    // Heino Xide Metallic Crest on Canopy
    const badgeGeo = new THREE.BoxGeometry(0.12, 0.01, 0.06);
    const badge = new THREE.Mesh(badgeGeo, brushedGoldMat);
    badge.position.set(0, 0.165, -0.05);
    groupCanopy.add(badge);

    // Forward Binocular Obstacle Avoidance Cameras
    const fwdSensorGeo = new THREE.SphereGeometry(0.025, 12, 12);
    const fwdLeft = new THREE.Mesh(fwdSensorGeo, darkTrimMat);
    fwdLeft.position.set(-0.12, 0.08, -0.48);
    const fwdRight = fwdLeft.clone();
    fwdRight.position.x = 0.12;
    groupCanopy.add(fwdLeft, fwdRight);

    // --- 3. Folding Carbon Arms ---
    interface ArmDef {
      name: string;
      startX: number;
      startZ: number;
      endX: number;
      endZ: number;
      ledColor: THREE.Material;
    }
    const armsConfig: ArmDef[] = [
      { name: 'FL', startX: -0.15, startZ: -0.2, endX: -0.85, endZ: -0.65, ledColor: ledRedMat },
      { name: 'FR', startX: 0.15, startZ: -0.2, endX: 0.85, endZ: -0.65, ledColor: ledRedMat },
      { name: 'RL', startX: -0.15, startZ: 0.2, endX: -0.9, endZ: 0.65, ledColor: ledGreenMat },
      { name: 'RR', startX: 0.15, startZ: 0.2, endX: 0.9, endZ: 0.65, ledColor: ledGreenMat }
    ];

    const propellerMeshes: THREE.Group[] = [];

    armsConfig.forEach((arm) => {
      const armGroup = new THREE.Group();

      const dx = arm.endX - arm.startX;
      const dz = arm.endZ - arm.startZ;
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dz, dx);

      const armTubeGeo = new THREE.BoxGeometry(length, 0.045, 0.06);
      const armTube = new THREE.Mesh(armTubeGeo, bodyMat);
      armTube.position.set((arm.startX + arm.endX) / 2, 0.02, (arm.startZ + arm.endZ) / 2);
      armTube.rotation.y = -angle;
      armTube.castShadow = !isSoftwareGl;
      armGroup.add(armTube);

      // Landing Gear Leg tip
      const legGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.16, 8);
      const leg = new THREE.Mesh(legGeo, darkTrimMat);
      leg.position.set(arm.endX, -0.06, arm.endZ);
      armGroup.add(leg);

      // Arm Navigation LED
      const ledGeo = new THREE.SphereGeometry(0.02, 8, 8);
      const led = new THREE.Mesh(ledGeo, arm.ledColor);
      led.position.set(arm.endX, -0.02, arm.endZ + (arm.endZ > 0 ? 0.04 : -0.04));
      armGroup.add(led);

      groupArms.add(armGroup);

      // Motor Hub
      const motorHub = new THREE.Group();
      motorHub.position.set(arm.endX, 0.06, arm.endZ);

      const motorCanGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.06, 20);
      const motorCan = new THREE.Mesh(motorCanGeo, darkTrimMat);
      motorCan.castShadow = !isSoftwareGl;
      motorHub.add(motorCan);

      const rotorCapGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.025, 16);
      const rotorCap = new THREE.Mesh(rotorCapGeo, brushedGoldMat);
      rotorCap.position.y = 0.04;
      motorHub.add(rotorCap);

      // Propeller Assembly
      const propAssembly = new THREE.Group();
      propAssembly.position.y = 0.055;

      const bladeLength = 0.42;
      const bladeGeo = new THREE.BoxGeometry(bladeLength, 0.008, 0.04);
      const blade1 = new THREE.Mesh(bladeGeo, propMat);
      blade1.position.x = bladeLength / 2;
      blade1.rotation.z = 0.06;

      const blade2 = new THREE.Mesh(bladeGeo, propMat);
      blade2.position.x = -bladeLength / 2;
      blade2.rotation.z = -0.06;

      propAssembly.add(blade1, blade2);
      motorHub.add(propAssembly);

      propellerMeshes.push(propAssembly);
      groupMotors.add(motorHub);
    });

    // --- 4. 3-Axis Motorized Gimbal & 4K Camera ---
    const gimbalAssembly = new THREE.Group();
    gimbalAssembly.position.set(0, -0.04, -0.42);

    const yawMotorGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16);
    const yawMotor = new THREE.Mesh(yawMotorGeo, darkTrimMat);
    gimbalAssembly.add(yawMotor);

    const gimbalPitchGroup = new THREE.Group();
    gimbalPitchGroup.position.set(0, -0.04, 0);

    const pitchArmGeo = new THREE.BoxGeometry(0.12, 0.015, 0.015);
    const pitchArm = new THREE.Mesh(pitchArmGeo, darkTrimMat);
    gimbalPitchGroup.add(pitchArm);

    const camHousingGeo = new THREE.BoxGeometry(0.09, 0.07, 0.09);
    const camHousing = new THREE.Mesh(camHousingGeo, darkTrimMat);
    camHousing.castShadow = !isSoftwareGl;
    gimbalPitchGroup.add(camHousing);

    const lensBarrelGeo = new THREE.CylinderGeometry(0.032, 0.035, 0.04, 24);
    const lensBarrel = new THREE.Mesh(lensBarrelGeo, darkTrimMat);
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.z = -0.06;
    gimbalPitchGroup.add(lensBarrel);

    const goldRingGeo = new THREE.TorusGeometry(0.033, 0.003, 8, 24);
    const goldRing = new THREE.Mesh(goldRingGeo, brushedGoldMat);
    goldRing.position.z = -0.055;
    gimbalPitchGroup.add(goldRing);

    const glassGeo = new THREE.SphereGeometry(0.028, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const glass = new THREE.Mesh(glassGeo, lensGlassMat);
    glass.rotation.x = -Math.PI / 2;
    glass.position.z = -0.075;
    gimbalPitchGroup.add(glass);

    const sensorGeo = new THREE.PlaneGeometry(0.04, 0.03);
    const sensor = new THREE.Mesh(sensorGeo, sensorSiliconMat);
    sensor.position.z = -0.04;
    gimbalPitchGroup.add(sensor);

    gimbalAssembly.add(gimbalPitchGroup);
    groupGimbal.add(gimbalAssembly);

    // --- 5. Intelligent Flight Battery (Removable Rear Pack) ---
    const batteryGeo = new THREE.BoxGeometry(0.38, 0.1, 0.4);
    const battery = new THREE.Mesh(batteryGeo, bodyMat);
    battery.position.set(0, 0.02, 0.42);
    battery.castShadow = !isSoftwareGl;
    groupBattery.add(battery);

    for (let i = -0.06; i <= 0.06; i += 0.04) {
      const battLedGeo = new THREE.SphereGeometry(0.008, 8, 8);
      const battLed = new THREE.Mesh(battLedGeo, ledGreenMat);
      battLed.position.set(i, 0.075, 0.61);
      groupBattery.add(battLed);
    }

    // --- Interactive Orbit Controls ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const spherical = {
      radius: 4.8,
      theta: 0.8,
      phi: 1.15
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      spherical.theta -= dx * 0.008;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.02, spherical.phi - dy * 0.008));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(2.0, Math.min(8.0, spherical.radius + e.deltaY * 0.005));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // ANIMATION & KINEMATICS LOOP
    // ==========================================
    let frameId = 0;
    const clock = new THREE.Clock();

    const curCamPos = new THREE.Vector3().copy(camera.position);
    const targetCamPos = new THREE.Vector3();

    function tick() {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const s = stateRef.current;

      // 1. Camera Preset Interpolation
      if (s.cameraPreset === 'orbit') {
        targetCamPos.set(
          spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta),
          spherical.radius * Math.cos(spherical.phi),
          spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta)
        );
      } else if (s.cameraPreset === 'front') {
        targetCamPos.set(0, 0.45, -2.6);
      } else if (s.cameraPreset === 'top') {
        targetCamPos.set(0, 4.2, 0.05);
      } else if (s.cameraPreset === 'sensor') {
        targetCamPos.set(0.35, 0.32, -1.1);
      }

      curCamPos.lerp(targetCamPos, Math.min(1, delta * 5));
      camera.position.copy(curCamPos);
      camera.lookAt(_targetLookAt);

      // 2. Flight Hover Physics & Body Wobble
      const targetHoverY = 0.4 + s.hoverAltitude;
      const targetRoll = s.rotorsSpinning ? Math.sin(time * 2.5) * 0.04 : 0;
      const targetPitch = s.rotorsSpinning ? Math.cos(time * 1.8) * 0.03 : 0;
      const hoverWobble = s.rotorsSpinning ? Math.sin(time * 5) * 0.025 : 0;

      droneRoot.position.y = THREE.MathUtils.damp(
        droneRoot.position.y,
        targetHoverY + hoverWobble,
        6,
        delta
      );
      droneRoot.rotation.z = THREE.MathUtils.damp(droneRoot.rotation.z, targetRoll, 4, delta);
      droneRoot.rotation.x = THREE.MathUtils.damp(droneRoot.rotation.x, targetPitch, 4, delta);

      // Contact shadow dissipation on altitude lift
      const shadowScale = Math.max(0.4, 1 - s.hoverAltitude * 0.35);
      contactShadow.scale.set(shadowScale, shadowScale, shadowScale);
      shadowMat.opacity = Math.max(0.12, 0.6 - s.hoverAltitude * 0.25);

      // 3. Propeller Spin
      if (s.rotorsSpinning) {
        const spinSpeed = 38 * delta;
        propellerMeshes.forEach((mesh, idx) => {
          mesh.rotation.y += (idx % 2 === 0 ? 1 : -1) * spinSpeed;
        });
      }

      // 4. Gimbal Pitch Angle Control
      const targetGimbalRad = THREE.MathUtils.degToRad(s.gimbalPitch);
      gimbalPitchGroup.rotation.x = THREE.MathUtils.damp(
        gimbalPitchGroup.rotation.x,
        targetGimbalRad,
        8,
        delta
      );

      // 5. Mechanical Exploded View Separations
      const ex = s.explodedAmount;
      groupCanopy.position.y = THREE.MathUtils.damp(groupCanopy.position.y, ex * 0.85, 6, delta);
      groupBattery.position.z = THREE.MathUtils.damp(groupBattery.position.z, 0.42 + ex * 0.75, 6, delta);
      groupGimbal.position.z = THREE.MathUtils.damp(groupGimbal.position.z, -0.42 - ex * 0.65, 6, delta);
      groupGimbal.position.y = THREE.MathUtils.damp(groupGimbal.position.y, -0.04 - ex * 0.2, 6, delta);
      groupMotors.position.y = THREE.MathUtils.damp(groupMotors.position.y, ex * 0.45, 6, delta);
      groupFuselage.position.y = THREE.MathUtils.damp(groupFuselage.position.y, -ex * 0.35, 6, delta);

      // 6. Lighting Atmosphere Updates
      if (s.lightPreset === 'golden') {
        keyLight.color.setHex(0xffaa55);
        keyLight.intensity = 2.8;
        hemiLight.color.setHex(0xe9be86);
        hemiLight.groundColor.setHex(0x14221a);
        if (scene.fog) scene.fog.color.setHex(0x0e0a07);
        renderer.setClearColor(0x0e0a07);
      } else if (s.lightPreset === 'studio') {
        keyLight.color.setHex(0xffffff);
        keyLight.intensity = 2.2;
        hemiLight.color.setHex(0xd0e0e3);
        hemiLight.groundColor.setHex(0x111618);
        if (scene.fog) scene.fog.color.setHex(0x07090a);
        renderer.setClearColor(0x07090a);
      } else if (s.lightPreset === 'monsoon') {
        keyLight.color.setHex(0x7ba2b8);
        keyLight.intensity = 1.4;
        hemiLight.color.setHex(0x5a7888);
        hemiLight.groundColor.setHex(0x091218);
        if (scene.fog) scene.fog.color.setHex(0x080f14);
        renderer.setClearColor(0x080f14);
      } else if (s.lightPreset === 'night') {
        keyLight.color.setHex(0x223344);
        keyLight.intensity = 0.5;
        hemiLight.color.setHex(0x112233);
        hemiLight.groundColor.setHex(0x030608);
        if (scene.fog) scene.fog.color.setHex(0x030507);
        renderer.setClearColor(0x030507);
      }

      // Wireframe toggle across materials
      bodyMat.wireframe = s.wireframeMode;
      darkTrimMat.wireframe = s.wireframeMode;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        // Safe software loop pacing as required by skill
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            gl.deleteSync(sync);
            frameId = window.setTimeout(tick, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      carbonTex.dispose();
      shadowTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="studio-3d" aria-label="Interactive 3D Drone Studio" className="py-24 sm:py-32 relative">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.25em] uppercase text-[#d9803f] mb-3">
              <span className="w-5 h-px bg-[#d9803f]" aria-hidden="true" />
              Real-time WebGL Simulation
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f3ede2] font-normal tracking-tight">
              3D Aerial <em className="italic text-[#d9803f] font-light">Drone Workbench</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#f3ede2]/65 max-w-xl">
              Inspect the primary aircraft behind Heino Xide's films. Orbit, test gimbal kinematics, simulate coastal flight winds, and explore exploded aerospace components in real time.
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setRotorsSpinning((prev) => !prev)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 ${
                rotorsSpinning
                  ? 'bg-[#d9803f] text-[#07090a] shadow-lg shadow-[#d9803f]/20'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {rotorsSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{rotorsSpinning ? 'Disarm Rotors' : 'Spin Rotors'}</span>
            </button>

            <button
              onClick={() => setWireframeMode((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                wireframeMode
                  ? 'bg-[#d9803f]/20 border-[#d9803f] text-[#d9803f]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
              }`}
              title="Toggle Wireframe X-Ray"
              aria-label="Toggle Wireframe Mode"
            >
              <Activity className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D VIEWPORT CONTAINER */}
        <div
          className={`relative w-full rounded-2xl border border-white/10 overflow-hidden bg-[#07090a] transition-all duration-500 ${
            fullscreen ? 'fixed inset-0 z-[200] rounded-none border-none' : 'h-[580px] sm:h-[680px]'
          }`}
        >
          {/* WebGL Canvas Mount (Clean container with zero React overlay interference) */}
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

          {/* Minimal Spec Badge (Top-Left) */}
          <div className="absolute top-5 left-5 z-20 pointer-events-none">
            <div className="px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-left">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#d9803f]">
                <Shield className="w-3 h-3" />
                <span>Aircraft 01 // DJI Mavic Air 2</span>
              </div>
              <div className="text-xs font-medium text-white mt-0.5">
                4K 60FPS · 1/2" Quad-Bayer · 34-min Flight Endurance
              </div>
            </div>
          </div>

          {/* Top-Right Quick Utilities (Fullscreen & Reset Camera) */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
            <button
              onClick={() => {
                setCameraPreset('orbit');
                setGimbalPitch(-15);
                setHoverAltitude(0);
                setExplodedAmount(0);
              }}
              className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFullscreen((prev) => !prev)}
              className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
              aria-label="Toggle Fullscreen"
            >
              {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Telemetry Strip (Top-Center Floating HUD) */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-6 px-5 py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/80">
            <div>
              <span className="text-white/40 mr-1.5">ALT:</span>
              <span className="text-white tabular-nums">{(0.4 + hoverAltitude).toFixed(2)}m</span>
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div>
              <span className="text-white/40 mr-1.5">GIMBAL:</span>
              <span className="text-[#e9be86] tabular-nums">{gimbalPitch}&deg;</span>
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div>
              <span className="text-white/40 mr-1.5">RPM:</span>
              <span className={`tabular-nums ${rotorsSpinning ? 'text-emerald-400' : 'text-white/50'}`}>
                {rotorsSpinning ? '8,420' : '0'}
              </span>
            </div>
            <div className="w-px h-3 bg-white/15" />
            <div>
              <span className="text-white/40 mr-1.5">BATTERY:</span>
              <span className="text-emerald-400 tabular-nums">98% (12.6V)</span>
            </div>
          </div>

          {/* Interaction Instruction Pill */}
          <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
            <span className="text-[11px] font-sans tracking-wide text-white/40 bg-black/50 px-3 py-1 rounded-full border border-white/5">
              Drag to 360° orbit · Scroll to zoom
            </span>
          </div>

          {/* ======================================================== */}
          {/* ERGONOMIC COLLAPSIBLE BOTTOM DOCK (Zero Viewport Occlusion) */}
          {/* As required by Three.js architectural guidelines           */}
          {/* ======================================================== */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-[940px] px-3 sm:px-4">
            <div className="flex flex-col items-center">
              {/* Collapse / Expand Toggle Button */}
              <button
                onClick={() => setHudCollapsed((prev) => !prev)}
                className="mb-1.5 px-3 py-1 rounded-t-lg bg-black/90 border-t border-x border-white/15 text-[10px] font-medium tracking-wider uppercase text-white/70 hover:text-white transition-colors flex items-center gap-1 shadow-lg"
              >
                {hudCollapsed ? <ChevronUp className="w-3 h-3 text-[#d9803f]" /> : <ChevronDown className="w-3 h-3 text-[#d9803f]" />}
                <span>{hudCollapsed ? 'Show Controls' : 'Hide Controls (Zen Mode)'}</span>
              </button>

              {/* Main Dock Container */}
              <div
                className={`w-full rounded-2xl bg-[#0d1411]/95 backdrop-blur-xl border border-white/15 p-3 sm:p-4 shadow-2xl transition-all duration-300 ${
                  hudCollapsed ? 'opacity-0 translate-y-10 pointer-events-none h-0 overflow-hidden p-0' : 'opacity-100 translate-y-0'
                }`}
              >
                {/* Dock Tabs Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[
                      { id: 'flight', label: 'Flight & Gimbal', icon: Compass },
                      { id: 'layers', label: 'Exploded View', icon: Layers },
                      { id: 'optics', label: 'Camera & Angles', icon: Camera },
                      { id: 'lighting', label: 'Coastal Lighting', icon: Sun }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-[#d9803f] text-[#07090a] font-semibold'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                    HEINO XIDE // AEROSPACE WORKBENCH
                  </span>
                </div>

                {/* Dock Tab Panes */}
                <div className="min-h-[58px] flex items-center">
                  {/* TAB 1: Flight & Gimbal Kinematics */}
                  {activeTab === 'flight' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full items-center text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono text-white/70">
                          <span>HOVER ALTITUDE</span>
                          <span className="text-[#d9803f] tabular-nums">{hoverAltitude.toFixed(1)}m</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1.8"
                          step="0.1"
                          value={hoverAltitude}
                          onChange={(e) => setHoverAltitude(parseFloat(e.target.value))}
                          className="w-full accent-[#d9803f] h-1.5 bg-black/60 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1 font-mono text-white/70">
                          <span>GIMBAL PITCH TILT</span>
                          <span className="text-[#e9be86] tabular-nums">{gimbalPitch}&deg;</span>
                        </div>
                        <input
                          type="range"
                          min="-90"
                          max="20"
                          step="1"
                          value={gimbalPitch}
                          onChange={(e) => setGimbalPitch(parseInt(e.target.value))}
                          className="w-full accent-[#d9803f] h-1.5 bg-black/60 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setGimbalPitch(-90)}
                          className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] text-white/80 transition-colors"
                        >
                          Top-Down (90&deg;)
                        </button>
                        <button
                          onClick={() => setGimbalPitch(0)}
                          className="flex-1 py-1.5 px-2 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] text-white/80 transition-colors"
                        >
                          Horizon (0&deg;)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Exploded Engineering View */}
                  {activeTab === 'layers' && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full text-xs">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-[11px] mb-1 font-mono text-white/70">
                          <span>MECHANICAL SEPARATION</span>
                          <span className="text-[#d9803f] tabular-nums">{Math.round(explodedAmount * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.02"
                          value={explodedAmount}
                          onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
                          className="w-full accent-[#d9803f] h-1.5 bg-black/60 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setExplodedAmount(0)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                            explodedAmount === 0 ? 'bg-[#d9803f] text-[#07090a] font-semibold' : 'bg-white/5 text-white/70 hover:text-white'
                          }`}
                        >
                          Assembled
                        </button>
                        <button
                          onClick={() => setExplodedAmount(0.6)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                            explodedAmount > 0.4 && explodedAmount < 0.8 ? 'bg-[#d9803f] text-[#07090a] font-semibold' : 'bg-white/5 text-white/70 hover:text-white'
                          }`}
                        >
                          Subsystems
                        </button>
                        <button
                          onClick={() => setExplodedAmount(1)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                            explodedAmount === 1 ? 'bg-[#d9803f] text-[#07090a] font-semibold' : 'bg-white/5 text-white/70 hover:text-white'
                          }`}
                        >
                          Full Explode
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Camera Angles & Sensor Inspection */}
                  {activeTab === 'optics' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 w-full text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-[11px] uppercase tracking-wider font-mono mr-1">Views:</span>
                        {[
                          { id: 'orbit', label: '360° Free Orbit' },
                          { id: 'front', label: 'Gimbal Nose' },
                          { id: 'sensor', label: 'CMOS Sensor Glass' },
                          { id: 'top', label: 'Plan View' }
                        ].map((view) => (
                          <button
                            key={view.id}
                            onClick={() => setCameraPreset(view.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                              cameraPreset === view.id
                                ? 'bg-[#d9803f] text-[#07090a] font-semibold'
                                : 'bg-white/5 text-white/70 hover:text-white'
                            }`}
                          >
                            {view.label}
                          </button>
                        ))}
                      </div>

                      <div className="text-[11px] font-mono text-[#e9be86] hidden lg:block">
                        FOCAL: 24mm EQ · APERTURE: f/2.8 FIXED
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Atmospheric Coastal Lighting Presets */}
                  {activeTab === 'lighting' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 w-full text-xs">
                      <div className="flex items-center gap-2">
                        {[
                          { id: 'golden', label: 'Golden Hour (Kyaukphyu Reefs)', icon: Sun },
                          { id: 'studio', label: 'Technical Softbox', icon: Zap },
                          { id: 'monsoon', label: 'Monsoon Sea Fog', icon: CloudRain },
                          { id: 'night', label: 'Night Flight Beacons', icon: Moon }
                        ].map((preset) => {
                          const Icon = preset.icon;
                          const isActive = lightPreset === preset.id;
                          return (
                            <button
                              key={preset.id}
                              onClick={() => setLightPreset(preset.id as any)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                                isActive
                                  ? 'bg-[#d9803f] text-[#07090a] font-semibold'
                                  : 'bg-white/5 text-white/70 hover:text-white'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span>{preset.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specification Bento Strip Below 3D Viewport */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#0d1411] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9803f]">Optics & Sensor</div>
            <div className="text-sm font-medium text-white mt-1">1/2" Quad Bayer CMOS</div>
            <div className="text-xs text-white/50 mt-0.5">48 MP RAW Stills · 4K/60fps D-Cinelike</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1411] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9803f]">Stabilization</div>
            <div className="text-sm font-medium text-white mt-1">3-Axis Mechanical Gimbal</div>
            <div className="text-xs text-white/50 mt-0.5">Pitch: -135° to 45° · Roll: -45° to 45°</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1411] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9803f]">Wind Resistance</div>
            <div className="text-sm font-medium text-white mt-1">Level 5 (10.5 m/s)</div>
            <div className="text-xs text-white/50 mt-0.5">Resistant to Bay of Bengal maritime gusts</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d1411] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#d9803f]">Signal Transmission</div>
            <div className="text-sm font-medium text-white mt-1">OcuSync 2.0 (10 km)</div>
            <div className="text-xs text-white/50 mt-0.5">Dual-frequency 2.4/5.8 GHz live feed</div>
          </div>
        </div>
      </div>
    </section>
  );
};
