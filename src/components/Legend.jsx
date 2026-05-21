import { useState } from 'react'
import Icon from './Icons'

const DIALECTS = [
  { name: 'Mancunian',     color: '#2c6e7a' },
  { name: 'Scouse',        color: '#c89b3c' },
  { name: 'Welsh English', color: '#a23a3a' },
  { name: 'Cockney',       color: '#6a4d80' },
  { name: 'Geordie',       color: '#c4622d' },
]

const LANGUAGES = [
  { name: 'Welsh',           color: '#2e7d8f' },
  { name: 'Scottish Gaelic', color: '#4a6fa0' },
  { name: 'Irish',           color: '#5d8a64' },
  { name: 'Scots',           color: '#6b9c70' },
  { name: 'Cornish',         color: '#b8943a' },
]

const LAYERS = [
  {
    id: 'dialects',
    label: 'Dialects',
    iconName: 'quote',
    title: 'Dialect Regions',
    desc: 'Spoken varieties of English. Hover or tap a region to see characteristic phrases.',
    items: DIALECTS,
  },
  {
    id: 'languages',
    label: 'Languages',
    iconName: 'languages',
    title: 'Indigenous Languages',
    desc: 'Celtic and historic languages of the British Isles, including UNESCO-classified endangered tongues.',
    items: LANGUAGES,
  },
  {
    id: 'diversity',
    label: 'Diversity',
    iconName: 'globe',
    title: 'Linguistic Diversity',
    desc: 'Number of languages spoken in major cities, scaled 0–100 by community count.',
    items: null,
  },
]

const Legend = ({ activeLayer, onLayerChange, stacked, onStackedChange }) => {
  const [collapsed, setCollapsed] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  )
  const layer = LAYERS.find(l => l.id === activeLayer) || LAYERS[0]

  return (
    <aside className="legend" aria-label="Map legend">
      <div className="legend__head">
        <span className="legend__kicker">Layer</span>
        <button
          className="legend__collapse"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand legend' : 'Collapse legend'}
        >
          <Icon name={collapsed ? 'chevronUp' : 'chevronDown'} size={14} />
        </button>
      </div>

      <div className="legend__tabs" role="tablist">
        {LAYERS.map(l => (
          <button
            key={l.id}
            role="tab"
            aria-selected={activeLayer === l.id}
            className={`legend__tab ${activeLayer === l.id ? 'legend__tab--active' : ''}`}
            onClick={() => onLayerChange(l.id)}
          >
            <Icon name={l.iconName} size={13} />
            {l.label}
          </button>
        ))}
      </div>

      {!collapsed && (
        <>
          <div className="legend__body">
            <div className="legend__title">{layer.title}</div>
            <div className="legend__desc">{layer.desc}</div>

            {layer.items ? (
              <div className="legend__items">
                {layer.items.map(({ name, color }) => (
                  <div className="legend__item" key={name}>
                    <span className="legend__swatch" style={{ background: color }} />
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="legend__gradient" />
                <div className="legend__gradient-labels">
                  <span>fewer</span>
                  <span>many</span>
                </div>
                <div className="legend__items" style={{ marginTop: 10 }}>
                  <div className="legend__item">
                    <span className="legend__swatch legend__swatch--circle" style={{ background: '#a9c6d8' }} />
                    Lower diversity
                  </div>
                  <div className="legend__item">
                    <span className="legend__swatch legend__swatch--circle" style={{ background: '#d9a05b' }} />
                    Medium diversity
                  </div>
                  <div className="legend__item">
                    <span className="legend__swatch legend__swatch--circle" style={{ background: '#a23a3a' }} />
                    High diversity
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className={`legend__stack ${stacked ? 'legend__stack--on' : ''}`}
            onClick={() => onStackedChange(!stacked)}
            aria-pressed={stacked}
          >
            <span className="legend__stack-switch" />
            <Icon name="layers" size={14} />
            <span>Stack all layers</span>
          </button>
        </>
      )}
    </aside>
  )
}

export default Legend
