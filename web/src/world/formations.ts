/**
 * "Code to product": every formation is the SAME set of N chips (small
 * glowing blocks, like tokens of code) arranged differently. The world morphs
 * chip-for-chip between formations as you scroll or navigate.
 *
 * PURE (no three.js, deterministic PRNG) so scripts/verify-formations.mts
 * tests exactly what renders. Any N works: shapes are sampled to exactly N
 * chips and chip size adapts, so solid shapes stay solid on every tier.
 */

export type Vec3 = [number, number, number];

export const FLOOR_Y = -1.72;

export type FormationKey =
  | "product"
  | "code"
  | "services"
  | "gallery"
  | "process"
  | "delivered"
  | "scatter"
  | "missing"
  | `focus${0 | 1 | 2 | 3 | 4}`;

/** A label pinned to a point of a formation. `text` may reference content: "service:2", "phase:0". */
export type Anchor = {
  text: string;
  point: Vec3;
  /** Where the label sits: beside the anchor, or centred above it ("up", staggered by `level` so neighbours never collide). */
  side: "left" | "right" | "up";
  level?: 0 | 1;
};

export type Formation = {
  /** xyz per chip (length 3N). */
  position: Float32Array;
  /** Chip dimensions per chip (length 3N). */
  scale: Float32Array;
  /** 0..1 emissive accent per chip (the ember glow). */
  glow: Float32Array;
  /** 0..1 how freely each chip drifts (0 = locked into a solid). */
  loose: Float32Array;
  /** Group per chip (service icon / process stage index), -1 = none. Hover highlights a group. */
  group: Float32Array;
  anchors: Anchor[];
};

// ------------------------------------------------------------------ helpers

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9) >>> 0) / 4294967296;
}

type Chip = { p: Vec3; s: Vec3; g: number; l: number; gr?: number };

function pack(chips: Chip[], n: number, anchors: Anchor[]): Formation {
  if (chips.length !== n) throw new Error(`formation produced ${chips.length} chips, expected ${n}`);
  const f: Formation = {
    position: new Float32Array(n * 3),
    scale: new Float32Array(n * 3),
    glow: new Float32Array(n),
    loose: new Float32Array(n),
    group: new Float32Array(n).fill(-1),
    anchors,
  };
  chips.forEach((c, i) => {
    f.position.set(c.p, i * 3);
    f.scale.set(c.s, i * 3);
    f.glow[i] = c.g;
    f.loose[i] = c.l;
    f.group[i] = c.gr ?? -1;
  });
  return f;
}

/** Splits n into parts proportional to weights, summing exactly to n. */
export function split(n: number, weights: number[]): number[] {
  const total = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (n * w) / total);
  const out = raw.map(Math.floor);
  let rest = n - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rest > 0; k++, rest--) out[order[k % order.length]![1]]!++;
  return out;
}

/**
 * Tiles a w×h rectangle with exactly `count` chips on a near-square grid.
 * `place(u, v)` maps grid coords (in rectangle units, centred) to 3D; the
 * chip covers ~92% of its cell so the surface reads as solid.
 */
function tileRect(count: number, w: number, h: number, place: (u: number, v: number, cw: number, ch: number) => Chip): Chip[] {
  if (count <= 0) return [];
  const cols = Math.max(1, Math.round(Math.sqrt((count * w) / h)));
  const rows = Math.ceil(count / cols);
  const cw = w / cols;
  const ch = h / rows;
  const chips: Chip[] = [];
  for (let r = 0; r < rows && chips.length < count; r++) {
    for (let c = 0; c < cols && chips.length < count; c++) {
      chips.push(place(-w / 2 + (c + 0.5) * cw, -h / 2 + (r + 0.5) * ch, cw, ch));
    }
  }
  return chips;
}

/** Chips along a polyline (closed or open), evenly spaced by length. */
function alongPath(points: [number, number][], closed: boolean, count: number, place: (x: number, y: number, step: number, horizontal: boolean) => Chip): Chip[] {
  const segs: { a: [number, number]; b: [number, number]; len: number }[] = [];
  const pts = closed ? [...points, points[0]!] : points;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    segs.push({ a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) });
  }
  const total = segs.reduce((s, x) => s + x.len, 0);
  const step = total / count;
  const chips: Chip[] = [];
  for (let k = 0; k < count; k++) {
    let d = (k + 0.5) * step;
    let seg = segs[0]!;
    for (const s of segs) {
      seg = s;
      if (d <= s.len) break;
      d -= s.len;
    }
    const t = seg.len ? Math.min(1, d / seg.len) : 0;
    const horizontal = Math.abs(seg.b[0] - seg.a[0]) >= Math.abs(seg.b[1] - seg.a[1]);
    chips.push(place(seg.a[0] + (seg.b[0] - seg.a[0]) * t, seg.a[1] + (seg.b[1] - seg.a[1]) * t, step, horizontal));
  }
  return chips;
}

