import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map from './components/Map'
import Legend from './components/Legend'
import SearchBar from './components/SearchBar'
import './styles/globals.css'

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false })
  const [activeLayer, setActiveLayer] = useState('dialects')
  const [zoomedIn, setZoomedIn] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRegion(null)
        setShowAbout(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchSelect = (region) => {
    setActiveLayer(region.layer)
    setZoomedIn(true)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: region.center,
        zoom: 7,
        duration: 1400,
      })
    }
  }

  const handleRegionClick = (region) => {
    setSelectedRegion(region)
    setZoomedIn(true)
  }

  const handleOverview = () => {
    setZoomedIn(false)
    setSelectedRegion(null)
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [-2.5, 54.5],
        zoom: 5,
        duration: 1400,
      })
    }
  }

  return (
    <div className="app">

      <div style={{
        position: 'fixed',
        top: '24px',
        left: '32px',
        zIndex: 999,
        pointerEvents: 'none',
      }}>
        <h1 style={{
          fontFamily: 'var(--font)',
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Linguistic Atlas
        </h1>
        <p style={{
          fontFamily: 'var(--font)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '4px',
          letterSpacing: '0.02em',
        }}>
          UK & Ireland
        </p>
      </div>

      <SearchBar onSelect={handleSearchSelect} />

      <Map
        onRegionClick={handleRegionClick}
        onTooltipChange={setTooltip}
        activeLayer={activeLayer}
        mapRef={mapRef}
      />

      <Legend
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
      />

      {/* About button */}
      <button
        onClick={() => setShowAbout(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 1000,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(13,27,42,0.92)',
          color: '#a8c4d4',
          fontSize: '14px',
          fontFamily: 'var(--font)',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ?
      </button>

      {/* About panel */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '72px',
              right: '32px',
              zIndex: 1000,
              width: '280px',
              background: 'rgba(13,27,42,0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h3 style={{
              fontFamily: 'var(--font)',
              fontSize: '15px',
              fontWeight: '700',
              color: '#e8f4fd',
              marginBottom: '10px',
            }}>
              About this project
            </h3>
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '13px',
              color: '#a8c4d4',
              lineHeight: '1.7',
              marginBottom: '12px',
            }}>
              An interactive linguistic atlas mapping dialect regions, indigenous languages, and linguistic diversity across the UK and Ireland.
            </p>
            <p style={{
              fontFamily: 'var(--font)',
              fontSize: '13px',
              color: '#a8c4d4',
              lineHeight: '1.7',
              marginBottom: '16px',
            }}>
              Built with React, Mapbox GL JS, and D3. Data drawn from linguistic surveys, census records, and academic sources.
            </p>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '12px',
            }}>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '12px',
                color: '#5e7d90',
                lineHeight: '1.6',
              }}>
                Three layers to explore:
              </p>
              <p style={{
                fontFamily: 'var(--font)',
                fontSize: '12px',
                color: '#5e7d90',
                lineHeight: '1.8',
                marginTop: '4px',
              }}>
                🗣 <strong style={{ color: '#7b9cb0' }}>Dialect Regions</strong> — spoken variety areas<br />
                📜 <strong style={{ color: '#7b9cb0' }}>Indigenous Languages</strong> — Celtic and historic tongues<br />
                🌍 <strong style={{ color: '#7b9cb0' }}>Diversity Index</strong> — multilingual cities
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedIn && (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverview}
            style={{
              position: 'fixed',
              top: '24px',
              right: selectedRegion ? '360px' : '32px',
              zIndex: 1000,
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(13,27,42,0.92)',
              color: '#a8c4d4',
              fontSize: '13px',
              fontFamily: 'var(--font)',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'right 0.3s ease',
            }}
          >
            ← Overview
          </motion.button>
        )}
      </AnimatePresence>

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
        >
          {tooltip.text}
        </div>
      )}

      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            className="panel"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
          >
            <button
              className="panel__close"
              onClick={() => setSelectedRegion(null)}
            >
              ×
            </button>

            <h2 className="panel__name">{selectedRegion.name}</h2>
            <p className="panel__region">{selectedRegion.region}</p>

            {selectedRegion.speakers && (
              <div className="panel__stat">
                <span className="panel__stat-label">Speakers</span>
                <span className="panel__stat-value">
                  {parseInt(selectedRegion.speakers).toLocaleString()}
                </span>
              </div>
            )}

            {selectedRegion.languages && (
              <div className="panel__stat">
                <span className="panel__stat-label">Languages spoken</span>
                <span className="panel__stat-value">{selectedRegion.languages}</span>
              </div>
            )}

            {selectedRegion.diversity_score && (
              <div className="panel__stat">
                <span className="panel__stat-label">Diversity score</span>
                <span className="panel__stat-value">{selectedRegion.diversity_score}/100</span>
              </div>
            )}

            {selectedRegion.status && (
              <span className={`panel__status ${selectedRegion.status === 'Critically Endangered' ? 'panel__status--critical' : ''}`}>
                {selectedRegion.status}
              </span>
            )}

            <p className="panel__fact">{selectedRegion.fact}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default App