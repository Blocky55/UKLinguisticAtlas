// Single source of truth for the three map layers.
//
// Anything that needs a region name, palette colour, geographic centre,
// layer label, or summary total should import from this file — so the
// map, legend, search bar, sidebar, and About modal cannot drift apart.
//
// Layer geometry lives in /public/data/*.geojson; characteristic words
// live in ./phrases.js.

// ── Per-region palette ─────────────────────────────────────────────
// These hex values are mirrored in styles/globals.css for the legend.

export const DIALECTS = [
  { name: 'Mancunian',     color: '#2c6e7a', center: [-2.24, 53.48] },
  { name: 'Scouse',        color: '#c89b3c', center: [-2.98, 53.41] },
  { name: 'Welsh English', color: '#a23a3a', center: [-3.80, 52.40] },
  { name: 'Cockney',       color: '#6a4d80', center: [-0.12, 51.51] },
  { name: 'Geordie',       color: '#c4622d', center: [-1.61, 54.97] },
]

export const LANGUAGES = [
  { name: 'Welsh',           color: '#2e7d8f', center: [-3.80, 52.40] },
  { name: 'Scottish Gaelic', color: '#4a6fa0', center: [-6.00, 57.50] },
  { name: 'Irish',           color: '#5d8a64', center: [-8.00, 53.00] },
  { name: 'Scots',           color: '#6b9c70', center: [-3.50, 56.00] },
  { name: 'Cornish',         color: '#b8943a', center: [-5.00, 50.30] },
]

// Diversity is a graduated scale rather than a categorical palette.
// Cities are tagged with their band so the search swatch matches the
// circle colour on the map without re-reading the GeoJSON.
export const DIVERSITY_BANDS = {
  low:  '#a9c6d8',
  mid:  '#d9a05b',
  high: '#a23a3a',
}

export const CITIES = [
  { name: 'London',     band: 'high', center: [-0.12, 51.51] },
  { name: 'Birmingham', band: 'mid',  center: [-1.89, 52.49] },
  { name: 'Manchester', band: 'mid',  center: [-2.24, 53.48] },
  { name: 'Leeds',      band: 'mid',  center: [-1.55, 53.80] },
  { name: 'Bristol',    band: 'mid',  center: [-2.59, 51.45] },
  { name: 'Glasgow',    band: 'low',  center: [-4.25, 55.86] },
  { name: 'Cardiff',    band: 'low',  center: [-3.18, 51.48] },
  { name: 'Belfast',    band: 'low',  center: [-5.93, 54.60] },
]

// ── Layer config ───────────────────────────────────────────────────
// `displayLabel` is the singular form used in the sidebar header chip;
// `label` is the plural label used by the legend tabs and search.

export const LAYERS = [
  {
    id: 'dialects',
    label: 'Dialects',
    displayLabel: 'Dialect',
    iconName: 'quote',
    title: 'Dialect Regions',
    desc: 'Spoken varieties of English. Hover or tap a region to see characteristic phrases.',
    items: DIALECTS,
    accent: '#a23a3a',
  },
  {
    id: 'languages',
    label: 'Languages',
    displayLabel: 'Language',
    iconName: 'languages',
    title: 'Indigenous Languages',
    desc: 'Celtic and historic languages of the British Isles, including UNESCO-classified endangered tongues.',
    items: LANGUAGES,
    accent: '#2e7d8f',
  },
  {
    id: 'diversity',
    label: 'Diversity',
    displayLabel: 'City',
    iconName: 'globe',
    title: 'Linguistic Diversity',
    desc: 'Number of languages spoken in major cities, scaled 0–100 by community count.',
    items: null,
    accent: '#b07a2c',
  },
]

// ── Derived lookups ────────────────────────────────────────────────

const cityColor = (band) => DIVERSITY_BANDS[band]

export const ALL_REGIONS = [
  ...DIALECTS.map(d => ({ name: d.name, layer: 'dialects',  center: d.center, color: d.color })),
  ...LANGUAGES.map(l => ({ name: l.name, layer: 'languages', center: l.center, color: l.color })),
  ...CITIES.map(c => ({ name: c.name, layer: 'diversity', center: c.center, color: cityColor(c.band) })),
].sort((a, b) => a.name.localeCompare(b.name))

export const COLOR_BY_NAME = Object.fromEntries(
  [...DIALECTS, ...LANGUAGES].map(r => [r.name, r.color])
)

export const TOTALS = {
  dialects: DIALECTS.length,
  languages: LANGUAGES.length,
  cities: CITIES.length,
}

// ── Mapbox style expressions ───────────────────────────────────────
// Build a `match` expression once and reuse it for fill and outline
// paints so per-feature colours never drift between the two layers.

const matchExpression = (items, fallback = '#8a857e') => [
  'match', ['get', 'name'],
  ...items.flatMap(i => [i.name, i.color]),
  fallback,
]

export const DIALECT_COLORS  = matchExpression(DIALECTS)
export const LANGUAGE_COLORS = matchExpression(LANGUAGES)