// ------------------------------------------------------------------ shapes

/**
 * The finished product: a tall slab (the Skaylon mark in 3D) covered in chips,
 * cut by the logo's angled seam. Chips beside the seam glow: light leaking
 * from inside. Front/back/sides/top carry chips in proportion to their area.
 */
function productChips(n: number, center: Vec3, size: Vec3, seamGlow: number, rand: () => number): Chip[] {
  const [W, H, D] = size;
  const [cx, cy, cz] = center;
  const t = 0.05; // chip thickness
  const seam = (x: number) => 0.28 + 0.17 * (x / (W / 2)); // the logo's angled cut (local y)
  const faces = [
    { area: W * H, key: "front" },
    { area: W * H, key: "back" },
    { area: D * H, key: "left" },
    { area: D * H, key: "right" },
    { area: W * D, key: "top" },
  ];
  const counts = split(n, faces.map((f) => f.area));
  const chips: Chip[] = [];
  faces.forEach((face, i) => {
    const count = counts[i]!;
    const glowAt = (x: number, y: number) => (Math.abs(y - seam(x)) < H * 0.035 ? seamGlow : 0);
    // Pull chips back from the seam to open a visible cut.
    const gapY = (x: number, y: number) => {
      const s = seam(x);
      const d = y - s;
      return Math.abs(d) < 0.03 ? y + Math.sign(d || 1) * 0.03 : y;
    };
    const jitter = () => (rand() - 0.5) * 0.004;
    if (face.key === "front" || face.key === "back") {
      const z = face.key === "front" ? D / 2 : -D / 2;
      chips.push(...tileRect(count, W, H, (u, v, cw, ch) => ({ p: [cx + u, cy + gapY(u, v), cz + z + jitter()], s: [cw * 0.92, ch * 0.9, t], g: glowAt(u, v), l: 0 })));
    } else if (face.key === "left" || face.key === "right") {
      const x = face.key === "left" ? -W / 2 : W / 2;
      chips.push(...tileRect(count, D, H, (u, v, cw, ch) => ({ p: [cx + x + jitter(), cy + gapY(x, v), cz + u], s: [t, ch * 0.9, cw * 0.92], g: glowAt(x, v), l: 0 })));
    } else {
      chips.push(...tileRect(count, W, D, (u, v, cw, ch) => ({ p: [cx + u, cy + H / 2 + jitter(), cz + v], s: [cw * 0.92, t, ch * 0.92], g: 0, l: 0 })));
    }
  });
  return chips;
}

/** Floating lines of code: rows of tokens (chips) with indentation, in depth layers. */
function codeChips(n: number, rand: () => number): Chip[] {
  const layers = [-1.4, -0.4, 0.6];
  const perLayer = split(n, [1.2, 1, 0.8]);
  const chips: Chip[] = [];
  layers.forEach((z, li) => {
    let remaining = perLayer[li]!;
    const rows = 16;
    const perRow = split(remaining, Array.from({ length: rows }, () => 0.6 + rand()));
    for (let r = 0; r < rows; r++) {
      const count = perRow[r]!;
      remaining -= count;
      const y = 2.3 - r * 0.26 + li * 0.05;
      const indent = [0, 0.3, 0.6, 0.3, 0.9][Math.floor(rand() * 5)]!;
      let x = -1.3 + li * 0.3 + indent;
      for (let k = 0; k < count; k++) {
        const w = 0.08 + rand() * 0.22; // token width
        chips.push({ p: [x + w / 2, y, z + (rand() - 0.5) * 0.08], s: [w, 0.07, 0.03], g: rand() < 0.06 ? 0.8 : 0, l: 1 });
        x += w + 0.05;
        if (x > 3.6) x = -1.3 + indent;
      }
    }
  });
  return chips;
}

/** Five service icons on a gentle arc (browser, dashboard, phone, layers, design ring). */
export const SERVICE_CENTERS: Vec3[] = [-3.3, -1.65, 0, 1.65, 3.3].map((x) => [x, 0.25, -Math.abs(x) * 0.22]);

