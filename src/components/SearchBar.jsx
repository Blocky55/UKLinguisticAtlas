import { useState, useRef, useEffect } from 'react'
import Icon from './Icons'

const ALL_REGIONS = [
  { name: 'Belfast',          layer: 'diversity', center: [-5.93, 54.60], color: '#a9c6d8' },
  { name: 'Birmingham',       layer: 'diversity', center: [-1.89, 52.49], color: '#d9a05b' },
  { name: 'Bristol',          layer: 'diversity', center: [-2.59, 51.45], color: '#d9a05b' },
  { name: 'Cardiff',          layer: 'diversity', center: [-3.18, 51.48], color: '#a9c6d8' },
  { name: 'Cockney',          layer: 'dialects',  center: [-0.12, 51.51], color: '#6a4d80' },
  { name: 'Cornish',          layer: 'languages', center: [-5.00, 50.30], color: '#b8943a' },
  { name: 'Geordie',          layer: 'dialects',  center: [-1.61, 54.97], color: '#c4622d' },
  { name: 'Glasgow',          layer: 'diversity', center: [-4.25, 55.86], color: '#a9c6d8' },
  { name: 'Irish',            layer: 'languages', center: [-8.00, 53.00], color: '#5d8a64' },
  { name: 'Leeds',            layer: 'diversity', center: [-1.55, 53.80], color: '#d9a05b' },
  { name: 'London',           layer: 'diversity', center: [-0.12, 51.51], color: '#a23a3a' },
  { name: 'Manchester',       layer: 'diversity', center: [-2.24, 53.48], color: '#d9a05b' },
  { name: 'Mancunian',        layer: 'dialects',  center: [-2.24, 53.48], color: '#2c6e7a' },
  { name: 'Scottish Gaelic',  layer: 'languages', center: [-6.00, 57.50], color: '#4a6fa0' },
  { name: 'Scots',            layer: 'languages', center: [-3.50, 56.00], color: '#6b9c70' },
  { name: 'Scouse',           layer: 'dialects',  center: [-2.98, 53.41], color: '#c89b3c' },
  { name: 'Welsh',            layer: 'languages', center: [-3.80, 52.40], color: '#2e7d8f' },
  { name: 'Welsh English',    layer: 'dialects',  center: [-3.80, 52.40], color: '#a23a3a' },
]

const SearchBar = ({ onSelect, registerFocus }) => {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (registerFocus) registerFocus(() => inputRef.current?.focus())
  }, [registerFocus])

  const results = query.length >= 1
    ? ALL_REGIONS.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
    : ALL_REGIONS

  useEffect(() => { setActiveIdx(0) }, [query])

  useEffect(() => {
    if (!focused) return
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [activeIdx, focused])

  const handleSelect = (region) => {
    onSelect(region)
    setQuery('')
    setFocused(false)
    inputRef.current?.blur()
  }

  const handleKey = (e) => {
    if (!focused) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[activeIdx]) handleSelect(results[activeIdx])
    } else if (e.key === 'Escape') {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="topbar">
      <div className="search">
        <span className="search__icon"><Icon name="search" size={14} /></span>
        <input
          ref={inputRef}
          type="text"
          className="search__input"
          placeholder="Search regions, languages, cities…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKey}
          aria-label="Search regions, languages, and cities"
          autoComplete="off"
        />
        {query.length > 0 && (
          <button
            className="search__clear"
            onMouseDown={(e) => { e.preventDefault(); setQuery(''); inputRef.current?.focus() }}
            aria-label="Clear search"
          >
            <Icon name="close" size={14} />
          </button>
        )}

        {focused && (
          <div className="search__results" ref={listRef}>
            {query.length === 0 && (
              <div className="search__hint">All entries — alphabetical</div>
            )}
            {results.length === 0 && (
              <div className="search__empty">No matching entries</div>
            )}
            {results.map((region, i) => (
              <div
                key={region.name + region.layer}
                data-idx={i}
                onMouseDown={() => handleSelect(region)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`search__item ${i === activeIdx ? 'search__item--active' : ''}`}
              >
                <span className="search__item-name">
                  <span className="search__item-swatch" style={{ background: region.color }} />
                  {region.name}
                </span>
                <span className="search__item-layer">{region.layer}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
