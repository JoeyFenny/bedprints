# Image prompts

**Palette: black / white / bamboo tan** (no sage or green). All images are AI-generated illustrations of the product *concept*, not photos of the real goods. Replace them with real product photography as soon as it exists (overwrite the files in `public/images/`, keep the names, and keep the 640px `-sm.jpg` twin).

## How the current set was made (2026-10-03)

Pollinations.ai now returns HTTP 402 without an API key, so the images were generated with the **AI Horde** anonymous queue (`https://aihorde.net/api/v2/generate/async`, apikey `0000000000`, model `Juggernaut XL`, 28 steps, `k_dpmpp_2m`, cfg 5.5, 2 candidates per prompt). Each prompt below was used with this style suffix and negative prompt, the best candidate was picked by eye, then upscaled with Lanczos (1024 -> 1200px, hero 1024x576 -> 1600x900) plus a light unsharp mask.

- Style suffix: `black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail`
- Negative prompt: `green, sage, mint, teal, blue tint, text, watermark, logo, people, person, face, deformed, distorted, blurry, cartoon, illustration, painting, cgi, oversaturated, cluttered`

## `public/images/hero-bedroom.jpg (+ -sm 960px, og-bedprince.jpg is a crop)`

Size requested: 1024x576

wide photo of a serene modern bedroom, bed with crisp white bamboo bedding and a folded tan throw, black wood headboard, woven tan bamboo pendant lamp, large window with soft morning light, white walls, black bedside table, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-sheet-set.jpg`

Size requested: 1024x1024

neatly made bed with crisp white bamboo sheets and soft drapes of fabric, two white pillows and one charcoal black pillow, black wood headboard, white wall, tan bamboo bedside stool, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-sheet-set-2.jpg`

Size requested: 1024x1024

close-up of rumpled white bamboo viscose sheets with smooth silky sheen and soft folds, edge of a black pillowcase and a tan blanket corner, soft morning light, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-pillowcases.jpg`

Size requested: 1024x1024

two stacked white bamboo pillows with smooth white pillowcases on a bed with white sheets, a black pillow behind them, tan wall, soft natural light, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-duvet-cover.jpg`

Size requested: 1024x1024

bed dressed with a soft white duvet cover with gentle wrinkles, black headboard, white and black pillows, bright minimalist bedroom, tan wooden floor, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-pillow.jpg`

Size requested: 1024x1024

one plush white pillow resting on a bed with white sheets, plain tan wall behind, soft natural window light, clean minimal styling, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-throw-blanket.jpg`

Size requested: 1024x1024

soft tan oatmeal knit throw blanket draped over the corner of a white bed, black headboard, cozy minimal bedroom, warm natural light, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-cooling-comforter.jpg`

Size requested: 1024x1024

white lightly quilted box-stitched comforter folded at the foot of a bed with white sheets, black bed frame, tan wall, calm minimal bedroom, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-sheet-set-detail.jpg`

Size requested: 1024x1024

macro close-up of crisp white bamboo viscose sheet fabric folded with a smooth silky sheen, soft shadows, a hint of a black stitched hem, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-pillowcases-detail.jpg`

Size requested: 1024x1024

close-up of the corner of a white pillowcase with fine black piping edge on a white pillow, smooth fabric, tan linen blanket blurred in background, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-duvet-cover-detail.jpg`

Size requested: 1024x1024

close-up of a white duvet cover corner with a hidden zipper and a small black fabric tie, soft wrinkles, natural light, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-pillow-detail.jpg`

Size requested: 1024x1024

close-up of a plush white pillow edge with fine stitching, smooth bamboo fabric texture, tan background, soft light, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-throw-blanket-detail.jpg`

Size requested: 1024x1024

close-up macro of a chunky tan oatmeal knit blanket texture, soft yarn stitches, warm natural light, shallow depth of field, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## `public/images/bamboo-cooling-comforter-detail.jpg`

Size requested: 1024x1024

close-up of white quilted box-stitched comforter surface showing neat stitching squares, soft shadows, a black bed frame corner blurred in background, black white and warm tan palette, neutral colors, photorealistic, editorial interior catalog photography, 85mm lens, natural window light, sharp focus, fine fabric texture, high detail

## Known limits

- 1024px sources upscaled to 1200/1600px: fine for cards and the gallery, soft if zoomed to 2x. Real photos or a 2048px render would fix this.
- AI furniture details (lamp cords, nightstand legs) can look slightly off when zoomed. Do not use these as proof of construction details such as corner ties or hidden zips.
- Previous (replaced) set: sage-green Pollinations renders, 768px upscaled.
