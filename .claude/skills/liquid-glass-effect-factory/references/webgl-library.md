# WebGL Liquid Glass — `@ybouane/liquidglass`

The high-fidelity path. Where the CSS/SVG techniques *approximate* refraction by shoving
backdrop pixels, this library rasterises the DOM behind a panel into a WebGL texture and runs a
**fragment shader** that computes a real rounded-rect glass lens: biconvex/dome refraction (IOR
1.5), chromatic aberration, Fresnel, multi-light specular, inner rim, and a soft drop shadow.
Works in **all evergreen browsers** (WebGL1 + Canvas2D + SVG foreignObject), incl. Firefox.

> **Verified** (built from source `tsc && esbuild`, driven in a browser): `init()` resolves ~200ms;
> renders at ~60fps; injects a padded output `<canvas>` (size = `(w+2·20)·dpr`); the dome preset
> visibly magnifies + refracts text with chromatic fringing, shadow and rim. All claims below hold.

## Install / import

```bash
npm install @ybouane/liquidglass
```
```js
import { LiquidGlass } from '@ybouane/liquidglass';
// or, no build step, straight from CDN:
// import { LiquidGlass } from 'https://cdn.jsdelivr.net/npm/@ybouane/liquidglass/dist/index.js';
```

## Minimal working page

```html
<div id="root" style="position:relative;width:900px;height:560px;overflow:hidden">
  <img class="bg" src="wallpaper.jpg" alt="" crossorigin="anonymous"
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <h1 style="position:absolute;top:20px;left:20px;color:#fff">Hello</h1>
  <div class="counter" data-dynamic>0</div>                 <!-- re-captured every frame -->
  <div class="glass" style="position:absolute;top:180px;left:250px;width:400px;height:200px;isolation:isolate">Glass</div>
</div>

<script type="module">
  import { LiquidGlass } from '@ybouane/liquidglass';
  const g = document.querySelector('.glass');
  g.dataset.config = JSON.stringify({ blurAmount: 0.25, cornerRadius: 30 });   // frosted
  const instance = await LiquidGlass.init({
    root: document.querySelector('#root'),
    glassElements: [g],
  });
  // instance.destroy();  // later
</script>
```

## Three rules that come from the architecture

1. **Glass elements must be direct children of `root`.** Nested glass is rejected at init.
2. **The `root` itself is never sampled.** Put the background in a **sibling inside** the root —
   not as the root's own `background`/padding/border.
3. **`init()` is async** — resolves after webfonts prefetch + glass content pre-capture (~100–500ms).

## ⚠️ Stacking gotcha (verified — bake this in)

The library injects its output `<canvas>` as the glass element's first child with
**`z-index:-1`**. If the glass element does **not** form its own stacking context, that canvas
can paint *behind* a positioned background and you'll see nothing. **Fix:** give every glass
element `isolation: isolate` (or a non-auto `z-index`). Also: the shadow halo overflows the
element's box, so an ancestor with `overflow:hidden` will clip it.

## API

`LiquidGlass.init(options): Promise<LiquidGlass>`

| Option | Type | Default | Notes |
|---|---|---|---|
| `root` | `HTMLElement` | required | Container; glass must be direct children. |
| `glassElements` | `NodeList \| HTMLElement[]` | `[]` | Elements to turn into glass. |
| `defaults` | `Partial<GlassConfig>` | `{}` | Per-instance config overrides. |

Instance: `.fps` (measured), `.destroy()` (stop loop, remove canvases, restore styles, free GL),
`.markChanged(el?)` (flag content the library can't observe — a repainted `<canvas>`, a swapped
`<img>` `src`, a changed `background-image`; with no arg, redraw all).
Also exported: `DEFAULTS`, types `GlassConfig`/`LiquidGlassOptions`, `invalidateFontEmbedCache()`.

## Per-element config (`element.dataset.config = JSON.stringify({...})`)

Re-read live via MutationObserver, so you can retune at runtime.

