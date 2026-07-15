---
name: glassmorphism
description: Apply the Glassmorphism aesthetic direction — frosted translucent panels floating over a vivid indigo-to-violet gradient with blurred neon orbs. Use when building or restyling web UI (landing pages, cards, navs, pricing tables, dashboards) that should read as layered frosted glass with luminous pink/blue accents. Triggers - "glassmorphism", "frosted glass", "glass cards", "translucent UI", "aurora/gradient background".
---

# Glassmorphism

An aesthetic direction documented from the live reference at
https://claudekit.github.io/frontend-design-pro-demo/03-glassmorphism.html (the "Aura" demo).

**Essence:** the entire page is one deep, luminous gradient scene; every UI surface is a
sheet of frosted glass floating above it. Depth comes from translucency + blur + light
borders — never from opaque fills. Accents are saturated pink and sky blue used as
gradients, glows, and clipped text. Mood words: dreamy, premium, airy, futuristic, soft.

## Visual references

View these with the Read tool before designing — they carry more information than the rules below:

- [references/hero.png](references/hero.png) — hero: gradient headline word, pill nav, primary pink CTA + glass CTA, floating profile card. Note how the glass card picks up pink on its right edge and blue on its left, because the *background* shines through it.
- [references/card-detail.png](references/card-detail.png) — anatomy of one glass card: nested `glass-subtle` stat tiles inside a `glass` card (two translucency tiers), gradient-fill button, muted uppercase micro-labels.
- [references/features.png](references/features.png) — 3-column grid of identical glass cards; gradient icon squircles are the only saturated fills inside cards.
- [references/pricing.png](references/pricing.png) — "featured" treatment: brighter glass fill + accent border + floating pill badge; secondary cards keep glass buttons while the featured one gets the pink gradient button.
- [references/hover-feature-card.png](references/hover-feature-card.png) — the signature compound hover, captured live: compare card 1 ("Frosted Glass") to its siblings — the card is lifted 8px with a brighter border while its icon has sprung to 1.15× with a −5° tilt and a pink glow.
- [references/hover-cta.png](references/hover-cta.png) — "Start Building" CTA under hover: the fill is lightened by the fully-expanded ripple overlay and the pink glow has intensified (compare against hero.png; the headline shimmer is also caught at a different gradient position between the two shots).
- [references/source.css](references/source.css) — the demo's complete CSS, verbatim. Consult it for anything not covered here.
- [references/interactions.js](references/interactions.js) — the demo's complete inline JS, verbatim: the three IntersectionObserver reveal systems.

## 1. The background stack (mandatory — glass is invisible without it)

Glass surfaces only read if something colorful sits behind them. The direction uses two fixed layers:

```css
body {
  background: linear-gradient(135deg,
    #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #7c3aed 75%, #6366f1 100%);
  background-attachment: fixed;  /* scene stays still while content scrolls */
  color: #ffffff;
}
```

Plus 3 giant blurred "orbs" in a `position: fixed; z-index: -1; pointer-events: none` container:

| Orb | Size | Gradient (135deg) | Position |
|---|---|---|---|
| 1 (pink) | 600px | `#ec4899 → #f472b6` | top: -200px; right: -200px |
| 2 (blue) | 500px | `#3b82f6 → #60a5fa` | bottom: -150px; left: -150px |
| 3 (violet) | 400px | `#8b5cf6 → #a78bfa` | dead center |

Each orb: `border-radius: 50%; filter: blur(80px); opacity: 0.6;` and a slow drift
animation (`float 20s ease-in-out infinite`, staggered delays 0 / -5s / -10s, moving
±30–50px and scaling 0.95–1.1). Orbs bleed off-canvas (negative offsets) so color enters
from the corners. Limit to ~3 — `blur(80px)` is expensive.

## 2. The glass material

Two translucency tiers plus a "featured" state. All white-on-white alpha — no gray, no color tint in the glass itself.

