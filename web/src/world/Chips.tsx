"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { buildFormation, morphAmount, type Formation, type FormationKey } from "./formations";
import { live } from "./live";
import { PALETTE } from "./materials/materials";
import { useWorld } from "./store";

const GLOW_SOURCE = new Color("#ff4a0c");

/**
 * The chips: N small blocks in ONE instanced draw call. Each chip carries two
 * states (A = where it is, B = where it's going); the vertex shader morphs
 * between them with a per-chip stagger, so shapes dissolve and form in waves.
 * CPU work happens only when the destination changes (a snapshot of the
 * current in-between state becomes the new A), never per chip per frame.
 */
export function Chips({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const cache = useMemo(() => new Map<FormationKey, Formation>(), []);
  const formation = (key: FormationKey) => {
    let f = cache.get(key);
    if (!f) cache.set(key, (f = buildFormation(key, count)));
    return f;
  };

  const { mesh, attrs, uniforms, seed } = useMemo(() => {
    const geometry = new BoxGeometry(1, 1, 1);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) seed[i] = ((i * 2654435761) % 1000) / 1000; // stable pseudo-random
    const attrs = {
      a: new InstancedBufferAttribute(new Float32Array(count * 4), 4), // pos A + glow A
      b: new InstancedBufferAttribute(new Float32Array(count * 4), 4), // pos B + glow B
      sa: new InstancedBufferAttribute(new Float32Array(count * 4), 4), // scale A + loose A
      sb: new InstancedBufferAttribute(new Float32Array(count * 4), 4), // scale B + loose B
      group: new InstancedBufferAttribute(new Float32Array(count).fill(-1), 1), // hover group (destination)
    };
    geometry.setAttribute("aA", attrs.a);
    geometry.setAttribute("aB", attrs.b);
    geometry.setAttribute("aSA", attrs.sa);
    geometry.setAttribute("aSB", attrs.sb);
    geometry.setAttribute("aSeed", new InstancedBufferAttribute(seed, 1));
    geometry.setAttribute("aGroup", attrs.group);

    const uniforms = {
      uMix: { value: 1 },
      uTime: { value: 0 },
      uEmber: { value: new Color() },
      uHighlight: { value: -1 },
      uHighlightAmt: { value: 0 },
    };
    const material = new MeshStandardMaterial({ color: new Color("#181b20"), metalness: 0.88, roughness: 0.22, envMapIntensity: 1.85 });
    material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          /* glsl */ `#include <common>
          attribute vec4 aA; attribute vec4 aB; attribute vec4 aSA; attribute vec4 aSB; attribute float aSeed; attribute float aGroup;
          uniform float uMix; uniform float uTime; uniform float uHighlight; uniform float uHighlightAmt;
          varying float vGlow; varying float vTone;
          vec3 chipScale; vec3 chipPos;`,
        )
        .replace(
          "#include <beginnormal_vertex>",
          /* glsl */ `
          // Must match morphAmount() in formations.ts.
          float mx = clamp(uMix * 1.5 - aSeed * 0.5, 0.0, 1.0);
          float m = mx * mx * (3.0 - 2.0 * mx);
          chipScale = max(mix(aSA.xyz, aSB.xyz, m), vec3(1e-4));
          float loose = mix(aSA.w, aSB.w, m);
          chipPos = mix(aA.xyz, aB.xyz, m);
          chipPos.y += sin(m * 3.14159) * (0.15 + 0.35 * aSeed); // lift mid-flight
          chipPos += loose * 0.06 * vec3(sin(uTime * 0.4 + aSeed * 40.0), cos(uTime * 0.33 + aSeed * 23.0), sin(uTime * 0.27 + aSeed * 11.0));
          vGlow = mix(aA.w, aB.w, m) + (abs(aGroup - uHighlight) < 0.5 ? uHighlightAmt * m : 0.0);
          vTone = 0.62 + 0.5 * fract(aSeed * 7.13); // per-chip tone: machined parts, not tiles
          vec3 objectNormal = normalize(normal / chipScale);
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif`,
        )
        .replace("#include <begin_vertex>", "vec3 transformed = position * chipScale + chipPos;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform vec3 uEmber;\nvarying float vGlow;\nvarying float vTone;")
        // Glowing chips drop their lit surface so the ember reads as light, not peach paint.
        .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= vTone * (1.0 - 0.9 * clamp(vGlow, 0.0, 1.0));")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uEmber * vGlow;");
    };
    material.customProgramCacheKey = () => "skaylon-chips-v4";

    const mesh = new InstancedMesh(geometry, material, count);
    const identity = new Matrix4();
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, identity);
    mesh.frustumCulled = false; // chips move far outside the box's bounds
    return { mesh, attrs, uniforms, seed };
  }, [count]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as MeshStandardMaterial).dispose();
    },
    [mesh],
  );

  /*
   * Morph bookkeeping (not React state: changes every frame). Two modes:
   *  - "track": A = from-formation, B = to-formation, mix follows the scroll
   *    (journey) or glides to 1 (routes). Exact in both scroll directions.
   *  - "catchup": the chips aren't on the requested pair yet (a jump across
   *    chapters, or a route change): A = whatever is on screen now, B = the
   *    exact in-between state being asked for; glide there, then switch to
   *    "track", which renders the same state, so there is no pop.
   */
  const state = useRef({
    mode: "track" as "track" | "catchup",
    aKey: null as FormationKey | null,
    bKey: null as FormationKey | null,
    /** For catch-up: the pair and journey mix B currently represents. */
    goalFrom: null as FormationKey | null,
    goalTo: null as FormationKey | null,
    goalMix: 1,
    mix: 1,
    initialised: false,
  });

  const load = (target: InstancedBufferAttribute, scaleTarget: InstancedBufferAttribute, f: Formation) => {
    const p = target.array as Float32Array;
    const s = scaleTarget.array as Float32Array;
    for (let i = 0; i < count; i++) {
      p[i * 4] = f.position[i * 3]!;
      p[i * 4 + 1] = f.position[i * 3 + 1]!;
      p[i * 4 + 2] = f.position[i * 3 + 2]!;
      p[i * 4 + 3] = f.glow[i]!;
      s[i * 4] = f.scale[i * 3]!;
      s[i * 4 + 1] = f.scale[i * 3 + 1]!;
      s[i * 4 + 2] = f.scale[i * 3 + 2]!;
      s[i * 4 + 3] = f.loose[i]!;
    }
    target.needsUpdate = true;
    scaleTarget.needsUpdate = true;
  };

  /** Freeze the current in-between state into A (same maths as the shader, minus drift). */
  const snapshot = (mix: number) => {
    const a = attrs.a.array as Float32Array;
    const b = attrs.b.array as Float32Array;
    const sa = attrs.sa.array as Float32Array;
    const sb = attrs.sb.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const m = morphAmount(mix, seed[i]!);
      const lift = Math.sin(m * Math.PI) * (0.15 + 0.35 * seed[i]!);
      for (let k = 0; k < 4; k++) {
        a[i * 4 + k] = a[i * 4 + k]! + (b[i * 4 + k]! - a[i * 4 + k]!) * m;
        sa[i * 4 + k] = sa[i * 4 + k]! + (sb[i * 4 + k]! - sa[i * 4 + k]!) * m;
      }
      a[i * 4 + 1] = a[i * 4 + 1]! + lift;
    }
    attrs.a.needsUpdate = true;
    attrs.sa.needsUpdate = true;
  };

  /** Write the exact state the shader would show for pair (fa → fb) at `mix` into B. */
  const blendIntoB = (fa: Formation, fb: Formation, mix: number) => {
    const p = attrs.b.array as Float32Array;
    const s = attrs.sb.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const m = morphAmount(mix, seed[i]!);
      const lift = Math.sin(m * Math.PI) * (0.15 + 0.35 * seed[i]!);
      for (let a = 0; a < 3; a++) {
        p[i * 4 + a] = fa.position[i * 3 + a]! + (fb.position[i * 3 + a]! - fa.position[i * 3 + a]!) * m;
        s[i * 4 + a] = fa.scale[i * 3 + a]! + (fb.scale[i * 3 + a]! - fa.scale[i * 3 + a]!) * m;
      }
      p[i * 4 + 1] = p[i * 4 + 1]! + lift;
      p[i * 4 + 3] = fa.glow[i]! + (fb.glow[i]! - fa.glow[i]!) * m;
      s[i * 4 + 3] = fa.loose[i]! + (fb.loose[i]! - fa.loose[i]!) * m;
    }
    attrs.b.needsUpdate = true;
    attrs.sb.needsUpdate = true;
  };

  const setGroups = (f: Formation) => {
    (attrs.group.array as Float32Array).set(f.group);
    attrs.group.needsUpdate = true;
  };

  /** Load a clean pair: A = from, B = to. */
  const track = (from: FormationKey, to: FormationKey, mix: number) => {
    load(attrs.a, attrs.sa, formation(from));
    load(attrs.b, attrs.sb, formation(to));
    setGroups(formation(to));
    Object.assign(state.current, { mode: "track", aKey: from, bKey: to, mix });
  };

  /** Freeze what's on screen into A; aim B at pair (from → to) at `goalMix`. */
  const catchUp = (from: FormationKey, to: FormationKey, goalMix: number) => {
    const st = state.current;
    snapshot(st.mix);
    if (goalMix >= 0.999 || from === to) load(attrs.b, attrs.sb, formation(to));
    else if (goalMix <= 0.001) load(attrs.b, attrs.sb, formation(from));
    else blendIntoB(formation(from), formation(to), goalMix);
    setGroups(formation(goalMix < 0.5 ? from : to));
    Object.assign(st, { mode: "catchup", aKey: null, bKey: null, goalFrom: from, goalTo: to, goalMix, mix: 0 });
  };

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const st = state.current;
    const { from: rawFrom, to, mix: goal } = live.morph;
    // Routes ask for "whatever → to"; treat that as the pair (to → to) at 1.
    const from = rawFrom ?? to;
    const journey = rawFrom !== null;

    if (!st.initialised) {
      // First frame: start exactly where the page is (mid-journey included).
      track(from, to, journey ? goal : 1);
      st.initialised = true;
    }

    const onPair = st.mode === "track" && st.aKey === from && st.bKey === to;
    if (st.mode === "track" && !onPair) {
      if (journey && st.bKey === from && (st.mix > 0.82 || goal < 0.18)) track(from, to, goal); // scrolled forward into the next chapter
      else if (journey && st.aKey === to && (st.mix < 0.18 || goal > 0.82)) track(from, to, goal); // scrolled back into the previous chapter
      else catchUp(from, to, journey ? goal : 1);
    } else if (st.mode === "catchup" && (st.goalFrom !== from || st.goalTo !== to || Math.abs(st.goalMix - (journey ? goal : 1)) > 0.08)) {
      catchUp(from, to, journey ? goal : 1); // the destination moved while gliding: re-aim
    }

    let targetMix: number;
    let lambda: number;
    if (st.mode === "catchup") {
      targetMix = 1;
      lambda = journey ? 5.5 : 1.6; // scroll jumps catch up briskly; route changes glide
    } else {
      targetMix = journey ? goal : 1;
      lambda = journey ? 8.0 : 1.6;
    }
    st.mix = reducedMotion ? targetMix : st.mix + (targetMix - st.mix) * (1 - Math.exp(-lambda * dt));
    if (Math.abs(targetMix - st.mix) < 1e-4) st.mix = targetMix;
    if (st.mode === "catchup" && st.mix >= 0.9999) {
      // Arrived: the pair renders exactly this state at goalMix, so switch seamlessly.
      track(st.goalFrom!, st.goalTo!, st.goalFrom === st.goalTo ? 1 : st.goalMix);
    }
    uniforms.uMix.value = st.mix;
    if (!reducedMotion) uniforms.uTime.value += dt;
    // AgX desaturates bright light: a deeply saturated source at modest
    // intensity is what renders as the brand ember (not pastel peach).
    uniforms.uEmber.value.copy(GLOW_SOURCE).lerp(PALETTE.warmCore, live.warmth * 0.25).multiplyScalar(2.2);
    if (Math.abs(targetMix - st.mix) > 1e-3) live.moving = true;

    // Hovering a service in the DOM lights its icon (group = service index).
    const active = useWorld.getState().activeWedge;
    if (active !== null) uniforms.uHighlight.value = active;
    const amt = uniforms.uHighlightAmt.value;
    const highlightGoal = active !== null ? 0.9 : 0;
    uniforms.uHighlightAmt.value = reducedMotion ? highlightGoal : amt + (highlightGoal - amt) * (1 - Math.exp(-8 * dt));
    if (Math.abs(highlightGoal - uniforms.uHighlightAmt.value) > 1e-3) live.moving = true;

    // Labels belong to whichever clean formation is on screen (none while catching up).
    const showing = st.mode !== "track" ? null : st.mix > 0.85 ? st.bKey : st.mix < 0.15 ? st.aKey : null;
    const edge = st.mix > 0.5 ? (st.mix - 0.85) / 0.15 : (0.15 - st.mix) / 0.15;
    live.labels.key = showing;
    live.labels.opacity = showing ? Math.min(1, Math.max(0, edge)) : 0;
  });

  return <primitive object={mesh} />;
}
