---
name: premium-look
description: Apply the Premium Look / 3D Hyperrealism aesthetic direction — studio-lit "physical object" UI on a deep navy-violet canvas, metallic gold gradient text with a traveling shine, cards built from a simulated-lighting recipe (gradient fill + bevel highlights + deep soft shadows), true perspective/preserve-3d tilts, and slow weighted luxury motion. Use when building or restyling web UI (landing pages, e-commerce, brand sites for jewelry, watches, fashion, spirits, real estate, finance) that should read as expensive, hushed, and gallery-lit. Triggers - "premium look", "luxury UI", "3D hyperrealism", "metallic text", "gold accent", "high-end brand", "boutique/jewelry aesthetic", "dark luxury landing page".
---

# Premium Look / 3D Hyperrealism

An aesthetic direction documented from the live reference at
https://claudekit.github.io/frontend-design-pro-demo/08-3d-hyperrealism.html (the "LUXE" demo).

**Essence:** UI as physical luxury objects photographed in a dark studio. Every panel is a
*lit object* — a consistent light source from the upper-left produces gradient fills, a
bright bevel on each top edge, and deep soft shadows that make cards float above the
canvas. The canvas is midnight navy-violet (`#1a1a2e`), never black, washed with faint
warm gold light. One accent family: metallic gold, rendered as a *gradient* (dark → light
→ base → light → dark) rather than a flat color, and kept moving — a shine perpetually
travels across headline text, the hero piece levitates, the primary button's halo
breathes. Type pairs a serif display (Playfair Display) with a geometric sans (Outfit).
Motion is slow, weighted, and organic — springs and breathing loops are on-brand; nothing
snaps. Mood words: opulent, hushed, boutique, vitrine, gallery-lit, heirloom, expensive.

## Visual references

View these with the Read tool before designing — they carry more information than the rules below:

