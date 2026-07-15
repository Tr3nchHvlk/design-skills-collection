---
name: retro-futurism
description: Apply the Retro-Futurism / Cyberpunk aesthetic direction — full-saturation cyan and magenta neon glowing on a near-black CRT grid, angular cut-corner panels, monospace terminal typography, glitch and scanline effects. Use when building or restyling web UI (landing pages, dashboards, dev tools, gaming/crypto products) that should read as a neon-lit hacker interface. Triggers - "cyberpunk", "retro-futurism", "synthwave", "neon UI", "terminal aesthetic", "CRT/scanlines", "glitch effect", "80s arcade".
---

# Retro-Futurism / Cyberpunk

An aesthetic direction documented from the live reference at
https://claudekit.github.io/frontend-design-pro-demo/07-retro-futurism-cyberpunk.html (the "NEON//SYS" demo).

**Essence:** a machine interface from an imagined 1980s future. Everything sits on a
near-black CRT screen — a faint cyan blueprint grid with a magenta horizon glow — under a
scanline overlay. Light is the only material: full-saturation cyan and magenta neon that
*glows* (triple-layer shadows), never pastel, never soft. Corners are cut at 45°, never
rounded. The page talks like a computer: monospace type, uppercase tracking, `>` prompts,
trailing underscores, a boot-sequence terminal. Motion is electrical and mechanical —
flicker, glitch, blink, sweep — not organic. Mood words: nocturnal, electric, hacker,
synthwave, dystopian, arcade.

## Visual references

View these with the Read tool before designing — they carry more information than the rules below:

- [references/rf-01-hero.png](references/rf-01-hero.png) — the whole system in one frame: glowing logo, tracked-out mono nav, flickering magenta `SYSTEM ONLINE // V2.077` badge, three-line stacked headline (white / cyan glow / magenta glow), cut-corner buttons, and the HUD image frame with neon-duotone photo and glowing stat readouts.
- [references/rf-10-glitch-headline.png](references/rf-10-glitch-headline.png) — close-up of the headline: "THE" is mid-glitch — RGB-split slices offset ±2px in magenta/cyan. Also shows the three-tier line treatment: flat white vs cyan neon vs magenta neon.
- [references/rf-02-features.png](references/rf-02-features.png) — section pattern: two-tone title ("SYSTEM" white + "FEATURES" cyan glow), 6 near-transparent cards with 1px cyan/20 hairline borders, huge magenta-glow Orbitron numerals, muted mono body text. Note the magenta horizon glow entering at the bottom of the grid canvas.
- [references/rf-03-terminal-footer.png](references/rf-03-terminal-footer.png) — the terminal set piece: cyan-bordered window, traffic-light dots, magenta `$` prompt / cyan command / gray `[OK]` output lines, blinking block cursor; centered neon logo footer below.
- [references/rf-04-buttons-rest.png](references/rf-04-buttons-rest.png) — button anatomy at rest: primary is solid cyan with dark text, secondary is 2px cyan outline; both have 10px corner cuts (top-left, bottom-right) and trailing-underscore labels.
- [references/rf-05-btn-primary-hover.png](references/rf-05-btn-primary-hover.png) — the signature hover, captured live: the primary button has fully *channel-swapped* cyan → magenta. Not a lightening — a hue flip.
- [references/rf-06-btn-secondary-hover.png](references/rf-06-btn-secondary-hover.png) — secondary hover: outline floods solid cyan, text inverts to background black.
- [references/rf-07-nav-link-hover.png](references/rf-07-nav-link-hover.png) — nav hover: INTERFACE has turned cyan with glow, shifted 5px right, and a magenta `>` prompt has faded in before it — the link becomes a terminal command line.
- [references/rf-08-feature-card-hover.png](references/rf-08-feature-card-hover.png) — card 1 hovered vs siblings: border snaps to solid cyan, interior fills with inset cyan glow, a 2px cyan→magenta gradient line has wiped across the top edge, and the numeral's glow has intensified.
- [references/rf-09-cyber-frame-hover.png](references/rf-09-cyber-frame-hover.png) — HUD frame hovered: lifted 4px with a 40px outer cyan glow. Shows the frame anatomy: 20px corner cuts, magenta corner brackets on the opposite corners, neon-duotone photo treatment.
- [references/source.css](references/source.css) — the demo's complete CSS, verbatim. Consult it for anything not covered here.
- [references/interactions.js](references/interactions.js) — the demo's complete inline JS, verbatim: the three IntersectionObserver reveal systems.

## 1. The canvas stack (mandatory — three fixed layers)

