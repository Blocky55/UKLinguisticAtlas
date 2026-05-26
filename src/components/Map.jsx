import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { DIALECT_COLORS, LANGUAGE_COLORS, DIVERSITY_BANDS } from '../data/regions'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const Map = ({
  onRegionClick,
  onTooltipChange,
  activeLayer,
  stacked,
  mapRef,
  sidebarOpen,
  isMobile,
}) => {
  const container = useRef(null)
  const map = useRef(null)
  const hoveredId = useRef({ source: null, id: null })
  const loaded = useRef(false)
  const sidebarOpenRef = useRef(sidebarOpen)
  const isMobileRef = useRef(isMobile)

  useEffect(() => { sidebarOpenRef.current = sidebarOpen }, [sidebarOpen])
  useEffect(() => { isMobileRef.current = isMobile }, [isMobile])

  useEffect(() => {
    if (map.current) return
    if (!container.current) return

    const m = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-3.5, 54.6],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
    })

    m.addControl(new mapboxgl.AttributionControl({ compact: true }), 'top-right')

    m.on('load', () => {
      loaded.current = true

      // Soften the map style — desaturate water and labels for editorial feel
      try {
        if (m.getLayer('water')) {
          m.setPaintProperty('water', 'fill-color', '#e6e1d4')
        }
      } catch {
        // Style layer not present on this Mapbox style — safe to ignore.
      }

      // ── Dialects ──
      m.addSource('dialects', {
        type: 'geojson',
        data: '/data/dialects.geojson',
        generateId: true,
      })

      m.addLayer({
        id: 'dialects-fill',
        type: 'fill',
        source: 'dialects',
        paint: {
          'fill-color': DIALECT_COLORS,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.72,
            0.50,
          ],
        },
      })

      m.addLayer({
        id: 'dialects-outline',
        type: 'line',
        source: 'dialects',
        paint: {
          'line-color': DIALECT_COLORS,
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 2.2, 1.2,
          ],
          'line-opacity': 0.85,
        },
      })

      // ── Languages ──
      m.addSource('languages', {
        type: 'geojson',
        data: '/data/languages.geojson',
        generateId: true,
      })

      m.addLayer({
        id: 'languages-fill',
        type: 'fill',
        source: 'languages',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': LANGUAGE_COLORS,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.65,
            0.42,
          ],
        },
      })

      m.addLayer({
        id: 'languages-outline',
        type: 'line',
        source: 'languages',
        layout: { visibility: 'none' },
        paint: {
          'line-color': LANGUAGE_COLORS,
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], 2, 1.0,
          ],
          'line-opacity': 0.75,
        },
      })

      // ── Diversity ──
      m.addSource('diversity', {
        type: 'geojson',
        data: '/data/diversity.geojson',
        generateId: true,
      })

      m.addLayer({
        id: 'diversity-circles',
        type: 'circle',
        source: 'diversity',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['get', 'diversity_score'],
            28, 10,
            95, 34,
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'diversity_score'],
            28, DIVERSITY_BANDS.low,
            60, DIVERSITY_BANDS.mid,
            95, DIVERSITY_BANDS.high,
          ],
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.92, 0.78,
          ],
          'circle-stroke-color': '#1a1817',
          'circle-stroke-width': 1.2,
          'circle-stroke-opacity': 0.55,
        },
      })

      m.addLayer({
        id: 'diversity-labels',
        type: 'symbol',
        source: 'diversity',
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.9],
          'text-anchor': 'top',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-letter-spacing': 0.04,
        },
        paint: {
          'text-color': '#1a1817',
          'text-halo-color': '#f8f5ee',
          'text-halo-width': 1.4,
        },
      })

      // ── Hover helpers ──
      const setHover = (source, id, state) => {
        if (id == null) return
        m.setFeatureState({ source, id }, { hover: state })
      }

      const wireHover = (layerId, source, getText) => {
        m.on('mousemove', layerId, (e) => {
          if (!e.features.length) return
          if (hoveredId.current.id !== null) {
            setHover(hoveredId.current.source, hoveredId.current.id, false)
          }
          hoveredId.current = { source, id: e.features[0].id }
          setHover(source, e.features[0].id, true)
          m.getCanvas().style.cursor = 'pointer'
          if (!isMobileRef.current) {
            onTooltipChange({
              visible: true,
              x: e.point.x,
              y: e.point.y,
              text: getText(e.features[0].properties),
            })
          }
        })

        m.on('mouseleave', layerId, () => {
          if (hoveredId.current.id !== null) {
            setHover(hoveredId.current.source, hoveredId.current.id, false)
          }
          hoveredId.current = { source: null, id: null }
          m.getCanvas().style.cursor = ''
          onTooltipChange({ visible: false })
        })
      }

      wireHover('dialects-fill',     'dialects',  (p) => p.name)
      wireHover('languages-fill',    'languages', (p) => p.name)
      wireHover('diversity-circles', 'diversity', (p) => `${p.name} — ${p.languages}+ languages`)

      // ── Click ──
      const computePadding = () => {
        const open = sidebarOpenRef.current
        const mobile = isMobileRef.current
        if (mobile) {
          return open
            ? { top: 60, right: 20, bottom: window.innerHeight * 0.72 + 30, left: 20 }
            : { top: 80, right: 20, bottom: 120, left: 20 }
        }
        return open
          ? { top: 80, right: 380 + 40, bottom: 80, left: 60 }
          : { top: 80, right: 60, bottom: 80, left: 60 }
      }

      const computeOffset = () => {
        if (isMobileRef.current) {
          return sidebarOpenRef.current ? [0, -window.innerHeight * 0.18] : [0, 0]
        }
        return sidebarOpenRef.current ? [-190, 0] : [0, 0]
      }

      const featureBounds = (feature) => {
        const bounds = new mapboxgl.LngLatBounds()
        const addCoords = (coords) => {
          if (typeof coords[0] === 'number') {
            bounds.extend(coords)
          } else {
            coords.forEach(addCoords)
          }
        }
        addCoords(feature.geometry.coordinates)
        return bounds
      }

      const handleClick = (e) => {
        if (!e.features.length) return
        const feat = e.features[0]
        const props = feat.properties
        const layer = feat.layer.id.startsWith('dialects')
          ? 'dialects'
          : feat.layer.id.startsWith('languages')
            ? 'languages'
            : 'diversity'

        onRegionClick({
          name: props.name,
          region: props.region,
          speakers: props.speakers || null,
          languages: props.languages || null,
          diversity_score: props.diversity_score || null,
          fact: props.fact,
          status: props.status || null,
          layer,
          center: feat.geometry.type === 'Point'
            ? feat.geometry.coordinates
            : [e.lngLat.lng, e.lngLat.lat],
        })

        // Wait one tick for the sidebar to mount before fitting bounds.
        setTimeout(() => {
          if (feat.geometry.type === 'Point') {
            m.flyTo({
              center: feat.geometry.coordinates,
              zoom: 8,
              duration: 1100,
              offset: computeOffset(),
              essential: true,
            })
          } else {
            const b = featureBounds(feat)
            m.fitBounds(b, {
              padding: computePadding(),
              duration: 1100,
              maxZoom: 9,
              essential: true,
            })
          }
        }, 50)
      }

      m.on('click', 'dialects-fill', handleClick)
      m.on('click', 'languages-fill', handleClick)
      m.on('click', 'diversity-circles', handleClick)
    })

    map.current = m
    if (mapRef) mapRef.current = m
    if (typeof window !== 'undefined' && import.meta.env.DEV) window.__atlas_map = m

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // ── Layer switching ──
  useEffect(() => {
    if (!loaded.current || !map.current) return
    const all = [
      'dialects-fill', 'dialects-outline',
      'languages-fill', 'languages-outline',
      'diversity-circles', 'diversity-labels',
    ]

    if (stacked) {
      all.forEach(l => map.current.setLayoutProperty(l, 'visibility', 'visible'))
      // Lighter fills when stacked so layers don't muddy
      map.current.setPaintProperty('dialects-fill', 'fill-opacity', [
        'case', ['boolean', ['feature-state', 'hover'], false], 0.55, 0.32,
      ])
      map.current.setPaintProperty('languages-fill', 'fill-opacity', [
        'case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0.28,
      ])
      return
    }

    all.forEach(l => map.current.setLayoutProperty(l, 'visibility', 'none'))

    // Restore default fill opacities
    map.current.setPaintProperty('dialects-fill', 'fill-opacity', [
      'case', ['boolean', ['feature-state', 'hover'], false], 0.72, 0.50,
    ])
    map.current.setPaintProperty('languages-fill', 'fill-opacity', [
      'case', ['boolean', ['feature-state', 'hover'], false], 0.65, 0.42,
    ])

    if (activeLayer === 'dialects') {
      map.current.setLayoutProperty('dialects-fill', 'visibility', 'visible')
      map.current.setLayoutProperty('dialects-outline', 'visibility', 'visible')
    } else if (activeLayer === 'languages') {
      map.current.setLayoutProperty('languages-fill', 'visibility', 'visible')
      map.current.setLayoutProperty('languages-outline', 'visibility', 'visible')
    } else if (activeLayer === 'diversity') {
      map.current.setLayoutProperty('diversity-circles', 'visibility', 'visible')
      map.current.setLayoutProperty('diversity-labels', 'visibility', 'visible')
    }
  }, [activeLayer, stacked])

  return <div className="map-host"><div ref={container} /></div>
}

export default Map
