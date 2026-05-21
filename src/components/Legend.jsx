const DIALECT_COLOURS = [
  { name: 'Mancunian', color: '#38d9a9' },
  { name: 'Scouse', color: '#ffd43b' },
  { name: 'Welsh English', color: '#e03131' },
  { name: 'Cockney', color: '#7950f2' },
  { name: 'Geordie', color: '#f76707' },
]

const LANGUAGE_COLOURS = [
  { name: 'Welsh', color: '#4ecdc4' },
  { name: 'Scottish Gaelic', color: '#45b7d1' },
  { name: 'Irish', color: '#96ceb4' },
  { name: 'Scots', color: '#88d8a3' },
  { name: 'Cornish', color: '#ffd93d' },
]

const DIVERSITY_COLOURS = [
  { name: 'High diversity', color: '#e03131' },
  { name: 'Medium diversity', color: '#ffd43b' },
  { name: 'Lower diversity', color: '#45b7d1' },
]

const Legend = ({ activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'dialects', label: 'Dialect Regions' },
    { id: 'languages', label: 'Indigenous Languages' },
    { id: 'diversity', label: 'Diversity Index' },
  ]

  const swatches =
    activeLayer === 'dialects' ? DIALECT_COLOURS :
    activeLayer === 'languages' ? LANGUAGE_COLOURS :
    DIVERSITY_COLOURS

  return (
    <div className="legend">
      {/* Layer toggles */}
      {layers.map(layer => (
        <button
          key={layer.id}
          className={`legend__btn ${activeLayer === layer.id ? 'legend__btn--active' : ''}`}
          onClick={() => onLayerChange(layer.id)}
        >
          {layer.label}
        </button>
      ))}

      {/* Colour swatches */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        {swatches.map(({ name, color }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
            }} />
            <span style={{
              color: '#a8c4d4',
              fontSize: '12px',
              fontFamily: 'var(--font)',
            }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Legend