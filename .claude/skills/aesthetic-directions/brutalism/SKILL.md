---
name: brutalism
description: Apply the Brutalism / Neo-Brutalist web aesthetic direction — flat black ink, thick 4px white borders partitioning full-bleed sections, huge condensed Anton uppercase type, solid yellow and hot-pink color blocks, grayscale photos, hard zero-blur offset shadows, and violent slam/shake/pop motion. Use when building or restyling web UI (portfolios, agency sites, editorial, fashion/music/streetwear brands) that should read as loud, raw, anti-polish. Triggers - "brutalism", "brutalist", "neo-brutalism", "anti-design", "raw web", "punk/zine aesthetic", "hard shadows", "poster typography", "marquee".
---

# Brutalism

An aesthetic direction documented from the live reference at
https://claudekit.github.io/frontend-design-pro-demo/04-brutalism.html (the "BRUTAL" demo).

**Essence:** a screen-printed punk poster that happens to be a website. Flat black ink,
no gradients, no glass, no glow — structure is the only decoration. Thick 4px white
borders divide the page into full-bleed cells like a paste-up layout; whole panels are
flooded solid yellow or hot pink; photos are forced to grayscale like a photocopy.
Type is enormous condensed uppercase (Anton) against typewriter mono (Space Mono).
Depth is physical, not optical: elements lift off the page with hard zero-blur offset
shadows, stickers sit rotated a few degrees, hovers slam and shake. The page is
self-aware and hostile ("ERROR 404: BEAUTY NOT FOUND", "No Rights Reserved", a
crosshair cursor). Mood words: raw, loud, defiant, xerox, zine, anti-design.

## Visual references

View these with the Read tool before designing — they carry more information than the rules below:

- [references/br-01-hero.png](references/br-01-hero.png) — the whole system in one frame: 50/50 split hero, black left / solid-yellow right, three-line Anton mega-headline with the middle word flipped yellow, rotated pink `EST. 2024` sticker-tag, mono body copy, yellow button with white border; on the right a photo multiplied into the yellow field inside a black frame, with a rotated black `ERROR 404: BEAUTY NOT FOUND` sticker breaking out of it.
- [references/br-02-marquee.png](references/br-02-marquee.png) — the marquee strip mid-scroll: black Anton keywords (`UNPOLISHED * HIGH CONTRAST * BOLD TYPOGRAPHY`) on flood yellow, bounded by 4px borders.
- [references/br-03-projects.png](references/br-03-projects.png) — the projects section at rest: `SELECTED WORK` header vs mono `[04] PROJECTS` counter, 2×2 grid partitioned by 4px white borders, grayscale photos, Anton titles, yellow mono category labels and yellow Anton numerals.
- [references/br-04-stats.png](references/br-04-stats.png) — the stats band: four tiles alternating solid-yellow / black (nth-child odd), Anton 4rem values (`127`, `89`, `14`, `∞`), tracked mono labels.
- [references/br-05-cta.png](references/br-05-cta.png) — CTA at rest: 2fr/1fr split, two-tone Anton title (white line + hot-pink line), yellow button, and a flood-pink panel holding a giant Anton `!` resting at rotate(−10°).
- [references/br-06-footer.png](references/br-06-footer.png) — the minimal footer: Anton logo, mono uppercase links, `© 2024 — NO RIGHTS RESERVED`. No border above it — the CTA's border-bottom does the separating.
- [references/br-07-btn-rest.png](references/br-07-btn-rest.png) — button anatomy at rest: yellow fill, black mono 700 uppercase label (+0.15em), 4px white border, completely flat — no shadow until hover.
- [references/br-08-btn-hover.png](references/br-08-btn-hover.png) — the signature hover, captured live: `SEE OUR WORK` has jumped up-left 4px and an 8px hard white shadow appears bottom-right — paper lifting off the page. (Also shows the hero-image multiply treatment clearly.)
- [references/br-09-nav-hover.png](references/br-09-nav-hover.png) — nav hover: `WORK` has become a solid yellow block with black text and a white border; siblings stay bare text. Block fill, not underline.
- [references/br-10-project-card-hover.png](references/br-10-project-card-hover.png) — card 1 hovered vs siblings: lifted −6,−6 with a 10px yellow hard shadow (the yellow bar visible along its right edge), 70% black overlay with yellow Anton `VIEW`, image colorized and zoomed underneath.
- [references/br-11-stat-hover.png](references/br-11-stat-hover.png) — the `127` tile hovered: nudged up-left 4px, opening a visible gap against its neighbors; no shadow — the misalignment itself is the feedback.
- [references/br-12-cta-hover.png](references/br-12-cta-hover.png) — CTA section hovered: the `!` has sprung from −10° to rotate(−20°) scale(1.1) on the direction's only bouncy easing. Compare with br-05.
- [references/source.css](references/source.css) — the demo's complete CSS, verbatim. Consult it for anything not covered here.
- [references/interactions.js](references/interactions.js) — the demo's complete inline JS, verbatim: the three IntersectionObserver reveal systems.

