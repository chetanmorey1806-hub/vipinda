import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase, BUCKET } from '../supabase'
import { refreshUploaded, useUploaded } from '../gallery'

const MAX_SIDE = 1600
const QUALITY = 0.82

/** Shrink a phone/camera photo in the browser before uploading. */
async function compress(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', QUALITY))
  return { blob, w, h }
}

const kb = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`)

/* ───────────────── open / close via #admin ───────────────── */
export function useAdminRoute() {
  const [open, setOpen] = useState(() => window.location.hash === '#admin')
  useEffect(() => {
    const on = () => setOpen(window.location.hash === '#admin')
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const close = () => {
    history.replaceState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
  }
  return [open, close]
}

export default function Admin({ onClose }) {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(!supabase)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    if (!supabase) return () => (document.body.style.overflow = '')
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      document.body.style.overflow = ''
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div className="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="admin-card"
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-label="Gallery manager"
      >
        <header className="admin-head">
          <div>
            <span className="admin-kicker">VIPIN. · Admin</span>
            <h2>Gallery manager</h2>
          </div>
          <div className="admin-head-actions">
            {session && (
              <button className="admin-ghost" onClick={() => supabase.auth.signOut()}>
                Log out
              </button>
            )}
            <button className="admin-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        {!supabase ? <NotConfigured /> : !ready ? <p className="admin-muted">Loading…</p> : session ? <Manager /> : <Login />}
      </motion.div>
    </motion.div>
  )
}

/* ───────────────── setup hint ───────────────── */
function NotConfigured() {
  return (
    <div className="admin-body">
      <p className="admin-alert">Photo upload is not connected yet.</p>
      <ol className="admin-steps">
        <li>Create a free project at supabase.com.</li>
        <li>SQL Editor → paste <code>supabase/setup.sql</code> → Run.</li>
        <li>Authentication → Users → Add user (Vipin's email + password).</li>
        <li>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in Vercel → Settings → Environment Variables, then redeploy.
        </li>
      </ol>
    </div>
  )
}

/* ───────────────── login ───────────────── */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setErr(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message)
  }

  return (
    <form className="admin-body admin-login" onSubmit={submit}>
      <p className="admin-muted">Log in to add or remove gallery photos.</p>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      </label>
      <AnimatePresence>
        {err && (
          <motion.p className="admin-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {err}
          </motion.p>
        )}
      </AnimatePresence>
      <button className="admin-primary" disabled={busy}>
        {busy ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  )
}

/* ───────────────── upload + manage ───────────────── */
function Manager() {
  const photos = useUploaded()
  const [queue, setQueue] = useState([]) // { id, file, preview, caption, status, note }
  const [drag, setDrag] = useState(false)
  const [running, setRunning] = useState(false)
  const input = useRef(null)

  useEffect(() => {
    refreshUploaded()
  }, [])

  const addFiles = useCallback((files) => {
    const imgs = [...files].filter((f) => f.type.startsWith('image/'))
    setQueue((q) => [
      ...q,
      ...imgs.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
        caption: '',
        status: 'ready',
        note: kb(file.size),
      })),
    ])
  }, [])

  const patch = (id, p) => setQueue((q) => q.map((it) => (it.id === id ? { ...it, ...p } : it)))
  const remove = (id) =>
    setQueue((q) => {
      const it = q.find((x) => x.id === id)
      if (it) URL.revokeObjectURL(it.preview)
      return q.filter((x) => x.id !== id)
    })

  const uploadAll = async () => {
    setRunning(true)
    for (const it of queue.filter((x) => x.status === 'ready' || x.status === 'error')) {
      try {
        patch(it.id, { status: 'working', note: 'Compressing…' })
        const { blob, w, h } = await compress(it.file)
        patch(it.id, { note: `Uploading ${kb(blob.size)}…` })
        const path = `${new Date().toISOString().slice(0, 10)}/${it.id}.jpg`
        const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
        if (up.error) throw up.error
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        const ins = await supabase.from('gallery_photos').insert({ path, url: data.publicUrl, caption: it.caption.trim(), width: w, height: h })
        if (ins.error) {
          await supabase.storage.from(BUCKET).remove([path])
          throw ins.error
        }
        patch(it.id, { status: 'done', note: 'Added to gallery ✓' })
      } catch (e) {
        patch(it.id, { status: 'error', note: e.message || 'Upload failed' })
      }
    }
    await refreshUploaded()
    setRunning(false)
    // clear finished items after a moment
    setTimeout(() => setQueue((q) => q.filter((x) => x.status !== 'done')), 1800)
  }

  const del = async (p) => {
    if (!window.confirm('Remove this photo from the gallery?')) return
    await supabase.storage.from(BUCKET).remove([p.path])
    const { error } = await supabase.from('gallery_photos').delete().eq('id', p.id)
    if (error) window.alert(error.message)
    refreshUploaded()
  }

  const saveCaption = async (p, caption) => {
    if (caption === p.caption) return
    const { error } = await supabase.from('gallery_photos').update({ caption }).eq('id', p.id)
    if (error) window.alert(error.message)
    refreshUploaded()
  }

  const pending = queue.filter((x) => x.status === 'ready' || x.status === 'error').length

  return (
    <div className="admin-body">
      {/* drop zone */}
      <div
        className={`admin-drop ${drag ? 'drag' : ''}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          addFiles(e.dataTransfer.files)
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      >
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        <motion.span className="admin-drop-icon" animate={{ y: drag ? -6 : 0 }}>
          ⬆
        </motion.span>
        <b>Tap to choose photos</b>
        <small>or drag &amp; drop · JPG / PNG / WEBP · big photos are shrunk automatically</small>
      </div>

      {/* queue */}
      <AnimatePresence>
        {queue.length > 0 && (
          <motion.div className="admin-queue" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {queue.map((it) => (
              <motion.div key={it.id} layout className={`admin-item ${it.status}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <img src={it.preview} alt="" />
                <div className="admin-item-main">
                  <input
                    placeholder="Caption (optional)"
                    value={it.caption}
                    onChange={(e) => patch(it.id, { caption: e.target.value })}
                    disabled={it.status === 'working' || it.status === 'done'}
                    maxLength={120}
                  />
                  <small>{it.note}</small>
                </div>
                {(it.status === 'ready' || it.status === 'error') && !running && (
                  <button className="admin-x" onClick={() => remove(it.id)} aria-label="Remove">
                    ✕
                  </button>
                )}
              </motion.div>
            ))}
            <button className="admin-primary" onClick={uploadAll} disabled={running || !pending}>
              {running ? 'Uploading…' : `Upload ${pending} photo${pending === 1 ? '' : 's'}`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* uploaded */}
      <h3 className="admin-sub">
        Uploaded photos <span>{photos.length}</span>
      </h3>
      {photos.length === 0 ? (
        <p className="admin-muted">No uploaded photos yet. The built-in photos are always shown in the gallery.</p>
      ) : (
        <div className="admin-grid">
          <AnimatePresence>
            {photos.map((p) => (
              <motion.figure key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <img src={p.url} alt={p.caption} loading="lazy" />
                <input defaultValue={p.caption} placeholder="Caption" onBlur={(e) => saveCaption(p, e.target.value.trim())} maxLength={120} />
                <button className="admin-del" onClick={() => del(p)} aria-label="Delete photo">
                  Delete
                </button>
              </motion.figure>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