```css
/* Tier 1 — primary surfaces (cards, nav, footer) */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);   /* always pair — Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Tier 2 — elements nested INSIDE a glass surface (stat tiles, sub-panels) */
.glass-subtle {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

The material formula: **fill alpha ≈ 2× border-alpha⁻¹** … concretely: border alpha is
always 2× the fill alpha (0.1/0.2, 0.05/0.1, 0.15/accent). The border is the "light edge"
that makes the pane read as glass.

States:
- **Hover:** border brightens to `rgba(255,255,255,0.3)`, shadow deepens to `0 16px 48px`.
- **Featured/selected:** fill rises to `rgba(255,255,255,0.15)` + border becomes the accent color + a gradient pill badge overlaps the top edge (`top: -12px`). Emphasis = *brighter glass*, never a different hue.

## 3. Color tokens

```css
:root {
  --color-text:       #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.7);
  --color-accent:     #f472b6;   /* pink 400 — primary accent */
  --color-accent-alt: #60a5fa;   /* blue 400 — secondary accent */
  --glass-bg:         rgba(255, 255, 255, 0.1);
  --glass-border:     rgba(255, 255, 255, 0.2);
  --glass-shadow:     rgba(0, 0, 0, 0.2);
}
```

Usage rules:
- Text is only ever white or white/70. Never dark text on glass.
- Accents appear as **gradients, not flats**: pink CTA = `linear-gradient(135deg, #f472b6, #ec4899)`; blue CTA = `linear-gradient(135deg, #60a5fa, #3b82f6)`; icon tiles & clipped text = `linear-gradient(135deg, var(--color-accent), var(--color-accent-alt))` (pink→blue).
- Colored elements cast **colored glows**, not black shadows: `box-shadow: 0 10px 30px rgba(244, 114, 182, 0.3)` (pink) / `rgba(96, 165, 250, 0.4)` (blue). Only glass panes use the black shadow.
- Tag/badge pattern: accent text on 20%-alpha accent fill (`color: #f472b6; background: rgba(244,114,182,0.2)`), pill radius.

## 4. Typography

Font: **Plus Jakarta Sans** (Google Fonts), weights 400/500/600/700/800. Geometric,
friendly, slightly rounded — suits the soft look.

| Role | Spec |
|---|---|
| Hero h1 | `clamp(2.5rem, 5vw, 4rem)`, weight 800, line-height 1.1, letter-spacing −0.03em |
| Hero keyword | one `<span>` gets pink→blue gradient via `background-clip: text` + a slow shimmer (`background-size: 200% auto`, 3s linear loop) |
| Section title | `clamp(2rem, 4vw, 3rem)`, 800, −0.02em |
| Section tag | 0.75rem, 600, UPPERCASE, +0.1em tracking, accent pill (see §3) |
| Body / description | 1–1.125rem, white/70, line-height 1.6–1.7 |
| Stat value | 1.5rem, 700, white |
| Micro label | 0.75rem, UPPERCASE, +0.05em, white/70 |
| Buttons | 0.9375–1rem, 600 |

Pattern: heavyweight (800) tight-tracked display type against feather-light translucent
surfaces — the contrast is the point.

## 5. Shape language

Everything is rounded; the radius steps down as elements nest:

- **24px** — top-level glass cards, nav pill, footer
- **16px** — buttons (large), icon squircles, avatars, nested sub-panels
- **12px** — small buttons, nav links, full-width card buttons
- **100px (pill)** — tags, badges

Generous breathing room: cards pad 2–2.5rem, sections pad 100px vertical, content
container max-width 1200px with 2rem gutters. Grids: 3-column, 1.5rem gap (hero is a
2-column 4rem-gap grid).

Icon treatment: emoji/glyph centered in a 60px gradient squircle (pink→blue, radius 16px) —
the only saturated fill allowed inside a card body.

## 6. Interaction design & motion

### 6.1 Motion vocabulary

Three easings define the personality — never use raw defaults for signature moments:

| Curve | Feel | Used for |
|---|---|---|
| `cubic-bezier(0.16, 1, 0.3, 1)` | long glide to rest ("expo-out") | entrances, scroll reveals |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | springy overshoot | icon pop, price-value pop |
| `all 0.3s ease` | quiet, uniform | every hover state (lift, glow, color) |

Duration bands: **0.3s** hovers · **0.4s** springs and ripple · **0.5–0.9s** entrances/reveals · **3–20s** ambient loops. Transforms are limited to `translateY`, `scale`, small `rotate` — nothing moves horizontally except ambient orbs.

### 6.2 Page-load choreography

A fixed entrance timeline, top-down in reading order; every animation uses `both` fill so elements hold their hidden state until their delay:

| t (s) | Element | Animation |
|---|---|---|
| 0.1 | nav pill | `fadeInUp` 0.6s |
| 0.3 | hero copy block | `fadeInUp` 0.9s |
| 0.5 | hero glass card | `fadeInScale` 0.8s (glass "materializes" via scale, copy via rise) |
| 0.6 / 0.7 / 0.8 | the 3 stat tiles inside the card | `fadeInUp` 0.5s each |

`fadeInUp` = opacity 0→1 + `translateY(50px → 0)`. `fadeInScale` = opacity 0→1 + `scale(0.9 → 1)`. Delta between siblings is always ~0.1s — long enough to read as a cascade, short enough to feel like one event.

### 6.3 Scroll choreography (JS — see [references/interactions.js](references/interactions.js))

Three IntersectionObserver systems, all **reveal-once** (classes/styles are added, never removed — scrolling back up never re-animates):

1. **Generic blocks** (section headers, footer): `.reveal` / `.reveal-scale` elements start at `opacity: 0` + `translateY(60px)` / `scale(0.9)`; an observer with `threshold: 0.1, rootMargin: '0px 0px -50px 0px'` (fires 50px before the element would enter) adds `.revealed`, transitioning 0.8s on the expo-out curve. `.stagger-1…4` utility classes add 0.1–0.4s `transition-delay`.
2. **Feature cards:** JS seeds inline `opacity: 0; translateY(40px)`, then at `threshold: 0.2` reveals each card `index × 100ms` apart over 0.6s.
3. **Price cards:** identical pattern but `index × 120ms` over 0.7s — larger surfaces move a touch slower.

### 6.4 Element states — hover / active / focus

| Element | Hover | Press / focus |
|---|---|---|
| any `.glass` pane | border white/20 → white/30; shadow `0 8px 32px` → `0 16px 48px` | — |
| nav link | text white/70 → white + fill white/10 (identical to its `.active` current-page state) | focus-visible (all elements): `outline: 2px solid #f472b6; outline-offset: 4px` |
| primary pink CTA / nav CTA | lift `translateY(-2px)`; glow `0 10px 30px pink/.3` → `0 15px 40px pink/.4` **+ halo `0 0 40px pink/.2`**; ripple (§6.5) | — |
| secondary glass button | fill white/10 → white/20 only — no lift; secondary actions stay planted | — |
| blue button (in-card CTA) | lift −2px + blue glow `0 10px 30px rgba(96,165,250,.4)` | — |
| feature card | lift `translateY(-8px)` (0.3s ease) **while its icon springs `scale(1.15) rotate(-5deg)` (0.4s spring) + pink glow `0 0 30px pink/.4`** | `:active` presses to `translateY(-4px) scale(0.98)` |
| price card | lift −8px **while the price value springs `scale(1.1)`** | `:active` same press |
| hero preview card | gains ambient halo `0 0 60px rgba(244,114,182,0.15)` | — |

The signature is the **compound hover** (see [references/hover-feature-card.png](references/hover-feature-card.png)): the container lifts on the quiet 0.3s ease while exactly one child inside overshoots on the 0.4s spring and a colored glow blooms — three concurrent motions on different curves. Reproduce that pairing (calm parent + playful child + light) rather than any single effect. Interaction hierarchy mirrors visual hierarchy: primary actions lift *and* glow, secondary glass buttons only brighten, whole cards lift furthest (−8px vs −2px).

### 6.5 Button ripple

Every `.btn` carries a centered `::after` circle (white/20, radius 50%) at 0×0 that grows to 300×300px over 0.4s on hover — light flooding the glass from within. It's what lightens the CTA fill in [references/hover-cta.png](references/hover-cta.png).

### 6.6 Ambient (idle) motion

The page is never fully still, but idle motion is slow enough to be subliminal:
- **Orbs** drift ±30–50px and breathe `scale(0.95–1.1)` on `float 20s ease-in-out infinite`, delays 0 / −5s / −10s so they never sync.
- **Hero gradient keyword**: `background-size: 200% auto` + `shimmer 3s linear infinite` sweeps the pink→blue gradient through the clipped text.
- **`glowPulse`** keyframe (breathing pink halo on the glass shadow) is defined as an optional accent for hero-level surfaces.

### 6.7 Accessibility contract

Non-negotiable when reproducing this direction: a `prefers-reduced-motion: reduce` block zeroes every animation/transition duration and delay, disables the shimmer, and force-shows all `.reveal` content (`opacity: 1; transform: none`). Keyboard focus is never suppressed — `:focus-visible` gets the accent outline listed above.

## 7. Do / Don't

**Do**
- Put the gradient + orbs behind *everything* first; build glass on top.
- Always write `backdrop-filter` together with `-webkit-backdrop-filter`.
- Nest tier-2 glass (`.glass-subtle`) inside tier-1 for hierarchy instead of dividers or fills.
- Keep exactly two accent hues (pink + blue) and express them as 135° gradients + glows.
- Overlap elements across boundaries (badge over card edge, orbs off-canvas) — layering sells the depth.
- Choreograph motion: staggered entrances (~0.1s apart), reveal-once scroll triggers, and compound hovers (calm lift + one springy child + glow). A lone `:hover { transform: scale(1.05) }` is off-direction.

**Don't**
- Don't use opaque or gray fills for surfaces — if a panel is opaque, it's off-direction.
- Don't put dark text on glass; contrast comes from white text + weight, not color flips.
- Don't tint the glass itself with color — color lives *behind* it (orbs) or *on* it (accent CTAs).
- Don't stack many large blurred layers (GPU cost); ~3 orbs + blur(10–20px) panes is the budget.
- Don't rely on `background-attachment: fixed` alone — it's broken on iOS Safari, and anything below the first viewport loses the backdrop in full-page screenshots/exports. A `position: fixed; inset: 0; z-index: -1` background layer div (as the demo's orb container does) is the robust pattern.

## 8. Minimal starter

```html
<body>                                    <!-- gradient canvas (§1) -->
  <div class="bg-orbs" aria-hidden="true">
    <div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div>
  </div>
  <nav><div class="glass nav-glass">…</div></nav>   <!-- floating pill nav -->
  <section class="hero">
    <div class="glass preview-card">                 <!-- tier-1 pane -->
      <div class="glass-subtle stat">…</div>          <!-- tier-2 nested -->
      <button class="btn btn-primary">…</button>      <!-- pink gradient + glow -->
      <button class="btn btn-glass">…</button>        <!-- glass secondary -->
    </div>
  </section>
</body>
```

Copy exact values from [references/source.css](references/source.css).