function iconChips(kind: number, n: number, center: Vec3, k: number): Chip[] {
  const [cx, cy, cz] = center;
  const t = 0.05;
  const at = (x: number, y: number, z = 0): Vec3 => [cx + x * k, cy + y * k, cz + z * k];
  const line = (x: number, y: number, step: number, horizontal: boolean): Chip => ({
    p: at(x, y),
    s: horizontal ? [step * 0.85 * k, 0.045 * k, t] : [0.045 * k, step * 0.85 * k, t],
    g: 0,
    l: 0,
  });
  switch (kind) {
    case 0: {
      // Browser window: frame, title bar with three dots, content lines.
      const [frame, bar, content] = split(n, [4, 2, 3]);
      return [
        ...alongPath([[-0.6, -0.42], [0.6, -0.42], [0.6, 0.42], [-0.6, 0.42]], true, frame!, line),
        ...tileRect(bar!, 1.2, 0.14, (u, v, cw, ch) => ({ p: at(u, 0.35 + v), s: [cw * 0.9 * k, ch * 0.9 * k, t], g: u < -0.35 ? 0.9 : 0, l: 0 })),
        ...alongPath([[-0.48, 0.12], [0.3, 0.12], [0.3, 0.02], [-0.48, 0.02], [-0.48, -0.1], [0.45, -0.1], [0.45, -0.22], [-0.48, -0.22]], false, content!, line),
      ];
    }
    case 1: {
      // Dashboard: a 3×2 grid of cards, one highlighted.
      const counts = split(n, [1, 1, 1, 1, 1, 1]);
      return counts.flatMap((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const ox = -0.42 + col * 0.42;
        const oy = 0.2 - row * 0.42;
        return tileRect(c, 0.34, 0.34, (u, v, cw, ch) => ({ p: at(ox + u, oy + v), s: [cw * 0.85 * k, ch * 0.85 * k, t], g: i === 1 ? 0.7 : 0, l: 0 }));
      });
    }
    case 2: {
      // Phone: rounded outline, screen grid, home bar.
      const [outline, screen, home] = split(n, [4, 5, 0.6]);
      const r = 0.08;
      const outlinePts: [number, number][] = [];
      for (let a = 0; a < 4; a++) {
        const [qx, qy] = [[0.28, 0.5], [-0.28, 0.5], [-0.28, -0.5], [0.28, -0.5]][a] as [number, number];
        for (let s = 0; s <= 4; s++) {
          const ang = (a * Math.PI) / 2 + (s / 4) * (Math.PI / 2);
          outlinePts.push([qx - Math.sign(qx) * r + Math.cos(ang) * r, qy - Math.sign(qy) * r + Math.sin(ang) * r]);
        }
      }
      return [
        ...alongPath(outlinePts, true, outline!, line),
        ...tileRect(screen!, 0.44, 0.74, (u, v, cw, ch) => ({ p: at(u, 0.05 + v), s: [cw * 0.8 * k, ch * 0.8 * k, t], g: v > 0.3 ? 0.6 : 0, l: 0 })),
        ...tileRect(home!, 0.18, 0.03, (u, v, cw, ch) => ({ p: at(u, -0.42 + v), s: [cw * 0.9 * k, ch * k, t], g: 0.4, l: 0 })),
      ];
    }
    case 3: {
      // Custom software: three stacked plates (layers of a system).
      const counts = split(n, [1, 1, 1]);
      return counts.flatMap((c, i) =>
        tileRect(c, 0.9, 0.6, (u, v, cw, ch) => ({
          p: at(u + (i - 1) * 0.06, -0.3 + i * 0.3, v),
          s: [cw * 0.88 * k, t, ch * 0.88 * k],
          g: i === 2 ? 0.5 : 0,
          l: 0,
        })),
      );
    }
    default: {
      // UI/UX: a design ring with a focal point.
      const [ring, dot] = split(n, [5, 1]);
      const pts: [number, number][] = Array.from({ length: 48 }, (_, i) => [Math.cos((i / 48) * Math.PI * 2) * 0.5, Math.sin((i / 48) * Math.PI * 2) * 0.5]);
      return [
        ...alongPath(pts, true, ring!, line),
        ...tileRect(dot!, 0.24, 0.24, (u, v, cw, ch) => ({ p: at(u, v), s: [cw * 0.85 * k, ch * 0.85 * k, t], g: 0.9, l: 0 })),
      ];
    }
  }
}

