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

// ─────────────────────────────────────────────────────────────
//  Photos uploaded from the website (/#admin) live in Supabase.
//  useGallery() = uploaded photos (newest first) + built-in photos.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

const listeners = new Set()
let uploaded = []
let loaded = false

export async function refreshUploaded() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('gallery_photos')
    .select('id, path, url, caption, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('Gallery: could not load uploaded photos —', error.message)
    return uploaded
  }
  uploaded = data
  loaded = true
  listeners.forEach((fn) => fn(uploaded))
  return uploaded
}

export function useUploaded() {
  const [list, setList] = useState(uploaded)
  useEffect(() => {
    listeners.add(setList)
    if (!loaded) refreshUploaded()
    return () => listeners.delete(setList)
  }, [])
  return list
}

/** Gallery items for display: { src, alt, uploaded } */
export function useGallery(t) {
  const up = useUploaded()
  return [
    ...up.map((p) => ({ src: p.url, alt: p.caption || 'Vipin Tatad', uploaded: true })),
    ...GALLERY.map((g) => ({ src: g.src, alt: caption(t, g), uploaded: false })),
  ]
}
