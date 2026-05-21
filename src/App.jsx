import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map from './components/Map'
import Legend from './components/Legend'
import './styles/globals.css'

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false })
  const [activeLayer, setActiveLayer] = useState('dialects')

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

      <Map
        onRegionClick={setSelectedRegion}
        onTooltipChange={setTooltip}
        activeLayer={activeLayer}
      />

      <Legend
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
      />

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