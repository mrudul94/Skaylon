"use client";

import {
  CubeUVReflectionMapping,
  DataTexture,
  HalfFloatType,
  LinearFilter,
  LinearSRGBColorSpace,
  RGBAFormat,
} from "three";
import { ENV_TEXTURE, rgbeToHalfSliced } from "./environment";

let cache: Promise<DataTexture> | null = null;

/**
 * The pre-baked PMREM environment (scripts/bake-environment.mjs) as a
 * CubeUV half-float texture. three uses a CubeUVReflectionMapping texture as
 * is: no cube render, no PMREM shaders, no GPU passes at start-up. The
 * decode is time-sliced, so it never forms a long main-thread task.
 */
export function loadBakedEnvironment(): Promise<DataTexture> {
  cache ??= (async () => {
    const { width, height, file } = ENV_TEXTURE;
    const res = await fetch(file);
    if (!res.ok) throw new Error(`environment ${res.status}`);
    let bytes = new Uint8Array(await res.arrayBuffer());
    // Some servers/CDNs transparently decode .gz; only decompress real gzip.
    if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
      bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    }
    if (bytes.length !== width * height * 4) throw new Error("environment size mismatch");
    const half = await rgbeToHalfSliced(bytes);

    const texture = new DataTexture(half, width, height, RGBAFormat, HalfFloatType);
    texture.mapping = CubeUVReflectionMapping;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.colorSpace = LinearSRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  })();
  cache.catch(() => (cache = null)); // allow a retry after a failed fetch
  return cache;
}