The scene is built from three `position: fixed` full-viewport layers; content scrolls between layers 2 and 3:

```css
/* Layer 1 — the void */
body { background: #0a0a0f; color: #fff; font-family: var(--font-mono); }

/* Layer 2 — blueprint grid + horizon glow (z-index: -1, behind content) */
.grid-bg {
  position: fixed; inset: 0; z-index: -1;
  background:
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;                  /* 1px cyan lines, 50px cells */
}
.grid-bg::after {                              /* synthwave horizon rising from the bottom */
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(to bottom,
    transparent 0%, rgba(255, 0, 255, 0.1) 50%, rgba(0, 255, 255, 0.1) 100%);
}

/* Layer 3 — CRT scanlines ABOVE everything (z-index: 1000) */
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1000;
  background: repeating-linear-gradient(0deg,
    rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px);
}
```

The scanline overlay is the direction's texture signature: a 2px-period horizontal
raster sitting *over* all content (`pointer-events: none` keeps it inert). It darkens
everything slightly, so all colors below are tuned to survive it.

## 2. Surfaces & materials

Surfaces are wireframes, not panes: near-zero fill + 1–2px neon hairline border. Depth
comes from glow, never from black elevation shadows.

```css
/* Standard card — barely-there fill, hairline border */
.feature-card {
  background: rgba(0, 255, 255, 0.02);
  border: 1px solid rgba(0, 255, 255, 0.2);
  padding: 2rem;                     /* border-radius: 0 — always */
}

/* HUD frame — heavier: 2px solid cyan, 20px corner cuts, magenta corner brackets */
.cyber-frame {
  background: rgba(0, 255, 255, 0.05);
  border: 2px solid var(--color-cyan);
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px),
                     calc(100% - 20px) 100%, 0 100%, 0 20px);
}
.cyber-frame::before, .cyber-frame::after {      /* magenta L-brackets, opposite corners */
  content: ''; position: absolute; width: 20px; height: 20px;
  border: 2px solid var(--color-magenta);
}
.cyber-frame::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.cyber-frame::after  { bottom: -2px; right: -2px; border-left: none; border-top: none; }

/* Terminal — the one truly dark surface */
.terminal { background: rgba(0, 0, 0, 0.8); border: 2px solid var(--color-cyan); }
```

Border-alpha is the hierarchy dial: `0.1` (section dividers) → `0.2` (card/nav
hairlines) → `0.3` (internal rules) → `1.0` solid (featured frames, terminal, hover).

**Photo treatment** — any image gets forced into the palette:

```css
.cyber-image img { filter: saturate(1.5) contrast(1.1); }
.cyber-image::after {   /* neon duotone wash */
  content: ''; position: absolute; inset: 0; mix-blend-mode: overlay;
  background: linear-gradient(135deg,
    rgba(0, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 0, 255, 0.2) 100%);
}
```

## 3. Color tokens

```css
:root {
  --color-bg:         #0a0a0f;                    /* near-black, faint blue cast */
  --color-text:       #ffffff;
  --color-text-muted: rgba(255, 255, 255, 0.5);   /* body copy, labels, outputs */
  --color-cyan:       #00ffff;                    /* structure: borders, chrome, commands */
  --color-magenta:    #ff00ff;                    /* energy: alerts, numerals, prompts */
  --color-yellow:     #ffff00;   /* reserved in the demo — defined, never used */
  --color-hot-pink:   #ff1493;   /* reserved in the demo — defined, never used */
  --glow-cyan:    0 0 10px var(--color-cyan),    0 0 20px var(--color-cyan),    0 0 40px var(--color-cyan);
  --glow-magenta: 0 0 10px var(--color-magenta), 0 0 20px var(--color-magenta), 0 0 40px var(--color-magenta);
}
```

Usage rules:
- **Two accents with fixed roles.** Cyan is the *structural* color — logo, borders, frames, stats, commands, primary actions. Magenta is the *energy* color — status badges, feature numerals, terminal prompts, glitch ghosts, corner brackets. Magenta punctuates; cyan builds.
- **Full saturation or alpha — nothing in between.** Accents are pure `#00ffff`/`#ff00ff`; hierarchy is achieved by putting *alpha* on cyan (border/fill tints), never by desaturating the hue.
- **The glow formula:** any accent-colored text takes its matching glow token — three stacked shadows at the same hue, radii 10/20/40px, zero offset. Intensified (hover) glow steps up to 20/40/60px. Colored light replaces elevation: hover shadows are `0 0 40px rgba(0,255,255,0.3)`-style halos, and the only near-black shadow in the system is the terminal's own fill.
- **Muted text is flat.** `rgba(255,255,255,0.5)` body copy never glows — glow is reserved for display type and accents so it stays special (and readable).
- Terminal semantics: prompt `$` magenta, command cyan, output muted white; traffic-light dots `#ff5f56` / `#ffbd2e` / `#27c93f` are the only non-palette colors on the page.

