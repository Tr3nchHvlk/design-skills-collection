---
name: luminous-gradient
description: Aurora / mesh gradient aesthetic — dark indigo canvas with slowly drifting multi-layer radial gradients (cyan, purple, pink, blue), translucent white-alpha cards, pill shapes, gradient-clipped text, and glow-based hover states. Use when building landing pages, heroes, or dashboards that should feel luminous, atmospheric, and alive ("northern lights" mood). Covers the full background recipe, color tokens, typography, and every interaction/animation choice (load choreography, scroll reveals, hover state tables, easing vocabulary).
---

# Luminous Gradient (Aurora / Mesh Gradient)

Documented from the live demo `https://claudekit.github.io/frontend-design-pro-demo/06-aurora-mesh-gradient.html`.
Verbatim page CSS: [source.css](source.css) · Verbatim page JS: [interactions.js](interactions.js) · Screenshots: [references/](references/)

## Essence

A near-black indigo canvas over which three enormous, blurred radial-gradient
layers drift and breathe on 20–30 s loops, like aurora borealis. All UI sits
on top as barely-there translucent surfaces (3–5% white) so the moving color
field shows through everything. Brand color is not one color but a **gradient
ramp** (cyan → purple → pink) applied to text via `background-clip: text` and
to primary buttons. Light is the interaction language: elements respond to
hover by **glowing** (large zero-offset box-shadows in cyan), never by casting
dark drop shadows. Shapes are pills and soft super-rounded cards. The page
never sits still — even at rest the background wanders, the headline gradient
slides, and a status dot pulses — but every motion is slow, ambient, and
low-amplitude.

Reference: [references/lg-01-hero.png](references/lg-01-hero.png) (hero),
[references/lg-02-features.png](references/lg-02-features.png) (cards over the field),
[references/lg-03-stats-cta.png](references/lg-03-stats-cta.png),
[references/lg-04-cta-footer.png](references/lg-04-cta-footer.png).

## Background / canvas — the signature recipe

Two fixed, full-viewport, `z-index: -1` elements build the atmosphere:

**1. `.aurora-bg` — three drifting layers.** Each layer is `200%` × `200%`,
offset `-50%` top/left (so drift never exposes an edge), `opacity: 0.5`, and
painted with 1–2 huge radial-gradient ellipses that fade to transparent by
40–50%:

```css
.aurora-layer-1 {  /* cyan + purple, 25s drift */
  background:
    radial-gradient(ellipse 80% 50% at 20% 40%, var(--color-cyan) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 70% 60%, var(--color-purple) 0%, transparent 50%);
  animation: aurora-drift 25s ease-in-out infinite;
}
.aurora-layer-2 {  /* pink + blue, 30s drift, REVERSED */
  animation: aurora-drift 30s ease-in-out infinite reverse;
}
.aurora-layer-3 {  /* single purple ellipse, 20s opacity/scale pulse */
  animation: aurora-pulse 20s ease-in-out infinite;
}

@keyframes aurora-drift {   /* organic wander: translate ±5%, rotate ±5deg */
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25%      { transform: translate(5%, -5%) rotate(5deg); }
  50%      { transform: translate(-5%, 5%) rotate(-5deg); }
  75%      { transform: translate(3%, 3%) rotate(3deg); }
}
@keyframes aurora-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.2); }
}
```

**2. `.mesh-overlay` — static color wash.** Three faint radial circles
(cyan 15%, purple 15%, pink 10% alpha) under `filter: blur(60px)`. This fills
gaps between the drifting ellipses so no region of the viewport is ever flat
`#0f0f1a`.

**Key deliberate choices:**
- The three layer durations are all different and non-multiples (25 / 30 / 20 s),
  and layer 2 runs `reverse` — the composite pattern effectively never repeats.
- Drift animates only `transform` (translate/rotate/scale) and `opacity`;
  the blur is static. Compositor-only → smooth at 60 fps.
- Layers use the full-saturation token colors; the 0.5 layer opacity +
  transparency stops do the softening. The mesh overlay uses pre-softened
  rgba stops + blur instead.

## Material / surface recipe

