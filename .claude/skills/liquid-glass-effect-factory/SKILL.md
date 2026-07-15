---
name: liquid-glass-effect-factory
description: Create liquid-glass / glassmorphism UI — frosted, clear, or dark translucent panels, buttons, docks, magnifiers, and lock-screen UIs that refract the background behind them. Covers five zero-dependency CSS + SVG-filter techniques AND the high-fidelity WebGL shader library (@ybouane/liquidglass). Use whenever the user asks for "liquid glass", "glassmorphism", "frosted glass", "glass button/panel/card/dock", "Apple/iOS/macOS glass", a backdrop-blur/refraction effect, or a glass magnifier/lens. Self-contained: all filter assets and CSS live in this skill folder.
---

# Liquid Glass Effect Factory

Produce any liquid-glass style on demand. Two families of technique are covered, both fully
documented inside this skill folder (no external files needed):

- **CSS + SVG filters** — zero-dependency (or tiny JS). `backdrop-filter` captures the page; an
  SVG `feDisplacementMap` warps it. Cheap, GPU-composited, Chromium-first.
- **WebGL shader library** (`@ybouane/liquidglass`, npm/CDN) — real per-pixel lens refraction,
  chromatic aberration, Fresnel, specular, shadow. Photorealistic, cross-browser (incl. Firefox),
  heavier.

## How to use this skill

1. **Pick the path** with the decision table below.
2. **Open the matching reference** (all in this folder):
   - CSS/SVG methods → [`references/techniques-css-svg.md`](references/techniques-css-svg.md)
   - WebGL library → [`references/webgl-library.md`](references/webgl-library.md)
   - Shader internals (to build your own) → [`references/shader.md`](references/shader.md)
   - Ready values for regular/dark/frosted/button/dome → [`references/presets.md`](references/presets.md)
3. **Grab the assets** (this folder):
   - [`assets/svg-filters.html`](assets/svg-filters.html) — paste this `<svg>` block into the page;
     provides `#lg-refract`, `#lg-warp`, `#lg-lens` (the lens map PNG is embedded — no external fetch).
   - [`assets/glass.css`](assets/glass.css) — utility classes for every CSS technique.
4. **Assemble** the requested component and hand back a complete, runnable file.

## Decision table

| The user wants… | Use | Reference |
|---|---|---|
| Cheapest frosted panel, works everywhere | Plain glassmorphism (`.glass`) | techniques §1 |
| Clear refractive panel/card | Pseudo-element (`.glass-refract`) | techniques §2 |
| Round/pill glass **button** | Single-property lens (`.glass-lens`, `#lg-lens`) | techniques §3 |
| **Dock / toolbar / bar** | Four-layer stack (`.lg-wrapper`) | techniques §4 |
| **Draggable / expanding** menu | GSAP + CSS-var morph | techniques §5 |
| Photoreal lens, **magnifier**, layered glass, or Firefox support | WebGL library | webgl-library.md |
| iPhone **lock-screen / app UI** mock | Glassmorphism + layout + mouse parallax | techniques §1 |

Rule of thumb: **default to CSS/SVG** for simple UI glass; reach for the **WebGL library** when the
user says "realistic", "magnifier", "like the demo", needs Firefox, or wants glass stacked over glass.

## The three finishes (map to "regular / dark / frosted")

- **regular** = clear + refractive (low/no blur, visible warp).
- **frosted** = milky (raise blur + white tint) — plain glassmorphism is the frosted baseline.
- **dark** = smoked (dark tint / negative brightness, white text).

Exact values for each, in both CSS and WebGL form, are in
[`references/presets.md`](references/presets.md).

## Non-negotiables (all techniques)

- Glass needs a **detailed background** to refract (photo/gradient/text). Over flat colour it's invisible.
- CSS: any backdrop-capturing element **must declare `backdrop-filter`** (even `blur(0px)`); keep
  `border-radius` consistent across all glass layers; SVG filter `id`s are global (unique per doc).
- WebGL: glass elements must be **direct children of the root**, the **root is never captured**
  (put the background in a sibling inside it), `init()` is **async**, and every glass element needs
  **`isolation: isolate`** or its injected canvas (z-index:-1) hides behind the background.
- Displacement/`url(#…)` filters are **Chromium-first**; Firefox degrades to a plain frosted panel.
  The WebGL library is the cross-browser option.

## Minimal CSS/SVG starter (copy, then adapt)

```html
<!-- 1) the filter defs (or paste the full assets/svg-filters.html) -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0">
  <filter id="lg-refract" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="n"/>
    <feGaussianBlur in="n" stdDeviation="0.02" result="b"/>
    <feDisplacementMap in="SourceGraphic" in2="b" scale="77" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>

<!-- 2) a detailed background + a glass panel -->
<div style="min-height:100vh;background:url(PHOTO.jpg) center/cover;display:grid;place-items:center">
  <div class="glass-refract" style="width:300px;height:200px;display:grid;place-items:center;color:#fff">Glass</div>
</div>

<style>
.glass-refract{position:relative;border-radius:30px;isolation:isolate}
.glass-refract::before{content:"";position:absolute;inset:0;border-radius:inherit;
  box-shadow:inset 2px 2px 0 -2px rgba(255,255,255,.7), inset 0 0 3px 1px rgba(255,255,255,.7)}
.glass-refract::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;overflow:hidden;
  backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);filter:url(#lg-refract)}
</style>
```
For frosted, raise the `::after` blur; for dark, add a `rgba(0,0,0,.3)` tint layer. Full variants
in [`references/techniques-css-svg.md`](references/techniques-css-svg.md).

## Minimal WebGL starter

See the complete working page in [`references/webgl-library.md`](references/webgl-library.md)
("Minimal working page"). Import from the CDN, put the background as a sibling inside the root,
give the glass `isolation:isolate`, set `data-config`, and `await LiquidGlass.init(...)`.

## Verification note

The WebGL library was built from source and driven in-browser during authoring: `init()` ~200ms,
~60fps, dome preset visibly magnifies + refracts with chromatic fringing, shadow and rim. The
`isolation: isolate` requirement above was discovered the same way — honor it.
