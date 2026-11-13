import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null until the two env vars are set — the site then just shows the built-in photos
export const supabase = url && key ? createClient(url, key) : null
export const BUCKET = 'gallery'