| Option | Default | Meaning |
|---|---|---|
| `blurAmount` | `0.00` | Background blur (0 sharp → 1 max). 0 skips blur passes. |
| `refraction` | `0.69` | How much the glass bends the background. |
| `chromAberration` | `0.05` | Colour fringing at the rim. |
| `edgeHighlight` | `0.05` | Rim glow / inner stroke intensity. |
| `specular` | `0.00` | Multi-light Blinn-Phong highlight. |
| `fresnel` | `1.00` | Grazing-angle reflection (rim whitening). |
| `distortion` | `0.00` | Micro-noise distortion. |
| `cornerRadius` | `65` | Corner radius (CSS px). |
| `zRadius` | `40` | Bevel depth (cross-section curvature). |
| `opacity` | `1.00` | Panel opacity. |
| `saturation` | `0.00` | −1 gray … 0 … 1 vivid. |
| `tintStrength` | `0.00` | Cool blue glass tint. |
| `brightness` | `0.00` | −0.5 … 0.5. |
| `shadowOpacity` | `0.30` | Drop shadow opacity. |
| `shadowSpread` | `10` | Shadow spread (px). |
| `shadowOffsetY` | `1` | Shadow vertical offset (px). |
| `floating` | `false` | Drag-to-move (Pointer Events). |
| `button` | `false` | Hover brightens; press flattens bevel + deepens shadow. |
| `bevelMode` | `0` | `0` biconvex pill; `1` dome (set `cornerRadius===zRadius` → half-sphere magnifier). |

## How it works (pipeline)

1. **Capture the scene**: non-glass children of the root are rasterised to a hidden canvas —
   `<img>/<canvas>/<video>` via `drawImage`; everything else via **`html-to-image`** (style
   inlining + SVG `<foreignObject>`). Static children cached once; `data-dynamic` (and `<video>`)
   re-captured every frame.
2. **Per glass, in stacking order**: crop the scene to the panel's padded rect, upload that
   region, optional 6-pass Gaussian blur, then run the glass fragment shader into the injected
   canvas. Result is **composited back before the next glass runs**, so a glass above another
   refracts the one below.
3. **Dirty-tracking**: the loop short-circuits when nothing changed; only glasses whose sample
   rect intersects a changed region re-render.

The GLSL itself (rounded-rect SDF, bevel height-field, dual refraction models, chromatic
aberration, Fresnel/specular, shadow) is dissected in [shader.md](shader.md).

## Dynamic content & stacking

- **`data-dynamic`** on a direct child of root → re-rasterised every frame (counters, charts).
  Use sparingly; it defeats dirty-tracking. `<video>` is auto-detected.
- For occasional updates, prefer `instance.markChanged(el)` — costs nothing on idle frames.
- The library re-implements CSS stacking-context rules on the root's direct children to decide
  paint order (position+z-index, opacity<1, transform/filter/clip-path/mix-blend-mode/isolation/
  backdrop-filter/mask/contain, will-change of those).

## Gotchas & limits

- Each instance opens **its own WebGL context** (browsers cap ~16 — don't spawn dozens).
- DOM→canvas capture is expensive — keep non-glass wrappers small/shallow; resize re-captures all.
- **Webfonts must load before `init()`** with CORS-friendly headers (Google Fonts/jsdelivr/unpkg
  ok); fonts loaded later fall back to system fonts inside captures — call
  `invalidateFontEmbedCache()` then re-init. Cross-origin `<img>` needs `crossorigin="anonymous"`
  or the tainted canvas disables the effect for the whole root.
- Separate roots can't share refraction. `destroy()` won't restore an element's original
  `position:static` if it overwrote it with `relative`.
- **Rim edge-smear over stark backgrounds (verified).** Biconvex panels (`bevelMode:0`) refract by
  sampling the backdrop *outward* at the rim. The renderer uploads only the panel's cropped region
  with `CLAMP_TO_EDGE`, so a sample that lands past that edge repeats the edge texel — and if that
  texel is **stark high-contrast content** (e.g., bold pure-white text) sitting at the panel's edge,
  it stretches into bright **strips along the border**. Fix: put glass over **detailed, gentle-contrast
  backgrounds** (photos / textures / mesh gradients), not a solid high-contrast bar crossing the edge —
  this is exactly why the official demo (photo backdrops) looks clean. The **dome** (`bevelMode:1`)
  samples *inward* toward center, so it never shows this.
- WebGL context loss auto-recovers. License: MIT.

## When to use this vs. CSS/SVG

Use the library for genuine lensing (magnifier domes, layered glass refracting glass beneath it,
chromatic edges), cross-browser consistency incl. Firefox, and built-in drag/button — at the cost
of a JS lib + WebGL context + per-frame DOM capture. Use CSS/SVG
([techniques-css-svg.md](techniques-css-svg.md)) for zero-dependency, ultra-cheap, GPU-composited
glass where approximate refraction and Chromium-first support are fine.