| Surface | Background | Border | Radius | Extra |
|---|---|---|---|---|
| Feature card | `rgba(255,255,255,0.03)` | `1px rgba(255,255,255,0.08)` | 24px | hidden gradient hairline at top (see hovers) |
| Stat card | `rgba(255,255,255,0.03)` | `1px rgba(255,255,255,0.08)` | 20px | hidden bottom-up cyan wash `::after` |
| Nav pill | `rgba(15,15,26,0.6)` + `backdrop-filter: blur(20px)` | `1px rgba(255,255,255,0.1)` | 100px | the only frosted-glass surface |
| CTA card | `linear-gradient(135deg, rgba(6,182,212,.1), rgba(168,85,247,.1))` | `1px rgba(255,255,255,0.1)` | 32px | own private aurora: oversized `::before` with two radial circles on `aurora-drift 20s` |
| Icon tile | `linear-gradient(135deg, rgba(6,182,212,.2), rgba(168,85,247,.2))` | `1px rgba(255,255,255,0.1)` | 16px | 60×60px, emoji glyph |
| Secondary button | `rgba(255,255,255,0.1)` | `1px rgba(255,255,255,0.2)` | 100px | |
| Primary button / nav CTA | `linear-gradient(135deg, cyan, purple)` | none | 100px | dark text (`--color-bg`) on gradient; resting glow `0 0 30px rgba(6,182,212,0.3)` |

Rules of the material system:
- Surfaces are **white-alpha tints, not solid colors** — the aurora must read
  through every card. Only the nav uses backdrop blur (content scrolls under it).
- Radius scales with container size: 16 → 20 → 24 → 32px; interactive
  pills are always fully round (`100px`).
- Shadows are **glows**: zero-offset, large-blur, cyan-tinted
  (`0 0 30–60px rgba(6,182,212, .2–.6)`). No offset drop shadows anywhere.

Close-up reference: [references/lg-05-feature-card-rest.png](references/lg-05-feature-card-rest.png).

## Color tokens

```css
:root {
  --color-bg:         #0f0f1a;                  /* near-black indigo, never pure black */
  --color-text:       #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.6); /* all secondary text */
  --color-cyan:       #06b6d4;  /* lead accent: glows, focus, tags, gradient start */
  --color-purple:     #a855f7;  /* gradient middle */
  --color-pink:       #ec4899;  /* gradient end (3-stop ramps only) */
  --color-blue:       #3b82f6;  /* background layers only, never UI */
}
```

- The brand gradient is `linear-gradient(135deg, cyan, purple)` (2-stop) or
  `…cyan, purple, pink` (3-stop, reserved for the hero headline span and the
  feature-card hover hairline). Always 135deg or 90deg.
- Gradient-clipped text (`background-clip: text; -webkit-text-fill-color:
  transparent`) is used for: logo, footer logo, the emphasized span inside
  `h1`, uppercase section tags, and stat values. Never body text.
- Cyan is the functional accent — glow shadows, focus outlines, the hero-tag
  chip (`rgba(6,182,212,.1)` bg + `.3` border + cyan text), hovered stat-card
  border. Pink/blue never appear alone in UI chrome.

## Typography

Single family: **Sora** (Google Fonts), weights 400–800. Geometric,
slightly techy — suits the luminous mood.

| Role | Size | Weight | Tracking / leading |
|---|---|---|---|
| H1 | `clamp(3rem, 7vw, 5rem)` | 800 | `-0.03em`, lh 1.1 |
| Section / CTA title | `clamp(2rem, 4–5vw, 3–3.5rem)` | 800 | `-0.02em` |
| Stat value | 3rem | 800 | gradient-clipped |
| Card title | 1.25rem | 700 | |
| Hero description | 1.25rem | 400 | muted, lh 1.7, max-width 600px |
| Body / card text | 0.9375rem | 400 | muted, lh 1.7 |
| Section tag | 0.75rem | 600 | uppercase, `+0.1em`, gradient-clipped |
| Nav links / small UI | 0.9375rem | 500–600 | |

Pattern: heavyweight (800), tight-tracked display type in pure white, with
**one gradient-clipped span** for the key phrase; everything secondary drops
to 60% white. Contrast comes from weight and opacity, not from extra colors.

## Shape

- Pills (`border-radius: 100px`) for every interactive element: nav container,
  nav links, buttons, tag chips.
- Large soft radii (20–32px) for containers.
- No sharp corners, no straight-edged dividers except the single hairline
  `border-top` on the footer (`rgba(255,255,255,0.08)`).
- Layout: `max-width: 1200px` container, 3-col feature grid, 4-col stat grid
  (→ 2 → 1 responsive), centered hero with generous `min-height: 100vh`.

## Interaction design & motion

### Easing vocabulary

