import { useEffect, useRef, useState } from 'react'
import Slot from '../components/Slot'
import './CUSeeMe.css'

/* ─── 9 transmisiones — fragmentos de la misma obsesión ─── */
const feeds = [
  {
    handle: 'ella',
    name:   'tercera persona · sin dirección',
    title:  'ella no me habla más',
    sub:    'hablo de ella en tercera para no llorar',
    views:  '84,151',  ago: '3 semanas',
    fps: '14.7', kbps: '18', src: '/cam01.mp4',
  },
  {
    handle: 'ella?',
    name:   'cuarto vacío · signo de pregunta',
    title:  'todavía sos vos?',
    sub:    'ya no sé si estoy hablando con quien creo',
    views:  '175,155', ago: '2 meses',
    fps: '17.3', kbps: '7',  src: '/cam02.mp4',
  },
  {
    handle: 'donde_estas?',
    name:   'caminando desde las 3am',
    title:  'te busqué en todos lados',
    sub:    'hoteles, calles, tu casa vieja',
    views:  '103,919', ago: '2 meses',
    fps: '16.7', kbps: '8',  src: '/cam03.mp4',
  },
  {
    handle: 'dejame_en_paz',
    name:   'puerta cerrada con cadena',
    title:  'no me escribas más',
    sub:    'ya lo intenté todo y sigo acá',
    views:  '84,786',  ago: '3 meses',
    fps: '16.8', kbps: '17', src: '/cam04.mp4',
  },
  {
    handle: 'usuario_bloqueado',
    name:   '— — —',
    title:  'CONEXIÓN RECHAZADA',
    sub:    'más habitaciones, más llaves',
    views:  '0', ago: '—',
    fps: '00.0', kbps: '0', blocked: true,
  },
  {
    handle: 'te_extraño',
    name:   'madrugada · terraza',
    title:  'aunque me haga mal',
    sub:    'sigo escribiéndote cosas que no voy a mandar',
    views:  '130,517', ago: '5 meses',
    fps: '16.7', kbps: '15', src: '/cam06.mp4',
  },
  {
    handle: 'fé',
    name:   '— dirección · desde afuera del cuadro —',
    title:  'mi copa siempre va a estar llena',
    sub:    'mientras tenga fe',
    views:  '1',       ago: 'siempre',
    fps: '24.0', kbps: '—', src: '/cam07.mp4',
  },
  {
    handle: 'vox_record_001',
    name:   'nokia_2003 · memo grabado',
    title:  'última cosa que dijiste',
    sub:    'la escucho todas las noches',
    views:  '236,036', ago: '10 meses',
    fps: '13.1', kbps: '11', src: '/cam08.mp4',
  },
  {
    handle: 't_amo_para_siempre',
    name:   'mensaje enviado · nunca recibido',
    title:  'lo dije primero',
    sub:    'y sigo sosteniéndolo aunque no lo devuelvas',
    views:  '204,848', ago: '11 meses',
    fps: '15.6', kbps: '8',  src: '/cam09.mp4',
  },
]

const bookmarks = [
  { app: 'msn',      label: 'MSN Messenger', icon: '💬' },
  { app: 'limewire', label: 'donde_estas?',  icon: '🔍' },
  { app: 'ads',      label: 'El Anuncio',    icon: '📰' },
]

