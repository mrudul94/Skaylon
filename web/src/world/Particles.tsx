"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, ShaderMaterial } from "three";

const BOUNDS = { x: 16, y: 8, z: 14, floor: -1.7 };

/**
 * Dust suspended in the haze. All motion runs on the GPU (one uniform per
 * frame): a slow rise with a gentle sway, wrapping vertically. Frozen under
 * reduced motion.
 */
export function Particles({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    let seed = 42;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const position = new Float32Array(count * 3);
    const random = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      position[i * 3] = (rand() - 0.5) * BOUNDS.x;
      position[i * 3 + 1] = BOUNDS.floor + rand() * BOUNDS.y;
      position[i * 3 + 2] = (rand() - 0.6) * BOUNDS.z;
      random[i] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(position, 3));
    g.setAttribute("aRandom", new BufferAttribute(random, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: dpr },
          uFloor: { value: BOUNDS.floor },
          uHeight: { value: BOUNDS.y },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uFloor;
          uniform float uHeight;
          attribute float aRandom;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float speed = 0.03 + aRandom * 0.05;
            p.y = uFloor + mod(p.y - uFloor + uTime * speed, uHeight);
            p.x += sin(uTime * 0.12 + aRandom * 40.0) * 0.25;
            p.z += cos(uTime * 0.09 + aRandom * 23.0) * 0.18;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float size = mix(0.6, 2.4, aRandom * aRandom);
            gl_PointSize = size * uPixelRatio * (9.0 / -mv.z);
            // Fade at the top/bottom of the wrap and with distance (haze).
            float h = (p.y - uFloor) / uHeight;
            float edge = smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.85, 1.0, h));
            vAlpha = edge * exp(-0.06 * -mv.z) * (0.35 + aRandom * 0.65);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float disc = 1.0 - smoothstep(0.2, 0.5, d);
            gl_FragColor = vec4(vec3(1.0, 0.94, 0.86), disc * vAlpha * 0.55);
          }
        `,
      }),
    [dpr],
  );

  useFrame((_, dt) => {
    if (!reducedMotion) material.uniforms.uTime!.value += Math.min(dt, 0.1);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
