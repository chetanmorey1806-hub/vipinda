// ─────────────────────────────────────────────────────────────
//  Links, photos and other non-translated content.
//  All page text (English / हिंदी / मराठी) lives in src/strings.js.
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  email: 'vipintatad7@gmail.com',
  instagram: 'https://www.instagram.com/vipintatad_vip',
  facebook: 'https://www.facebook.com/share/1E9UVthhK1/',
  youtube: 'https://youtube.com/@vipintatad-d5t',
  spotify: 'https://open.spotify.com/artist/5sfLrbbZqY4qsqcXIETguR',
  spotifyEmbed: 'https://open.spotify.com/embed/artist/5sfLrbbZqY4qsqcXIETguR?utm_source=generator&theme=0',
}

// section ids — labels come from strings.js (nav.*)
export const NAV = ['about', 'music', 'credits', 'press', 'gallery', 'philosophy', 'contact']

export const LANGUAGES = [
  { word: 'मराठी', label: 'Marathi' },
  { word: 'हिंदी', label: 'Hindi' },
  { word: 'English', label: 'English' },
]

export const BEYOND_ICONS = ['✎', '◉', '✂', '▣', '✦', '▶']

// press headlines stay in their original language
export const PRESS = [
  {
    outlet: 'Mumbai Mirror',
    title: "'Swachh Bharat for whom?' Student Vipin Tatad's rap video calls attention to problems faced by slum dwellers",
    url: 'https://mumbaimirror.indiatimes.com/mumbai/other/swachh-bharat-for-whom-student-vipin-tatads-rap-video-calls-attention-to-problems-faced-by-slum-dwellers/articleshow/66045890.cms',
  },
  {
    outlet: 'Round Table India',
    title: 'A Dissent to Clean India & Smart Cities — Meri Galli Ki Samasya, by Ambedkarite rapper Vipin Tatad (VIP)',
    url: 'https://roundtableindia.co.in/index.php?option=com_content&view=article&id=9477:a-dissent-to-clean-india-smart-cities-meri-galli-ki-samasya-the-problem-of-my-locality-galli-by-ambedkarite-rapper-vipin-tatad&catid=129&Itemid=195',
  },
  {
    outlet: 'Open Magazine',
    title: 'Rebel Rap — by Dipti Nagpaul',
    url: 'https://openthemagazine.com/feature/rebel-rap/',
  },
  {
    outlet: 'Indian Cultural Forum',
    title: 'The Republic Speaks — a round-up of the voices and issues raised against the CAA',
    url: 'https://archive.indianculturalforum.in/2020/01/29/the-republic-speaks/',
  },
  {
    outlet: 'लोकजागर · Lokjagar',
    title: 'विपिनच्या प्रतिभेची JNU मध्ये दखल',
    url: 'http://www.lokjagar.in/west-vidarbh/amravati-student-vipin-tatad-talent-appreciated-in-jnu-delhi-1910',
    deva: true,
  },
  {
    outlet: 'TISS, Mumbai',
    title: 'Dr. Ambedkar Memorial Lecture — performance',
    url: 'http://www.findglocal.com/IN/Mumbai/923997297683666/Dr.-Ambedkar-Memorial-Lecture---TISS%2C-Mumbai/videos/2933979933293727',
  },
  {
    outlet: 'E-Paper',
    title: 'Print feature on Vipin Tatad',
    url: 'https://www.readwhere.com/read/m5/2834726#issue/57/1',
  },
  {
    outlet: 'Scoopnest',
    title: '#SwachBharat — brilliant rap video',
    url: 'https://www.scoopnest.com/s/Vipin%20Tatad',
  },
  {
    outlet: 'Protest Rap',
    title: 'Aazadi — Jamia protest rap song',
    url: 'https://www.youtube.com/results?search_query=Vipin+Tatad+Aazadi+rap',
  },
]

// gallery photos — captions come from strings.js (gallery.caps), same order
export const GALLERY = [
  '/images/stage-red.jpg',
  '/images/mic-bw.jpg',
  '/images/crew.jpg',
  '/images/stage-nyf.jpg',
  '/images/stage-blue.jpg',
  '/images/stage-white.jpg',
  '/images/portrait-bw.jpg',
  '/images/nagsen-festival.jpg',
  '/images/crowd-clap.jpg',
]

// hero slider — captions come from strings.js (slides), same order.
// `pos` = crop focus (object-position) for each photo
export const SLIDES = [
  { src: '/images/stage-red.jpg', pos: '55% 30%' },
  { src: '/images/mic-bw.jpg', pos: '62% 40%' },
  { src: '/images/crew.jpg', pos: '50% 30%' },
  { src: '/images/stage-nyf.jpg', pos: '50% 22%' },
  { src: '/images/stage-blue.jpg', pos: '60% 35%' },
  { src: '/images/stage-white.jpg', pos: '50% 25%' },
  { src: '/images/nagsen-festival.jpg', pos: '50% 40%' },
]
