# Style presets — regular / dark / frosted / button / dome

Ready-to-use values for the three glass "finishes" plus button and magnifier, given for **both**
paths: the WebGL library (`data-config` JSON) and the CSS/SVG techniques (knob values).

## WebGL `data-config` presets (`@ybouane/liquidglass`)

```js
// REGULAR — clear, refractive (the defaults; nothing else needed)
{ refraction: 0.69, blurAmount: 0, chromAberration: 0.05, cornerRadius: 40 }

// FROSTED — milky, blurred
{ blurAmount: 0.25, cornerRadius: 30 }

// DARK — smoked
{ brightness: -0.3, blurAmount: 0.25, cornerRadius: 50 }

// BUTTON — hover brightens, press flattens bevel + deepens shadow
{ button: true, cornerRadius: 24, blurAmount: 0.3, brightness: -0.1 }

// DOME MAGNIFIER — half-sphere lens that enlarges content behind it
{ bevelMode: 1, cornerRadius: 50, zRadius: 50, floating: true, blurAmount: 0, refraction: 1.2 }

// Extra real-world configs:
// Hero title (frosted+dark+chromatic, deep bevel)
{ blurAmount: 0.3, chromAberration: 0.2, cornerRadius: 60, zRadius: 60, refraction: 1.2, brightness: -0.2 }
// Video-controls overlay
{ cornerRadius: 20, zRadius: 20, blurAmount: 0.4, brightness: -0.1 }
// Floating panels: clear / blurred / dark
{ floating: true, cornerRadius: 40, blurAmount: 0 }
{ floating: true, cornerRadius: 40, blurAmount: 0.5 }
{ floating: true, cornerRadius: 40, brightness: -0.3, blurAmount: 0.4 }
```

Remember: every glass element needs `isolation: isolate` (stacking gotcha), the background must be
a sibling *inside* the root, and `init()` is async.

## CSS/SVG knob presets

Applied to the utility classes in [`../assets/glass.css`](../assets/glass.css) /
techniques in [techniques-css-svg.md](techniques-css-svg.md).

| Finish | Tint / fill | Blur | Filter | Notes |
|---|---|---|---|---|
| **regular** (clear) | `rgba(255,255,255,.08–.12)` | `blur(0px)` on lens | `#lg-refract` | bright rim via `::before`; refraction does the work |
| **frosted** (milky) | `rgba(255,255,255,.10)` | `blur(4–8px)` | optional `#lg-refract` | this is plain glassmorphism if you drop the filter |
| **dark** (smoked) | `rgba(0,0,0,.25–.35)` | `blur(4px)` | optional | set text colour to white |
| **button** | `linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,255,255,.03))` | — | `#lg-lens` | pill/circle radius |
| **magnifier** | — | — | `#lg-lens` | round; the lens map bulges the centre. For a *true* magnifier use the WebGL dome preset |

Colour-tuning cheatsheet (any technique):
- Milkier/frostier → raise the lens/effect `blur()` and the tint alpha.
- Brighter "wet" rim → raise the inset box-shadow alphas on the rim/`::before`/`.lg-shine`.
- Dark glass → replace white tint with `rgba(0,0,0,.3)` + white content colour.
- Stronger warp → swap `#lg-refract`→`#lg-warp`, or raise the filter's `feDisplacementMap scale`.

## Interactive-playground slider ranges (for a tuner UI)

If you build a live tuner (one `<input type=range>` per param writing to `data-config`), these are
sensible ranges (from the library's own playground):

| Control | min | max | step | default |
|---|---|---|---|---|
| blurAmount | 0 | 1 | 0.01 | 0.25 |
| refraction | 0 | 2 | 0.01 | 0.69 |
| chromAberration | 0 | 0.3 | 0.005 | 0.05 |
| edgeHighlight | 0 | 1 | 0.01 | 0.05 |
| specular | 0 | 1 | 0.01 | 0 |
| fresnel | 0 | 2 | 0.01 | 1 |
| distortion | 0 | 1 | 0.01 | 0 |
| cornerRadius | 0 | 100 | 1 | 40 |
| zRadius | 1 | 100 | 1 | 40 |
| opacity | 0 | 1 | 0.01 | 1 |
| saturation | −1 | 1 | 0.01 | 0 |
| brightness | −0.5 | 0.5 | 0.01 | 0 |
| shadowOpacity | 0 | 1 | 0.01 | 0.3 |
| shadowSpread | 0 | 40 | 1 | 10 |
| bevelMode | 0 | 1 | 1 | 0 |
