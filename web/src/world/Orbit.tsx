"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, TorusGeometry, type Group, type Mesh } from "three";
import { live } from "./live";
import { PALETTE } from "./materials/materials";
import { CORE_Y } from "./shapes";
import { useWorld } from "./store";

const SATELLITES = 5;
const RING_RADIUS = 2.25;

/**
 * Two hairline orbit rings around the core and five chrome satellites riding
 * the inner one: one per service. Hovering a service in the page (or opening
 * its page) makes its satellite swell and glow cyan. Visibility follows the
 * core's shape (`rings`, `satellites` in shapes.ts).
 */
export function Orbit({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<Group>(null);
  const ringA = useRef<Group>(null);
  const ringB = useRef<Group>(null);
  const sats = useRef<(Mesh | null)[]>([]);
  const angle = useRef(0);
  const glow = useRef<number[]>(Array(SATELLITES).fill(0));

  const assets = useMemo(() => {
    const ringGeoA = new TorusGeometry(RING_RADIUS, 0.006, 6, 220);
    const ringGeoB = new TorusGeometry(RING_RADIUS + 0.45, 0.004, 6, 220);
    const ringMatA = new MeshBasicMaterial({ color: PALETTE.iris, transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false });
    const ringMatB = new MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false });
    const satGeo = new SphereGeometry(0.085, 32, 16);
    const satMats = Array.from(
      { length: SATELLITES },
      () => new MeshStandardMaterial({ color: "#20242d", metalness: 1, roughness: 0.2, envMapIntensity: 2, emissive: new Color(0, 0, 0) }),
    );
    return { ringGeoA, ringGeoB, ringMatA, ringMatB, satGeo, satMats };
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const { rings, satellites } = live.shape;
    const offset = live.coreOffset;
    root.current?.position.set(offset[0], CORE_Y + offset[1], offset[2]);
    const { pose, activeWedge } = useWorld.getState();
    const lit = activeWedge ?? (pose.kind === "focus" ? pose.wedge : null);
    if (!reducedMotion) angle.current += dt * 0.16;

    assets.ringMatA.opacity = 0.55 * rings;
    assets.ringMatB.opacity = 0.3 * rings;
    if (ringA.current) {
      ringA.current.visible = rings > 0.01 || satellites > 0.01;
      ringA.current.rotation.y = angle.current;
    }
    if (ringB.current) {
      ringB.current.visible = rings > 0.01;
      ringB.current.rotation.y = -angle.current * 0.6;
    }

    const k = 1 - Math.exp(-6 * dt);
    for (let i = 0; i < SATELLITES; i++) {
      const sat = sats.current[i];
      if (!sat) continue;
      const g = (glow.current[i]! += ((lit === i ? 1 : 0) - glow.current[i]!) * k);
      const a = (i / SATELLITES) * Math.PI * 2;
      sat.position.set(Math.cos(a) * RING_RADIUS, 0, Math.sin(a) * RING_RADIUS);
      sat.scale.setScalar(Math.max(0.001, satellites * (1 + g * 1.4)));
      sat.visible = satellites > 0.01;
      assets.satMats[i]!.emissive.copy(PALETTE.cyan).multiplyScalar(g * 2.2 + 0.08);
      if (g > 0.01 && g < 0.99) live.moving = true;
    }
  });

  return (
    <group ref={root} position={[0, CORE_Y, 0]}>
      {/* Inner ring carries the satellites. Tilted toward the camera. */}
      <group rotation={[0.32, 0, 0.18]}>
        <group ref={ringA}>
          <mesh geometry={assets.ringGeoA} material={assets.ringMatA} rotation-x={Math.PI / 2} />
          {assets.satMats.map((mat, i) => (
            <mesh key={i} ref={(el) => void (sats.current[i] = el)} geometry={assets.satGeo} material={mat} />
          ))}
        </group>
      </group>
      <group rotation={[0.62, 0, -0.28]}>
        <group ref={ringB}>
          <mesh geometry={assets.ringGeoB} material={assets.ringMatB} rotation-x={Math.PI / 2} />
        </group>
      </group>
    </group>
  );
}
