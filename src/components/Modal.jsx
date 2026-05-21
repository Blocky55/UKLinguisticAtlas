import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Icon from './Icons'
import { SOURCES } from '../data/phrases'

const Modal = ({ title, kicker, children, onClose }) => {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <motion.div
      className="modal-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <header className="modal__head">
          <div>
            {kicker && (
              <div style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
                fontWeight: 700,
                marginBottom: 3,
              }}>{kicker}</div>
            )}
            <h2 className="modal__title">{title}</h2>
          </div>
          <button className="sidebar__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </motion.div>
    </motion.div>
  )
}

export const AboutModal = ({ onClose, totals }) => (
  <Modal title="The Linguistic Atlas" kicker="About this project" onClose={onClose}>
    <p className="modal__lede">
      An interactive cartographic survey of the languages and dialects spoken across the
      United Kingdom and Ireland — from the regional varieties of English to the
      Celtic tongues and the rising linguistic diversity of the postwar city.
    </p>

    {totals && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        background: 'var(--rule)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--r-3)',
        overflow: 'hidden',
        marginBottom: 18,
      }}>
        <div style={{ background: 'var(--paper-card)', padding: '12px 14px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
            {totals.dialects}
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 700, marginTop: 6 }}>
            dialect regions
          </div>
        </div>
        <div style={{ background: 'var(--paper-card)', padding: '12px 14px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
            {totals.languages}
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 700, marginTop: 6 }}>
            indigenous languages
          </div>
        </div>
        <div style={{ background: 'var(--paper-card)', padding: '12px 14px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--ink)', lineHeight: 1 }}>
            {totals.cities}
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 700, marginTop: 6 }}>
            urban surveys
          </div>
        </div>
      </div>
    )}

    <section className="modal__section">
      <div className="modal__section-title">How to read the map</div>
      <ul className="modal__list">
        <li><strong style={{ color: 'var(--ink)' }}>Dialects</strong> — coloured polygons mark the core area of each spoken variety. Boundaries are approximations of areal use, not strict borders.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Languages</strong> — Celtic and historic tongues, including UNESCO endangered-status classifications.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Diversity</strong> — graduated circles scaled by the number of community languages spoken in each city.</li>
      </ul>
    </section>

    <section className="modal__section">
      <div className="modal__section-title">Sources</div>
      <ul className="modal__list">
        {SOURCES.map((s) => (
          <li key={s.title}>
            <strong style={{ color: 'var(--ink)' }}>{s.title}.</strong>{' '}
            <span className="modal__cite">{s.detail}</span>
          </li>
        ))}
      </ul>
    </section>

    <section className="modal__section">
      <div className="modal__section-title">A note on method</div>
      <p style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)' }}>
        Dialect boundaries reflect the broad continua described in the literature
        rather than discrete administrative regions. Speaker counts for endangered
        languages are taken from the most recent national census; characteristic
        words are illustrative selections from standard reference works and are
        not intended as exhaustive lexicons.
      </p>
    </section>
  </Modal>
)

export const ShortcutsModal = ({ onClose }) => (
  <Modal title="Keyboard shortcuts" kicker="Keys" onClose={onClose}>
    <div className="kbd-grid">
      <span className="kbd-row"><span className="kbd">/</span></span>
      <span>Focus search</span>

      <span className="kbd-row"><span className="kbd">↑</span><span className="kbd">↓</span></span>
      <span>Navigate search results</span>

      <span className="kbd-row"><span className="kbd">Enter</span></span>
      <span>Open selected result</span>

      <span className="kbd-row"><span className="kbd">1</span></span>
      <span>Show dialects layer</span>

      <span className="kbd-row"><span className="kbd">2</span></span>
      <span>Show languages layer</span>

      <span className="kbd-row"><span className="kbd">3</span></span>
      <span>Show diversity layer</span>

      <span className="kbd-row"><span className="kbd">S</span></span>
      <span>Stack all layers</span>

      <span className="kbd-row"><span className="kbd">O</span></span>
      <span>Return to overview</span>

      <span className="kbd-row"><span className="kbd">?</span></span>
      <span>Show this list</span>

      <span className="kbd-row"><span className="kbd">Esc</span></span>
      <span>Close panel / modal</span>
    </div>
  </Modal>
)

export default Modal
