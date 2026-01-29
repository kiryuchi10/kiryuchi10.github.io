import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export function PostProcessing(): React.ReactElement {
  return (
    <EffectComposer>
      <Bloom intensity={0.4} luminanceThreshold={0.9} luminanceSmoothing={0.9} />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
}