- [references/pl-01-hero.png](references/pl-01-hero.png) — the whole system in one frame: gold serif LUXE logo, muted nav, three-line serif headline with the metallic-gold word "Premium", glowing gold primary button + gold-outline secondary, and the hero 3D card: lit gradient surface, gold hairline border, framed studio photo, serif caption, gold pill badge.
- [references/pl-05-metallic-headline.png](references/pl-05-metallic-headline.png) — close-up of the headline treatment: flat white serif lines sandwiching the gradient-clipped metallic gold word with its soft gold drop-shadow.
- [references/pl-02-products.png](references/pl-02-products.png) — section pattern: gold-outline pill tag ("COLLECTION"), serif title with one gold word, three product cards — recessed square image wells, serif product names, gold prices.
- [references/pl-03-materials.png](references/pl-03-materials.png) — the four metal swatches (24K Gold / Sterling Silver / Rose Bronze / Platinum): the 5-stop symmetric metallic gradient formula at full scale, dark labels sitting *on* the metal. Note the section sits on the darker `--color-bg-alt` band.
- [references/pl-04-cta-footer.png](references/pl-04-cta-footer.png) — CTA set piece: gold-washed 24px-radius card, "Experience Luxury" with metallic gold word, glowing gold button; gold hairline footer with metallic LUXE logotype below.
- [references/pl-06-buttons-rest.png](references/pl-06-buttons-rest.png) — button anatomy at rest: primary is a 135° gold gradient slab with dark text and a pulsing halo (caught mid-pulse), secondary is a 2px gold outline with gold text.
- [references/pl-07-btn-gold-hover.png](references/pl-07-btn-gold-hover.png) — primary hover, captured live: button lifted 2px, halo enlarged and steadied (the idle pulse pauses on hover).
- [references/pl-08-card3d-hover.png](references/pl-08-card3d-hover.png) — hero card under hover, captured live: **note it is NOT tilted** — the declared hover tilt is overridden by the idle float animation (see Don't list). Shows the card anatomy: gradient surface, gold top hairline, framed photo, badge.
- [references/pl-09-product-card-hover.png](references/pl-09-product-card-hover.png) — card 1 hovered vs siblings: outer card lifted 12px, inner surface tilted toward the viewer, border warmed to gold, photo zoomed ~5%, price sprung larger. Five concurrent effects reading as "picking the piece up."
- [references/pl-10-material-hover-shine.png](references/pl-10-material-hover-shine.png) — bronze swatch hovered: scaled 1.05 with the white shine band caught mid-sweep (transition slowed for capture; live sweep is 0.5s).
- [references/pl-11-nav-hover.png](references/pl-11-nav-hover.png) — nav hover: "Collections" turned gold with the gold gradient underline grown to full width.
- [references/source.css](references/source.css) — the demo's complete CSS, verbatim. Consult it for anything not covered here.
- [references/interactions.js](references/interactions.js) — the demo's complete inline JS, verbatim: the three IntersectionObserver reveal systems (and see §6.3 for which of them actually fire).

## 1. The canvas

Three background moves, all quiet:

```css
body { background: var(--color-bg); color: #fff; font-family: var(--font-body); }

/* Warm light washes inside the hero only — an absolute layer, not fixed */
.hero { position: relative; min-height: 100vh; perspective: 1000px; }
.hero-bg {
  position: absolute; inset: 0; z-index: -1;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(212, 175, 55, 0.10) 0%, transparent 50%);
}

/* Alternate section band — half a step darker, not a new color */
.materials { background: var(--color-bg-alt); }   /* #16162a vs #1a1a2e */
```

The nav is a fixed frosted bar: `rgba(26, 26, 46, 0.9)` + `backdrop-filter: blur(20px)`
+ 1px bottom hairline `rgba(212, 175, 55, 0.2)`. Sections separate by background shift
and 100px vertical padding — no divider graphics.

## 2. Surfaces & materials — the lighting recipe

This is the core of the direction. Every raised surface is built from the same
five-layer simulation of a studio light at the upper-left:

```css
.card-3d-inner {
  /* 1 — gradient fill: lit face falling away from the light */
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(0, 0, 0, 0.10) 100%);
  /* 2 — gold hairline border */
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  /* 3 — elevation + contact ring + top bevel, in one declaration */
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),          /* deep soft drop — floats above canvas */
    0 0 0 1px rgba(255, 255, 255, 0.05),     /* faint ambient contact ring */
    inset 0 1px 0 rgba(255, 255, 255, 0.1);  /* light catching the top edge */
  position: relative; overflow: hidden;
}
/* 4 — gold light-edge across the top */
.card-3d-inner::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
}
```

**Convex vs concave.** Cards are convex (lit top, drop shadow below); image wells are
carved *into* the surface — dark gradient fill + inset shadow:

```css
.product-image {
  aspect-ratio: 1; border-radius: 12px; overflow: hidden;
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
}
```

**The metallic gradient formula** — five symmetric stops at 135°, dark → light → base →
light → dark. Used for text, buttons, badges, and the material swatches:

```css
/* Text: clip the gradient, add a soft gold shadow, keep it moving (§6.5) */
.metallic-gold {
  background: linear-gradient(135deg,
    var(--color-gold-dark) 0%, var(--color-gold-light) 25%,
    var(--color-gold) 50%, var(--color-gold-light) 75%, var(--color-gold-dark) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
}
/* Swatch recipes — same shape, different metals */
.material-gold     { background: linear-gradient(135deg, #b8860b, #ffd700 25%, #daa520 50%, #ffd700 75%, #b8860b); }
.material-silver   { background: linear-gradient(135deg, #696969, #e0e0e0 25%, #c0c0c0 50%, #e0e0e0 75%, #696969); }
.material-bronze   { background: linear-gradient(135deg, #8b4513, #cd853f 25%, #b87333 50%, #cd853f 75%, #8b4513); }
.material-platinum { background: linear-gradient(135deg, #8e8e8e, #f5f5f5 25%, #e5e4e2 50%, #f5f5f5 75%, #8e8e8e); }
```

**The gold button** is a solid metal slab: 3-stop gold gradient, dark (`--color-bg`) text,
bevel via inset shadows, warm halo:

```css
.btn-gold {
  color: var(--color-bg);
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold-light), var(--color-gold));
  box-shadow:
    0 4px 15px rgba(212, 175, 55, 0.3),        /* warm halo */
    inset 0 1px 0 rgba(255, 255, 255, 0.3),    /* top bevel */
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);         /* bottom bevel */
}
```

**Photography:** real studio product photos with light, softly-lit backgrounds
(white/cream/blush), `object-fit: cover`, inside rounded wells — the bright photo against
the dark UI is what sells "lit object in a dark showroom." No duotone or filter
treatment; the photos supply the realism.

## 3. Color tokens

```css
:root {
  --color-bg:         #1a1a2e;                    /* midnight navy-violet — never black */
  --color-bg-alt:     #16162a;                    /* alternate section band */
  --color-text:       #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.6);   /* body copy, nav links */
  --color-gold:       #d4af37;                    /* the accent — classic metallic gold */
  --color-gold-light: #f4d160;                    /* gradient highlight stop */
  --color-gold-dark:  #a08628;                    /* gradient shadow stop */
  --color-silver:     #c0c0c0;                    /* secondary metal — headlines only */
}
```

Usage rules:
- **One accent family.** Gold is the only voice: flat `--color-gold` for small text
  (prices, tags, hovered links, focus rings) and hairline borders (at 0.2–0.3 alpha);
  the 3–5-stop *gradient* for anything larger (buttons, badges, headline words,
  underlines). Never flat-fill a large area with gold.
- **Gold light is atmosphere.** Gold at 0.05–0.15 alpha appears as radial washes
  (hero), surface tints (CTA card `rgba(212,175,55,0.1)` → `0.05`), and warm halos
  (`0 0 50px rgba(212,175,55,0.15)` on hovered cards) — the room is lit by the metal.
- **Silver is the supporting metal**: used once, as the `.metallic-silver` clipped
  gradient on a secondary section title ("Premium Finishes"). Bronze/platinum exist only
  as swatch content, never as UI chrome.
- **Shadows are black and soft** (`rgba(0,0,0,0.3–0.5)`, large blur, strong y-offset) —
  realistic elevation, unlike neon directions where colored glow replaces shadow. Gold
  halos *accompany* black shadows on hover, never replace them.
- Text on metal is dark: `rgba(0,0,0,0.7)` labels on swatches, `var(--color-bg)` on gold
  buttons/badges. Light-on-light is never allowed.

## 4. Typography

Two Google fonts, strictly cast:

- **Playfair Display** (serif, 400–800) — display only: logo, all headings, card/product
  titles, footer logotype. High-contrast strokes read as engraved luxury.
- **Outfit** (geometric sans, 300–700) — everything else: body, nav, buttons, tags,
  prices, labels. Clean and modern, never competing with the serif.

| Role | Spec |
|---|---|
| Hero h1 | Playfair `clamp(3rem, 6vw, 4.5rem)`, 700, line-height 1.15, sentence case |
| Section title | Playfair `clamp(2rem, 4vw, 3rem)`, 700 |
| CTA title | Playfair `clamp(2rem, 5vw, 3.5rem)`, 700 |
| Logo | Playfair 1.75rem, 700, metallic-gold clipped gradient |
| Card title | Playfair 1.5rem (hero card) / 1.25rem (product), 600 |
| Body / description | Outfit 1.125rem, white/60, line-height 1.8 |
| Price | Outfit 1.125rem, 600, flat gold |
| Nav link | Outfit 0.9375rem, 500, white/60 |
| Button | Outfit 0.9375rem, 600 |
| Section tag | Outfit 0.75rem, 600, UPPERCASE, +0.15em, gold, in 1px gold pill |
| Badge | Outfit 0.75rem, 600, UPPERCASE, +0.1em, dark text on gold gradient pill |
| Material label | Outfit 0.875rem, 600, UPPERCASE, +0.1em, black/70 |

**The signature move: one metallic word per headline.** Every display heading is flat
white except a single `<span class="metallic-gold">` word — "Experience **Premium**
Design", "Featured **Pieces**", "Experience **Luxury**" (secondary sections may use
`.metallic-silver` instead: "Premium **Finishes**"). Body text is sentence case and
quiet; uppercase + tracking is reserved for small ornaments (tags, badges, labels).

