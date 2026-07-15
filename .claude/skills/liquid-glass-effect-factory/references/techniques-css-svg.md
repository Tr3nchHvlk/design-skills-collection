# CSS + SVG Liquid Glass — technique catalogue

Five zero-dependency (or tiny-JS) techniques. All rely on **`backdrop-filter`** to capture the
page behind an element, optionally warped by an **SVG displacement filter**. Copy the filter
defs from [`../assets/svg-filters.html`](../assets/svg-filters.html) and the utility classes from
[`../assets/glass.css`](../assets/glass.css) — or inline the snippets below.

**Universal rules (apply to every technique):**
- Glass only shows over a **detailed background** (photo/gradient/text). Over flat colour → nothing to refract.
- Any element that captures the backdrop **must declare `backdrop-filter`** — even `blur(0px)`. Remove it and the effect dies.
- Keep `border-radius` identical across the element and all its glass layers/pseudo-elements.
- Displacement via `filter:url(#…)`/`backdrop-filter:url(#…)` is **Chromium-first**; Firefox won't apply an SVG filter to the backdrop and degrades to a plain frosted panel. Treat the warp as progressive enhancement.
- SVG filter `id`s are **global** — keep them unique per document.
- Motion helps: animate the background (or drag the panel) so the refraction feels alive.

---

## 1. Plain glassmorphism (baseline, widest support, no refraction)

Frosted translucent panel. No SVG, works everywhere `backdrop-filter` does.

```html
<div class="glass">Panel</div>
```
```css
.glass{
  background:rgba(255,255,255,.10);
  border:1px solid rgba(255,255,255,.20);
  border-radius:24px;
  backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
}
```
Dark variant: `background:rgba(0,0,0,.25)`. Optional depth cue — mouse parallax on the wallpaper:
```js
addEventListener('mousemove',e=>{
  const x=(e.clientX/innerWidth-.5)*10, y=(e.clientY/innerHeight-.5)*10;
  bgEl.style.backgroundPosition=`calc(50% + ${x}px) calc(50% + ${y}px)`;
});
```

## 2. Pseudo-element refraction (one element → clear liquid glass)

`::after` = the lens (captures + displaces the backdrop), `::before` = the bright rim. Needs
`#lg-refract` (procedural) from the filters asset.

```html
<div class="glass-refract" style="width:300px;height:200px">Glass</div>
```
```css
.glass-refract{position:relative;border-radius:30px;isolation:isolate;display:grid;place-items:center}
.glass-refract::before{content:"";position:absolute;inset:0;z-index:0;border-radius:inherit;
  box-shadow:inset 2px 2px 0 -2px rgba(255,255,255,.7), inset 0 0 3px 1px rgba(255,255,255,.7)}
.glass-refract::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;overflow:hidden;
  isolation:isolate;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);filter:url(#lg-refract)}
```
Frost it: raise the `::after` blur to `blur(6px)`. Stronger warp: swap `#lg-refract` → `#lg-warp`.

## 3. Single-property refractive button (round lens)

Applies the filter straight to the backdrop. Best for circular/pill buttons using the lens map
`#lg-lens`. Narrowest support (Chromium).

```html
<button class="glass-lens" style="width:180px;height:180px;border-radius:999px">+</button>
```
```css
.glass-lens{border:1px solid rgba(255,255,255,.3);
  background:linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,255,255,.03));
  backdrop-filter:url(#lg-lens); -webkit-backdrop-filter:url(#lg-lens)}
```
The lens map (`#lg-lens`) is a precomputed PNG baked into the filters asset — no external fetch.
If you load a map from another origin at runtime, go through `fetch → blob → objectURL` (a
cross-origin image can taint the filter and disable it).

## 4. Four-layer stack (Apple-dock; most control)

Separate layers for blur+refraction / tint / rim / content. Best for docks, toolbars, bars.

```html
<div class="lg-wrapper" style="padding:.6rem;border-radius:2rem">
  <div class="lg-effect"></div>
  <div class="lg-tint"></div>
  <div class="lg-shine"></div>
  <div class="lg-content"><!-- icons/label --></div>
</div>
```
```css
.lg-wrapper{position:relative;display:flex;overflow:hidden;border-radius:2rem;
  box-shadow:0 6px 6px rgba(0,0,0,.2),0 0 20px rgba(0,0,0,.1)}
.lg-wrapper>div{border-radius:inherit}                 /* round every layer together */
.lg-effect{position:absolute;inset:0;z-index:0;backdrop-filter:blur(3px);filter:url(#lg-refract)}
.lg-tint  {position:absolute;inset:0;z-index:1;background:rgba(255,255,255,.5)}   /* dark: rgba(0,0,0,.35) */
.lg-shine {position:absolute;inset:0;z-index:2;
  box-shadow:inset 2px 2px 1px 0 rgba(255,255,255,.5), inset -1px -1px 1px 1px rgba(255,255,255,.5)}
.lg-content{position:relative;z-index:3}
```
Layer order = paint order; keep effect→tint→shine→content.

## 5. Draggable + expandable menu (GSAP + CSS-variable morph)

Interactive glass. Geometry lives in CSS custom properties; a state class re-points them and
`transition`s animate the morph. Drag via GSAP Draggable.

```css
.lg-menu{
  --w:270px; --h:270px; --pad:30px; --r:32px;
  --t:.4s cubic-bezier(.5,1.5,.5,1);            /* springy */
  position:relative;width:var(--w);height:var(--h);padding:var(--pad);border-radius:var(--r);
  cursor:grab;transition:width var(--t),height var(--t),padding var(--t)}
.lg-menu.is-open{--w:550px;--h:700px;--pad:40px}   /* one class flips the vars */
.lg-menu>.lg-effect{filter:url(#lg-warp);backdrop-filter:blur(3px)} /* strong warp */
```
```html
<script type="module">
  import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3/+esm';
  import Draggable from 'https://cdn.jsdelivr.net/npm/gsap@3/Draggable.js';
  import InertiaPlugin from 'https://cdn.jsdelivr.net/npm/gsap@3/InertiaPlugin.js';
  gsap.registerPlugin(Draggable, InertiaPlugin);   // InertiaPlugin REQUIRED for inertia:true
  Draggable.create('.lg-menu',{ type:'x,y', inertia:true,
    onRelease(){ gsap.to(this.target,{x:0,y:0,duration:1.5,ease:'elastic.out(1,0.3)'}); }});
  document.querySelector('.lg-menu').addEventListener('click',e=>{
    if(e.target.closest('.lg-icon'))return; e.currentTarget.classList.toggle('is-open'); });
</script>
```
Gotcha: `inertia:true` is a no-op unless **InertiaPlugin** is loaded (GSAP just warns). Drag +
elastic snap-back work without it.

---

## Choosing a technique

| Want… | Use |
|---|---|
| Cheapest, works everywhere, no warp | **#1 glassmorphism** |
| Clear refractive panel, one element | **#2 pseudo-element** |
| Round refractive button | **#3 single-property lens** |
| Dock / toolbar / bar with full control | **#4 four-layer** |
| Draggable, expanding, interactive | **#5 GSAP menu** |
| Photorealistic lens / magnifier / cross-browser | → use the **WebGL library** (see [webgl-library.md](webgl-library.md)) |

See [presets.md](presets.md) for regular / dark / frosted / button knob values.
