import { useEffect, useState } from 'react'
import CUSeeMe from './windows/CUSeeMe'
import MSN from './windows/MSN'
import LimeWire from './windows/LimeWire'
import Classifieds from './windows/Classifieds'
import RetroPlayerWindow from './components/RetroPlayerWindow'
import WindowFrame from './components/WindowFrame'
import ThemePicker from './components/ThemePicker'

const APPS = {
  msn:      { Component: MSN,               label: 'MSN Messenger', pos: { x: 120, y: 90  } },
  limewire: { Component: LimeWire,          label: 'donde_estas?',  pos: { x: 80,  y: 200 } },
  mp3:      { Component: RetroPlayerWindow, label: 'notas de voz eliminadas', pos: { x: 220, y: 160 } },
  ads:      { Component: Classifieds,       label: 'El Anuncio',    pos: { x: 300, y: 110 } },
}

export default function App() {
  // wins: [{ id, app, props }]
  const [wins, setWins]       = useState([])
  const [minimized, setMin]   = useState({})
  const [maximized, setMax]   = useState({})
  const [zMap, setZMap]       = useState({})
  const [maxZ, setMaxZ]       = useState(100)
  const [clock, setClock]     = useState('00:00')
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 640
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
  const toggleMax = (id) => {
    setMax(m => ({ ...m, [id]: !m[id] }))
    focusApp(id)
  }

  return (
    <div className="os">
      <div className="os-main">
        <CUSeeMe onOpen={openApp} />
      </div>

      {wins.map((w, i) => {
        const app = APPS[w.app]
        const Comp = app.Component        // En mobile las ventanas cascadean con offset amplio (54px verticales)
        // para que se lea claramente que hay una ventana debajo
        const defaultPos = isMobile
          ? { x: 6 + i * 16, y: 16 + i * 54 }
          : { x: app.pos.x + i * 20, y: app.pos.y + i * 20 }
        return (
          <WindowFrame
            key={w.id}
            defaultPos={defaultPos}
            zIndex={zMap[w.id] || 100}
            onFocus={() => focusApp(w.id)}
            onSwipeClose={() => closeApp(w.id)}
            minimized={!!minimized[w.id]}
            maximized={!!maximized[w.id]}
          >
            <Comp
              {...w.props}
              onClose={() => closeApp(w.id)}
              onMin={() => toggleMin(w.id)}
              onMax={() => toggleMax(w.id)}
              isMaximized={!!maximized[w.id]}
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
                {w.app === 'msn'      ? <img src="/msg.png" alt="msn" className="os-taskicon-img" draggable={false} /> :
                 w.app === 'limewire' ? '🔍' :
                 w.app === 'mp3'      ? '♪' :
                                        '📰'}
              </span>
              <span className="os-tasklabel">
                {(() => {
                  const raw = w.props?.contact ?? APPS[w.app].label
                  // Trunca por caracteres (no por pixeles) para diferenciar handles largos
                  return raw.length > 11 ? raw.slice(0, 10) + '…' : raw
                })()}
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
