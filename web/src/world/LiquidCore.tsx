"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { live } from "./live";
import { PALETTE } from "./materials/materials";

const GLOW_COLOR = new Color("#ff4a0c");

/**
 * Liquid Chrome / Molten Mercury Core
 *
 * A continuous fluid sculpture representing Skaylon's transformation:
 * "From ambiguity to a system you can rely on."
 *
 * Features:
 * - Multi-octave 3D simplex noise vertex displacement for organic fluid ripples
 * - Exact normal perturbation via numerical gradient for mirror-like chrome reflections
 * - Sub-surface molten ember glow that pulses from within fluid crevices and folds
 * - Scroll-reactive velocity & turbulence that smoothly stretches and settles
 */
export function LiquidCore({
  tier,
  reducedMotion,
}: {
  tier: 1 | 2;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  // Detail subdivision based on hardware tier
  const detail = tier === 2 ? 64 : 44;

  const { geometry, material, uniforms } = useMemo(() => {
    const geo = new IcosahedronGeometry(1.5, detail);

    const uniforms = {
      uTime: { value: 0 },
      uTurbulence: { value: 0.15 },
      uEmber: { value: new Color("#ff4a0c") },
      uCoreGlow: { value: 0.4 },
    };

    const mat = new MeshStandardMaterial({
      color: new Color("#161a20"),
      metalness: 0.96,
      roughness: 0.12,
      envMapIntensity: 2.4,
    });

    mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      Object.assign(shader.uniforms, uniforms);

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          /* glsl */ `
          #include <common>
          uniform float uTime;
          uniform float uTurbulence;
          varying float vDisplacement;
          varying vec3 vWorldNormal;

          // Simplex 3D noise
          vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(
                       i.z + vec4(0.0, i1.z, i2.z, 1.0))
                     + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                     + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          float getDisplacement(vec3 p, float t, float turb) {
            vec3 coord = p * 1.25;
            float n1 = snoise(coord + vec3(0.0, t * 0.45, t * 0.32));
            float n2 = snoise(coord * 2.1 - vec3(t * 0.28, 0.0, t * 0.36)) * 0.46;
            float n3 = snoise(coord * 3.6 + vec3(t * 0.18, t * 0.22, 0.0)) * 0.2;
            return (n1 + n2 + n3) * (0.2 + turb * 0.26);
          }
          `,
        )
        .replace(
          "#include <beginnormal_vertex>",
          /* glsl */ `
          float d0 = getDisplacement(position, uTime, uTurbulence);
          vDisplacement = d0;

          // Compute perturbed normal using orthogonal offsets on sphere surface
          float eps = 0.015;
          vec3 vTan = normalize(cross(normal, abs(normal.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
          vec3 vBi = cross(normal, vTan);
          vec3 pCenter = position + normal * d0;
          vec3 pTan = (position + vTan * eps) + normal * getDisplacement(position + vTan * eps, uTime, uTurbulence);
          vec3 pBi = (position + vBi * eps) + normal * getDisplacement(position + vBi * eps, uTime, uTurbulence);
          vec3 objectNormal = normalize(cross(pTan - pCenter, pBi - pCenter));
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif
          `,
        )
        .replace(
          "#include <begin_vertex>",
          /* glsl */ `
          vec3 transformed = position + normal * d0;
          `,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          /* glsl */ `
          #include <common>
          uniform vec3 uEmber;
          uniform float uCoreGlow;
          varying float vDisplacement;
          `,
        )
        .replace(
          "#include <emissivemap_fragment>",
          /* glsl */ `
          #include <emissivemap_fragment>
          // Fluid crevices and deep folds glow with molten ember heat
          float crevice = smoothstep(0.02, -0.25, vDisplacement);
          totalEmissiveRadiance += uEmber * (crevice * 3.2 + uCoreGlow * 0.3);
          `,
        );
    };

    mat.customProgramCacheKey = () => `skaylon-liquid-mercury-v1-${tier}`;

    return { geometry: geo, material: mat, uniforms };
  }, [detail, tier]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Track scroll speed and smooth turbulence
  const scrollState = useRef({
    lastY: 0,
    velocity: 0,
    turbulence: 0.12,
  });

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const ss = scrollState.current;

    // Measure scroll speed
    const currentY = typeof window !== "undefined" ? window.scrollY : 0;
    const dy = Math.abs(currentY - ss.lastY);
    ss.lastY = currentY;

    // Smooth scroll velocity impulse
    const targetVel = Math.min(dy / 40, 2.5);
    ss.velocity += (targetVel - ss.velocity) * (1 - Math.exp(-8 * dt));

    // Target turbulence based on journey warmth and velocity
    const targetTurbulence = 0.12 + ss.velocity * 0.35 + live.warmth * 0.2;
    ss.turbulence += (targetTurbulence - ss.turbulence) * (1 - Math.exp(-4 * dt));

    if (!reducedMotion) {
      // Advance fluid time (faster during scroll motion)
      uniforms.uTime.value += dt * (0.8 + ss.velocity * 0.7);
      uniforms.uTurbulence.value = ss.turbulence;

      // Pulse ember color with warmth
      uniforms.uEmber.value
        .copy(GLOW_COLOR)
        .lerp(PALETTE.warmCore, live.warmth * 0.4)
        .multiplyScalar(1.6 + live.glow * 1.8);

      uniforms.uCoreGlow.value = 0.25 + live.glow * 0.8;

      // Gentle floating levitation & organic rotation
      if (meshRef.current) {
        meshRef.current.position.y = Math.sin(uniforms.uTime.value * 0.6) * 0.1;
        meshRef.current.rotation.y += dt * (0.15 + ss.velocity * 0.2);
        meshRef.current.rotation.x = Math.sin(uniforms.uTime.value * 0.4) * 0.12;

        // Fluid squish/stretch along Y during scroll
        const stretch = 1 + ss.velocity * 0.12;
        meshRef.current.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
      }

      // Inner glowing core pulse
      if (innerRef.current) {
        innerRef.current.rotation.y -= dt * 0.3;
        innerRef.current.scale.setScalar(0.92 + Math.sin(uniforms.uTime.value * 1.5) * 0.06);
      }

      live.moving = true;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* Liquid Chrome Outer Shell with Molten Ember Crevices */}
      <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />

      {/* Internal Molten Core Sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial
          color={GLOW_COLOR}
          transparent
          opacity={0.7}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
