import gsap from "gsap";
import * as THREE from "three";
import { FC, memo, useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ORB_POINTS = 16000;
const ORB_RADIUS = 1.45;
const DUST_POINTS = 500;
const WAVE_SEGMENTS = 360;
const CAMERA_DISTANCE = 10.5;

// Circular waveforms around the orb: radius, ripple density, speed, opacity, tilt.
const WAVE_RINGS = [
  { radius: 2.05, density: 28, speed: 3.2, opacity: 0.95, tilt: 0.18 },
  { radius: 2.45, density: 18, speed: -2.4, opacity: 0.55, tilt: -0.12 },
  { radius: 2.9, density: 40, speed: 4.1, opacity: 0.28, tilt: 0.3 },
];

/* Grainy "sound orb": thousands of fine points on a sphere, pushed in and out
   by layered waves. Horizontal bands ripple like an audio spectrum. */
const orbVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBeat;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vWave;
  varying float vAlpha;

  void main() {
    vec3 dir = normalize(position);
    float t = uTime;

    // Latitude bands behave like frequency bins; each band has its own rhythm.
    float band = floor((dir.y * 0.5 + 0.5) * 24.0);
    float level = 0.5 + 0.5 * sin(band * 1.7 + t * (1.4 + mod(band, 4.0) * 0.45));

    // Ripples travel around the sphere instead of forming fixed rings.
    float ripple = sin(dir.y * 22.0 + atan(dir.z, dir.x) * 2.0 - t * 3.0);

    float wave =
        ripple * 0.25 * level +
        sin(dir.x * 2.6 + t * 1.3) * cos(dir.z * 3.1 - t * 0.9) * 0.45 +
        sin((dir.x + dir.y) * 5.0 + t * 2.2) * 0.3;

    float amp = 0.11 + uBeat * 0.15;
    float radius = ${ORB_RADIUS.toFixed(2)} * (1.0 + wave * amp) + (aRandom - 0.5) * 0.05;
    vec3 p = dir * radius * uIntro;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRandom * 0.9) / -mvPosition.z;

    vWave = wave;
    // Grain: each point flickers a little on its own.
    vAlpha = (0.35 + 0.65 * smoothstep(-0.4, 0.8, wave)) *
             (0.7 + 0.3 * sin(t * 6.0 + aRandom * 40.0));
  }
`;

const orbFragmentShader = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uRed;
  uniform vec3 uHot;
  varying float vWave;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    vec3 color = mix(uDeep, uRed, smoothstep(-0.5, 0.35, vWave));
    color = mix(color, uHot, smoothstep(0.45, 0.85, vWave));
    gl_FragColor = vec4(color, smoothstep(0.5, 0.1, d) * vAlpha);
  }
`;

/**
 * Hero 3D scene. three.js renders, GSAP drives the intro, the beat, pointer
 * parallax and the scroll-linked motion.
 */
