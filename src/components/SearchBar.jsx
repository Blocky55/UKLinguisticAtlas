import { useState } from 'react'

const ALL_REGIONS = [
  { name: 'Belfast', layer: 'diversity', center: [-5.93, 54.60] },
  { name: 'Birmingham', layer: 'diversity', center: [-1.89, 52.49] },
  { name: 'Bristol', layer: 'diversity', center: [-2.59, 51.45] },
  { name: 'Cardiff', layer: 'diversity', center: [-3.18, 51.48] },
  { name: 'Cockney', layer: 'dialects', center: [-0.12, 51.51] },
  { name: 'Cornish', layer: 'languages', center: [-5.0, 50.3] },
  { name: 'Geordie', layer: 'dialects', center: [-1.61, 54.97] },
  { name: 'Glasgow', layer: 'diversity', center: [-4.25, 55.86] },
  { name: 'Irish', layer: 'languages', center: [-8.0, 53.0] },
  { name: 'Leeds', layer: 'diversity', center: [-1.55, 53.80] },
  { name: 'London', layer: 'diversity', center: [-0.12, 51.51] },
  { name: 'Manchester', layer: 'diversity', center: [-2.24, 53.48] },
  { name: 'Mancunian', layer: 'dialects', center: [-2.24, 53.48] },
  { name: 'Scottish Gaelic', layer: 'languages', center: [-6.0, 57.5] },
  { name: 'Scots', layer: 'languages', center: [-3.5, 56.0] },
  { name: 'Scouse', layer: 'dialects', center: [-2.98, 53.41] },
  { name: 'Welsh', layer: 'languages', center: [-3.8, 52.4] },
  { name: 'Welsh English', layer: 'dialects', center: [-3.8, 52.4] },
]

const ResultsList = ({ items, onSelect }) => (
  <div style={{
    marginTop: '6px',
    background: 'rgba(13,27,42,0.97)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    maxHeight: '320px',
    overflowY: 'auto',
  }}>
    {items.map(region => (
      <div
        key={region.name + region.layer}
        onMouseDown={() => onSelect(region)}
        style={{
          padding: '10px 16px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          transition: '0.15s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,217,169,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ color: '#e8f4fd', fontSize: '14px', fontFamily: 'var(--font)' }}>
          {region.name}
        </span>
        <span style={{ color: '#5e7d90', fontSize: '11px', fontFamily: 'var(--font)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {region.layer}
        </span>
      </div>
    ))}
  </div>
)

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const results = query.length >= 1
    ? ALL_REGIONS.filter(r =>
        r.name.toLowerCase().startsWith(query.toLowerCase())
      )
    : ALL_REGIONS

  const showDropdown = focused

  const handleSelect = (region) => {
    onSelect(region)
    setQuery('')
    setFocused(false)
  }

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '300px',
    }}>
      <input
        type="text"
        placeholder="Search regions, languages, cities..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(13,27,42,0.92)',
          color: '#e8f4fd',
          fontSize: '14px',
          fontFamily: 'var(--font)',
          outline: 'none',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      />

      {showDropdown && (
        <>
          {query.length === 0 && (
            <div style={{
              marginTop: '6px',
              padding: '8px 16px',
              color: '#5e7d90',
              fontSize: '11px',
              fontFamily: 'var(--font)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              All locations — alphabetical
            </div>
          )}
          {results.length > 0
            ? <ResultsList items={results} onSelect={handleSelect} />
            : (
              <div style={{
                marginTop: '6px',
                padding: '12px 16px',
                background: 'rgba(13,27,42,0.97)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: '#5e7d90',
                fontSize: '13px',
                fontFamily: 'var(--font)',
              }}>
                No results found
              </div>
            )
          }
        </>
      )}
    </div>
  )
}

export default SearchBar