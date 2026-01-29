import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Points, PointMaterial, Preload } from '@react-three/drei';

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(9000 * 3);
    for (let i = 0; i < 9000; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 400;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 250;
      arr[i * 3 + 2] = -Math.random() * 300;
    }
    return arr;
  }, []);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stars />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

