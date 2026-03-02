'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';

export default function HeroScene() {
  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} />
        <Float speed={1.5} rotationIntensity={0.6}>
          <Sphere args={[1, 32, 32]}>
            <meshStandardMaterial color="#F5A623" wireframe />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
}
