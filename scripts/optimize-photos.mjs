// Resizes / compresses every photo in src/gallery so the site stays fast.
// Usage:  npm run photos
// Safe to run any time — already-small photos are left alone.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve('src/gallery')
const MAX = 1400 // longest side in px
const MAX_KB = 400

const files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
let changed = 0

for (const f of files) {
  const file = path.join(DIR, f)
  const before = fs.statSync(file).size
  const meta = await sharp(file).metadata()
  const big = Math.max(meta.width || 0, meta.height || 0) > MAX
  if (!big && before / 1024 <= MAX_KB) continue

  const out = path.join(DIR, f.replace(/\.(png|webp|jpeg)$/i, '.jpg'))
  const buf = await sharp(file)
    .rotate() // respect phone camera orientation
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer()
  fs.writeFileSync(out, buf)
  if (out !== file) fs.unlinkSync(file)
  changed++
  console.log(`✓ ${f} → ${path.basename(out)}  ${Math.round(before / 1024)}KB → ${Math.round(buf.length / 1024)}KB`)
}

console.log(changed ? `\nOptimised ${changed} photo(s).` : 'All photos are already optimised.')
