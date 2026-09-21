"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { Texture } from "three";
import { ContactShadow, CoreGlow } from "./Atmosphere";
import { FLOOR_Y } from "./formations";
import { PALETTE } from "./materials/materials";

/**
 * Studio lighting in a dark void. Reflections come from the pre-baked
 * environment (src/world/environment.ts → scripts/bake-environment.mjs); a
 * raking key light gives direction; a cool rim separates the silhouette from
 * the haze. Shadow and glow are cheap decals (see Atmosphere.tsx).
 */
export function Stage({ environment }: { environment: Texture | null }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.environment = environment;
    return () => {
      scene.environment = null;
    };
  }, [scene, environment]);

  return (
    <>
      <color attach="background" args={[PALETTE.void]} />
      <fogExp2 attach="fog" args={[PALETTE.void, 0.035]} />

      <ambientLight intensity={0.05} />
      <directionalLight position={[-5, 7, 5]} intensity={2.8} color="#fff6ed" />
      <directionalLight position={[5, 2.5, -6]} intensity={1.8} color="#b4cbff" />
      <pointLight position={[0, -1.0, 0]} intensity={1.5} color="#d9764a" distance={10} />

      {/* Ground: near-black, faintly reflective, dissolving into fog. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#050607" roughness={0.42} metalness={0.45} envMapIntensity={0.65} />
      </mesh>
      <ContactShadow />
      <CoreGlow />
    </>
  );
}