## 1. The canvas: borders instead of whitespace

There are no background layers, textures, or gradients — the canvas is flat `#0a0a0a`
and the page is *partitioned*, not padded. Every section is full-bleed and butts
directly against the next; 4px solid white borders are the walls between cells:

```css
:root { --border-thick: 4px; }
body { background: #0a0a0a; color: #fff; font-family: var(--font-mono); cursor: crosshair; }

nav        { border-bottom: var(--border-thick) solid var(--color-text); }
.hero      { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
             border-bottom: var(--border-thick) solid var(--color-text); }
.hero-content { border-right: var(--border-thick) solid var(--color-text); }
.project-card { border-right: var(--border-thick) solid var(--color-text);
                border-bottom: var(--border-thick) solid var(--color-text); }
.project-card:nth-child(2n) { border-right: none; }   /* outer edge stays open */
```

Rules of the grid:
- **Full-bleed sections, hairline-free.** The only `.container` (1400px) is inside the
  nav; every other section runs edge to edge. Grid columns share borders like table
  cells — kill the border on the last cell of each row so the page edge stays clean.
- **Color-block cells.** Whole grid cells are flooded with solid accent: the hero's
  right half is pure yellow, the CTA's right third pure pink, stats tiles alternate
  yellow/black via `:nth-child(odd)`. Color is architectural, not decorative.
- **The marquee** is a section in its own right: a yellow strip between borders with
  an infinitely scrolling track (§6.5).
- Layout grids: hero `1fr 1fr`; projects `repeat(2, 1fr)`; stats `repeat(4, 1fr)`;
  CTA `2fr 1fr`. Collapse at 1024px (hero/CTA to 1 col, stats to 2) and 768px
  (everything 1 col, nav links hidden) — when a column collapses, its border-right
  becomes a border-bottom.

## 2. Surfaces & materials

Surfaces are flat ink — zero gradients, zero blur, zero transparency (the single
exception: the project-card hover overlay at `rgba(0,0,0,0.7)`).

- **Depth = hard offset shadow.** The only shadow form in the system is
  `box-shadow: Npx Npx 0 <flat color>` — zero blur, zero spread, paired with an equal
  and opposite `translate(-N px, -N px)` so the element "lifts" while the shadow stays
  put. Sizes are graded: button 8px white, project card 10px yellow. Nothing ever has
  a soft/ambient shadow.
- **Stickers.** Small elements sit deliberately crooked: the hero tag at
  `rotate(-2deg)` (pink fill), the error box at `rotate(5deg)` (black fill, white
  border), the CTA `!` at `rotate(-10deg)`. Rotation is ±2–10°, always on small
  accent elements, never on structural cells.
- **Photo treatment** — every image is de-glossed:

