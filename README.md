# The Linguistic Atlas

An interactive cartographic survey of the languages and dialects spoken across the
United Kingdom and Ireland — from the regional varieties of English to the
Celtic tongues and the rising linguistic diversity of the postwar city.

The atlas presents three layers on a single Mapbox base map:

- **Dialects** — five regional varieties of English (Mancunian, Scouse, Welsh
  English, Cockney, Geordie) drawn as approximate areal polygons.
- **Languages** — five indigenous and minoritised languages of the British Isles
  (Welsh, Scottish Gaelic, Irish, Scots, Cornish) with their historic strongholds.
- **Diversity** — graduated circles over eight major cities scaled by the number
  of community languages spoken (London through Belfast).

Each region opens a side panel with characteristic words, speaker counts, and a
short editorial note. Words can be played back through the browser's Web Speech
API where a matching voice is available.

## Running locally

The project is a standard [Vite](https://vite.dev) + React 19 single-page app.

```bash
npm install
cp .env.example .env   # then paste a real Mapbox token into .env
npm run dev
```

The dev server runs at `http://localhost:5173`. For a production build:

```bash
npm run build
npm run preview
```

## Environment variables

| Variable             | Required | Notes                                                                              |
| -------------------- | -------- | ---------------------------------------------------------------------------------- |
| `VITE_MAPBOX_TOKEN`  | yes      | A public Mapbox access token. Get one at <https://account.mapbox.com/access-tokens/>. |

See [`.env.example`](.env.example) for the expected shape.

## Data sources

GeoJSON for the three layers lives under [`public/data/`](public/data) and is
loaded at runtime by the map:

- `dialects.geojson` — approximated areas of use for the five featured English
  dialects. Boundaries reflect the broad continua described in the literature
  rather than administrative borders.
- `languages.geojson` — historic ranges of the five Celtic and Scots tongues.
- `diversity.geojson` — points for eight cities with a `diversity_score`
  (0–100) and a count of community languages.

Characteristic words, native-script language names, and the bibliography shown
in the *About* modal are defined in [`src/data/phrases.js`](src/data/phrases.js).
The names, centres, and palette colours used by the map, legend, search, and
sidebar are co-located in [`src/data/regions.js`](src/data/regions.js) so they
stay in sync.

Primary sources credited in the app and informing the underlying figures:

- Orton, H. & Dieth, E. (1962–71) *Survey of English Dialects*, University of Leeds
- Wells, J. C. (1982) *Accents of English*, Cambridge University Press
- ONS / NRS / NISRA Census 2021 — language and country-of-birth tabulations
- UNESCO *Atlas of the World's Languages in Danger*
- Welsh Government *Welsh Language Use Survey*
- Bòrd na Gàidhlig — *National Gaelic Language Plan*
- British Library Sound Archive — *Voices of the UK*

## Known limitations

- Dialect and language polygons are illustrative outlines, not authoritative
  isoglosses. The Survey of English Dialects uses point fieldwork rather than
  drawn regions.
- Characteristic words are short illustrative selections; they are not lexicons
  and do not aim to capture the full range of any variety.
- Diversity scores collapse a complex demographic picture into a single 0–100
  scale. They are useful as a comparative summary, not as a substitute for the
  underlying census tables.
- Pronunciations play through whichever voices the user's browser has installed.
  Coverage for Welsh, Scottish Gaelic, Irish, and Cornish varies widely; the
  app falls back to `en-GB` rather than failing silently.
- The map currently targets desktop and tablet; mobile layout is supported but
  the panels are tuned for ≥ 720 px viewports.

## Tech stack

React 19, Vite, [mapbox-gl](https://docs.mapbox.com/mapbox-gl-js/), and
[framer-motion](https://www.framer.com/motion/) for transitions. Lint is plain
`eslint` with the React Hooks and Refresh plugins (`npm run lint`).

## Licence

No licence has been declared. Treat the source as all-rights-reserved unless and
until one is added.