## 4. Typography

Two Google fonts, strictly cast:

- **Orbitron** (400–900) — display only: logo, h1, section titles, feature numerals/titles, stat values. Geometric, squared, sci-fi.
- **Share Tech Mono** — everything else: body copy, nav, buttons, tags, labels, terminal. The mono voice *is* the interface fiction; body text set in it reads as machine output.

| Role | Spec |
|---|---|
| Hero h1 | Orbitron `clamp(3rem, 7vw, 5rem)`, weight 900, UPPERCASE, line-height 1.1; three stacked `display:block` spans: line 1 flat white, line 2 cyan + glow (+ glitch), line 3 magenta + glow |
| Section title | Orbitron `clamp(2rem, 4vw, 3rem)`, 900, UPPERCASE, +0.1em; one `<span>` word flipped to cyan + glow |
| Logo | Orbitron 1.5rem, 900, +0.1em, cyan + glow; name styled `NEON//SYS` — `//` as brand mark |
| Feature numeral | Orbitron 2.5rem, 900, magenta + glow (`01`…`06` with leading zeros) |
| Feature title | Orbitron 1.125rem, 700, UPPERCASE, +0.05em, white |
| Status tag | mono 0.75rem, UPPERCASE, +0.2em, magenta text in 1px magenta border box |
| Nav link | mono 0.875rem, UPPERCASE, +0.15em, white/50 |
| Body copy | mono 1rem, white/50, line-height 1.8 |
| Micro label | mono 0.75rem, UPPERCASE, +0.1em, white/50 |
| Button | mono 0.875rem, UPPERCASE, +0.1em |

Voice details that sell the fiction: trailing underscores on actions (`INITIALIZE_`,
`LEARN MORE_`) as a cursor metaphor; version strings in copy (`SYSTEM ONLINE // V2.077`);
`>` prompts; `[OK]` boot lines. Everything except body sentences is UPPERCASE with
generous tracking (+0.05 to +0.2em).

## 5. Shape language

- **`border-radius: 0` everywhere.** The only circles are the 12px terminal dots. If a corner is softened, it's *cut*, not rounded.
- **45° corner cuts via `clip-path`**, always top-left + bottom-right, size-graded: buttons 10px, frames 20px — `polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)`.
- **Corner brackets**: 20×20px magenta L-shapes overlapping a cyan frame's opposite corners (HUD / targeting-reticle language).
- **1–2px hairlines everywhere**: nav bottom border, section top borders, card borders, stat divider — all cyan at 0.1–0.3 alpha. Sections are separated by hairlines, not background changes.
- Layout: 1200px container, 2rem gutters; hero is a 2-col 4rem-gap grid; features 3-col 2rem-gap (2-col ≤1024px, 1-col ≤768px); sections pad 80–100px vertical.

## 6. Interaction design & motion

### 6.1 Motion vocabulary

The personality split: **entrances are organic, ambient loops are mechanical.**

| Curve | Feel | Used for |
|---|---|---|
| `ease` / `ease-out` 0.3s | quiet, uniform | all hover states (0.2s on nav links) |
| `cubic-bezier(0.16, 1, 0.3, 1)` | long glide to rest ("expo-out") | scroll-reveal transforms |
| `linear` | machine, no acceleration | glitch slices (2s), scanline sweep (3s) |
| `step-end` | binary, digital | terminal cursor blink (1s) — no tween, on/off |
| keyframe percentage bursts | electrical stutter | badge flicker (dips only at 92–96% of a 3s loop) |

Duration bands: **0.2–0.3s** hovers · **0.4–0.8s** entrances · **0.3s-step** boot-line
cascade · **1–3s** ambient loops. Transforms: small `translateX/Y`, `scale(0.98–1.1)`,
`scaleX` wipes — nothing rotates, nothing bounces (no spring curves in this direction;
overshoot would feel organic, off-fiction).

Two signature entrance keyframes (used everywhere):

```css
@keyframes fadeInGlitch {   /* materialize via horizontal wipe — text/cards */
  0%   { opacity: 0; transform: translateX(-20px); clip-path: inset(0 100% 0 0); }
  50%  { clip-path: inset(0 50% 0 0); }
  100% { opacity: 1; transform: translateX(0); clip-path: inset(0 0 0 0); }
}
@keyframes slideInNeon {    /* de-blur materialize — panels/frames/stats */
  from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
  to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
}
```

