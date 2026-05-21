import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from './Icons'
import { PHRASES, CITY_LANGUAGES } from '../data/phrases'

const LAYER_LABELS = {
  dialects:  { label: 'Dialect',   color: '#a23a3a' },
  languages: { label: 'Language',  color: '#2e7d8f' },
  diversity: { label: 'City',      color: '#b07a2c' },
}

const COLOR_BY_NAME = {
  'Mancunian':       '#2c6e7a',
  'Scouse':          '#c89b3c',
  'Welsh English':   '#a23a3a',
  'Cockney':         '#6a4d80',
  'Geordie':         '#c4622d',
  'Welsh':           '#2e7d8f',
  'Scottish Gaelic': '#4a6fa0',
  'Irish':           '#5d8a64',
  'Scots':           '#6b9c70',
  'Cornish':         '#b8943a',
}

const speak = (text, lang) => {
  if (!('speechSynthesis' in window)) return false
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang || 'en-GB'
    u.rate = 0.9
    u.pitch = 1.0
    // Pick a matching voice if one is available
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.lang?.toLowerCase().startsWith((lang || 'en').toLowerCase()))
    if (match) u.voice = match
    window.speechSynthesis.speak(u)
    return new Promise(resolve => { u.onend = resolve; u.onerror = resolve })
  } catch {
    return false
  }
}

const fmtNumber = (n) => parseInt(n).toLocaleString()

const Sidebar = ({ region, onClose, onShare, onBookmark, isBookmarked }) => {
  const [playingIdx, setPlayingIdx] = useState(null)
  const [shared, setShared] = useState(false)

  const tone = LAYER_LABELS[region.layer] || LAYER_LABELS.dialects
  const swatchColor = COLOR_BY_NAME[region.name] || tone.color
  const phrases = PHRASES[region.name]
  const cityLangs = region.layer === 'diversity' ? CITY_LANGUAGES[region.name] : null

  const handleSpeak = async (idx, word, lang) => {
    setPlayingIdx(idx)
    await speak(word, lang)
    setPlayingIdx(null)
  }

  const handleShare = () => {
    onShare?.()
    setShared(true)
    setTimeout(() => setShared(false), 1800)
  }

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 110, damping: 18 }}
      role="dialog"
      aria-label={`Details: ${region.name}`}
    >
      <header className="sidebar__head">
        <span className="sidebar__head-meta">
          <span
            className="sidebar__head-meta-dot"
            style={{ background: swatchColor }}
          />
          {tone.label}
        </span>
        <button className="sidebar__close" onClick={onClose} aria-label="Close panel">
          <Icon name="close" size={16} />
        </button>
      </header>

      <div className="sidebar__body">
        <h2 className="sidebar__name">{region.name}</h2>
        {phrases?.name_native && (
          <div style={{
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontSize: '15px',
            color: 'var(--ink-3)',
            marginTop: '-2px',
            marginBottom: '8px',
          }}>
            {phrases.name_native}
          </div>
        )}
        {region.region && (
          <div className="sidebar__region">{region.region}</div>
        )}

        {region.status && (
          <span className={`sidebar__status ${region.status === 'Critically Endangered' ? 'sidebar__status--critical' : ''}`}>
            <Icon name="alert" size={11} />
            {region.status}
          </span>
        )}

        {region.fact && (
          <p className="sidebar__lede">{region.fact}</p>
        )}

        {/* Stats grid — adapts column count to avoid empty cells */}
        {(() => {
          const small = []
          let hasDiversity = false
          if (region.speakers)   small.push({ key: 'speakers',  label: 'Speakers',  value: fmtNumber(region.speakers) })
          if (region.languages)  small.push({ key: 'languages', label: 'Languages', value: region.languages, unit: '+ spoken' })
          if (region.diversity_score) hasDiversity = true
          if (!small.length && !hasDiversity) return null
          // If we only have one small cell, make it full-width too
          const oneCol = small.length <= 1
          return (
            <div className="sidebar__stats" style={{ gridTemplateColumns: oneCol ? '1fr' : '1fr 1fr' }}>
              {small.map(c => (
                <div key={c.key} className={oneCol ? 'sidebar__stat sidebar__stat--full' : 'sidebar__stat'}>
                  <div className="sidebar__stat-label">{c.label}</div>
                  <div className="sidebar__stat-value">
                    {c.value}
                    {c.unit && <span className="sidebar__stat-unit">{c.unit}</span>}
                  </div>
                </div>
              ))}
              {hasDiversity && (
                <div className="sidebar__stat sidebar__stat--full">
                  <div className="sidebar__stat-label">Diversity index</div>
                  <div className="sidebar__stat-value">
                    {region.diversity_score}
                    <span className="sidebar__stat-unit">/ 100</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--rule)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${region.diversity_score}%`,
                      background: 'linear-gradient(to right, var(--c-div-low), var(--c-div-mid), var(--c-div-high))',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Characteristic phrases */}
        {phrases?.items && (
          <section className="sidebar__section">
            <div className="sidebar__section-head">
              <span className="sidebar__section-title">Characteristic Words</span>
              <span className="sidebar__section-side">tap to listen</span>
            </div>
            {phrases.items.map((p, i) => (
              <div className="phrase" key={p.word}>
                <div>
                  <div className="phrase__word">{p.word}</div>
                  <div className="phrase__meaning">{p.meaning}</div>
                </div>
                <button
                  className={`phrase__speak ${playingIdx === i ? 'phrase__speak--playing' : ''}`}
                  onClick={() => handleSpeak(i, p.word, phrases.lang)}
                  aria-label={`Pronounce ${p.word}`}
                  title="Listen"
                >
                  <Icon name={playingIdx === i ? 'volumePlaying' : 'volume'} size={13} />
                </button>
              </div>
            ))}
          </section>
        )}

        {/* City top-languages list (diversity layer) */}
        {cityLangs && (
          <section className="sidebar__section">
            <div className="sidebar__section-head">
              <span className="sidebar__section-title">Most-spoken Communities</span>
              <span className="sidebar__section-side">Census 2021</span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '4px',
            }}>
              {cityLangs.map((lang, i) => (
                <span
                  key={lang}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: 'var(--r-2)',
                    background: i === 0 ? 'var(--ink)' : 'var(--paper-card)',
                    color: i === 0 ? 'var(--paper)' : 'var(--ink-2)',
                    border: i === 0 ? '1px solid var(--ink)' : '1px solid var(--rule-strong)',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {i < 9 && (
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: '10px',
                      opacity: 0.6,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                  {lang}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="sidebar__actions">
          <button
            className={`sidebar__action ${shared ? 'sidebar__action--done' : ''}`}
            onClick={handleShare}
          >
            <Icon name={shared ? 'check' : 'link'} size={13} />
            {shared ? 'Link copied' : 'Copy link'}
          </button>
          <button
            className="sidebar__action"
            onClick={onBookmark}
            aria-pressed={isBookmarked}
          >
            <Icon name={isBookmarked ? 'bookmarkFilled' : 'bookmark'} size={13} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <p className="sidebar__cite">
          {region.layer === 'dialects' && '— Survey of English Dialects (Orton & Dieth) and Accents of English (Wells, 1982).'}
          {region.layer === 'languages' && '— UNESCO Atlas of Endangered Languages and national census records.'}
          {region.layer === 'diversity' && '— ONS, NRS and NISRA Census 2021 community-language tabulations.'}
        </p>
      </div>
    </motion.aside>
  )
}

export default Sidebar
