const Legend = ({ activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'dialects', label: 'Dialect Regions' },
    { id: 'languages', label: 'Indigenous Languages' },
    { id: 'diversity', label: 'Diversity Index' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      left: '32px',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {layers.map(layer => (
        <button
          key={layer.id}
          onClick={() => onLayerChange(layer.id)}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: activeLayer === layer.id ? '1px solid #38d9a9' : '1px solid rgba(255,255,255,0.15)',
            background: activeLayer === layer.id ? 'rgba(56,217,169,0.15)' : 'rgba(13,27,42,0.85)',
            color: activeLayer === layer.id ? '#38d9a9' : '#a8c4d4',
            fontSize: '13px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'Arial',
          }}
        >
          {layer.label}
        </button>
      ))}
    </div>
  )
}

export default Legend