```css
/* gallery images: photocopy at rest, real on hover */
.project-image img { filter: grayscale(100%); transition: all 0.3s; }
.project-card:hover .project-image img { filter: grayscale(0%); transform: scale(1.1); }

/* hero image: screen-printed INTO the yellow field */
.hero-image img {
  border: var(--border-thick) solid var(--color-bg);   /* black frame on yellow */
  mix-blend-mode: multiply;                            /* inks into the panel */
  filter: grayscale(100%) contrast(1.2);
}
```

The multiply-over-yellow trick is the direction's photo signature: a grayscale image
multiplied onto a solid accent panel prints as a two-ink riso/screen-print duotone.

- **Selection & cursor are styled too:** `::selection { background: #ffff00; color: #0a0a0a; }`
  and `body { cursor: crosshair; }` — the hostility extends to the browser chrome.

## 3. Color tokens

```css
:root {
  --color-bg:          #0a0a0a;   /* flat near-black ink */
  --color-text:        #ffffff;   /* type AND borders — same white */
  --color-accent:      #ffff00;   /* yellow: floods, highlights, hover fills, shadows */
  --color-accent-alt:  #ff3366;   /* hot pink: punctuation — tag, CTA word, one panel */
  --color-accent-blue: #00ffff;   /* reserved in the demo — defined, never used */
}
```

Usage rules:
- **Four inks, full strength.** Black, white, yellow, pink — used flat, never tinted,
  never alpha'd (again: the 0.7 black overlay is the lone exception). There are no
  grays; "muted" doesn't exist in this direction.
- **Yellow is the workhorse:** the highlighted headline word, the marquee, the hero
  panel, buttons, odd stat tiles, category labels, numerals, hover fills, card
  shadows, selection, focus rings. If something activates or matters, it goes yellow.
- **Pink punctuates:** the rotated tag, the second CTA line, the `!` panel — roughly
  one pink moment per screenful. Pink never appears on interactive states.
- **Text sits directly on the flood colors:** black-on-yellow, white-on-pink,
  black-on-white — always maximum-contrast pairings, no overlays to soften them.
- Cyan is declared but unused — resist adding a third accent; two is the budget.

## 4. Typography

Two Google fonts, cast as poster vs typewriter:

- **Anton** (single weight) — display only: logo, headlines, section titles, project
  titles/numerals, stat values, marquee words, the `VIEW` overlay, the giant `!`.
  Condensed, ultra-black, always UPPERCASE.
- **Space Mono** (400/700) — everything else: nav, body, tags, labels, buttons,
  footer. The mono voice makes body copy read as manifesto/typescript.

| Role | Spec |
|---|---|
| Hero h1 | Anton `clamp(4rem, 10vw, 10rem)`, UPPERCASE, **line-height 0.9**, −0.02em; middle word is a `display:block` span flipped `#ffff00` |
| CTA title | Anton `clamp(3rem, 8vw, 6rem)`, line-height 1; second line span flipped `#ff3366` |
| Section title | Anton 3rem UPPERCASE |
| Project title | Anton 1.5rem UPPERCASE |
| Stat value / project numeral | Anton 4rem / 2rem (numerals `01`…`04` with leading zeros, yellow) |
| Marquee word | Anton 2rem, +0.1em, black on yellow |
| Logo | Anton 2rem, +0.05em, white (footer 1.5rem) |
| Nav link | mono 0.875rem, 700, UPPERCASE, +0.1em |
| Button | mono 0.875rem, 700, UPPERCASE, +0.15em |
| Body copy | mono 1rem, line-height 1.8, max-width 400–500px |
| Tag / label / counter | mono 0.75rem, 700, UPPERCASE, +0.1–0.2em |

Display type is set tight and huge — `line-height 0.9` makes headline lines *touch*.
The scale jump between Anton display and mono UI is extreme (10rem vs 0.875rem);
there are no intermediate sizes softening the cliff.

Voice details that sell the fiction: bracketed counters (`[04] PROJECTS`), error
copy as decoration (`ERROR 404: BEAUTY NOT FOUND`), anti-slogans (`© 2024 — NO
RIGHTS RESERVED`, `∞ NO LIMITS`), a marquee chanting the style's own rules
(`RAW DESIGN * UNPOLISHED * HIGH CONTRAST`), and self-deprecating CTA copy
(`LET'S MAKE SOMETHING UGLY BEAUTIFUL`).