| Token | Curve | Used for |
|---|---|---|
| **Expo-out** | `cubic-bezier(0.16, 1, 0.3, 1)` | entrances, scroll reveals, stat-card hover lift — fast start, long luxurious settle |
| **Back-out (overshoot)** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | icon scale-up, stat-value pop — playful spring past the target |
| `ease` / `ease-out` | browser default | hover color/border/glow shifts (0.3–0.5s) |
| `ease-in-out` | browser default | all infinite ambient loops (aurora, pulse, gradient shift) |

Durations: hovers 0.3–0.5 s · entrances/reveals 0.5–1 s · ambient loops 1.5–30 s.

### Ambient motion (runs forever, no input needed)

| Element | Animation | Duration | Detail |
|---|---|---|---|
| Aurora layer 1 | `aurora-drift` | 25 s | translate ±5%, rotate ±5° |
| Aurora layer 2 | `aurora-drift` reverse | 30 s | counter-motion against layer 1 |
| Aurora layer 3 | `aurora-pulse` | 20 s | opacity .3↔.6, scale 1↔1.2 |
| CTA card `::before` | `aurora-drift` | 20 s | private aurora inside the card |
| H1 gradient span | `textGradientShift` | 4 s | `background-size: 200% auto`, background-position 0%↔100% — the headline's colors visibly slide (compare [lg-01-hero.png](references/lg-01-hero.png) vs [lg-08-btn-primary-hover.png](references/lg-08-btn-primary-hover.png): same headline, cyan-phase vs pink-phase) |
| Hero-tag dot (`::before`) | `pulse-dot` | 2 s | opacity 1↔.5, scale 1↔1.5 — "live" beacon |
| Hovered feature card | `borderGlow` | 1.5 s infinite | border pulses white/.08 ↔ cyan/.3 *while hovered* |

### Load choreography (CSS, fires once on page load)

All entrances use `fadeInUp` (opacity 0 → 1, translateY 50px → 0) with
`animation-fill-mode: both`, except the hero tag which uses the signature
`glowIn` (opacity 0 → 1 **+ `filter: blur(10px)` → 0**) — it materializes out
of light rather than sliding.

```
t=0.10s  nav-inner      fadeInUp 0.6s ease-out
t=0.20s  cta-card       fadeInUp 0.8s ease-out (if in first viewport)
t=0.30s  hero-content   fadeInUp 1.0s expo-out   ← longest, hero is the star
t=0.50s  hero-tag       glowIn   0.8s ease-out   ← blur-in on top of parent's rise
```

(Feature/stat cards also have CSS `nth-child` delays of 0.1–0.35 s as a
no-JS fallback, but the JS below overrides them with observer-driven reveals.)

### Scroll choreography (JS, IntersectionObserver — see [interactions.js](interactions.js))

Each group gets its own observer; elements are pre-hidden inline via JS
(so no-JS users see everything), then revealed when they intersect:

| Group | Trigger | Hidden state | Reveal | Stagger |
|---|---|---|---|---|
| `.reveal` elements | 10% visible, `rootMargin: 0 0 -50px 0` | `translateY(60px)`, opacity 0 | 0.8 s expo-out (class-based, `.revealed`) | via `.stagger-1…4` classes (0.1–0.4 s transition-delay) |
| Feature cards | 20% visible | `translateY(40px)`, opacity 0 | 0.6 s (opacity `ease`, transform expo-out) | `index × 80 ms` setTimeout |
| Stat cards | 20% visible | `translateY(30px)`, opacity 0 | 0.5 s | `index × 100 ms` |
| CTA card | 20% visible | `scale(0.95)`, opacity 0 | 0.8 s | none — single element, scale not slide |

Choices worth copying: travel distance shrinks with element weight (60 → 40 →
30 px); the CTA card *scales* in instead of sliding (it's a container, not a
list item); reveals are one-way (class/style is added, never removed — no
re-triggering on scroll-up). `html { scroll-behavior: smooth }` for anchors.

### Hover / active state tables (all captured live)

**Primary button** (`.btn-primary`, and `.nav-cta` variant) —
[lg-07-buttons-rest.png](references/lg-07-buttons-rest.png) → [lg-08-btn-primary-hover.png](references/lg-08-btn-primary-hover.png), nav: [lg-10-nav-cta-hover.png](references/lg-10-nav-cta-hover.png)

| Property | Rest | Hover | Transition |
|---|---|---|---|
| transform | none | `translateY(-2px)` (nav variant: `scale(1.05)`) | 0.3 s ease |
| box-shadow | `0 0 30px rgba(6,182,212,.3)` | `0 0 50px rgba(6,182,212,.5)` — glow brightens, does not move | 0.3 s ease |
| sheen `::before` | parked at `left: -100%` | sweeps to `left: 100%` — a white/.2 diagonal light band crosses the button once | 0.5 s ease |

