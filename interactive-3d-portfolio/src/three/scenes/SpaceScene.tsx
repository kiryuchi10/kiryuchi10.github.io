import React from 'react';
import { Starfield } from '../objects/Starfield';

export function SpaceScene(): React.ReactElement {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />
      <fog attach="fog" args={['#0a0a12', 15, 40]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Starfield />
    </>
  );
}
