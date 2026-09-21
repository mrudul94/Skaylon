"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, CanvasTexture, Color, type Mesh, type MeshBasicMaterial } from "three";
import { FLOOR_Y } from "./formations";
import { live } from "./live";
import { PALETTE } from "./materials/materials";

/**
 * Cheap stand-ins for two expensive effects, measured to cost ~450 ms of
 * main-thread blocking EACH at start-up (plus per-frame GPU passes):
 *  - real-time shadow maps → a soft contact-shadow decal under the product
 *  - bloom post-processing → an additive glow halo behind the subject
 * Both are driven by the pose (live.shadow / live.glow).
 */

function radialTexture(stops: [number, string][]): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

const tmp = new Color();

export function ContactShadow() {
  const mesh = useRef<Mesh>(null);
  const texture = useMemo(
    () => radialTexture([[0, "rgba(0,0,0,0.85)"], [0.35, "rgba(0,0,0,0.45)"], [1, "rgba(0,0,0,0)"]]),
    [],
  );
  useFrame(() => {
    if (!mesh.current) return;
    const opacity = live.shadow * 0.9;
    (mesh.current.material as MeshBasicMaterial).opacity = opacity;
    mesh.current.visible = opacity > 0.01;
  });
  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0.2, FLOOR_Y + 0.004, 0.1]} scale={[3.2, 2.0, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export function CoreGlow() {
  const mesh = useRef<Mesh>(null);
  const texture = useMemo(
    () =>
      radialTexture([
        [0, "rgba(255,255,255,0.95)"],
        [0.2, "rgba(255,210,170,0.55)"],
        [0.45, "rgba(217,118,74,0.18)"],
        [0.75, "rgba(217,118,74,0.04)"],
        [1, "rgba(0,0,0,0)"],
      ]),
    [],
  );
  useFrame(({ camera }) => {
    if (!mesh.current) return;
    mesh.current.quaternion.copy(camera.quaternion); // billboard
    const m = mesh.current.material as MeshBasicMaterial;
    m.color.copy(tmp.copy(PALETTE.coolCore).lerp(PALETTE.warmCore, live.warmth)).multiplyScalar(live.glow * 0.75);
    mesh.current.visible = live.glow > 0.01;
  });
  return (
    <mesh ref={mesh} position={[0, 0.1, -0.6]} scale={[4.6, 5.8, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </mesh>
  );
}
