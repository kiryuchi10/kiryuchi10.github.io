import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

// Fallback to the existing lightweight canvas if the GLTF asset is missing.
import ComputerCanvas from './ComputerCanvas';

function ComputersModel({ isMobile }) {
  const { scene } = useGLTF('/desktop_pc/scene.gltf');

  return (
    <group>
      <ambientLight intensity={isMobile ? 0.6 : 0.8} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={isMobile ? 0.9 : 1.2}
        castShadow={false}
      />
      <pointLight position={[-10, 4, -8]} intensity={isMobile ? 0.6 : 0.9} />

      <primitive
        object={scene}
        scale={isMobile ? 0.62 : 0.78}
        position={isMobile ? [0, -2.15, -1.1] : [0, -2.75, -1.45]}
        rotation={[-0.01, -0.18, -0.02]}
      />
    </group>
  );
}

export default function ComputersCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasGltf, setHasGltf] = useState(null); // null = unknown, true/false after check

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    // CRA dev server may return index.html (200) for missing assets.
    // So we verify the response isn't HTML by reading the first chunk.
    (async () => {
      try {
        const res = await fetch('/desktop_pc/scene.gltf', { method: 'GET' });
        if (cancelled) return;
        if (!res.ok || !res.body) {
          setHasGltf(false);
          return;
        }

        const contentType = (res.headers.get('content-type') || '').toLowerCase();
        // If server explicitly says HTML, it's not a GLTF asset.
        if (contentType.includes('text/html')) {
          setHasGltf(false);
          return;
        }

        // Read only the first chunk to detect an HTML fallback like "<!DOCTYPE ...".
        const reader = res.body.getReader();
        const { value } = await reader.read();
        reader.releaseLock();

        if (!value || value.length === 0) {
          setHasGltf(false);
          return;
        }

        const headText = new TextDecoder('utf-8').decode(value.slice(0, 64)).trim();
        if (headText.startsWith('<') || headText.toLowerCase().startsWith('<!doctype')) {
          setHasGltf(false);
          return;
        }

        setHasGltf(true);
      } catch {
        if (cancelled) return;
        setHasGltf(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (hasGltf === false) {
    return <ComputerCanvas />;
  }

  // While we haven't verified the asset, avoid mounting useGLTF (prevents repeated runtime errors).
  if (hasGltf === null) {
    return <ComputerCanvas />;
  }

  return (
    <Canvas
      frameloop="always"
      dpr={isMobile ? 1 : [1, 2]}
      camera={{ position: [18, 3, 6], fov: 26 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          rotateSpeed={0.6}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <ComputersModel isMobile={isMobile} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

