import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SpaceScene } from './scenes/SpaceScene';
import { DeskScene } from './scenes/DeskScene';
import { PostProcessing } from './effects/PostProcessing';

export function CanvasRoot(): React.ReactElement {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SpaceScene />
          <DeskScene />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