function servicesChips(n: number): Chip[] {
  const counts = split(n, [1, 1, 1, 1, 1]);
  return counts.flatMap((c, i) => iconChips(i, c, SERVICE_CENTERS[i]!, 1).map((chip) => ({ ...chip, gr: i })));
}

/** Gallery wall: three framed panels, glowing borders. */
function galleryChips(n: number): Chip[] {
  const centers: Vec3[] = [[-2.25, 0.35, -0.5], [0, 0.45, 0], [2.25, 0.35, -0.5]];
  const counts = split(n, [1, 1.2, 1]);
  return counts.flatMap((c, i) => {
    const [fill, border] = split(c, [3, 1]);
    const [x, y, z] = centers[i]!;
    const w = 1.9;
    const h = 1.3;
    return [
      ...tileRect(fill!, w * 0.9, h * 0.86, (u, v, cw, ch) => ({ p: [x + u, y + v, z], s: [cw * 0.9, ch * 0.9, 0.04], g: 0, l: 0 })),
      ...alongPath([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], true, border!, (px, py, step, hor) => ({
        p: [x + px, y + py, z + 0.03],
        s: hor ? [step * 0.8, 0.04, 0.04] : [0.04, step * 0.8, 0.04],
        g: 0.55,
        l: 0,
      })),
    ];
  });
}

/** Four process stages, left to right, from chaos to a finished product. */
export const PROCESS_CENTERS: Vec3[] = [
  [-3.3, 0.3, 0.6],
  [-1.1, 0.3, -0.3],
  [1.1, 0.3, -1.2],
  [3.3, 0.3, -2.1],
];

function processChips(n: number, rand: () => number): Chip[] {
  const counts = split(n, [1, 1, 1, 1]);
  const [c0, c1, c2, c3] = PROCESS_CENTERS as [Vec3, Vec3, Vec3, Vec3];
  const scattered: Chip[] = Array.from({ length: counts[0]! }, () => {
    const u = rand() * Math.PI * 2;
    const v = Math.acos(2 * rand() - 1);
    const r = 0.35 + rand() * 0.45;
    return { p: [c0[0] + r * Math.sin(v) * Math.cos(u), c0[1] + r * Math.cos(v), c0[2] + r * Math.sin(v) * Math.sin(u)], s: [0.06, 0.06, 0.06], g: rand() < 0.1 ? 0.8 : 0, l: 1 };
  });
  const loose = tileRect(counts[1]!, 1, 1, (u, v) => ({ p: [c1[0] + u + (rand() - 0.5) * 0.12, c1[1] + v + (rand() - 0.5) * 0.12, c1[2] + (rand() - 0.5) * 0.3], s: [0.07, 0.07, 0.07], g: 0, l: 0.5 }));
  const structured = [0, 1, 2].flatMap((layer) =>
    tileRect(split(counts[2]!, [1, 1, 1])[layer]!, 0.9, 0.9, (u, v, cw, ch) => ({ p: [c2[0] + u, c2[1] - 0.35 + layer * 0.35, c2[2] + v], s: [cw * 0.85, 0.05, ch * 0.85], g: layer === 2 ? 0.4 : 0, l: 0 })),
  );
  const product = productChips(counts[3]!, c3, [0.55, 1.1, 0.2], 0.9, rand);
  const tag = (chips: Chip[], gr: number) => chips.map((c) => ({ ...c, gr }));
  return [...tag(scattered, 0), ...tag(loose, 1), ...tag(structured, 2), ...tag(product, 3)];
}

function scatterChips(n: number, rand: () => number, radius = 6): Chip[] {
  return Array.from({ length: n }, () => {
    const u = rand() * Math.PI * 2;
    const v = Math.acos(2 * rand() - 1);
    const r = radius * Math.cbrt(rand());
    const y = Math.max(FLOOR_Y + 0.3, 0.4 + r * Math.cos(v) * 0.6);
    return { p: [r * Math.sin(v) * Math.cos(u), y, r * Math.sin(v) * Math.sin(u) - 2], s: [0.05, 0.05, 0.05], g: rand() < 0.05 ? 0.6 : 0, l: 1 };
  });
}

// ------------------------------------------------------------------ formations

const PRODUCT_CENTER: Vec3 = [0, 0.05, 0];
const PRODUCT_SIZE: Vec3 = [1.3, 3.0, 0.55];