## 5. Shape language

- **Radius scales with size**: 4px buttons → 12px image wells → 16px cards → 24px CTA
  panel → 100px pills (tags, badges). Nothing is square; nothing is fully round except
  pills.
- **1px gold-tinted hairlines** for card borders (gold at 0.2–0.3 alpha, or white/10 on
  neutral product cards), plus the gold light-edge `::before` gradient line on hero-level
  surfaces.
- **True 3D scene graph**: `perspective: 1000px` on containers (`.hero`, `.hero-visual`,
  `.product-card`), `transform-style: preserve-3d` on the moving surface — tilts are real
  perspective rotations, not skew fakery.
- Layout: 1200px container, 2rem gutters; hero is a 2-col 4rem-gap grid (text left,
  object right); products 3-col / 2rem gap; materials 4-col / 1.5rem gap; sections pad
  100px vertical (2-col / 1-col collapse at 1024px / 768px; nav links hide at 768px).

## 6. Interaction design & motion

### 6.1 Motion vocabulary

The personality: **luxury physics — slow, weighted, organic.** Springs and breathing
loops are on-brand (the opposite of mechanical/neon directions). Nothing snaps; hovers
run 0.3–0.5s, entrances 0.5–1s, ambient loops 2–6s.

| Curve | Feel | Used for |
|---|---|---|
| `ease` 0.3–0.4s | quiet | color/background hovers, outline-button fill, image zoom (0.5s) |
| `cubic-bezier(0.16, 1, 0.3, 1)` ("expo-out") | long glide to rest | hero entrances (1s), product-card lift (0.5s), material transform (0.4s), footer reveals (0.8s) |
| `cubic-bezier(0.23, 1, 0.32, 1)` ("quint-out") | heavy object settling | 3D tilts: hero card (0.6s), product inner surface (0.5s) |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out, overshoots) | springy pop | price scale-up, nav underline growth (0.3s) |
| `ease-in-out` 2–6s | breathing | float3D levitation, goldGlow halo pulse |
| `linear` 3s | constant sheen | metallic text shine |