`fadeInGlitch` reveals left-to-right like a scan; `slideInNeon` rises while snapping
from 10px blur into focus — a neon tube warming up.

### 6.2 Page-load choreography

Fixed timeline, all `both` fill; the two halves of the hero arrive on different curves —
copy *scans in*, hardware *focuses in*:

| t (s) | Element | Animation |
|---|---|---|
| 0.2 | hero copy block | `fadeInGlitch` 0.8s (wipe left→right) |
| 0.4 | hero visual column | `slideInNeon` 0.8s (rise + de-blur) |
| 0.5 | HUD frame | `slideInNeon` 0.6s (nested — frame lands after column) |
| 0.7 / 0.8 / 0.9 | the 3 stat readouts | `slideInNeon` 0.4s each, 0.1s cascade |
| 0.1 → 0.35 | 6 feature cards | `fadeInGlitch` 0.5s each, 0.05s steps |
| 0.3 | terminal window | `slideInNeon` 0.7s |
| 1.0 → 2.5 | 6 terminal lines | `slideInNeon` 0.3s each, **0.3s apart** — a real-time boot log |

The terminal is the choreography showpiece: lines appear at a human-readable 0.3s rhythm
long after the rest of the page has settled, as if the system is still booting. The
ambient flicker/glitch/blink loops (§6.5) start immediately and never stop.

### 6.3 Scroll choreography (JS — see [references/interactions.js](references/interactions.js))

Three IntersectionObserver systems, all **reveal-once** (classes/styles added, never
removed):

1. **Generic blocks** — `.reveal` (rise from 60px) / `.reveal-glitch` (slide from −40px left): observer at `threshold: 0.1, rootMargin: '0px 0px -50px 0px'` adds `.revealed`; transition 0.5s expo-out. `.stagger-1…4` classes add 0.1–0.4s `transition-delay`.
2. **Feature cards** — JS seeds inline `opacity: 0; translateX(-30px)`, reveals `index × 80ms` apart over 0.5s expo-out. Note the *horizontal* slide — this direction enters from the left (scan direction), not from below.
3. **Terminal** — seeded `translateY(40px)`, revealed at `threshold: 0.2` over 0.7s.

### 6.4 Element states — hover / active / focus

| Element | Hover | Press / focus |
|---|---|---|
| nav link | white/50 → cyan + full glow; magenta `>` prompt fades in (`::before`, opacity 0→1); `translateX(5px)`; 0.2s | focus-visible (all elements): `outline: 2px solid #00ffff; outline-offset: 4px` |
| logo | glow intensifies 10/20/40 → 20/40/60 | — |
| primary button | **full channel swap: cyan → magenta** (background + glow together) + shine sweep (§6.4a) | — |
| secondary (outline) button | floods solid cyan, text inverts to `#0a0a0f` + shine sweep | — |
| feature card | fill 0.02 → 0.05; border → solid cyan; `inset 0 0 30px rgba(0,255,255,0.1)` interior glow; 2px cyan→magenta gradient top edge wipes in (`scaleX(0→1)`, left origin); numeral springs `scale(1.1)` with glow → 20/40/60 | `:active` presses `scale(0.98)` |
| HUD frame | `translateY(-4px)` + halo `0 0 40px rgba(0,255,255,0.3)` | — |
| terminal window | halo `0 0 30px rgba(0,255,255,0.2)` | — |

Two patterns to reproduce: (1) **state changes are decisive** — the primary button doesn't
tint toward magenta, it *becomes* magenta; the card border doesn't brighten, it snaps to
solid; (2) **compound card hover** — four concurrent effects (fill, border, edge-wipe,
numeral spring) all on 0.3s ease, reading as one power-up event. Interaction hierarchy:
cards light up *inside* (inset glow), floating panels lift *outside* (halo + translate).

#### 6.4a Button shine sweep

Every `.btn-cyber` carries a full-size `::after` gradient band (`transparent →
white/30 → transparent`) parked at `left: -100%`; hover slides it to `left: 100%` over
0.4s ease — a light sweep across the face, timed with the color swap.

### 6.5 Ambient (idle) loops — the page is never still

