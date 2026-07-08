import { useEffect, useRef, useState } from 'react'
import './ThemePicker.css'

const THEMES = [
  { id: 'silkroad', label: 'silkroad', detail: 'Georgia italic + Verdana (default)' },
  { id: 'mssans',   label: 'ms sans',  detail: 'todo MS Sans Serif 8x16' },
  { id: 'dos',      label: 'dos vga',  detail: 'todo Perfect DOS VGA 437' },
  { id: 'w95fa',    label: 'w95fa',    detail: 'todo W95FA' },
  { id: 'terminal', label: 'terminal', detail: 'DOS · fósforo verde' },
]

const STORAGE_KEY = 'sufro-theme'

export default function ThemePicker() {
  const [theme, setTheme] = useState(
    () => (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || 'silkroad'
  )
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const current = THEMES.find(t => t.id === theme) || THEMES[0]

  return (
    <div ref={ref} className="tp">
      <button className="tp-btn" onClick={() => setOpen(v => !v)} title="cambiar tipografía">
        <span className="tp-dot" />
        <span className="tp-label">tema — {current.label}</span>
        <span className="tp-arrow">{open ? '▾' : '▴'}</span>
      </button>
      {open && (
        <div className="tp-menu">
          <div className="tp-menu-h">tipografía del sistema</div>
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`tp-item ${t.id === theme ? 'active' : ''}`}
              onClick={() => { setTheme(t.id); setOpen(false) }}
            >
              <span className="tp-item-label">{t.label}</span>
              <span className="tp-item-detail">{t.detail}</span>
            </button>
          ))}
          <div className="tp-menu-foot">
            los tokens están en <code>src/theme.css</code>
          </div>
        </div>
      )}
    </div>
  )
}
