import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const Map = ({ onRegionClick, onTooltipChange, activeLayer }) => {
  const container = useRef(null)
  const map = useRef(null)
  const hoveredId = useRef(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (map.current) return
    if (!container.current) return

    const m = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-2.5, 54.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 12,
    })

    m.on('load', () => {
      loaded.current = true

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
          'fill-color': [
            'match', ['get', 'name'],
            'Mancunian',    '#38d9a9',
            'Scouse',       '#ffd43b',
            'Welsh English','#e03131',
            'Cockney',      '#7950f2',
            'Geordie',      '#f76707',
            '#888888'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8, 0.5
          ],
        },
      })

      m.addLayer({
        id: 'dialects-outline',
        type: 'line',
        source: 'dialects',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.4,
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
          'fill-color': [
            'match', ['get', 'name'],
            'Welsh',           '#4ecdc4',
            'Scottish Gaelic', '#45b7d1',
            'Irish',           '#96ceb4',
            'Scots',           '#88d8a3',
            'Cornish',         '#ffd93d',
            '#888888'
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.8, 0.5
          ],
        },
      })

      m.addLayer({
        id: 'languages-outline',
        type: 'line',
        source: 'languages',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.5,
          'line-opacity': 0.4,
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
            28, 12,
            95, 40,
          ],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'diversity_score'],
            28, '#45b7d1',
            60, '#ffd43b',
            95, '#e03131',
          ],
          'circle-opacity': 0.75,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 1.5,
        },
      })

      m.addLayer({
        id: 'diversity-labels',
        type: 'symbol',
        source: 'diversity',
        layout: {
          visibility: 'none',
          'text-field': ['get', 'name'],
          'text-size': 12,
          'text-offset': [0, 2.5],
          'text-anchor': 'top',
        },
        paint: {
          'text-color': '#e8f4fd',
          'text-halo-color': '#0d1b2a',
          'text-halo-width': 1,
        },
      })

      // ── Hover (dialects) ──
      m.on('mousemove', 'dialects-fill', (e) => {
        if (!e.features.length) return
        if (hoveredId.current !== null) {
          m.setFeatureState({ source: 'dialects', id: hoveredId.current }, { hover: false })
        }
        hoveredId.current = e.features[0].id
        m.setFeatureState({ source: 'dialects', id: hoveredId.current }, { hover: true })
        m.getCanvas().style.cursor = 'pointer'
        onTooltipChange({ visible: true, x: e.point.x, y: e.point.y, text: e.features[0].properties.name })
      })

      m.on('mouseleave', 'dialects-fill', () => {
        if (hoveredId.current !== null) {
          m.setFeatureState({ source: 'dialects', id: hoveredId.current }, { hover: false })
        }
        hoveredId.current = null
        m.getCanvas().style.cursor = ''
        onTooltipChange({ visible: false })
      })

      // ── Hover (languages) ──
      m.on('mousemove', 'languages-fill', (e) => {
        if (!e.features.length) return
        if (hoveredId.current !== null) {
          m.setFeatureState({ source: 'languages', id: hoveredId.current }, { hover: false })
        }
        hoveredId.current = e.features[0].id
        m.setFeatureState({ source: 'languages', id: hoveredId.current }, { hover: true })
        m.getCanvas().style.cursor = 'pointer'
        onTooltipChange({ visible: true, x: e.point.x, y: e.point.y, text: e.features[0].properties.name })
      })

      m.on('mouseleave', 'languages-fill', () => {
        if (hoveredId.current !== null) {
          m.setFeatureState({ source: 'languages', id: hoveredId.current }, { hover: false })
        }
        hoveredId.current = null
        m.getCanvas().style.cursor = ''
        onTooltipChange({ visible: false })
      })

      // ── Hover (diversity) ──
      m.on('mousemove', 'diversity-circles', (e) => {
        if (!e.features.length) return
        m.getCanvas().style.cursor = 'pointer'
        onTooltipChange({
          visible: true,
          x: e.point.x,
          y: e.point.y,
          text: `${e.features[0].properties.name} — ${e.features[0].properties.languages} languages`,
        })
      })

      m.on('mouseleave', 'diversity-circles', () => {
        m.getCanvas().style.cursor = ''
        onTooltipChange({ visible: false })
      })

      // ── Click ──
      const handleClick = (e) => {
        if (!e.features.length) return
        const props = e.features[0].properties
        onRegionClick({
          name: props.name,
          region: props.region,
          speakers: props.speakers || null,
          languages: props.languages || null,
          diversity_score: props.diversity_score || null,
          fact: props.fact,
          status: props.status || null,
        })
        m.flyTo({ center: [e.lngLat.lng, e.lngLat.lat], zoom: 7, duration: 1400 })
      }

      m.on('click', 'dialects-fill', handleClick)
      m.on('click', 'languages-fill', handleClick)
      m.on('click', 'diversity-circles', handleClick)
    })

    map.current = m
  }, [])

  // ── Layer switching ──
  useEffect(() => {
    if (!loaded.current) return

    const allLayers = [
      'dialects-fill', 'dialects-outline',
      'languages-fill', 'languages-outline',
      'diversity-circles', 'diversity-labels',
    ]
    allLayers.forEach(l => map.current.setLayoutProperty(l, 'visibility', 'none'))

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
  }, [activeLayer])

  return <div ref={container} style={{ width: '100%', height: '100%' }} />
}

export default Map