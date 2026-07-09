import { useState } from 'react'
import './FakeDevTools.css'

/**
 * DevTools falsos — panel flotante estilo Chrome DevTools con 3 tabs.
 * Cada tab muestra "debug info" en clave narrativa del disco.
 */
export default function FakeDevTools({ open, onClose }) {
  const [tab, setTab] = useState('console')
  if (!open) return null

  return (
    <div className="fdt" role="dialog" aria-modal="true">
      <header className="fdt-tabs">
        <div className="fdt-tab-group">
          {['console', 'network', 'elements'].map(t => (
            <button
              key={t}
              className={`fdt-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'console'  && 'Console'}
              {t === 'network'  && 'Network'}
              {t === 'elements' && 'Elements'}
            </button>
          ))}
        </div>
        <button className="fdt-close" onClick={onClose} title="cerrar devtools">×</button>
      </header>

      <div className="fdt-body">
        {tab === 'console'  && <ConsoleTab />}
        {tab === 'network'  && <NetworkTab />}
        {tab === 'elements' && <ElementsTab />}
      </div>
    </div>
  )
}

/* ─── Console tab ─── */
function ConsoleTab() {
  const lines = [
    { level: 'error',   text: 'Failed to deliver message to usuario_bloqueado (403 Forbidden)' },
    { level: 'error',   text: 'Failed to deliver message to usuario_bloqueado (403 Forbidden)' },
    { level: 'error',   text: 'Failed to deliver message to usuario_bloqueado (403 Forbidden)' },
    { level: 'warn',    text: '[Deprecation] "1_last_time" será removido en la próxima versión — usar "like_the_1st_time"' },
    { level: 'info',    text: 'Reconnected to c-me.net · 9 streams active · 1 refused' },
    { level: 'log',     text: 'draft autoguardado: "estas ahi?" (te_extraño_borrador_49.doc)' },
    { level: 'error',   text: 'Uncaught RelationshipError: cannot read property "vos" of undefined' },
    { level: 'log',     text: 'reproduciendo memo_001.amr · 00:14 · loop 47' },
    { level: 'warn',    text: 'archivo dañado — ella?_versiones_del_lunes.mpg (checksum mismatch)' },
    { level: 'error',   text: 'Failed to deliver message to usuario_bloqueado (403 Forbidden)' },
    { level: 'info',    text: 'fé está observando desde afuera del cuadro' },
    { level: 'log',     text: 'time_since_last_response: 6h 22m 14s (aún contando)' },
  ]
  return (
    <div className="fdt-console">
      {lines.map((l, i) => (
        <div key={i} className={`fdt-line fdt-line-${l.level}`}>
          <span className="fdt-line-icon">
            {l.level === 'error' ? '⊗' : l.level === 'warn' ? '△' : l.level === 'info' ? 'ℹ' : '›'}
          </span>
          <span className="fdt-line-txt">{l.text}</span>
        </div>
      ))}
      <div className="fdt-prompt">
        <span className="fdt-prompt-arrow">›</span>
        <span className="fdt-prompt-cursor">_</span>
      </div>
    </div>
  )
}

/* ─── Network tab ─── */
function NetworkTab() {
  const requests = [
    { method: 'GET',  url: '/api/messages?to=usuario_bloqueado', status: 403, time: '124ms',  size: '0 B',    type: 'xhr' },
    { method: 'POST', url: '/api/messages',                       status: 403, time: '98ms',   size: '0 B',    type: 'xhr' },
    { method: 'POST', url: '/api/messages',                       status: 403, time: '112ms',  size: '0 B',    type: 'xhr' },
    { method: 'GET',  url: '/logo.png',                           status: 200, time: '14ms',   size: '32 KB',  type: 'img' },
    { method: 'GET',  url: '/wacha.png',                          status: 200, time: '18ms',   size: '29 KB',  type: 'img' },
    { method: 'GET',  url: '/carpeta%20audio.png',                status: 200, time: '22ms',   size: '30 KB',  type: 'img' },
    { method: 'GET',  url: '/1.gif',                              status: 200, time: '640ms',  size: '1.5 MB', type: 'img' },
    { method: 'POST', url: '/api/messages',                       status: 403, time: '103ms',  size: '0 B',    type: 'xhr' },
    { method: 'GET',  url: '/api/status?u=usuario_bloqueado',     status: 200, time: '89ms',   size: '48 B',   type: 'xhr' },
    { method: 'WS',   url: 'wss://c-me.net/live',                 status: 101, time: 'pending', size: '—',     type: 'ws' },
    { method: 'GET',  url: '/api/vox_record_001.amr',             status: 200, time: '410ms',  size: '412 KB', type: 'audio' },
    { method: 'POST', url: '/api/messages',                       status: 403, time: '115ms',  size: '0 B',    type: 'xhr' },
  ]
  return (
    <div className="fdt-network">
      <div className="fdt-net-head">
        <span>método</span>
        <span>url</span>
        <span>status</span>
        <span>tipo</span>
        <span>tiempo</span>
        <span>tamaño</span>
      </div>
      {requests.map((r, i) => (
        <div key={i} className={`fdt-net-row fdt-net-${r.status >= 400 ? 'err' : 'ok'}`}>
          <span className="fdt-net-method">{r.method}</span>
          <span className="fdt-net-url">{r.url}</span>
          <span className="fdt-net-status">{r.status}</span>
          <span>{r.type}</span>
          <span>{r.time}</span>
          <span>{r.size}</span>
        </div>
      ))}
      <div className="fdt-net-summary">
        12 requests · 8 failed · 4 completed · total: ~2.1 MB
      </div>
    </div>
  )
}

/* ─── Elements tab ─── */
function ElementsTab() {
  return (
    <div className="fdt-elements">
      <pre className="fdt-html">
{`<html data-theme="silkroad" lang="es">
  <body class="not-empty">
    <div id="root">
      <div class="os" data-mood="obsesivo">
        <cu-see-me>
          <feed handle="ella"                title="ella no me habla más"       state="online"    />
          <feed handle="ella?"               title="todavía sos vos?"           state="unknown"   />
          <feed handle="donde_estas?"        title="te busqué en todos lados"   state="searching" />
          <feed handle="dejame_en_paz"       title="no me escribas más"         state="paradox"   />
          `}<span className="hl">{`<feed handle="usuario_bloqueado"   title="CONEXIÓN RECHAZADA"        class="blocked"   ⇐ selected`}</span>{`
          <feed handle="te_extraño"          title="aunque me haga mal"         state="drafting"  />
          <feed handle="fé"                  title="mi copa siempre va a estar" state="directing" views="1" />
          <feed handle="vox_record_001"      title="última cosa que dijiste"    state="looping"   />
          <feed handle="t_amo_para_siempre"  title="lo dije primero"            state="undelivered" />
        </cu-see-me>
      </div>
    </div>
  </body>
</html>`}
      </pre>
    </div>
  )
}
