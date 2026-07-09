import { useEffect, useRef, useState } from 'react'
import Slot from '../components/Slot'
import MosaicDialog from '../components/MosaicDialog'
import SourceViewer from '../components/SourceViewer'
import FakeDevTools from '../components/FakeDevTools'
import RetroPlayer from '../components/RetroPlayer'
import ApologyPopup from '../components/ApologyPopup'
import './CUSeeMe.css'

/* ─── 9 transmisiones — fragmentos de la misma obsesión ─── */
const feeds = [
  {
    handle: 'ella',
    name:   '',
    title:  'y si todavía pensas en mi',
    sub:    'no pronuncies mi nombre',
    views:  '84,151',  ago: '3 semanas',
    fps: '14.7', kbps: '18',
    src: '/Convert%20to%20GIF%20project%20-%2009%20July%202026%20at%2001.01.42.mp4',
  },
  {
    handle: 'ella?',
    name:   'xro nadie tiene el mismo sonido de tu piel',
    title:  'todavía sos vos?',
    sub:    'sigo buscando a alguien q se parezca',
    views:  '175,155', ago: '2 meses',
    fps: '17.3', kbps: '7',  src: '/1.mp4',
  },
  {
    handle: 'donde_estas?',
    name:   'camino toda la madrugada x todas las calles donde caminamos',
    title:  'te busqué en todos lados',
    sub:    '_no location found',
    views:  '103,919', ago: '2 meses',
    fps: '16.7', kbps: '8',  src: '/nomiresparaabajo.mp4',
  },
  {
    handle: 'dejame_en_paz',
    name:   'tomatela x favor',
    title:  'no m hables +',
    sub:    'no aguanto posta',
    views:  '84,786',  ago: '3 meses',
    fps: '16.8', kbps: '17', src: '/pucho(1).mp4',
  },
  {
    handle: 'usuario_bloqueado',
    name:   '— — —',
    title:  'CONEXIÓN FALLIDA',
    sub:    'no se donde carajo te fuiste',
    views:  '0', ago: '—',
    fps: '00.0', kbps: '0', blocked: true,
  },
  {
    handle: 'te_extraño',
    name:   'igual cambiaste el chip',
    title:  'aunque me haga mal',
    sub:    'sigo escribiéndote cosas que no voy a mandar',
    views:  '130,517', ago: '5 meses',
    fps: '16.7', kbps: '15', src: '/dancingwiththestars(1).mp4',
  },
  {
    handle: 'fé',
    name:   '— sigo intentando hacerte feliz',
    title:  'mi copa siempre va a estar llena',
    sub:    'mientras tenga fé',
    views:  '1',       ago: 'siempre',
    fps: '24.0', kbps: '—',
    src: '/Convert%20to%20GIF%20project%20-%2009%20July%202026%20at%2001.01.42-3.mp4',
  },
  {
    handle: 'vox_record_001',
    name:   'ipod touch_2010 · memo grabado',
    title:  'última cosa que dijiste',
    sub:    'la escucho todas las noches',
    views:  '236,036', ago: '10 meses',
    fps: '13.1', kbps: '11', src: '/champan.mp4',
  },
  {
    handle: 't_amo_para_siempre',
    name:   'mensaje enviado · nunca recibido',
    title:  'lo dije primero',
    sub:    'y sigo sosteniéndolo aunque no lo devuelvas',
    views:  '204,848', ago: '11 meses',
    fps: '15.6', kbps: '8',
    src: '/Convert%20to%20GIF%20project%20-%2009%20July%202026%20at%2001.01.42-6.mp4',
  },
]

/* ─── Iconos como imágenes PNG (assets en /public) ─── */
const IconImg = ({ src, alt, size = 'md' }) => (
  <img
    src={src}
    alt={alt}
    className={`mbm-png mbm-png-${size}`}
    draggable={false}
  />
)

const bookmarks = [
  {
    app:   'msn',
    label: 'MSN Messenger',
    icon:  <IconImg src="/msg.png" alt="MSN" />,
    emoji: '💬',
  },
  {
    app:   'limewire',
    label: 'donde_estas?',
    icon:  <IconImg src="/wacha.png" alt="search" size="lg" />,
    emoji: '🔍',
  },
  {
    app:   'mp3',
    label: 'notas de voz eliminadas',
    icon:  <IconImg src="/carpeta%20audio.png" alt="audio folder" />,
    emoji: '♪',
  },
]