Transforms are physical: `translateY` lifts, `rotateX/rotateY` tilts toward the viewer,
`scale(0.98–1.1)`, `translateZ` levitation. The one entrance keyframe used everywhere:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(60px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 6.2 Page-load choreography

All delays are load-relative (`both` fill), a single rising wave from hero downward:

| t (s) | Element | Animation |
|---|---|---|
| 0.3 | hero copy block | `fadeInUp` 1s expo-out (60px rise) |
| 0.5 | hero visual (3D card) | `fadeInUp` 1s expo-out — object arrives after the pitch |
| 0.0 | section tags | `fadeInUp` 0.6s ease-out |
| 0.1 / 0.2 / 0.3 | 3 product cards | `fadeInUp` 0.6s ease-out, 0.1s cascade |
| 0.1 / 0.15 / 0.2 / 0.25 | 4 material swatches | `fadeInUp` 0.5s ease-out, 0.05s cascade |
| 0.2 | CTA card | `fadeInUp` 0.8s ease-out |

The ambient loops (§6.5) start immediately and never stop. Note the hero pair rhythm —
copy at 0.3s, object at 0.5s, both on the same slow expo-out — reads as curtains parting.

### 6.3 Scroll choreography (JS — see [references/interactions.js](references/interactions.js)) — and a real gotcha

The demo ships three IntersectionObserver systems, all reveal-once:

1. **Generic `.reveal`** (rise from 60px, 0.8s expo-out; `.stagger-1…4` add 0.1–0.4s
   `transition-delay`) — in the demo HTML only the two footer elements are tagged, so the
   footer is the only true scroll reveal. `.reveal-3d` (rise 40px + `rotateX(10deg)`
   untilt) is defined in CSS but unused.
2. **Product cards** — JS seeds inline `opacity: 0; translateY(50px) rotateX(10deg)`,
   intends to reveal `index × 120ms` apart (0.7s, expo-out) on intersect.
3. **Material swatches** — JS seeds `scale(0.9)`, intends `index × 100ms` reveals (0.5s).

**Verified live: systems 2 and 3 never visibly fire.** The same cards carry the CSS
load-stagger animations (§6.2) with `animation-fill-mode: both`, and CSS animation fill
overrides inline styles — computed opacity is 1 while the JS-seeded inline style still
says 0. When reproducing, **pick one system per element**: CSS load-stagger for
above-the-fold, JS observer reveal (with the 100–120ms index stagger and the
`rotateX(10deg)` → 0 untilt — a lid opening toward you) for below-the-fold. The intended
observer settings: `threshold: 0.1–0.2, rootMargin: '0px 0px -50px 0px'`.

### 6.4 Element states — hover / active / focus

| Element | Hover | Press / focus |
|---|---|---|
| nav link | white/60 → flat gold (0.3s ease); 2px `gold-dark → gold-light` gradient underline grows `width 0 → 100%` from the left on the back-out spring | focus-visible (global): `outline: 2px solid var(--color-gold); outline-offset: 4px` |
| gold button | lifts `translateY(-2px)`; halo doubles `0 4px 15px/0.3 → 0 8px 25px/0.4` (insets kept); **the idle glow pulse pauses** (`animation: none`) so the hover state is steady | — |
| outline button | fills with `rgba(212, 175, 55, 0.1)` wash — a breath of gold, no lift | — |
| hero 3D card | *declared* `rotateY(-5deg) rotateX(5deg)` on quint-out 0.6s — **overridden by the float3D loop, never renders** (see Don't) | — |
| product card | five concurrent effects, one gesture — "picking the piece up": outer card lifts `translateY(-12px)` + shadow deepens to `0 30px 60px`; inner surface tilts `rotateX(5deg) translateY(-10px)` toward the viewer (quint-out 0.5s); border warms white/10 → gold/30; gold aura joins the shadow (`0 0 50px rgba(212,175,55,0.15)`); photo zooms `scale(1.05)` (0.5s ease); price springs `scale(1.1)` on the back-out curve | `:active` presses down: `translateY(-6px) scale(0.98)` |
| material swatch | inflates `scale(1.05)` + `0 20px 40px` shadow; white shine band sweeps across (§6.4a) | `:active` `scale(0.98)` |

Patterns to reproduce: (1) **hover = physical response** — everything lifts, tilts,
inflates, or catches light; color barely changes; (2) **compound hovers on different
durations/curves** (lift 0.5s expo-out, zoom 0.5s ease, price 0.3s spring) so the event
feels layered, not mechanical; (3) **press states exist** — interactive cards compress
on `:active`, completing the physical fiction.

#### 6.4a Material shine sweep

Each swatch carries a full-height `::after` band, 50% wide, `transparent → white/40 →
transparent`, parked at `left: -100%`; hover sends it to `left: 150%` over 0.5s ease —
a light source passing across polished metal. Requires `overflow: hidden` on the swatch.

```css
.material-card::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}
.material-card:hover::after { left: 150%; }
```

### 6.5 Ambient (idle) loops — the showroom is alive

| Loop | Spec | Reads as |
|---|---|---|
| metallic shine | `.metallic-gold { background-size: 200% auto; animation: shine 3s linear infinite; }` — `background-position -200% → 200%` | light traveling across engraved metal lettering |
| float3D | `.card-3d { animation: float3D 6s ease-in-out infinite; }` — `translateZ(0 → 20px) rotateX(0 → 2deg)` at 50% | the signature piece levitating in a vitrine |
| goldGlow | `.btn-gold { animation: goldGlow 2s ease-in-out infinite; }` — halo `15px/0.3 → 30px/0.5 + 50px/0.2` at 50% | a warm pulse drawing the eye to the primary CTA |

All three start at load and run forever; all are slow (2–6s) and eased — breathing,
organic time. Ration: one levitating object, one pulsing button, shine only on
display-size metallic text.

### 6.6 Accessibility contract

Non-negotiable when reproducing: the `prefers-reduced-motion: reduce` block zeroes every
animation/transition duration and delay (stopping float, pulse, and reveals), removes the
metallic shine animation entirely, and force-shows `.reveal` content (`opacity: 1;
transform: none`). Keyboard focus is never suppressed: global `:focus-visible` gets the
2px gold outline at 4px offset. `html { scroll-behavior: smooth; }` for anchor travel.

## 7. Do / Don't

**Do**
- Build every raised surface from the five-layer lighting recipe (145° gradient fill,
  gold hairline, deep drop + contact ring + inset top bevel, gold light-edge) — one
  consistent light source, upper-left.
- Use the 5-stop symmetric metallic gradient for anything gold bigger than body text;
  clip it into display type with one gold word per headline.
- Keep motion heavy and slow: 0.3–0.5s hovers, expo/quint-out settles, spring pops on
  small accents, 2–6s breathing loops. Organic overshoot is on-brand here.
- Make hover physical: lift + tilt toward the viewer + deepen shadow + warm the border,
  with a compression `:active`. Put `perspective` on the parent and `preserve-3d` on the
  moving surface.
- Scale border-radius with element size (4 → 12 → 16 → 24 → pill).
- Contrast convex (cards: lit top, shadow below) against concave (image wells: dark
  fill, inset shadow).
- Use real studio photography on light backdrops inside the wells; keep labels on metal
  dark (`rgba(0,0,0,0.7)` or `var(--color-bg)`).

**Don't**
- Don't put an infinite `transform` animation and a `:hover` transform on the same
  element. The demo's hero card declares a hover tilt, but its `float3D` loop animates
  `transform` continuously and **CSS animations beat hover styles** — the tilt never
  renders (verified live: computed transform under hover is the float matrix; see
  [references/pl-08-card3d-hover.png](references/pl-08-card3d-hover.png), and Playwright
  even fails hover stability checks because the card never stops moving). Either pause
  the loop on hover (`animation: none` — the gold button does exactly this) or float a
  wrapper and tilt the inner element.
- Don't run CSS load animations with `fill-mode: both` *and* JS inline-style scroll
  reveals on the same cards — the animation fill silently wins and the scroll system
  becomes dead code (§6.3). One reveal system per element.
- Don't use pure black or neutral gray canvases; the navy-violet cast (`#1a1a2e`) is the
  luxury base. And don't flat-fill large areas with gold — gradient or alpha-wash only.
- Don't mix accent metals in one composition: gold leads, silver takes one secondary
  headline at most; bronze/platinum are content, not chrome.
- Don't make hovers snappy (0.15s) or use hard `linear`/`steps()` on interactions —
  mechanical timing breaks the weighted-object fiction (linear belongs only to the
  ambient shine).
- Don't tilt with `rotateX/Y` on an element whose parent lacks `perspective` — without
  it the rotation reads as a flat squash.
- Don't shine-sweep without `overflow: hidden`, and don't put shine bands on more than
  one element type (swatches); everywhere else light moves via the text shine.

## 8. Minimal starter

```html
<body>                                            <!-- #1a1a2e; Outfit body, Playfair display -->
  <nav>…</nav>                                    <!-- fixed, blur(20px), gold/20 bottom hairline -->
  <section class="hero">                          <!-- perspective: 1000px -->
    <div class="hero-bg" aria-hidden="true"></div><!-- two gold radial washes -->
    <div class="hero-grid">
      <div class="hero-content">                  <!-- fadeInUp 1s @0.3s -->
        <h1>Experience <span class="metallic-gold">Premium</span> Design</h1>
        <p class="hero-description">…</p>
        <div class="hero-buttons">
          <button class="btn btn-gold">Explore Collection</button>     <!-- goldGlow pulse -->
          <button class="btn btn-outline">Watch Showcase</button>
        </div>
      </div>
      <div class="hero-visual">                   <!-- perspective: 1000px; fadeInUp 1s @0.5s -->
        <div class="card-3d">                     <!-- float3D 6s loop (see Don't re: hover tilt) -->
          <div class="card-3d-inner">             <!-- the 5-layer lighting recipe -->
            <div class="card-image"><img …></div> <!-- studio photo, 4/3, 12px radius -->
            <div class="card-meta">
              <h3 class="card-title">Signature Piece</h3>
              <span class="card-badge">Limited</span>  <!-- gold gradient pill -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="products">
    <div class="section-header">
      <span class="section-tag">Collection</span>  <!-- gold outline pill -->
      <h2 class="section-title">Featured <span class="metallic-gold">Pieces</span></h2>
    </div>
    <div class="products-grid">                    <!-- 3 × .product-card (perspective) > .product-card-inner -->
      …
    </div>
  </section>
  <section class="materials">                     <!-- bg-alt band; 4 metallic swatches + shine sweep -->
    …
  </section>
  <section class="cta">
    <div class="cta-card">…</div>                  <!-- gold-washed 24px panel -->
  </section>
  <footer>…</footer>                               <!-- .reveal scroll entrance, metallic logotype -->
</body>
```

Copy exact values from [references/source.css](references/source.css). Fonts:
`Playfair Display` (400–800) + `Outfit` (300–700) via Google Fonts.
