import { useEffect, useState } from 'react'
import CUSeeMe from './windows/CUSeeMe'
import MSN from './windows/MSN'
import LimeWire from './windows/LimeWire'
import Classifieds from './windows/Classifieds'
import WindowFrame from './components/WindowFrame'
import ThemePicker from './components/ThemePicker'

const APPS = {
  msn:      { Component: MSN,         label: 'MSN Messenger', pos: { x: 120, y: 90  } },
  limewire: { Component: LimeWire,    label: 'donde_estas?',  pos: { x: 80,  y: 200 } },
  ads:      { Component: Classifieds, label: 'El Anuncio',    pos: { x: 300, y: 110 } },
}

export default function App() {
  // wins: [{ id, app, props }]
  const [wins, setWins]     = useState([])
  const [minimized, setMin] = useState({})
  const [zMap, setZMap]     = useState({})
  const [maxZ, setMaxZ]     = useState(100)
  const [clock, setClock]   = useState('00:00')

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setClock(`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  const buildId = (app, props) =>
    props?.contact ? `${app}:${props.contact}` : app

  const openApp = (app, props = {}) => {
    if (!APPS[app]) return
    const id = buildId(app, props)
    setWins(w => w.find(x => x.id === id) ? w : [...w, { id, app, props }])
    setMin(m => ({ ...m, [id]: false }))
    focusApp(id)
  }
  const focusApp = (id) => {
    setMaxZ(mz => {
      const nz = mz + 1
      setZMap(zm => ({ ...zm, [id]: nz }))
      return nz
    })
  }
  const closeApp = (id) => {
    setWins(w => w.filter(x => x.id !== id))
    setMin(m => { const c = { ...m }; delete c[id]; return c })
  }
  const toggleMin = (id) => {
    setMin(m => ({ ...m, [id]: !m[id] }))
    if (minimized[id]) focusApp(id)
  }

  return (
    <div className="os">
      <div className="os-main">
        <CUSeeMe onOpen={openApp} />
      </div>

      {wins.map((w, i) => {
        const app = APPS[w.app]
        const Comp = app.Component
        return (
          <WindowFrame
            key={w.id}
            defaultPos={{ x: app.pos.x + i * 20, y: app.pos.y + i * 20 }}
            zIndex={zMap[w.id] || 100}
            onFocus={() => focusApp(w.id)}
            minimized={!!minimized[w.id]}
          >
            <Comp
              {...w.props}
              onClose={() => closeApp(w.id)}
              onMin={() => toggleMin(w.id)}
              onOpen={openApp}
            />
          </WindowFrame>
        )
      })}

      <ThemePicker />

      <footer className="os-taskbar">
        <button className="os-start" type="button">
          <span className="os-flag" />
          <b>Inicio</b>
        </button>
        <div className="os-tasks">
          <button
            className="os-taskbtn active"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="os-taskicon">🌐</span>
            <span className="os-tasklabel">NCSA Mosaic</span>
          </button>
          {wins.map(w => (
            <button
              key={w.id}
              className={`os-taskbtn ${minimized[w.id] ? 'min' : ''}`}
              onClick={() => toggleMin(w.id)}
              title={w.props?.contact ? `${APPS[w.app].label} — ${w.props.contact}` : APPS[w.app].label}
            >
              <span className="os-taskicon">
                {w.app === 'msn' ? '💬' :
                 w.app === 'limewire' ? '🔍' : '📰'}
              </span>
              <span className="os-tasklabel">
                {w.props?.contact
                  ? `${APPS[w.app].label.split(' ')[0]} · ${w.props.contact}`
                  : APPS[w.app].label}
              </span>
            </button>
          ))}
        </div>
        <div className="os-tray">
          <span title="volumen">🔊</span>
          <span title="red">📡</span>
          <span className="os-clock">{clock}</span>
        </div>
      </footer>
    </div>
  )
}