## 5. Shape language

- **`border-radius` does not exist.** Not 0 by declaration — the property simply
  never appears. Every box is a hard rectangle.
- **4px is the only border weight** (`--border-thick`), always solid, white on black
  (or black on yellow for the hero image frame). No hairlines, no 1px anything.
- **Shadows are rectangles too:** `8px 8px 0` / `10px 10px 0`, flat color, no blur.
- **Rotation replaces curvature** as the organic touch: ±2–10° on stickers and the `!`.
- Nav links reserve their hover border with `border: 4px solid transparent` at rest —
  the yellow block snaps in without layout shift.
- Focus ring follows suit: `outline: 4px solid #ffff00; outline-offset: 4px` —
  thick and square, matching the border system.

## 6. Interaction design & motion

### 6.1 Motion vocabulary

The personality: **abrupt, physical, violent.** Feedback is near-instant and
oversized; entrances slam, pop, and rattle like objects being thrown onto a paste-up
board.

| Curve | Feel | Used for |
|---|---|---|
| `ease` / linear-ish **0.1s** | instant snap | nav fill, logo/footer color, button lift |
| `ease` **0.15s** | fast slam | card lift, stat nudge |
| `ease` 0.2–0.3s | quick | image colorize/zoom, overlay fade, numeral tilt |
| `cubic-bezier(0.16, 1, 0.3, 1)` 0.5s | hard launch, long skid ("expo-out") | slideInHard entrances, scroll reveals |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` 0.3s | spring overshoot | the CTA `!` swing — the only bounce |
| `ease-out` with keyframe overshoot | slap-on sticker | popInBrutal (scale 0 → 1.1 → 1 with rotation) |
| `ease-in-out` shake | rattle | shake keyframe (±5px x), 0.2–0.5s |
| `linear` 20s | conveyor belt | marquee loop |

Duration bands: **0.1–0.15s** hovers (the defining speed — polish-era 0.3s hovers feel
wrong here) · **0.4–0.5s** entrances · **20s** marquee. Unlike softer directions,
brutalism *does* rotate and overshoot: `popInBrutal` swings −10°→+2°→0° while scaling
0→1.1→1, and shake oscillates ±5px. Nothing fades gently; opacity always rides a
transform.

The three signature keyframes:

```css
@keyframes slideInHard {  /* thrown in from offscreen left */
  from { opacity: 0; transform: translateX(-100px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes popInBrutal {  /* sticker slapped on: overshoots scale AND rotation */
  0%   { opacity: 0; transform: scale(0)   rotate(-10deg); }
  70%  {             transform: scale(1.1) rotate(2deg);   }
  100% { opacity: 1; transform: scale(1)   rotate(0deg);   }
}
@keyframes shake {        /* horizontal rattle */
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-5px); }
  75%      { transform: translateX(5px); }
}
```

### 6.2 Page-load choreography

Short and percussive — everything lands inside 1s, then one loop keeps rattling:

| t (s) | Element | Animation |
|---|---|---|
| 0.2 | hero copy half | `slideInHard` 0.5s expo-out (slams in from the left) |
| 0.4 | hero yellow half | `slideInRight` 0.5s expo-out (slams in from the right) |
| 0.6 | `EST. 2024` tag | `popInBrutal` 0.4s ease-out — sticker slapped on last |
| 2.0 → ∞ | `ERROR 404` box | `shake 0.5s ease-in-out infinite` — sits still for 2s, then rattles forever |

The two hero halves arriving from *opposite* directions is the signature: the page
assembles like two paste-up boards shoved together. The delayed infinite shake on the
error sticker is the page's heartbeat — calm for two seconds, then permanently agitated.

(The CSS also declares staggered `slideInHard`/`popInBrutal` entrance animations for
`.project-card`/`.stat-item` (0.1–0.4s delays) — a load-time fallback that the JS
scroll system below immediately supersedes by seeding inline styles.)

### 6.3 Scroll choreography (JS — see [references/interactions.js](references/interactions.js))

Three IntersectionObserver systems, all **reveal-once** (styles added, never removed):

1. **Generic blocks** — `.reveal` (rise from 60px) / `.reveal-left` (slide from −80px):
   observer at `threshold: 0.1, rootMargin: '0px 0px -50px 0px'` adds `.revealed`;
   transition 0.5s expo-out. `.stagger-1…4` add 0.1–0.4s `transition-delay`.
2. **Project cards** — JS seeds inline `opacity: 0; translateY(50px)`, reveals
   `index × 100ms` apart over 0.5s expo-out.
3. **Stat tiles** — seeded `translateY(30px)`, revealed `index × 80ms` apart over
   0.4s plain ease at `threshold: 0.2` — the four tiles thud in left to right.

### 6.4 Element states — hover / active / focus

| Element | Hover | Press / focus |
|---|---|---|
| nav link | bare text → **solid yellow block**: yellow fill, black text, 4px white border snaps in; 0.1s | focus-visible (all elements): `outline: 4px solid #ffff00; outline-offset: 4px` |
| logo / footer link | white → yellow, 0.1s, nothing else | — |
| button `.btn-brutal` | `translate(-4px, -4px)` + `box-shadow: 8px 8px 0 #fff` + one `shake` 0.2s — rattles, then rests lifted | `:active` `translate(0,0)`, shadow none — **pressed flat to the page** |
| project card | four concurrent effects (0.15–0.3s): lifts `translate(-6px,-6px)` + `10px 10px 0` **yellow** shadow; image `grayscale(0)` + `scale(1.1)`; 70% black overlay fades in with Anton `VIEW` whose letter-spacing widens to 0.1em; numeral tilts `rotate(-10deg) scale(1.2)` | `:active` half-press: `translate(-2px,-2px)`, `4px 4px 0` shadow |
| stat tile | `translate(-4px,-4px)` — no shadow, just knocked out of alignment; the value runs one `shake` 0.3s | — |
| CTA section (whole `.cta:hover`) | the `!` springs −10° → `rotate(-20deg) scale(1.1)` on the spring bezier | — |

Patterns to reproduce:
1. **Lift/press physics** — hover = lift up-left with a hard shadow appearing
   down-right; `:active` = shove back down (shadow shrinks or vanishes). The trio
   rest → hover → active reads as paper: flat → lifted → pressed.
2. **Block fills, not tints** — the nav link doesn't get an underline or a color
   shift; it becomes a solid yellow slab. State changes are binary.
3. **Shake as tactile feedback** — buttons and stat values rattle *once* on hover
   (0.2–0.3s), like something being grabbed. Note the shake keyframe animates
   `translateX`, which overrides the hover lift *while it runs* — the element
   rattles in place, then jumps to its lifted position. The glitch box is the only
   element allowed an infinite shake.
4. **Hover reach can exceed the cursor target** — the `!` reacts to hovering
   *anywhere* in the CTA section, making the whole section feel alive.

### 6.5 Ambient (idle) loops

Exactly two — the page is agitated, not busy:

| Loop | Spec | Reads as |
|---|---|---|
| marquee | `.marquee-track { animation: marquee 20s linear infinite }` translating `0 → −50%`; content duplicated twice inside the track for a seamless wrap | protest-banner conveyor |
| glitch box | `shake 0.5s ease-in-out infinite` with `animation-delay: 2s` | a rattling warning label |

```html
<div class="marquee"><div class="marquee-track">
  <div class="marquee-content"><span>Raw Design</span><span>*</span>…</div>
  <div class="marquee-content"><!-- exact duplicate --></div>
</div></div>
```

### 6.6 Accessibility contract

Non-negotiable when reproducing this direction: the `prefers-reduced-motion: reduce`
block kills the two infinite loops outright (`animation: none` on `.marquee-track`
and `.glitch-box`), zeroes every other animation/transition duration and delay, and
force-shows `.reveal`/`.reveal-left` content. Keyboard focus is never suppressed:
`:focus-visible` gets the 4px yellow outline at 4px offset. Maximum-contrast ink
pairings (black/yellow, black/white) keep the direction AAA-friendly by default.

## 7. Do / Don't

**Do**
- Build with borders, not whitespace: full-bleed sections butted together, 4px solid
  white walls, shared cell borders with the outer edge left open.
- Flood whole grid cells with solid yellow (workhorse) and pink (punctuation);
  put black or white text straight on them.
- Set display type in Anton, UPPERCASE, line-height ≤1, at poster scale
  (`clamp(4rem, 10vw, 10rem)`), and everything else in bold mono with wide tracking.
- Use the lift/press shadow physics: hover `translate(-4,-4)` + `Npx Npx 0` hard
  shadow, active pressed flat. Grade N by element weight (button 8, card 10).
- Keep hovers at 0.1–0.15s and make them binary: block fills, full colorization,
  visible displacement.
- Rotate the small stuff ±2–10° (tags, stickers, one glyph) and let one element
  rattle on an infinite shake.
- Grayscale every photo; multiply grayscale images onto accent panels for the
  screen-print duotone; colorize only on hover.
- Write hostile microcopy: bracketed counters, error messages as ornament,
  anti-slogans, a marquee that chants the brand's rules.

**Don't**
- Don't use border-radius, gradients, blur, glow, or soft shadows — any of them
  instantly breaks the print fiction. Shadow blur is always 0.
- Don't use alpha/tinted colors — inks are full-strength; the only transparency
  allowed is a dark image overlay.
- Don't add grays or a third accent (the cyan token is a trap — it's declared and
  never used). Hierarchy comes from scale and placement, not muted palettes.