export default function CUSeeMe({ onOpen }) {
  const [hotOpen, setHotOpen] = useState(false)
  const [url, setUrl] = useState('http://c-me.net/welcome-2-our-memories.html')
  const menuRef = useRef(null)
  /* Menu system state */
  const [openMenu, setOpenMenu] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [devtoolsOpen, setDevtoolsOpen] = useState(false)
  /* Player fijo en la home + popup al cerrarlo */
  const [playerHidden, setPlayerHidden] = useState(false)
  const [apologyOpen,  setApologyOpen]  = useState(false)

  /* Cerrar cualquier menu al clickear afuera */
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  /* ─── Actions de los menús ─── */
  const openThemePicker = () => {
    const btn = document.querySelector('.tp-btn')
    if (btn) btn.click()
  }
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.()
    }
  }
  const scrollToTop = () => {
    document.querySelector('.mosaic-page')?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const openSearchHistory = () => {
    setOpenMenu(null)
    onOpen?.('limewire')
  }
  const showBlockedCounter = () => {
    const count = Number(localStorage.getItem('blocked-attempts') || '0')
    setDialog({
      kind: 'warning',
      title: 'Intentos a usuario_bloqueado',
      message: count === 0
        ? 'Todavía no le escribiste esta sesión. ¿Ganas de intentarlo?'
        : `Le escribiste ${count} ${count === 1 ? 'vez' : 'veces'} sin respuesta desde que abriste la página.`,
      extra: count > 0 ? '"Este mensaje no pudo entregarse a usuario_bloqueado."' : null,
    })
  }
  const showHistory = () => {
    setDialog({
      kind: 'info',
      title: 'Historial de navegación',
      message: 'Todas las páginas visitadas — en orden cronológico:',
      extra: (
        <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'none' }}>
          <li>· ella</li>
          <li>· ella?</li>
          <li>· donde_estas?</li>
          <li>· dejame_en_paz</li>
          <li>· usuario_bloqueado <span style={{color:'#a01a1a'}}>(bloqueado hace 6h)</span></li>
          <li>· te_extraño</li>
          <li>· fé</li>
          <li>· vox_record_001</li>
          <li>· t_amo_para_siempre</li>
        </ul>
      ),
    })
  }
  const showFavorites = () => {
    setDialog({
      kind: 'info',
      title: 'Favoritos',
      message: 'Contactos marcados como favoritos:',
      extra: (
        <ul style={{ margin: 0, paddingLeft: 20, listStyle: 'none' }}>
          <li>★ fé</li>
          <li>★ t_amo_para_siempre</li>
          <li style={{opacity:0.4, textDecoration:'line-through'}}>★ usuario_bloqueado <span style={{fontStyle:'italic'}}>(fue removido)</span></li>
        </ul>
      ),
    })
  }
  const dlg = (title, message, kind = 'info') => () => {
    setOpenMenu(null)
    setDialog({ title, message, kind })
  }

  /* Quotes rotativas para Copiar del disco */
  const quotes = [
    '"prefiero la herida a la indiferencia."',
    '"porque yo sigo ahí en algún rincón · y no hay ficción."',
    '"es un círculo, no una espiral."',
    '"habitaciones infinitas dentro de una misma casa."',
    '"welcome 2 ur last fucking chance!"',
    '"y no me contestás."',
    '"me digo muchas cosas · pero el tiempo sigue pasando."',
    '"lo dije primero · y sigo sosteniéndolo aunque no lo devuelvas."',
  ]
  const copyQuote = () => {
    setOpenMenu(null)
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(q).then(
        () => setDialog({
          title: 'Copiado al portapapeles',
          message: q,
          kind: 'info',
          extra: 'Ya no la vas a mandar.',
        }),
        () => setDialog({ title: 'Copiar', message: q, kind: 'info' })
      )
    } else {
      setDialog({ title: 'Copiar', message: q, kind: 'info' })
    }
  }

  /* ─── Configuración de menús ─── */
  const menus = {
    file: [
      { label: 'Nuevo mensaje',    shortcut: 'Ctrl+N', action: () => { setOpenMenu(null); onOpen('msn', { contact: 'usuario_bloqueado', blocked: true }) } },
      { label: 'Abrir recuerdo...', shortcut: 'Ctrl+O', action: () => { setOpenMenu(null); onOpen('mp3') } },
      { label: 'Imprimir...',       shortcut: 'Ctrl+P', action: () => { setOpenMenu(null); onOpen('ads') } },
      { sep: true },
      { label: 'Cerrar sesión',     action: dlg('Cerrar sesión', 'usuario_bloqueado ya cerró la sesión. No podés cerrar dos veces la misma conversación.', 'error') },
      { label: 'Salir',             action: dlg('Salir', 'Ya te fuiste hace rato.', 'warning') },
    ],
    edit: [
      { label: 'Deshacer',      shortcut: 'Ctrl+Z', action: dlg('Deshacer', 'No se puede deshacer lo dicho el 14 de julio.', 'error') },
      { label: 'Rehacer',       shortcut: 'Ctrl+Y', action: dlg('Rehacer', 'No hay nada para rehacer. Todo pasó.', 'warning') },
      { sep: true },
      { label: 'Copiar',        shortcut: 'Ctrl+C', action: copyQuote },
      { label: 'Pegar',         shortcut: 'Ctrl+V', action: dlg('Pegar', 'El portapapeles guardó "estás ahí?" hace 6h. Nunca la pegaste.', 'info') },
      { sep: true },
      { label: 'Buscar...',     shortcut: 'Ctrl+F', action: () => { setOpenMenu(null); onOpen('limewire') } },
      { label: 'Reemplazar...', action: () => { setOpenMenu(null); onOpen('msn', { contact: 'alguien_como_vos' }) } },
    ],
    view: [
      { label: 'Recargar',                    shortcut: 'F5',  action: dlg('Recargar', 'Listo. Lo mismo de siempre.') },
      { label: 'Historial',                   action: () => { setOpenMenu(null); showHistory() } },
      { label: 'Mostrar bloqueados',          action: () => { setOpenMenu(null); showBlockedCounter() } },
      { sep: true },
      { label: 'Estilos...',                  action: () => { setOpenMenu(null); openThemePicker() } },
      { label: 'Pantalla completa',           shortcut: 'F11', action: () => { setOpenMenu(null); toggleFullscreen() } },
    ],
    navigate: [
      { label: 'Atrás',                       action: dlg('Atrás', 'No podés volver.', 'error') },
      { label: 'Adelante',                    action: dlg('Adelante', 'No hay siguiente. Era todo esto.', 'warning') },
      { label: 'Inicio',                      action: () => { setOpenMenu(null); scrollToTop() } },
      { sep: true },
      { label: 'Favoritos',                   action: () => { setOpenMenu(null); showFavorites() } },
      { label: 'Añadir a favoritos',          action: dlg('Añadir a favoritos', 'Ya lo tuviste como favorito. No lo trajiste de vuelta.', 'warning') },
    ],
    tools: [
      { label: 'Ver código fuente',           shortcut: 'Ctrl+U', action: () => { setOpenMenu(null); setSourceOpen(true) } },
      { label: 'Herramientas de desarrollador', shortcut: 'F12', action: () => { setOpenMenu(null); setDevtoolsOpen(true) } },
      { sep: true },
      { label: 'Preferencias...',             action: () => { setOpenMenu(null); openThemePicker() } },
      { label: 'Historial de búsqueda',       action: () => { setOpenMenu(null); openSearchHistory() } },
    ],
  }

  /* ─── Keyboard shortcuts ─── */
  useEffect(() => {
    const onKey = (e) => {
      const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      /* Function keys funcionan siempre */
      if (e.key === 'F5') { e.preventDefault(); dlg('Recargar', 'Listo. Lo mismo de siempre.')() ; return }
      if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); return }
      if (e.key === 'F12') { e.preventDefault(); setDevtoolsOpen(v => !v); return }
      /* Ctrl+... solo si NO estamos tipeando en un input */
      if ((e.ctrlKey || e.metaKey) && !inInput) {
        const k = e.key.toLowerCase()
        if      (k === 'u') { e.preventDefault(); setSourceOpen(v => !v) }
        else if (k === 'n') { e.preventDefault(); onOpen?.('msn', { contact: 'usuario_bloqueado', blocked: true }) }
        else if (k === 'o') { e.preventDefault(); onOpen?.('mp3') }
        else if (k === 'p') { e.preventDefault(); onOpen?.('ads') }
        else if (k === 'z') { e.preventDefault(); dlg('Deshacer', 'No se puede deshacer lo dicho el 14 de julio.', 'error')() }
        else if (k === 'y') { e.preventDefault(); dlg('Rehacer', 'No hay nada para rehacer. Todo pasó.', 'warning')() }
      }
      /* Ctrl+C, Ctrl+V, Ctrl+F: NO interceptamos — el usuario necesita esos para copiar/pegar/buscar en la página */
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onOpen])

  const goUrl = (e) => {
    e.preventDefault()
    const u = url.toLowerCase()
    if (u.includes('msn'))                                    onOpen('msn')
    else if (u.startsWith('donde://') || u.includes('busca')) onOpen('limewire')
    else if (u.includes('mp3') || u.includes('recording'))    onOpen('mp3')
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
        <span className="mosaic-title">C-Me like the 1st time — welcome 2 ur last fucking chance!</span>
        <span className="mosaic-controls">
          <span className="mc mc-min">_</span>
          <span className="mc mc-max">□</span>
          <span className="mc mc-close">×</span>
        </span>
      </header>

      <nav className="mosaic-menu" ref={menuRef}>
        {/* File · Edit · View · Navigate · Tools — todos interactivos */}
        {['file','edit','view','navigate','tools'].map(name => {
          const capital = name[0].toUpperCase() + name.slice(1)
          const items   = menus[name]
          const isOpen  = openMenu === name
          return (
            <span
              key={name}
              className={`mm mm-clickable ${isOpen ? 'active' : ''}`}
              onClick={() => setOpenMenu(o => (o === name ? null : name))}
            >
              <u>{capital[0]}</u>{capital.slice(1)}
              {isOpen && (
                <div className="mm-dropdown">
                  {items.map((it, i) => it.sep
                    ? <div key={i} className="mm-drop-sep" />
                    : (
                      <div
                        key={i}
                        className="mm-drop-item mm-drop-menuitem"
                        onClick={(e) => { e.stopPropagation(); it.action() }}
                      >
                        <span className="mm-drop-lbl">{it.label}</span>
                        {it.shortcut && <span className="mm-drop-sc">{it.shortcut}</span>}
                      </div>
                    )
                  )}
                </div>
              )}
            </span>
          )
        })}

        {/* Hotlists (contactos) */}
        <span
          className={`mm mm-clickable ${hotOpen ? 'active' : ''}`}
          onClick={() => { setHotOpen(v => !v); setOpenMenu(null) }}
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
          <h1 className="cu-logo cu-logo-img">
            <img
              src="/logo.png"
              alt="C-Me like the 1st time — welcome 2 ur last fucking chance!"
              onError={(e) => {
                /* Si el PNG no está, muestra fallback de texto */
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.nextElementSibling
                if (fb) fb.style.display = 'block'
              }}
            />
            <span className="cu-logo-fallback" style={{ display: 'none' }}>
              C-Me <span className="cu-lasttime">like the 1st time</span>
              <div className="cu-welcome-inline">welcome 2 ur last fucking chance!</div>
            </span>
          </h1>
          {!playerHidden && (
            <div className="cu-inline-player">
              <a
                className="cu-inline-player-dl"
                href="/first-recording.mp3"
                download="first-recording.mp3"
                title="descargar mp3"
                aria-label="descargar"
              >↓</a>
              <button
                className="cu-inline-player-x"
                onClick={() => { setPlayerHidden(true); setApologyOpen(true) }}
                title="cerrar reproductor"
                aria-label="cerrar"
              >×</button>
              <RetroPlayer
                artist="????"
                track="xfavor no t olvides de esto"
                src="/first-recording.mp3"
              />
            </div>
          )}

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
                      <img
                        className="cu-blocked-img"
                        src="/WhatsApp%20Image%202026-07-09%20at%206.44.46%20AM.jpeg"
                        alt="usuario_bloqueado"
                        draggable={false}
                      />
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
              otras lugares donde t busqe
            </p>
            <div className="cu-shortcuts-grid">
              {bookmarks.map(b => (
                <a key={b.app} className="cu-shortcut" onClick={(e) => { e.preventDefault(); onOpen(b.app) }} href="#">
                  <div className="cu-shortcut-icon">{b.icon}</div>
                  <div className="cu-shortcut-lbl">{b.label}</div>
                  <div className="cu-shortcut-url">
                    {b.app === 'msn'      && 'msn://usuario_bloqueado'}
                    {b.app === 'limewire' && 'donde://usuario_bloqueado'}
                    {b.app === 'mp3'      && 'file:///1st-recording.mp3'}
                    {b.app === 'ads'      && 'file:///el_anuncio.pdf'}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <p className="cu-broughtby">
            un recuerdo de <a href="#" onClick={(e)=>{e.preventDefault(); openContact('t_amo_para_siempre')}}>illuno</a>
            &nbsp;·&nbsp;
            dir. x <a href="#" onClick={(e)=>{e.preventDefault(); openContact('fé')}}>fé</a>
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

      {/* ─── Overlays de menus ─── */}
      <MosaicDialog dialog={dialog} onClose={() => setDialog(null)} />
      <SourceViewer open={sourceOpen} onClose={() => setSourceOpen(false)} />
      <FakeDevTools open={devtoolsOpen} onClose={() => setDevtoolsOpen(false)} />
      <ApologyPopup open={apologyOpen} onClose={() => setApologyOpen(false)} />
    </section>
  )
}
