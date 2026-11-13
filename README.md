# Vipin Tatad — website

React + Vite + Framer Motion. English / हिंदी / मराठी, dark & light mode.

```bash
npm install
npm run dev      # local + phone on same Wi-Fi
npm run build    # production build → dist/
```

## Add photos to the gallery

1. Copy the photo(s) into **`src/gallery/`** (`.jpg`, `.jpeg`, `.png`, `.webp`).
2. Name them with a number first so they sort in order, e.g. `11-pune-concert-2025.jpg`.
3. Run **`npm run photos`** — shrinks big camera photos so the site stays fast.
4. Deploy (push to GitHub / `vercel --prod`). The photo appears in the gallery strip,
   the grid and the full-screen viewer automatically.

**Caption:** the file name becomes the caption (`11-pune-concert-2025.jpg` → "Pune Concert 2025").
For a translated caption, add the name without the number to `gallery.caps` in
`src/strings.js` for each language, e.g. `'pune-concert-2025': 'Live in Pune, 2025'`.

To remove a photo, delete the file from `src/gallery/`.

## Where things live

| What | File |
| --- | --- |
| All page text (EN / HI / MR), WhatsApp message templates | `src/strings.js` |
| Email, social links, WhatsApp number, hero & about slider photos, press | `src/data.js` |
| Hero slider speed (`SLIDE_TIME`) | `src/components/Hero.jsx` |
| Colours, fonts, layout | `src/index.css` |