export default function CUSeeMe({ onOpen }) {
  const [hotOpen, setHotOpen] = useState(false)
  const [url, setUrl] = useState('http://c-me.net/welcome-2-our-memories.html')
  const menuRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setHotOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const goUrl = (e) => {
    e.preventDefault()
    const u = url.toLowerCase()
    if (u.includes('msn'))                                    onOpen('msn')
    else if (u.startsWith('donde://') || u.includes('busca')) onOpen('limewire')
    else if (u.includes('anuncio') || u.includes('classi'))   onOpen('ads')
    else if (u.includes('salvacion') || u.includes('plug'))   onOpen('msn', { contact: 'salvacion_plug_24hs' })
    else if (u.includes('/fé') || u.includes('/fe'))          onOpen('msn', { contact: 'fé' })
  }

  const openFeed = (f) => {
    onOpen('msn', {
      contact: f.handle,
      displayName: f.name,
      feedSrc: f.src,
      blocked: !!f.blocked,
    })
  }

  const openContact = (handle) => {
    onOpen('msn', { contact: handle, displayName: null, feedSrc: null, blocked: false })
  }

  return (
    <section className="win cuseeme-win">
      <header className="mosaic-titlebar win-drag">
        <span className="mosaic-title">C-me — welcome 2 our memories</span>
        <span className="mosaic-controls">
          <span className="mc mc-min">_</span>
          <span className="mc mc-max">□</span>
          <span className="mc mc-close">×</span>
        </span>
      </header>

      <nav className="mosaic-menu" ref={menuRef}>
        {['File','Edit','View','Navigate','Tools'].map(m => (
          <span key={m} className="mm"><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
        <span
          className={`mm mm-clickable ${hotOpen ? 'active' : ''}`}
          onClick={() => setHotOpen(v => !v)}
        >
          <u>H</u>otlists ▾
          {hotOpen && (
            <div className="mm-dropdown">
              <div className="mm-drop-title">apps</div>
              {bookmarks.map(b => (
                <div key={b.app} className="mm-drop-item" onClick={() => { onOpen(b.app); setHotOpen(false) }}>
                  <span className="mm-drop-icon">{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
              <div className="mm-drop-sep" />
              <div className="mm-drop-title">contactos</div>
              {feeds.filter(f => !f.blocked).slice(0, 4).map(f => (
                <div key={f.handle} className="mm-drop-item" onClick={() => { openFeed(f); setHotOpen(false) }}>
                  <span className="mm-drop-icon">💬</span><span>{f.handle}</span>
                </div>
              ))}
              <div className="mm-drop-sep" />
              {/* accesos ocultos, chicos */}
              <div className="mm-drop-item quiet" onClick={() => { openContact('salvacion_plug_24hs'); setHotOpen(false) }}>
                <span className="mm-drop-icon">·</span><span>salvacion_plug_24hs</span>
              </div>
              <div className="mm-drop-item off">
                <span className="mm-drop-icon">×</span><span>usuario_bloqueado (sin conexión)</span>
              </div>
            </div>
          )}
        </span>
        <span className="mm"><u>H</u>elp</span>
      </nav>

      <div className="mosaic-toolbar">
        <button className="mtb-btn" aria-label="save">💾</button>
        <button className="mtb-btn" aria-label="print">🖨</button>
        <span className="mtb-sep" />
        <button className="mtb-btn" aria-label="back">◀</button>
        <button className="mtb-btn" aria-label="fwd">▶</button>
        <button className="mtb-btn" aria-label="reload">↻</button>
        <button className="mtb-btn" aria-label="home">🏠</button>
        <span className="mtb-sep" />
        <select className="mtb-select" defaultValue="Home">
          <option>Home</option>
          <option>Bookmarks</option>
        </select>
      </div>

      <form className="mosaic-address" onSubmit={goUrl}>
        <span className="ma-icon">✓</span>
        <input
          className="ma-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') goUrl(e) }}
        />
      </form>

      <div className="mosaic-bookmarks">
        <span className="mbm-label">links</span>
        {bookmarks.map(b => (
          <button key={b.app} className="mbm-btn" onClick={() => onOpen(b.app)}>
            <span className="mbm-icon">{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      <div className="mosaic-page">
        <div className="cu-page-inner">
          <h1 className="cu-logo">C-me <span className="cu-lasttime">1 Last Time</span></h1>
          <div className="cu-welcome">welcome 2 our memories</div>
          <p className="cu-instr">
            clic en cualquier <b>transmisión</b> para abrir la conversación con quien la emite
          </p>

          <div className="cu-grid">
            {feeds.map((f, i) => (
              <figure
                key={i}
                className={`cu-feed clickable ${f.blocked ? 'is-blocked' : ''} ${f.handle === 'fé' ? 'is-fé' : ''}`}
                onClick={() => openFeed(f)}
                title={f.blocked
                  ? 'intentar hablar con usuario_bloqueado'
                  : `abrir chat con ${f.handle}`}
              >
                <div className="cu-feed-bar">
                  <span className="cu-feed-icon" />
                  <span className="cu-feed-name">{f.handle}</span>
                  <span className="cu-feed-x">×</span>
                </div>

                <div className="cu-feed-body">
                  {f.blocked ? (
                    <div className="cu-blocked">
                      <div className="cu-blocked-mask" />
                      <span className="cu-blocked-txt">CONEXIÓN<br/>RECHAZADA</span>
                      <span className="cu-blocked-sub">más habitaciones, más llaves</span>
                    </div>
                  ) : (
                    <Slot
                      dataSrc={f.src}
                      label={f.handle.toUpperCase()}
                      aspect="4 / 3"
                    />
                  )}
                </div>

                <div className="cu-feed-meta">
                  <div className="cu-feed-title">{f.title}</div>
                  <div className="cu-feed-sub">{f.sub}</div>
                  <div className="cu-feed-loc">{f.name}</div>
                </div>

                <div className="cu-feed-foot">
                  <span className="cu-feed-views">{f.views} views · {f.ago}</span>
                  <span className="cu-feed-stats">{f.fps} fps · {f.kbps} Kbps</span>
                </div>
              </figure>
            ))}
          </div>

          <div className="cu-shortcuts">
            <h2 className="cu-shortcuts-h">links relacionados</h2>
            <p className="cu-shortcuts-sub">
              otros programas donde también intenté hablarles
            </p>
            <div className="cu-shortcuts-grid">
              {bookmarks.map(b => (
                <a key={b.app} className="cu-shortcut" onClick={(e) => { e.preventDefault(); onOpen(b.app) }} href="#">
                  <div className="cu-shortcut-icon">{b.icon}</div>
                  <div className="cu-shortcut-lbl">{b.label}</div>
                  <div className="cu-shortcut-url">
                    {b.app === 'msn' && 'msn://usuario_bloqueado'}
                    {b.app === 'limewire' && 'donde://usuario_bloqueado'}
                    {b.app === 'ads' && 'file:///el_anuncio.pdf'}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <p className="cu-caption">D · E · S · K · T · O · P &nbsp;·&nbsp; C · O · N · F · E · S · S · I · O · N · A · L</p>
          <p className="cu-uni">porque yo sigo ahí en algún rincón · y no hay ficción</p>
          <p className="cu-broughtby">
            un recuerdo de <a href="#" onClick={(e)=>{e.preventDefault(); openContact('t_amo_para_siempre')}}>illuno</a>
            &nbsp;·&nbsp;
            dirección <a href="#" onClick={(e)=>{e.preventDefault(); openContact('fé')}}>fé</a>
          </p>
        </div>
      </div>

      <footer className="mosaic-status">
        <span className="ms-tab">c-me</span>
        <span className="ms-tab">memories</span>
        <span className="ms-tab">metasearch</span>
        <span className="ms-fill">
          <span className="ms-fill-txt">listo · c-me.net · 9 transmisiones · 1 rechazada · illuno / fé</span>
        </span>
      </footer>
    </section>
  )
}
