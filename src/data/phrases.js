// Characteristic words and phrases for each region.
// `lang` is a BCP-47 tag used by the Web Speech API for pronunciation.
// `note` (optional) explains usage context.

export const PHRASES = {
  // ── Dialects ────────────────────────────────────────────────
  'Mancunian': {
    lang: 'en-GB',
    items: [
      { word: 'mint',       meaning: 'excellent; very good' },
      { word: 'mither',     meaning: 'to bother or pester someone' },
      { word: 'our kid',    meaning: 'sibling — also used affectionately for close friends' },
      { word: 'dead good',  meaning: 'really good (intensifier)' },
      { word: 'sound',      meaning: 'fine; agreed; reliable' },
    ],
  },
  'Scouse': {
    lang: 'en-GB',
    items: [
      { word: 'made up',    meaning: 'very pleased or happy' },
      { word: 'la',         meaning: 'lad — used to address a friend' },
      { word: 'boss',       meaning: 'great; impressive' },
      { word: 'gob',        meaning: 'mouth (also: to talk loudly)' },
      { word: 'gerrof',     meaning: '"get off" — leave me alone' },
    ],
  },
  'Welsh English': {
    lang: 'en-GB',
    items: [
      { word: 'cwtch',      meaning: 'a cuddle or a cosy nook (from Welsh)' },
      { word: 'tidy',       meaning: 'good; satisfactory; an all-purpose positive' },
      { word: 'lush',       meaning: 'lovely; beautiful; delicious' },
      { word: 'butt',       meaning: 'mate; friend' },
      { word: 'now in a minute', meaning: 'shortly — but not literally now' },
    ],
  },
  'Cockney': {
    lang: 'en-GB',
    items: [
      { word: 'gov’nor',     meaning: 'boss; sir; a person of authority' },
      { word: 'apples and pears', meaning: 'stairs (rhyming slang)' },
      { word: 'dog and bone',     meaning: 'telephone (rhyming slang)' },
      { word: 'plates of meat',   meaning: 'feet (rhyming slang)' },
      { word: 'porkies',          meaning: 'lies — from "pork pies" (rhyming slang)' },
    ],
  },
  'Geordie': {
    lang: 'en-GB',
    items: [
      { word: 'canny',      meaning: 'good; pleasant; quite (a positive marker)' },
      { word: 'howay',      meaning: 'come on; let’s go' },
      { word: 'pet',        meaning: 'a term of endearment for anyone' },
      { word: 'bairn',      meaning: 'child' },
      { word: 'gan',        meaning: 'to go' },
    ],
  },

  // ── Indigenous languages ────────────────────────────────────
  'Welsh': {
    lang: 'cy',
    name_native: 'Cymraeg',
    items: [
      { word: 'hiraeth',    meaning: 'a deep longing for home, often untranslatable' },
      { word: 'cynefin',    meaning: 'one’s habitat, a sense of place and belonging' },
      { word: 'paned',      meaning: 'a cup of tea' },
      { word: 'shwmae',     meaning: 'hello (informal, southern)' },
      { word: 'diolch',     meaning: 'thank you' },
    ],
  },
  'Scottish Gaelic': {
    lang: 'gd',
    name_native: 'Gàidhlig',
    items: [
      { word: 'sgrìob',  meaning: 'the tingle on the upper lip before sipping whisky' },
      { word: 'càirdeas', meaning: 'kinship; friendship' },
      { word: 'ceilidh',     meaning: 'a social gathering with music and dance' },
      { word: 'slàinte', meaning: 'health — said as a toast' },
      { word: 'failte',      meaning: 'welcome' },
    ],
  },
  'Irish': {
    lang: 'ga',
    name_native: 'Gaeilge',
    items: [
      { word: 'craic',       meaning: 'fun; entertainment; news (“what’s the craic?”)' },
      { word: 'fáilte', meaning: 'welcome' },
      { word: 'sláinte', meaning: 'health — a toast' },
      { word: 'grá',         meaning: 'love' },
      { word: 'go raibh maith agat', meaning: 'thank you (lit. "may you have good")' },
    ],
  },
  'Scots': {
    lang: 'en-GB',
    items: [
      { word: 'dreich',      meaning: 'dreary, bleak weather — grey and damp' },
      { word: 'glaikit',     meaning: 'foolish-looking; dazed' },
      { word: 'haver',       meaning: 'to talk nonsense; to dither' },
      { word: 'wheesht',     meaning: 'hush; be quiet' },
      { word: 'bonnie',      meaning: 'pretty; beautiful' },
    ],
  },
  'Cornish': {
    lang: 'kw',
    name_native: 'Kernewek',
    items: [
      { word: 'meur ras',    meaning: 'thank you very much' },
      { word: 'kerensa',     meaning: 'love' },
      { word: 'gwary',       meaning: 'play; theatrical performance' },
      { word: 'dydh da',     meaning: 'good day; hello' },
      { word: 'kernow',      meaning: 'Cornwall' },
    ],
  },
}

// City entries (diversity layer) — top spoken languages by community,
// approximated from ONS 2021 census categories and academic surveys.
export const CITY_LANGUAGES = {
  'London':     ['English', 'Polish', 'Romanian', 'Bengali', 'Urdu', 'Punjabi', 'Spanish', 'Arabic', 'Turkish', 'Portuguese'],
  'Birmingham': ['English', 'Urdu', 'Punjabi', 'Bengali', 'Polish', 'Arabic', 'Romanian'],
  'Manchester': ['English', 'Urdu', 'Polish', 'Arabic', 'Chinese', 'Bengali', 'Romanian'],
  'Glasgow':    ['English', 'Polish', 'Urdu', 'Punjabi', 'Arabic', 'Scots'],
  'Cardiff':    ['English', 'Welsh', 'Polish', 'Arabic', 'Bengali'],
  'Leeds':      ['English', 'Polish', 'Urdu', 'Punjabi', 'Romanian', 'Bengali'],
  'Bristol':    ['English', 'Polish', 'Somali', 'Urdu', 'Arabic', 'Spanish'],
  'Belfast':    ['English', 'Polish', 'Lithuanian', 'Irish', 'Mandarin', 'Portuguese'],
}

// Academic sources / citations — credited in the Sources modal.
export const SOURCES = [
  {
    title: 'Survey of English Dialects',
    detail: 'Orton, H. & Dieth, E. (1962–71). Leeds: University of Leeds. The foundational fieldwork survey for traditional English dialects.',
  },
  {
    title: 'Office for National Statistics — Census 2021',
    detail: 'Language and country-of-birth tables for England, Wales, Scotland and Northern Ireland (ONS, NRS, NISRA).',
  },
  {
    title: 'UNESCO Atlas of the World’s Languages in Danger',
    detail: 'Endangered status classifications for Cornish, Scottish Gaelic, Irish, Welsh and Manx.',
  },
  {
    title: 'Welsh Government — Welsh Language Use Survey',
    detail: 'Periodic surveys of Welsh-speaker numbers, fluency and domain of use.',
  },
  {
    title: 'Bòrd na Gàidhlig — National Gaelic Language Plan',
    detail: 'Demographic data and policy framework for Scottish Gaelic.',
  },
  {
    title: 'Northern Ireland Statistics & Research Agency',
    detail: 'Data on Irish and Ulster-Scots speakers in Northern Ireland.',
  },
  {
    title: 'Wells, J. C. (1982). Accents of English.',
    detail: 'Cambridge University Press. Reference classification of British and Irish accents.',
  },
  {
    title: 'British Library — Sound Archive',
    detail: 'Voices of the UK and Survey of English Dialects audio recordings.',
  },
]