**Secondary button** (`.btn-secondary`): bg white/.10 → .15, border white/.2 → .3. No lift, no glow — hierarchy preserved.

**Nav links**: muted text → white text + `rgba(255,255,255,0.1)` pill background, 0.3 s ease. Active page link holds the same style persistently.

**Feature card** — [lg-05-feature-card-rest.png](references/lg-05-feature-card-rest.png) → [lg-06-feature-card-hover.png](references/lg-06-feature-card-hover.png)

| Property | Rest | Hover | Transition |
|---|---|---|---|
| transform | none | `translateY(-8px)` | 0.4 s ease |
| background | white/.03 | white/.05 | 0.4 s ease |
| border | white/.08 | white/.15, then pulses to cyan/.3 (`borderGlow` 1.5 s infinite) | — |
| top hairline `::before` | opacity 0 | opacity 1 — 2px cyan→purple→pink gradient line across the top edge | 0.3 s ease |
| icon tile | scale 1 | `scale(1.15)` + `0 0 30px rgba(6,182,212,.4)` glow | 0.4 s **back-out** |
| `:active` (press) | — | `translateY(-4px) scale(0.98)` — sinks halfway back and compresses | inherits |

**Stat card** — [lg-09-stat-card-hover.png](references/lg-09-stat-card-hover.png)

| Property | Rest | Hover | Transition |
|---|---|---|---|
| transform | none | `translateY(-8px)` | 0.4 s **expo-out** |
| border | white/.08 | solid `var(--color-cyan)` | 0.4 s |
| wash `::after` | opacity 0 | opacity 1 — cyan/.1 gradient rising from the bottom edge | 0.3 s ease |
| stat value | scale 1 | `scale(1.1)` + `text-shadow: 0 0 30px rgba(6,182,212,.6)` — the number itself glows | 0.3 s **back-out** |

**CTA card**: whole card `scale(1.02)` + `0 0 60px rgba(6,182,212,.2)` glow, 0.5 s ease.

The shared grammar: **lift + brighten + glow**. Hover always (1) raises the
element a few px, (2) nudges background/border alpha up one step, and (3) adds
or intensifies a cyan glow. Secondary elements get only step 2. Inner accents
(icons, numbers) pop with the overshoot curve so the response feels springy.

### Accessibility choices

- `:focus-visible` on all links/buttons: `outline: 2px solid var(--color-cyan); outline-offset: 4px` — focus reuses the glow color.
- `@media (prefers-reduced-motion: reduce)`: aurora layers and CTA aurora get `animation: none`; every other animation/transition collapses to 0.01 ms; `.reveal` elements are forced visible (`opacity: 1; transform: none`); the headline gradient shift is disabled. The aesthetic degrades to a *static* aurora — the gradients stay, only the motion goes.
- Muted text is 60% white on #0f0f1a (comfortably ≥ 4.5:1); dark `--color-bg` text on gradient buttons keeps CTA labels readable.

## Do / Don't

**Do**
- Keep the base very dark (`#0f0f1a`-ish indigo). The aurora only reads against near-black.
- Use ≥ 2 drifting layers with *different, non-multiple* durations (one reversed) so the loop never becomes visible.
- Oversize background layers to 200% and offset −50% so motion never reveals an edge.
- Animate background layers with transform/opacity only; keep blur static.
- Reserve gradient-clipped text for one span per headline plus small labels — white 800-weight type does the heavy lifting.
- Express every hover as lift + alpha-step + cyan glow; use the back-out curve for small inner elements.
- Ship the `prefers-reduced-motion` block — this direction is motion-heavy and must degrade to static gradients.

**Don't**
- Don't use offset drop shadows anywhere — depth comes from glow and lift, not from a light source above.
- Don't make cards opaque; anything above ~8% white hides the aurora and kills the effect.
- Don't gradient-fill whole headlines or body text.
- Don't run ambient loops faster than ~2 s (the pulse dot) — aurora motion must stay below conscious attention.
- Don't use pure black `#000` or pure gray surfaces — everything carries a violet-indigo cast.
- Don't add more accent hues; the system is exactly cyan/purple/pink (+ blue confined to the background).