| Loop | Spec | Reads as |
|---|---|---|
| badge flicker | `flicker 3s infinite`: opacity 1 until 92%, then 0.3 → 1 → 0.5 → 1 across 92–96% | sputtering neon tube — steady, then a half-second stutter, repeat |
| headline glitch | `.glitch::before/::after` = two `content: attr(data-text)` clones offset ±2px with opposite-color shadows (magenta/cyan); `clip: rect()` keyframes slice random horizontal bands, `2s linear infinite alternate-reverse` (two desynced keyframe sets) | RGB channel separation / signal corruption |
| frame scanline | 2px `transparent → cyan → transparent` gradient line sweeps `top: 0 → 100%`, `3s linear infinite`, opacity 0.5 | HUD refresh scan |
| terminal cursor | 10px × 1.2em cyan block, `blink 1s step-end infinite` | live prompt |
| CRT overlay | static (no animation) — texture, not motion | screen raster |

Glitch is rationed: **one element** (`<span class="glitch" data-text="The Future">` — the
`data-text` attribute feeds the pseudo-element clones). Ambient loops are all ≤3s period
and either linear or stepped — mechanical time, not breathing/organic time.

### 6.6 Accessibility contract

Non-negotiable when reproducing this direction: the `prefers-reduced-motion: reduce`
block removes the scanline overlay entirely (`display: none`), zeroes every
animation/transition duration and delay (killing flicker, glitch, cursor blink, sweep),
and force-shows all `.reveal` content. Keyboard focus is never suppressed:
`:focus-visible` gets the 2px cyan outline at 4px offset.

## 7. Do / Don't

**Do**
- Build the three-layer canvas first (void → grid+horizon → scanline overlay); neon only reads on near-black.
- Keep the accent roles fixed: cyan = structure & chrome, magenta = energy & alerts. Magenta punctuates a cyan world.
- Glow with the formula — three stacked text-shadows, same hue, 10/20/40px; step to 20/40/60 for emphasis. Use colored halos instead of black drop shadows.
- Cut corners with `clip-path` (10px buttons / 20px frames, TL+BR); add magenta corner brackets to hero-level frames.
- Set all UI text in the mono font, uppercase, tracked +0.1em±; reserve Orbitron 900 for display. Use terminal fiction: `>` prompts, trailing `_`, `//` separators, `[OK]` logs.
- Keep ambient loops mechanical (linear/stepped, ≤3s) and hover changes decisive (full hue swaps, borders snapping solid).
- Force photos into the palette: `saturate(1.5)` + cyan→magenta duotone overlay.

**Don't**
- Don't round corners — `border-radius: 0` is the direction. No pill buttons, no soft cards.
- Don't desaturate or pastel the accents; hierarchy comes from alpha on cyan hairlines, not from muddier hues.
- Don't glow body text — muted flat gray mono is what keeps the neon legible.
- Don't use spring/bounce easings or rotation; overshoot reads organic and breaks the machine fiction.
- Don't glitch more than one element; a page of glitching text is noise, one corrupted headline is a signal.
- Don't expect `box-shadow` to escape `clip-path`: the demo's clipped buttons declare `box-shadow: var(--glow-cyan)` but the clip crops it — visible in [references/rf-04-buttons-rest.png](references/rf-04-buttons-rest.png), where the primary button has no halo. For a glowing cut-corner button, put `filter: drop-shadow()` on a wrapper (drop-shadow follows the clipped silhouette) or rely on the inset/interior treatment.
- Don't ship the scanline overlay without the reduced-motion escape hatch, and keep it `pointer-events: none` at a z-index above content.

## 8. Minimal starter

```html
<body>                                          <!-- #0a0a0f void; body::before = scanlines -->
  <div class="grid-bg" aria-hidden="true"></div> <!-- fixed cyan grid + magenta horizon -->
  <nav>…</nav>                                   <!-- hairline bottom border, mono links -->
  <section class="hero">
    <div class="hero-content">
      <span class="hero-tag">System Online // v2.077</span>   <!-- magenta box, flicker -->
      <h1>
        <span class="line-1">Welcome to</span>                 <!-- flat white -->
        <span class="line-2 glitch" data-text="The Future">The Future</span>  <!-- cyan + glitch -->
        <span class="line-3">Of Design</span>                  <!-- magenta glow -->
      </h1>
      <button class="btn-cyber btn-cyber-primary">Initialize_</button>
      <button class="btn-cyber btn-cyber-secondary">Learn More_</button>
    </div>
    <div class="hero-visual">
      <div class="cyber-frame">                  <!-- cyan frame, cuts, magenta brackets -->
        <div class="cyber-image"><img …></div>   <!-- duotone-washed photo -->
        <div class="cyber-stats">…</div>         <!-- glowing Orbitron values -->
      </div>
    </div>
  </section>
  <section class="terminal-section">
    <div class="terminal">…</div>                <!-- boot log + blinking cursor -->
  </section>
</body>
```

Copy exact values from [references/source.css](references/source.css).
