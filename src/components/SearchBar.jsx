import { useState, useRef, useEffect } from 'react'
import Icon from './Icons'
import { ALL_REGIONS } from '../data/regions'

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