## Minimal starter

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  :root {
    --color-bg: #0f0f1a; --color-text: #fff; --color-text-muted: rgba(255,255,255,.6);
    --color-cyan: #06b6d4; --color-purple: #a855f7; --color-pink: #ec4899; --color-blue: #3b82f6;
  }
  * { margin: 0; box-sizing: border-box; }
  body { font-family: 'Sora', sans-serif; background: var(--color-bg); color: var(--color-text);
         min-height: 100vh; overflow-x: hidden; display: grid; place-items: center; }

  .aurora-bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; }
  .aurora-layer { position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; opacity: .5; }
  .l1 { background: radial-gradient(ellipse 80% 50% at 20% 40%, var(--color-cyan) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 40% at 70% 60%, var(--color-purple) 0%, transparent 50%);
        animation: drift 25s ease-in-out infinite; }
  .l2 { background: radial-gradient(ellipse 70% 60% at 60% 30%, var(--color-pink) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 50% at 30% 70%, var(--color-blue) 0%, transparent 50%);
        animation: drift 30s ease-in-out infinite reverse; }
  @keyframes drift {
    0%,100% { transform: translate(0,0) rotate(0); } 25% { transform: translate(5%,-5%) rotate(5deg); }
    50% { transform: translate(-5%,5%) rotate(-5deg); } 75% { transform: translate(3%,3%) rotate(3deg); }
  }
  .mesh { position: fixed; inset: 0; z-index: -1; filter: blur(60px); background:
    radial-gradient(circle at 25% 25%, rgba(6,182,212,.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(168,85,247,.15) 0%, transparent 50%); }

  .card { max-width: 520px; padding: 3rem; text-align: center; border-radius: 24px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08);
          transition: all .4s ease; }
  .card:hover { transform: translateY(-8px); background: rgba(255,255,255,.05);
                border-color: rgba(255,255,255,.15); }
  h1 { font-size: 3rem; font-weight: 800; letter-spacing: -.03em; line-height: 1.1; }
  h1 span { background: linear-gradient(135deg, var(--color-cyan), var(--color-purple), var(--color-pink));
            background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; animation: shift 4s ease-in-out infinite; }
  @keyframes shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  p { color: var(--color-text-muted); line-height: 1.7; margin: 1rem 0 2rem; }
  .btn { padding: 1rem 2rem; font: 600 1rem 'Sora', sans-serif; color: var(--color-bg);
         border: none; border-radius: 100px; cursor: pointer;
         background: linear-gradient(135deg, var(--color-cyan), var(--color-purple));
         box-shadow: 0 0 30px rgba(6,182,212,.3); transition: all .3s ease; }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(6,182,212,.5); }
  .btn:focus-visible { outline: 2px solid var(--color-cyan); outline-offset: 4px; }
  @media (prefers-reduced-motion: reduce) {
    .aurora-layer, h1 span { animation: none; }
    * { transition-duration: .01ms !important; }
  }
</style>
</head>
<body>
  <div class="aurora-bg"><div class="aurora-layer l1"></div><div class="aurora-layer l2"></div></div>
  <div class="mesh"></div>
  <div class="card">
    <h1>Design with <span>luminous gradients</span></h1>
    <p>Flowing northern-lights color fields behind translucent, glowing surfaces.</p>
    <button class="btn">Explore Now</button>
  </div>
</body>
</html>
```

## References

| File | Shows |
|---|---|
| [lg-01-hero.png](references/lg-01-hero.png) | Full hero viewport: aurora field, pill nav, gradient headline (cyan phase), tag chip, button pair |
| [lg-02-features.png](references/lg-02-features.png) | Feature-card grid — white-alpha surfaces letting the aurora through |
| [lg-03-stats-cta.png](references/lg-03-stats-cta.png) | Stat cards with gradient-clipped values + CTA card |
| [lg-04-cta-footer.png](references/lg-04-cta-footer.png) | CTA card with private aurora + hairline-divided footer |
| [lg-05-feature-card-rest.png](references/lg-05-feature-card-rest.png) | Feature card close-up, rest state |
| [lg-06-feature-card-hover.png](references/lg-06-feature-card-hover.png) | Hovered feature card: lift, gradient top hairline, scaled glowing icon (vs siblings at rest) |
| [lg-07-buttons-rest.png](references/lg-07-buttons-rest.png) | Primary/secondary buttons at rest |
| [lg-08-btn-primary-hover.png](references/lg-08-btn-primary-hover.png) | Primary button hovered (brightened glow); headline caught in pink phase of `textGradientShift` |
| [lg-09-stat-card-hover.png](references/lg-09-stat-card-hover.png) | Hovered stat card: cyan border, bottom wash, popped glowing value |
| [lg-10-nav-cta-hover.png](references/lg-10-nav-cta-hover.png) | Nav pill with Get Started hovered (scale + glow) |
