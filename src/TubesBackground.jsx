import React, { useEffect, useRef, useState } from 'react';
import { cn } from './utils';

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

// ── Fallback: Pure Three.js animation (used if CDN fails) ─────────────────────
async function initFallbackAnimation(canvas, enableClickInteraction) {
  const THREE = await import('three');
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const palettes = [
    ['#f967fb', '#6958d5', '#53bc28'],
    ['#ff6b6b', '#ffd93d', '#6bcb77'],
    ['#4d96ff', '#ff6bff', '#ffd700'],
    ['#00f5d4', '#ff006e', '#8338ec'],
  ];
  let currentPalette = 0;
  const TUBE_COUNT = 6;
  const tubes = [];

  function buildTube(colorHex) {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      points.push(new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
      ));
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    const geo   = new THREE.TubeGeometry(curve, 80, 0.18 + Math.random() * 0.25, 8, false);
    const mat   = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Mesh(geo, mat);
  }

  function rebuildTubes() {
    tubes.forEach(m => { scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
    tubes.length = 0;
    const colors = palettes[currentPalette % palettes.length];
    for (let i = 0; i < TUBE_COUNT; i++) {
      const mesh = buildTube(colors[i % colors.length]);
      scene.add(mesh);
      tubes.push(mesh);
    }
  }

  rebuildTubes();

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const pointLights = [
    new THREE.PointLight(0x8b5cf6, 3, 60),
    new THREE.PointLight(0x06b6d4, 3, 60),
    new THREE.PointLight(0xf59e0b, 2, 50),
  ];
  pointLights[0].position.set(-20, 15, 10);
  pointLights[1].position.set(20, -15, 10);
  pointLights[2].position.set(0, 0, 20);
  pointLights.forEach(l => scene.add(l));

  const mouse  = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onMove = (e) => {
    mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  const onClick = () => {
    if (!enableClickInteraction) return;
    currentPalette++;
    rebuildTubes();
  };

  window.addEventListener('mousemove', onMove);
  window.addEventListener('click', onClick);

  const onResize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  let frameId, t = 0;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    t += 0.003;
    target.x += (mouse.x - target.x) * 0.04;
    target.y += (mouse.y - target.y) * 0.04;
    camera.position.x += (target.x * 8  - camera.position.x) * 0.05;
    camera.position.y += (target.y * 5  - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    pointLights[0].position.x = target.x * 25;
    pointLights[0].position.y = target.y * 15;
    pointLights[1].position.x = -target.x * 20;
    pointLights[1].position.y = -target.y * 12;
    tubes.forEach((mesh, i) => {
      mesh.rotation.x = Math.sin(t * 0.5 + i) * 0.15;
      mesh.rotation.y = Math.cos(t * 0.4 + i) * 0.18 + target.x * 0.3;
      mesh.rotation.z = Math.sin(t * 0.3 + i * 1.3) * 0.1;
      mesh.position.x = Math.sin(t * 0.2 + i * 1.1) * 2;
      mesh.position.y = Math.cos(t * 0.25 + i * 0.9) * 1.5;
    });
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('click', onClick);
    tubes.forEach(m => { m.geometry.dispose(); m.material.dispose(); });
    renderer.dispose();
  };
}

// ── Component ──────────────────────────────────────────────────────────────────
export function TubesBackground({
  children,
  className,
  isDark = true,
  enableClickInteraction = true,
}) {
  const canvasRef = useRef(null);
  const tubesRef  = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    let cleanup;
    let mounted = true;

    const init = async () => {
      // ── Try CDN first ──────────────────────────────────────────────────────
      try {
        const module = await import(
          /* @vite-ignore */
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
        const TubesCursor = module.default;
        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ['#f967fb', '#53bc28', '#6958d5'],
            lights: {
              intensity: 200,
              colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
            },
          },
        });

        tubesRef.current = app;
        if (mounted) setIsLoaded(true);

        const onResize = () => {};
        window.addEventListener('resize', onResize);
        cleanup = () => window.removeEventListener('resize', onResize);

      } catch (err) {
        // ── CDN failed → use local Three.js fallback ───────────────────────
        console.warn('CDN load failed, using local Three.js fallback:', err.message);
        if (!mounted || !canvasRef.current) return;
        cleanup = await initFallbackAnimation(canvasRef.current, enableClickInteraction);
        if (mounted) setIsLoaded(true);
      }
    };

    init();

    return () => {
      mounted = false;
      if (typeof cleanup === 'function') cleanup();
    };
  }, [enableClickInteraction]);

  // Click handler for CDN version color randomization
  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    const colors       = randomColors(3);
    const lightsColors = randomColors(4);
    tubesRef.current.tubes?.setColors?.(colors);
    tubesRef.current.tubes?.setLightsColors?.(lightsColors);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 w-full h-full -z-10 transition-colors duration-500',
        /* Dark mode: supply a deep navy page-bg.
           Light mode: transparent — body's #F8FAFC from CSS vars shows through */
        isDark ? 'bg-[#050918]' : 'bg-transparent',
        className,
      )}
      onClick={handleClick}
    >
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ touchAction: 'none' }}
      />

      {/* Decorative tint – pointer-events:none so mouse events always reach the canvas.
          Dark: gentle dark veil. Light: very faint white wash (15%) — keeps neon
          colors vibrant without graying the page. */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none transition-colors duration-500',
          isDark ? 'bg-black/20' : 'bg-white/15',
        )}
        aria-hidden="true"
      />

      {/* Optional children overlay */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}

export default TubesBackground;
