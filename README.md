# Vipin Tatad — website

React + Vite + Framer Motion. English / हिंदी / मराठी, dark & light mode.

```bash
npm install
npm run dev      # local + phone on same Wi-Fi
npm run build    # production build → dist/
```

## Upload photos from the website (no code)

Vipin can add or remove gallery photos from any phone or computer:
open **`https://vipinda1.vercel.app/#admin`** (or click "🔒 Manage photos" in the footer),
log in, choose photos, add an optional caption, tap **Upload**. They appear in the gallery instantly.

### One-time setup (≈10 minutes, free)

1. Create a free account and project at **https://supabase.com**.
2. In the project: **SQL Editor → New query** → paste everything from `supabase/setup.sql` → **Run**.
3. **Authentication → Users → Add user → Create new user** — enter Vipin's email and a password
   (tick "Auto Confirm User"). Only these users can upload/delete.
4. Recommended: **Authentication → Sign In / Providers → Email** → turn off "Allow new users to sign up",
   so nobody else can create an account.
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key.
6. **Vercel → your project → Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon public key
7. Redeploy on Vercel. Done.

For local testing, copy `.env.example` to `.env` and fill in the same two values.

## Add built-in photos (developer way)

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
