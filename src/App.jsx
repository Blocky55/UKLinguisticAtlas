import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map from './components/Map'
import Legend from './components/Legend'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import Icon from './components/Icons'
import { AboutModal, ShortcutsModal } from './components/Modal'
import { TOTALS } from './data/regions'
import './styles/globals.css'

const OVERVIEW = { center: [-3.5, 54.6], zoom: 5 }
const MOBILE_BP = 720

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false })
  const [activeLayer, setActiveLayer] = useState('dialects')
  const [stacked, setStacked] = useState(false)
  const [zoomedIn, setZoomedIn] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('la_bookmarks') || '[]')
    } catch { return [] }
  })
  const [toast, setToast] = useState(null)
  const [showHint, setShowHint] = useState(() => !localStorage.getItem('la_hint_dismissed'))

  const mapRef = useRef(null)
  const focusSearchRef = useRef(null)
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BP}px)`)

  // ── URL hash for deep-linking ─────────────────────────────
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
    if (!hash) return
    // Format: name|layer
    const [name, layer] = hash.split('|')
    if (!name) return
    // We'll wire actual region data after map loads; here we just set the layer
    if (['dialects', 'languages', 'diversity'].includes(layer)) {
      setActiveLayer(layer)
    }
  }, [])

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Don't fire shortcuts while typing in an input
      const tag = (e.target.tagName || '').toLowerCase()
      const inField = tag === 'input' || tag === 'textarea'

      if (e.key === 'Escape') {
        if (showShortcuts) return setShowShortcuts(false)
        if (showAbout) return setShowAbout(false)
        if (selectedRegion) return setSelectedRegion(null)
      }

      if (inField) return

      if (e.key === '/') {
        e.preventDefault()
        focusSearchRef.current?.()
      } else if (e.key === '?') {
        e.preventDefault()
        setShowShortcuts(s => !s)
      } else if (e.key === '1') {
        setActiveLayer('dialects'); setStacked(false)
      } else if (e.key === '2') {
        setActiveLayer('languages'); setStacked(false)
      } else if (e.key === '3') {
        setActiveLayer('diversity'); setStacked(false)
      } else if (e.key === 's' || e.key === 'S') {
        setStacked(v => !v)
      } else if (e.key === 'o' || e.key === 'O') {
        handleOverview()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showShortcuts, showAbout, selectedRegion])

  const handleSearchSelect = (region) => {
    setActiveLayer(region.layer)
    setStacked(false)
    setZoomedIn(true)
    if (mapRef.current) {
      const offset = !isMobile && selectedRegion ? [-190, 0] : (isMobile && selectedRegion ? [0, -window.innerHeight * 0.36] : [0, 0])
      mapRef.current.flyTo({
        center: region.center,
        zoom: 7,
        duration: 1300,
        offset,
        essential: true,
      })
    }
  }

  const handleRegionClick = (region) => {
    setSelectedRegion(region)
    setZoomedIn(true)
    window.history.replaceState(null, '', `#${encodeURIComponent(region.name)}|${region.layer}`)
  }

  const handleOverview = useCallback(() => {
    setZoomedIn(false)
    setSelectedRegion(null)
    window.history.replaceState(null, '', window.location.pathname)
    if (mapRef.current) {
      mapRef.current.flyTo({
        ...OVERVIEW,
        duration: 1300,
        offset: [0, 0],
        essential: true,
      })
    }
  }, [])

  const handleCloseSidebar = () => {
    setSelectedRegion(null)
    window.history.replaceState(null, '', window.location.pathname)
  }

  const handleShareLink = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {})
    }
  }

  const handleBookmark = () => {
    if (!selectedRegion) return
    const key = `${selectedRegion.name}|${selectedRegion.layer}`
    setBookmarks(prev => {
      const next = prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
      localStorage.setItem('la_bookmarks', JSON.stringify(next))
      setToast(prev.includes(key) ? 'Removed from saved' : 'Saved to your atlas')
      setTimeout(() => setToast(null), 1800)
      return next
    })
  }

  const dismissHint = () => {
    setShowHint(false)
    localStorage.setItem('la_hint_dismissed', '1')
  }

  const bookmarkKey = selectedRegion ? `${selectedRegion.name}|${selectedRegion.layer}` : null
  const isBookmarked = bookmarkKey ? bookmarks.includes(bookmarkKey) : false

  return (
    <div className="app">
      {/* Masthead */}
      <div className="masthead">
        <div className="masthead__kicker">A Cartographic Survey</div>
        <h1 className="masthead__title">
          The Linguistic <em>Atlas</em>
        </h1>
        <div className="masthead__sub">United Kingdom &amp; Ireland</div>
        <div className="masthead__rule" />
      </div>

      <SearchBar
        onSelect={handleSearchSelect}
        registerFocus={(fn) => { focusSearchRef.current = fn }}
      />

      <div className="map-host">
        <Map
          onRegionClick={handleRegionClick}
          onTooltipChange={setTooltip}
          activeLayer={activeLayer}
          stacked={stacked}
          mapRef={mapRef}
          sidebarOpen={!!selectedRegion}
          isMobile={isMobile}
        />
      </div>

      {/* Top-right controls */}
      <div className="controls">
        <AnimatePresence>
          {zoomedIn && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              onClick={handleOverview}
              className="overview-btn"
              aria-label="Return to overview"
            >
              <Icon name="arrowLeft" size={14} />
              Overview
            </motion.button>
          )}
        </AnimatePresence>
        {!isMobile && (
          <button
            className="icon-btn"
            onClick={() => setShowShortcuts(true)}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts ( ? )"
          >
            <Icon name="keyboard" size={16} />
          </button>
        )}
        <button
          className="icon-btn"
          onClick={() => setShowAbout(true)}
          aria-label="About and sources"
          title="About & sources"
        >
          <Icon name="book" size={16} />
        </button>
      </div>

      <Legend
        activeLayer={activeLayer}
        onLayerChange={(l) => { setActiveLayer(l); setStacked(false) }}
        stacked={stacked}
        onStackedChange={setStacked}
      />

      {/* Stats strip (desktop only) */}
      <div className="stats" aria-label="At-a-glance totals">
        <div className="stats__cell">
          <div className="stats__num">{TOTALS.dialects}</div>
          <div className="stats__lbl">Dialects</div>
        </div>
        <div className="stats__cell">
          <div className="stats__num">{TOTALS.languages}</div>
          <div className="stats__lbl">Languages</div>
        </div>
        <div className="stats__cell">
          <div className="stats__num">{TOTALS.cities}</div>
          <div className="stats__lbl">Cities</div>
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip.visible && !isMobile && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y - 30 }}
        >
          {tooltip.text}
        </div>
      )}

      {/* First-time hint */}
      <AnimatePresence>
        {showHint && !selectedRegion && !showAbout && !showShortcuts && (
          <motion.div
            className="hint"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, delay: 0.4 }}
            role="status"
          >
            Click a region to read its phrases —
            <span style={{ opacity: 0.7 }}>press</span>
            <span className="kbd" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--paper)' }}>?</span>
            <span style={{ opacity: 0.7 }}>for shortcuts</span>
            <button className="hint__close" onClick={dismissHint} aria-label="Dismiss">
              <Icon name="close" size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {selectedRegion && (
          <Sidebar
            region={selectedRegion}
            onClose={handleCloseSidebar}
            onShare={handleShareLink}
            onBookmark={handleBookmark}
            isBookmarked={isBookmarked}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showAbout && <AboutModal totals={TOTALS} onClose={() => setShowAbout(false)} />}
        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Icon name="check" size={13} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
