"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Color,
  MeshStandardMaterial,
  Raycaster,
  Sphere,
  SphereGeometry,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { live } from "./live";
import { PALETTE } from "./materials/materials";
import { pointer } from "./pointer";
import {
  CORE_Y,
  FLOAT_AMPLITUDE,
  MAX_STRETCH,
  MAX_TILT,
  NOISE_SCALE,
  POINTER_BULGE,
  VELOCITY_NOISE,
  mixShape,
  offsetScale,
  shapeFor,
} from "./shapes";

const SIMPLEX = /* glsl */ `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

/**
 * The core: one chrome form that morphs with the story (shapes.ts). The unit
 * sphere's vertices are directions; the vertex shader places each on a
 * superellipsoid (sphere ↔ rounded cube ↔ crystal, stretched into slabs),
 * adds liquid noise and a bulge toward the mouse, and twists it. Normals come
 * from two neighbouring surface points, so reflections follow the motion.
 * The iris → cyan sheen is emissive (fresnel + folds), not a light.
 */
export function Core({ tier, reducedMotion }: { tier: 1 | 2; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  // Longitude segments (latitude = half). Indexed, so the vertex shader runs
  // once per shared vertex; built in a few ms (an icosphere + mergeVertices
  // was a 139 ms long task at 1x CPU, 699 ms at 4x: scripts/longtasks.mjs).
  const detail = tier === 2 ? 224 : 128;

  const { geometry, material, uniforms } = useMemo(() => {
    const geo = new SphereGeometry(1, detail, detail / 2);

    const uniforms = {
      uTime: { value: 0 },
      uRound: { value: live.shape.round },
      uScale: { value: new Vector3(...live.shape.scale) },
      uSize: { value: live.shape.size },
      uNoise: { value: live.shape.noise },
      uTwist: { value: live.shape.twist },
      uPointer: { value: new Vector3(0, 0, 1) },
      uPointerAmt: { value: 0 },
      uIris: { value: new Color().copy(PALETTE.iris) },
      uCyan: { value: new Color().copy(PALETTE.cyan) },
      uGlow: { value: 0.5 },
    };

    const mat = new MeshStandardMaterial({
      color: new Color("#1a1d25"),
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 2.3,
    });

    mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          /* glsl */ `
          #include <common>
          uniform float uTime;
          uniform float uRound;
          uniform vec3 uScale;
          uniform float uSize;
          uniform float uNoise;
          uniform float uTwist;
          uniform vec3 uPointer;
          uniform float uPointerAmt;
          varying float vDisp;
          ${SIMPLEX}
          float fbm(vec3 p) {
            vec3 c = p * 1.25;
            return snoise(c + vec3(0.0, uTime * 0.45, uTime * 0.32))
              + snoise(c * 2.1 - vec3(uTime * 0.28, 0.0, uTime * 0.36)) * 0.46
              + snoise(c * 3.6 + vec3(uTime * 0.18, uTime * 0.22, 0.0)) * 0.2;
          }
          // Mirrors surfacePoint() in shapes.ts, plus noise, bulge and twist.
          vec3 surface(vec3 d, out float disp) {
            vec3 a = abs(d);
            float r = pow(pow(a.x, uRound) + pow(a.y, uRound) + pow(a.z, uRound), -1.0 / uRound);
            vec3 p = d * r * uScale * uSize;
            disp = uNoise * ${NOISE_SCALE.toFixed(3)} * fbm(d)
              + uPointerAmt * ${POINTER_BULGE.toFixed(3)} * smoothstep(0.55, 1.0, dot(d, uPointer));
            p += d * disp;
            float ang = uTwist * p.y;
            float c = cos(ang), s = sin(ang);
            p.xz = mat2(c, -s, s, c) * p.xz;
            return p;
          }
          `,
        )
        .replace(
          "#include <beginnormal_vertex>",
          /* glsl */ `
          vec3 dir = normalize(position);
          float d0;
          vec3 pC = surface(dir, d0);
          vDisp = d0;
          vec3 tA = normalize(cross(dir, abs(dir.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
          vec3 tB = cross(dir, tA);
          float dd;
          vec3 pA = surface(normalize(dir + tA * 0.01), dd);
          vec3 pB = surface(normalize(dir + tB * 0.01), dd);
          vec3 objectNormal = normalize(cross(pA - pC, pB - pC));
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif
          `,
        )
        .replace("#include <begin_vertex>", "vec3 transformed = pC;");

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          /* glsl */ `
          #include <common>
          uniform float uTime;
          uniform vec3 uIris;
          uniform vec3 uCyan;
          uniform float uGlow;
          varying float vDisp;
          `,
        )
        .replace(
          "#include <emissivemap_fragment>",
          /* glsl */ `
          #include <emissivemap_fragment>
          // Thin-film style sheen: hue bands shift with the viewing angle and
          // the folds of the surface; deep folds glow from within.
          float facing = clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0);
          float fres = pow(1.0 - facing, 2.4);
          float band = 0.5 + 0.5 * sin(fres * 7.0 + vDisp * 16.0 + uTime * 0.35);
          vec3 sheen = mix(uIris, uCyan, band);
          float fold = smoothstep(0.0, -0.2, vDisp);
          totalEmissiveRadiance += sheen * uGlow * (fres * 1.25 + fold * 1.4 + 0.04);
          `,
        );
    };
    mat.customProgramCacheKey = () => "skaylon-core-v2";

    return { geometry: geo, material: mat, uniforms };
  }, [detail]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const motion = useRef({ lastY: -1, velocity: 0, bob: 0, bobY: 0 });
  const raycaster = useMemo(() => new Raycaster(), []);
  const ndc = useMemo(() => new Vector2(), []);
  const hit = useMemo(() => new Vector3(), []);
  const sphere = useMemo(() => new Sphere(), []);

  useFrame(({ camera, size }, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const m = motion.current;
    const g = group.current;
    const core = mesh.current;
    if (!g || !core) return;

    // Scroll speed → turbulence and a little stretch.
    const y = window.scrollY;
    const dy = m.lastY < 0 ? 0 : Math.abs(y - m.lastY);
    m.lastY = y;
    m.velocity += (Math.min(dy / 60, 1) - m.velocity) * (1 - Math.exp(-6 * dt));

    // Shape: ease toward what the pose asks for (scroll morphs are already eased).
    const goal = shapeFor(live.morph.from, live.morph.to, live.morph.mix);
    const k = reducedMotion ? 1 : 1 - Math.exp(-3.2 * dt);
    const s = mixShape(live.shape, goal, k);
    const residual =
      Math.abs(s.round - goal.round) +
      Math.abs(s.size - goal.size) +
      Math.abs(s.scale[2] - goal.scale[2]) +
      Math.abs(s.offset[0] - goal.offset[0]);
    live.shape = s;

    uniforms.uRound.value = s.round;
    uniforms.uScale.value.set(s.scale[0], s.scale[1] * (1 + m.velocity * MAX_STRETCH), s.scale[2]);
    uniforms.uSize.value = s.size;
    uniforms.uNoise.value = s.noise + m.velocity * VELOCITY_NOISE;
    uniforms.uTwist.value = s.twist;
    uniforms.uGlow.value = 0.35 + live.glow * 0.65;
    uniforms.uIris.value.copy(PALETTE.iris).lerp(PALETTE.cyan, 0.25 * (1 - live.warmth));

    // Mouse: tilt the whole core toward it and raise a bulge where it points.
    const recent = pointer.active && performance.now() - pointer.lastMove < 4000;
    const tx = recent ? -pointer.y * MAX_TILT * 0.7 : 0;
    const ty = recent ? pointer.x * MAX_TILT : 0;
    const kt = reducedMotion ? 1 : 1 - Math.exp(-2.5 * dt);
    g.rotation.x += (tx - g.rotation.x) * kt;
    g.rotation.y += (ty - g.rotation.y) * kt;

    let bulge = 0;
    if (recent && !reducedMotion) {
      ndc.set(pointer.x, pointer.y);
      raycaster.setFromCamera(ndc, camera);
      sphere.center.copy(g.position);
      sphere.radius = s.size * 1.15;
      if (raycaster.ray.intersectSphere(sphere, hit)) {
        core.worldToLocal(hit);
        uniforms.uPointer.value.lerp(hit.normalize(), 1 - Math.exp(-10 * dt)).normalize();
        bulge = 1;
      }
    }
    uniforms.uPointerAmt.value += (bulge - uniforms.uPointerAmt.value) * (1 - Math.exp(-5 * dt));

    if (!reducedMotion) {
      uniforms.uTime.value += dt * (0.7 + m.velocity * 1.2);
      core.rotation.y += dt * (0.12 + m.velocity * 0.35);
      m.bob += dt;
      m.bobY = Math.sin(m.bob * 0.6) * FLOAT_AMPLITUDE;
    }
    const f = offsetScale(size.width / Math.max(1, size.height));
    live.coreOffset[0] = s.offset[0] * f;
    live.coreOffset[1] = s.offset[1];
    live.coreOffset[2] = s.offset[2] * f;
    g.position.set(live.coreOffset[0], CORE_Y + live.coreOffset[1] + m.bobY, live.coreOffset[2]);

    // Keep full frame rate only while something visible is changing.
    if (m.velocity > 0.01 || residual > 1e-3 || (recent && performance.now() - pointer.lastMove < 1200)) {
      live.moving = true;
    }
  });

  return (
    <group ref={group} position={[0, CORE_Y, 0]}>
      <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}
