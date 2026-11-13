// ─────────────────────────────────────────────────────────────
//  GALLERY — reads every image in src/gallery/ automatically.
//
//  To add a photo: drop a .jpg / .jpeg / .png / .webp file into
//  src/gallery/, then run `npm run photos` (resizes big photos)
//  and redeploy. No code changes needed.
//
//  • Order   — files are sorted by name, so prefix with a number:
//              11-pune-concert.jpg comes after 10-...
//  • Caption — taken from src/strings.js (gallery.caps) when the
//              name (without the number) has an entry there;
//              otherwise the file name becomes the caption:
//              "11-pune-concert-2025.jpg" → "Pune Concert 2025"
// ─────────────────────────────────────────────────────────────
const files = import.meta.glob('./gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const GALLERY = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => {
    const file = path.split('/').pop().replace(/\.[^.]+$/, '')
    const key = file.replace(/^\d+[-_ ]*/, '')
    const fallback = key.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    return { src, key, fallback }
  })

export const caption = (t, g) => t.gallery.caps[g.key] || g.fallback
