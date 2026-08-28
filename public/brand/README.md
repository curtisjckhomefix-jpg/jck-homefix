# Brand assets

Generated 2026-08-27 in the site's own design language: hi-vis equipment amber
(`#FFC700`) on carbon (`#08080a`), Archivo Black display type, and the hazard
stripe used as a rule throughout the site.

| File | Size | Use |
|---|---|---|
| `jck-mark.png` | 1024×1024 | Square mark — avatars, favicon, social profile |
| `jck-mark.svg` | vector | Same mark, scalable. Uses a font stack; convert text to paths before sending to a printer |
| `jck-lockup-on-dark-transparent.png` | 2388×680 | **Use this on the website.** Light text, transparent background |
| `jck-lockup-on-light-transparent.png` | 2388×680 | Dark text, transparent background — light backgrounds |
| `jck-lockup-dark.png` | 2388×680 | Same, but with a solid `#08080a` background baked in |
| `jck-lockup-light.png` | 2388×680 | Same, but with a solid `#faf8f4` background baked in |

## Use the transparent ones on the site

The solid-background versions show a faint rectangle in the header, because the
header is `bg-carbon-950/95` with a backdrop blur — very slightly different from
the `#08080a` baked into the file, so the edge catches the light.

Keep the solid versions only for places that need an opaque block: some print
workflows and email clients that composite onto white.

PNGs are rendered at 2× with the real Archivo Black webfont, so they are sharp
on retina displays.

## Testing Cloudinary with these

1. Upload `jck-mark.png` to Cloudinary as public ID **`jck/brand/mark`**.
2. Run:

   ```bash
   pnpm check-cloudinary <your-cloud-name> jck/brand/mark
   ```

   It fetches the asset through four transformation URLs — raw delivery,
   `f_auto,q_auto`, a resize, and a blur placeholder — and confirms each
   returns a real image.

## Note on the site header

The header and footer draw the JCK badge in CSS rather than loading an image.
That is deliberate — it is a coloured box with three letters, so an HTTP
request would cost more than it is worth. These files are for everywhere the
site is not: social profiles, email signatures, vehicle livery, print.
