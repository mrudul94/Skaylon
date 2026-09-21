/**
 * bake-environment — renders the studio lighting (src/world/environment.ts)
 * through three's PMREM ONCE, in real Chrome, and writes the result:
 *   public/env/studio-<size>.rgbe.gz   CubeUV texture, RGBE bytes, gzipped
 *   public/env/studio-<size>.json      { width, height, hash } for verify-env
 *
 * Runtime then skips environment rendering and PMREM entirely.
 *
 *   node --experimental-strip-types scripts/bake-environment.mjs
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { ENV_SIZE, ENV_TEXTURE, LIGHTFORMERS, encodeRGBE, environmentHash } from "../src/world/environment.ts";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const threeBuild = join(root, "node_modules", "three", "build");

const page = `<!doctype html><script type="module">
import * as THREE from "/three/three.module.js";
const lights = ${JSON.stringify(LIGHTFORMERS)};
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
for (const l of lights) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(l.color[0] * l.intensity, l.color[1] * l.intensity, l.color[2] * l.intensity), side: THREE.DoubleSide, toneMapped: false }),
  );
  m.position.set(...l.position);
  m.scale.set(l.scale[0], l.scale[1], 1);
  m.lookAt(0, 0, 0);
  scene.add(m);
}
const pmrem = new THREE.PMREMGenerator(renderer);
const rt = pmrem.fromScene(scene, 0, 0.1, 100, { size: ${ENV_SIZE} });
const gl = renderer.getContext();
gl.getExtension("EXT_color_buffer_float");
renderer.setRenderTarget(rt);
const px = new Float32Array(rt.width * rt.height * 4);
gl.readPixels(0, 0, rt.width, rt.height, gl.RGBA, gl.FLOAT, px);
renderer.setRenderTarget(null);
window.__bake = { width: rt.width, height: rt.height, data: Array.from(px) };
</script>`;

const server = createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" }).end(page);
  } else if (req.url?.startsWith("/three/")) {
    res.writeHead(200, { "content-type": "text/javascript" }).end(readFileSync(join(threeBuild, req.url.slice(7))));
  } else {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const tab = await browser.newPage();
tab.on("pageerror", (e) => console.error("page error:", e));
await tab.goto(`http://127.0.0.1:${port}/`);
await tab.waitForFunction(() => window.__bake, null, { timeout: 60000 });
const { width, height, data } = await tab.evaluate(() => window.__bake);
await browser.close();
server.close();

if (width !== ENV_TEXTURE.width || height !== ENV_TEXTURE.height) {
  throw new Error(`PMREM layout ${width}×${height} ≠ expected ${ENV_TEXTURE.width}×${ENV_TEXTURE.height}`);
}

// readPixels rows are bottom-up, exactly as the texture will be uploaded
// (DataTexture has flipY = false), so no flip is needed.
const rgbe = new Uint8Array(width * height * 4);
let peak = 0;
for (let i = 0; i < width * height; i++) {
  const [r, g, b] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  peak = Math.max(peak, r, g, b);
  encodeRGBE(r, g, b, rgbe, i * 4);
}
const gz = gzipSync(rgbe, { level: 9 });
const outDir = join(root, "public", "env");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(root, "public", ENV_TEXTURE.file.slice(1)), gz);
writeFileSync(
  join(outDir, `studio-${ENV_SIZE}.json`),
  JSON.stringify({ width, height, hash: environmentHash(), peak: Number(peak.toFixed(3)) }, null, 2) + "\n",
);
console.log(`baked ${width}×${height} environment → ${ENV_TEXTURE.file} (${(gz.length / 1024).toFixed(1)} KB gz, peak radiance ${peak.toFixed(2)})`);