/** Labels for each formation (pure lookup, no geometry needed). */
export function anchorsFor(key: FormationKey): Anchor[] {
  switch (key) {
    case "product":
      return [{ text: "Your finished product", point: [0.65, 1.55, 0.3], side: "right" }];
    case "delivered":
      return [{ text: "Delivered. Supported.", point: [0.65, 0.4, 0.3], side: "right" }];
    case "code":
      return [{ text: "Ideas → requirements → code", point: [2.2, 2.3, 0.6], side: "up", level: 0 }];
    case "services":
      return SERVICE_CENTERS.map((c, i) => ({ text: `service:${i}`, point: [c[0], c[1] + 0.62, c[2]] as Vec3, side: "up" as const, level: (i % 2) as 0 | 1 }));
    case "gallery":
      return [{ text: "Selected work", point: [0.95, 1.1, 0], side: "right" }];
    case "process":
      return PROCESS_CENTERS.map((c, i) => ({ text: `phase:${i}`, point: [c[0], c[1] + 0.85, c[2]] as Vec3, side: "up" as const, level: (i % 2) as 0 | 1 }));
    case "missing":
      return [{ text: "A piece is missing", point: [1.6, -1.2, 1.3], side: "right" }];
    case "scatter":
      return [];
    default:
      return [{ text: `service:${Number(key.slice(5))}`, point: [0.9, 1.45, 0.4], side: "right" }];
  }
}

export function buildFormation(key: FormationKey, n: number): Formation {
  const rand = rng(hash(key));
  const anchors = anchorsFor(key);
  switch (key) {
    case "product":
      return pack(productChips(n, PRODUCT_CENTER, PRODUCT_SIZE, 0.55, rand), n, anchors);
    case "delivered":
      return pack(productChips(n, PRODUCT_CENTER, PRODUCT_SIZE, 1, rand), n, anchors);
    case "code":
      return pack(codeChips(n, rand), n, anchors);
    case "services":
      return pack(servicesChips(n), n, anchors);
    case "gallery":
      return pack(galleryChips(n), n, anchors);
    case "process":
      return pack(processChips(n, rand), n, anchors);
    case "scatter":
      return pack(scatterChips(n, rand), n, anchors);
    case "missing": {
      // The product with a chunk torn out, its chips lying on the floor.
      const chips = productChips(n, PRODUCT_CENTER, PRODUCT_SIZE, 0.3, rand);
      chips.forEach((c) => {
        const [x, y, z] = c.p;
        if (x > 0.05 && y < -0.2 && y > -1.1 && z > 0) {
          c.p = [0.9 + rand() * 1.6, FLOOR_Y + 0.03, 0.6 + rand() * 1.4];
          c.s = [c.s[0], 0.05, c.s[1]];
          c.g = 0;
        }
      });
      return pack(chips, n, anchors);
    }
    default: {
      // focusN: that service's icon, large, at the centre; the rest drift far back.
      const i = Number(key.slice(5)) as 0 | 1 | 2 | 3 | 4;
      const [main, rest] = split(n, [3, 2]);
      // The rest recede into a faint, distant field of fine dust (never over the text).
      const backdrop = scatterChips(rest!, rand, 7).map((c) => ({
        ...c,
        p: [c.p[0] * 1.4, c.p[1], c.p[2] - 9] as Vec3,
        s: [0.03, 0.03, 0.03] as Vec3,
        g: 0,
      }));
      const chips = [...iconChips(i, main!, [0, 0.3, 0.4], 2.2).map((c) => ({ ...c, gr: i })), ...backdrop];
      return pack(chips, n, anchors);
    }
  }
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const ALL_FORMATIONS: FormationKey[] = ["product", "code", "services", "gallery", "process", "delivered", "scatter", "missing", "focus0", "focus1", "focus2", "focus3", "focus4"];

/** Axis-aligned bounds of a formation's chip centres (for camera clearance). */
export function bounds(f: Formation): { min: Vec3; max: Vec3 } {
  const min: Vec3 = [Infinity, Infinity, Infinity];
  const max: Vec3 = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < f.position.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      min[a] = Math.min(min[a]!, f.position[i + a]!);
      max[a] = Math.max(max[a]!, f.position[i + a]!);
    }
  }
  return { min, max };
}

/** Shared morph easing: per-chip staggered, so shapes dissolve and form in waves. */
export function morphAmount(mix: number, stagger: number): number {
  const x = Math.min(1, Math.max(0, mix * 1.5 - stagger * 0.5));
  return x * x * (3 - 2 * x);
}