const ThreeDMeshForHero: FC<{ className?: string }> = ({ className }) => {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // No WebGL: the scene is decorative, the page works without it.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
    holder.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const rig = new THREE.Group();
    scene.add(rig);

    // --- Grainy sound orb ------------------------------------------------
    const orbPositions = new Float32Array(ORB_POINTS * 3);
    const orbRandoms = new Float32Array(ORB_POINTS);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < ORB_POINTS; i++) {
      // Fibonacci sphere with jitter: even coverage, no visible pattern.
      const y = 1 - (2 * (i + Math.random())) / ORB_POINTS;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * goldenAngle + Math.random() * 0.3;
      orbPositions.set([Math.cos(angle) * ring, y, Math.sin(angle) * ring], i * 3);
      orbRandoms[i] = Math.random();
    }
    const orbGeometry = new THREE.BufferGeometry();
    orbGeometry.setAttribute("position", new THREE.BufferAttribute(orbPositions, 3));
    orbGeometry.setAttribute("aRandom", new THREE.BufferAttribute(orbRandoms, 1));
    const orbUniforms = {
      uTime: { value: 0 },
      uBeat: { value: 0 },
      uIntro: { value: 0 },
      uSize: { value: 30 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uDeep: { value: new THREE.Color(0x5c0a0a) },
      uRed: { value: new THREE.Color(0xef4444) },
      uHot: { value: new THREE.Color(0xffd0d0) },
    };
    const orbMaterial = new THREE.ShaderMaterial({
      uniforms: orbUniforms,
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const orb = new THREE.Points(orbGeometry, orbMaterial);
    rig.add(orb);

    // Soft red glow behind the orb.
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 128;
    const glowContext = glowCanvas.getContext("2d");
    if (glowContext) {
      const gradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(239,68,68,0.55)");
      gradient.addColorStop(0.4, "rgba(185,28,28,0.18)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 128, 128);
    }
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.setScalar(7);
    rig.add(glow);

    // --- Circular waveforms ------------------------------------------------
    const waves = WAVE_RINGS.map((config) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(WAVE_SEGMENTS * 3), 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.LineLoop(geometry, material);
      line.rotation.x = config.tilt;
      rig.add(line);
      return { config, geometry, material, line };
    });

    // --- Dust particles ----------------------------------------------------
    const dustPositions = new Float32Array(DUST_POINTS * 3);
    const point = new THREE.Vector3();
    for (let i = 0; i < DUST_POINTS; i++) {
      point.randomDirection().multiplyScalar(3.3 + Math.random() * 4);
      point.toArray(dustPositions, i * 3);
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    rig.add(dust);

    // --- Frame update ------------------------------------------------------
    const state = { beat: 0, intro: 0 };
    let visible = true;

    const draw = (time: number) => {
      orbUniforms.uTime.value = time;
      orbUniforms.uBeat.value = state.beat;
      orbUniforms.uIntro.value = state.intro;
      orb.rotation.y = time * 0.12;
      glowMaterial.opacity = state.intro * (0.75 + state.beat * 0.25);

      waves.forEach(({ config, geometry }, ringIndex) => {
        const positions = geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < WAVE_SEGMENTS; i++) {
          const a = (i / WAVE_SEGMENTS) * Math.PI * 2;
          // Fast carrier shaped by a slow envelope: reads as an audio waveform.
          const envelope = Math.pow(
            0.5 + 0.5 * Math.sin(a * 3 - time * (0.9 + ringIndex * 0.3)),
            2
          );
          const carrier =
            Math.sin(a * config.density + time * config.speed) +
            0.4 * Math.sin(a * config.density * 2.3 - time * config.speed * 1.4);
          const offset = carrier * envelope * (0.06 + state.beat * 0.12);
          const r = (config.radius + offset) * (0.4 + 0.6 * state.intro);
          positions.setXYZ(i, Math.cos(a) * r, Math.sin(a) * r, 0);
        }
        positions.needsUpdate = true;
      });

      dust.rotation.y = time * 0.03;
      dustMaterial.opacity = 0.7 * state.intro;
      waves.forEach(({ config, material }) => {
        material.opacity = config.opacity * state.intro;
      });

      renderer.render(scene, camera);
    };

    const tick = (time: number) => {
      visible && draw(time);
    };

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth: width, clientHeight: height } = holder;
      if (!width || !height) {
        return;
      }
      renderer.setSize(width, height, false);
      orbUniforms.uPixelRatio.value = renderer.getPixelRatio();
      camera.aspect = width / height;
      // Keep the whole composition inside narrow (portrait) holders.
      camera.position.z = CAMERA_DISTANCE / Math.min(1, camera.aspect);
      camera.updateProjectionMatrix();
      draw(gsap.ticker.time);
    });
    resizeObserver.observe(holder);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersectionObserver.observe(holder);

    // --- GSAP choreography -------------------------------------------------
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let onPointerMove: ((event: PointerEvent) => void) | undefined;

    gsap.registerPlugin(ScrollTrigger);
    const gsapContext = gsap.context(() => {
      if (reducedMotion) {
        state.intro = 1; // static frame, drawn by the resize observer
        return;
      }

      gsap.to(state, { intro: 1, duration: 2.2, ease: "expo.out" });
      gsap.from(waves.map(({ line }) => line.rotation), {
        x: `+=${Math.PI / 2}`,
        duration: 2.4,
        ease: "power3.out",
        stagger: 0.12,
      });

      // ~100 BPM kick.
      gsap
        .timeline({ repeat: -1, repeatDelay: 0.07 })
        .to(state, { beat: 1, duration: 0.08, ease: "power2.in" })
        .to(state, { beat: 0, duration: 0.45, ease: "power2.out" });

      // Scrolling away tilts and shrinks the scene.
      const scrollTrigger = {
        start: 0,
        end: () => window.innerHeight,
        scrub: 0.6,
      };
      gsap.to(rig.rotation, { z: 0.6, ease: "none", scrollTrigger });
      gsap.to(rig.scale, { x: 0.8, y: 0.8, z: 0.8, ease: "none", scrollTrigger });

      const tiltX = gsap.quickTo(rig.rotation, "x", { duration: 0.9, ease: "power3" });
      const tiltY = gsap.quickTo(rig.rotation, "y", { duration: 0.9, ease: "power3" });
      onPointerMove = (event) => {
        tiltY((event.clientX / window.innerWidth - 0.5) * 0.6);
        tiltX((event.clientY / window.innerHeight - 0.5) * 0.4);
      };
      window.addEventListener("pointermove", onPointerMove);
      gsap.ticker.add(tick);
    });

    return () => {
      gsap.ticker.remove(tick);
      gsapContext.revert();
      onPointerMove && window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      orbGeometry.dispose();
      orbMaterial.dispose();
      glowTexture.dispose();
      glowMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      waves.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      aria-hidden
      ref={holderRef}
      className={`w-full h-full ${className ?? ""}`}
    />
  );
};

export default memo(ThreeDMeshForHero);
