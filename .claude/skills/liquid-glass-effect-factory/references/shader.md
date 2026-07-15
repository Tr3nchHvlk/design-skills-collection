# The liquid-glass fragment shader (GLSL ES 1.0)

Reference for building/understanding a WebGL glass shader (as used by `@ybouane/liquidglass`).
Runs once per glass panel over a quad, sampling two textures: `u_bgTex` (sharp cropped
background) and `u_blurTex` (its blurred copy). Targets WebGL 1 for max compatibility.

The pipeline has three programs: **blit** (UV-transform copy for cover-fit upload/downsample),
**blur** (9-tap Gaussian, run H then V, ~6 passes, skipped when `blurAmount===0`), and the
**glass** shader below.

## Per-pixel algorithm

**1. Rounded-rect SDF + bevel height field.** A signed-distance function gives distance to the
rounded-rect edge; inside, a half-circle profile builds the glass cross-section:

```glsl
float rrSDF(vec2 p, vec2 b, float r){ vec2 q=abs(p)-b+vec2(r);
  return min(max(q.x,q.y),0.0)+length(max(q,vec2(0.0)))-r; }

float bevelHeight(float d, float zR){   // d = depth inside from edge, zR = bevel z-radius
  if(d<=0.0) return 0.0;
  if(d>=zR)  return zR;
  return sqrt(d*(2.0*zR-d));            // half-circle: flat centre, steep rim
}
```
The surface **normal** `N` = gradient of that height field (sample ±2px in x/y). This normal
drives refraction, Fresnel and speculars. `zRadius` controls how domed the bevel is.

**2. Refraction — two models (`bevelMode`), IOR 1.5** (`refrPow = 1 − 1/1.5`):
```glsl
if(u_bevelMode < 0.5){                  // 0 = BICONVEX pill: refract at entry + exit
  vec2 exitRefr=hGrad*refrPow, entryRefr=hGrad*refrPow;
  vec2 throughRefr=entryRefr*thickNorm*0.5;             // path length through the body
  refrPx=(exitRefr+entryRefr+throughRefr)*u_refract*30.0;
  refrPx += (-v_localPx/half_)*u_refract*4.0*depth;     // pull toward centre
}else{                                  // 1 = DOME / plano-convex: uniform magnification
  refrPx = -v_localPx*u_refract*depth*0.35;             // sample toward centre → zoom
}
```
`bevelMode 0` = default OS panel (bends at both faces). `bevelMode 1` with
`cornerRadius===zRadius` = half-sphere **magnifier** (literally enlarges content behind it).

**3. Chromatic aberration** — sample R/G/B at offset UVs along the normal, scaled by
`chromAberration`, weighted toward the rim; then edge-mix sharp vs. blurred:
```glsl
vec3 sharp=vec3(tex(u_bgTex, base+caD).r, tex(u_bgTex, base).g, tex(u_bgTex, base-caD).b);
vec3 blur =vec3(tex(u_blurTex,base+caD).r, tex(u_blurTex,base).g, tex(u_blurTex,base-caD).b);
vec3 col  =mix(sharp, blur, 1.0 - edge*0.15);   // rim crisp, centre uses the blur
```

**4. Colour grading** — in order: `brightness` (`col*=1+u_brightness`), `saturation` (mix toward
luma `dot(col,vec3(.299,.587,.114))`), cool tint (`mix(col, col*vec3(.92,.95,1.05), u_tint)`),
plus a subtle depth brighten.

**5. Lighting.**
- **Fresnel:** `pow(1.0-abs(N.z),4.0)*u_fresnel`; final `mix(fin, white, fres*0.2)` whitens edges.
- **Specular:** four fixed light dirs, Blinn-Phong `pow(dot(N,H), 50–120)`, summed × `specular`.
- **Inner stroke/rim:** ~1.5px inner border, brighter toward the top; plus `edgeHighlight` rim & inner glow.

**6. Drop shadow** — for fragments *outside* the panel (`sdf>0`), discard glass and write black
alpha: `exp`-falloff outer shadow + tighter contact shadow, offset by `shadowOffsetY`, scaled by
`shadowOpacity`/`shadowSpread`. The panel quad is padded by ~20px so the shadow has room (which is
why the injected canvas overflows the element box).

**7. Output** — `gl_FragColor = vec4(fin, mask * u_alpha)`, `mask` = anti-aliased `smoothstep` of
the SDF, `u_alpha` = `opacity`.

## Uniforms (map from config)

`u_size, u_radius, u_res, u_refract, u_chroma, u_edgeHL, u_spec, u_fresnel, u_distort, u_alpha,
u_sat, u_tint, u_zRadius, u_brightness, u_shadowAlpha, u_shadowSpread, u_shadowOffY, u_bevelMode`
— each is the correspondingly-named `data-config` value (px values × devicePixelRatio).

## Building it yourself (outline)

1. One shared hidden WebGL canvas (`alpha:true, premultipliedAlpha:false, preserveDrawingBuffer:true`).
2. Link blit/blur/glass programs; a pool of FBOs keyed by size (bg, blurA, blurB), reused across
   panels, flushed on resize.
3. Per panel: crop the scene to the padded rect, upload to `u_bgTex`; blit→blurA; if `blurAmount>0`
   run H+V Gaussian passes into `u_blurTex`; then draw the glass quad with blending
   `SRC_ALPHA, ONE_MINUS_SRC_ALPHA` into the element's canvas.
4. Handle `webglcontextlost`/`restored` (reinit programs/buffers, drop FBO cache).

This is enough to reproduce the effect without the library; for production, just use
`@ybouane/liquidglass` (see [webgl-library.md](webgl-library.md)).
