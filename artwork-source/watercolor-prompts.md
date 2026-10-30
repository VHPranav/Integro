# Integro watercolor artwork

Method: built-in image_gen tool for new illustrations. The client-supplied house image is the style reference and is used directly for the hero, home, and roof estimator. The original monochrome assets are retained.

## Final assets

- `public/artwork/solar-home-watercolor.webp` — supplied reference house, optimized as WebP.
- `public/artwork/solar-farm-watercolor.webp` — generated farm illustration.
- `public/artwork/solar-cta-watercolor.webp` — generated courtyard villa illustration.
- `artwork-source/watercolor-preview.png` — local website preview.

All final images are 1536 × 1024. Reveal outlines are calculated from each actual image in the browser using luminance edges, so the outline and colour layers share the same geometry.

## Farm generation prompt

Use case: illustration-story. Create a landscape 1536x1024 watercolor illustration for Integro solar website. Reference image is STYLE REFERENCE only: delicate fine dark ink outlines, luminous natural watercolor washes, sage and olive tropical foliage, warm terracotta/ochre and muted denim-blue photovoltaic panels, lots of clean warm-white paper negative space. Subject: a beautiful small Kerala solar farm with three rows of tilted blue photovoltaic panels, slender realistic supports, lush coconut palms and tropical planting softly fading into white paper edges. Sun high at upper right with subtle golden sunlight. Three-quarter front perspective. Composition entire array in bottom two thirds, generous white space above, no objects cropped. Premium editorial watercolor on white, not monochrome and not photorealism or 3D render. No text, logos, labels, border or watermark. Output white background matching reference. This is standalone artwork, not a website screenshot.

## CTA generation prompt

Use case: illustration-story. Create standalone landscape 1536x1024 watercolor artwork for the closing call-to-action of a premium Kerala solar installer website. Attached image is STYLE REFERENCE: delicate architectural ink outlines plus beautiful natural watercolor colours, warm cream stone, teak wood, terracotta tile roofs, blue photovoltaic panels, lush olive and sage tropical gardens, all fading softly into white paper. New subject composition: a welcoming modern single-storey Kerala courtyard villa viewed three-quarter from a slightly raised viewpoint, broad pitched tiled roof carrying a clear blue solar array, small steps and green tropical planting around the front, one coconut palm on each side, gentle afternoon golden light. Entire house visible, centered, compact balanced silhouette, large white negative space around subject with upper quarter white, painterly soft edges. Rich but refined natural colour, charming lived-in house, no people, no text, no logos, no border or watermark. Not monochrome, not photorealistic, not a 3D render. Same fine watercolor paper/ink character as reference, white background.

## Transparent background revision

Built-in image_gen edit, repeated once for each of the three final watercolor assets, with `transparent_background: true`.

Prompt: Edit target: the attached watercolor illustration. Remove ONLY the blank white/cream paper backdrop and its paper grain from around the illustrated subject, replacing it with genuine alpha transparency. Preserve the EXACT existing composition, framing, scale, geometry, colours, thin ink details, sun if present, all architecture, panels, foliage, flowers and painted ground washes. Keep light-coloured walls and white flower petals opaque within the subject; do not delete pale subject details. Keep soft watercolor bleed around the outer garden and ground as semitransparent edges. Do not redraw, crop, rearrange or add anything. The result is a clean watercolor illustration cutout on a truly transparent background, no white rectangle, no checkerboard painted into the image. Same landscape 3:2 canvas.

Transparent assets use sibling filenames `solar-home-watercolor-cutout.webp`, `solar-farm-watercolor-cutout.webp`, and `solar-cta-watercolor-cutout.webp` in `public/artwork/`. The opaque originals are preserved.

## Distinct hero house

Method: built-in image_gen, using the previous house as a style reference, with a true transparent background.

Final asset: `public/artwork/solar-hero-villa-watercolor.webp`. Used only in the hero; other house illustrations retain their current assets.

Prompt: Use case: illustration-story. Create a NEW and distinctly different Kerala solar house illustration for the hero of Integro website. Input image is a STYLE reference only; do not copy its bungalow architecture. New subject: an elegant contemporary TWO-STOREY Kerala family villa, asymmetric composition with a tall gabled terracotta-roof wing to the left, low wide veranda and covered carport to the right, warm teak screens, cream lime-plaster walls, laterite stone accents, big airy glass openings and a beautiful balcony. A large clearly visible muted-blue photovoltaic solar array sits on the broad front-facing sloped roof near center. Coconut palms and restrained lush tropical planting frame the home. Three-quarter front view, whole house in frame with small margin on sides, panoramic balanced silhouette, house placed mostly in lower two-thirds of a 1536x1024 landscape canvas. Fine ink detail and natural watercolor washes; olive foliage, warm terracotta, cream stone, teak and blue panels. Premium editorial illustration, warm welcoming daylight. Truly TRANSPARENT alpha background around all outer edges, no sky rectangle, no paper texture backdrop, no white background, no checkerboard drawn in. Soft semitransparent watercolor ground wash only immediately beneath building. No people, words, logo, watermark or decorative frame. Preserve white/cream solid walls inside the subject. Reference is only for watercolor palette and craft; create recognizably new architecture.