- Don't slow the hovers past ~0.15s or ease them gently — polish-speed transitions
  read as apologetic, which is off-voice.
- Don't rotate structural containers; crookedness is for stickers, numerals, and
  glyphs only.
- Don't let more than one element shake on loop; one rattling sticker is a nervous
  tic, several is a broken page.
- Don't center body copy or let it run wide — manifesto text stays left-aligned,
  mono, and capped around 400–500px.

## 8. Minimal starter

```html
<body>                                        <!-- flat #0a0a0a, cursor: crosshair -->
  <nav>…</nav>                                <!-- 4px border-bottom; links get yellow-block hover -->
  <section class="hero">                      <!-- 1fr 1fr, 4px border between + below -->
    <div class="hero-content">                <!-- slideInHard from the left -->
      <span class="hero-tag">Est. 2024</span> <!-- pink, rotate(-2deg), popInBrutal -->
      <h1>Design <span>Without</span> Rules</h1>  <!-- Anton 10rem; span = yellow line -->
      <p class="hero-description">…</p>       <!-- mono, max-width 400px -->
      <a class="btn-brutal" href="#">See Our Work</a> <!-- yellow/black/white; lift+shake hover -->
    </div>
    <div class="hero-visual">                 <!-- solid yellow; slideInRight -->
      <div class="hero-image">
        <img src="…">                         <!-- grayscale + multiply = duotone -->
        <div class="glitch-box">Error 404: Beauty Not Found</div> <!-- rotate(5deg), infinite shake -->
      </div>
    </div>
  </section>
  <div class="marquee"><div class="marquee-track">
    <div class="marquee-content"><span>Raw Design</span><span>*</span>…</div>
    <div class="marquee-content"><!-- duplicate for seamless loop --></div>
  </div></div>
  <section class="projects">…</section>       <!-- 2×2 bordered grid; grayscale→color cards -->
  <section class="stats">…</section>          <!-- 4 tiles, odd = yellow -->
  <section class="cta">…</section>            <!-- 2fr 1fr; pink panel + rotated ! -->
  <footer>…</footer>
</body>
```

Copy exact values from [references/source.css](references/source.css).
