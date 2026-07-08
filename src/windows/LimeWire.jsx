import { useState } from 'react'
import Slot from '../components/Slot'
import './LimeWire.css'

/* ─── Resultados: cada archivo referencia a un personaje real.
   Clickear la fila la selecciona (preview a la derecha).
   Doble clic (o botón ▶ abrir) abre la ventana referenciada.       */
const results = [
  {
    name:   'usuario_bloqueado_2004.wmv',
    size:   '14.2 MB', kbps: '256', q: 4, status: 'done',
    src:    '/lw01.mp4',
    author: 'usuario_bloqueado',
    notes:  'lo dije primero · no lo devolviste',
    refs:   ['t_amo_para_siempre', 'te_extraño'],
    opens:  { app: 'msn', props: { contact: 'usuario_bloqueado', blocked: true } },
  },
  {
    name:   'usuario_bloqueado_2004(1).wmv',
    size:   '14.2 MB', kbps: '256', q: 4, status: 'done',
    src:    '/lw01.mp4',
    author: 'usuario_bloqueado',
    notes:  'duplicado — misma cara, misma persona?',
    refs:   ['ella?', 'alguien_como_vos'],
    opens:  { app: 'msn', props: { contact: 'ella?' } },
  },
  {
    name:   'usuario_bloqueado_2004(2)_FAKE.wmv',
    size:   '3.2 MB', kbps: '48', q: 1, status: 'error',
    author: 'anónimo',
    notes:  'archivo dañado · una versión que no me acuerdo',
    refs:   ['ella?'],
    opens:  { app: 'msn', props: { contact: 'ella?' } },
  },
  {
    name:   'vox_record_001_(ultima_cosa).amr',
    size:   '412 KB', kbps: '32', q: 3, status: 'done',
    author: 'vox_record_001',
    notes:  '"voy a estar afuera si me necesitás" · 00:14',
    refs:   ['vox_record_001', 't_amo_para_siempre'],
    opens:  { app: 'msn', props: { contact: 'vox_record_001' } },
  },
  {
    name:   'te_extraño_borrador_47.doc',
    size:   '38 KB', kbps: '—', q: 5, status: 'done',
    author: 'te_extraño',
    notes:  'sé que no lo vas a leer',
    refs:   ['te_extraño', 'usuario_bloqueado'],
    opens:  { app: 'msn', props: { contact: 'te_extraño' } },
  },
  {
    name:   'te_extraño_borrador_48.doc',
    size:   '41 KB', kbps: '—', q: 5, status: 'done',
    author: 'te_extraño',
    notes:  'guardado automático — 05:44',
    refs:   ['te_extraño', 'alguien_como_vos'],
    opens:  { app: 'msn', props: { contact: 'te_extraño' } },
  },
  {
    name:   'ella_no_vuelve.rm',
    size:   '3.1 MB', kbps: '128', q: 2, status: 'stall',
    author: 'ella',
    notes:  'conexión interrumpida · reintentar?',
    refs:   ['ella', 'usuario_bloqueado'],
    opens:  { app: 'msn', props: { contact: 'ella' } },
  },
  {
    name:   'ella?_versiones_del_lunes.mpg',
    size:   '8.9 MB', kbps: '128', q: 3, status: 'queue',
    author: 'ella?',
    notes:  'múltiples versiones detectadas · elegí una',
    refs:   ['ella?', 'alguien_como_vos'],
    opens:  { app: 'msn', props: { contact: 'ella?' } },
  },
  {
    name:   'camara_hotel_9_(piso_3).wmv',
    size:   '22.4 MB', kbps: '512', q: 5, status: 'dl', p: 12,
    src:    '/lw02.mp4',
    author: 'donde_estas?',
    notes:  'vigilancia · tercera puerta a la izquierda',
    refs:   ['dejame_en_paz', 'alguien_como_vos'],
    opens:  { app: 'msn', props: { contact: 'dejame_en_paz' } },
  },
  {
    name:   'alguien_como_vos_intento_3.wmv',
    size:   '4.8 MB', kbps: '192', q: 3, status: 'dl', p: 63,
    author: 'alguien_como_vos',
    notes:  'bar de la 9 · segunda planta',
    refs:   ['alguien_como_vos', 'usuario_bloqueado'],
    opens:  { app: 'msn', props: { contact: 'alguien_como_vos' } },
  },
  {
    name:   't_amo_para_siempre_(sin_enviar).txt',
    size:   '2 KB', kbps: '—', q: 5, status: 'done',
    author: 't_amo_para_siempre',
    notes:  '"lo dije primero" · destinatario: usuario_bloqueado',
    refs:   ['t_amo_para_siempre', 'fé'],
    opens:  { app: 'msn', props: { contact: 't_amo_para_siempre' } },
  },
  {
    name:   'dejame_en_paz_(igual_veni).mp3',
    size:   '5.6 MB', kbps: '128', q: 3, status: 'queue',
    author: 'dejame_en_paz',
    notes:  'voz baja · loop de 4 palabras',
    refs:   ['dejame_en_paz', 't_amo_para_siempre'],
    opens:  { app: 'msn', props: { contact: 'dejame_en_paz' } },
  },
  {
    name:   'fé_toma_directora_04.mov',
    size:   '4.8 MB', kbps: '192', q: 5, status: 'done',
    author: 'fé',
    notes:  '"terminá el recuerdo" · toma sin cortes, 24fps',
    refs:   ['fé', 't_amo_para_siempre'],
    opens:  { app: 'msn', props: { contact: 'fé' } },
  },
  {
    name:   'salvacion_plug_horarios_kiosko.txt',
    size:   '1 KB', kbps: '—', q: 5, status: 'done',
    author: 'salvacion_plug_24hs',
    notes:  'abierto 24hs · comé algo antes',
    refs:   ['salvacion_plug_24hs'],
    opens:  { app: 'msn', props: { contact: 'salvacion_plug_24hs' } },
  },
  {
    name:   'el_anuncio.pdf',
    size:   '512 KB', kbps: '—', q: 5, status: 'done',
    author: 'talleres illuno · dirección fé',
    notes:  'página 47 · última · fúnebres',
    refs:   ['usuario_bloqueado', 't_amo_para_siempre', 'fé'],
    opens:  { app: 'ads', props: {} },
  },
  {
    name:   'archivo_corrupto_NO_ABRIR.exe',
    size:   '0.6 MB', kbps: '—', q: 1, status: 'error',
    author: 'desconocido',
    notes:  '"no lo hagas hermoso esta vez"',
    refs:   [],
    opens:  null,
  },
]

function Bars({ n }) {
  return (
    <span className="lw-bars">
      {[1,2,3,4,5].map(i => <span key={i} className={`lw-bar ${i <= n ? 'on' : ''}`} />)}
    </span>
  )
}
function Status({ s, p }) {
  if (s === 'done')  return <span className="lw-st done">completado</span>
  if (s === 'dl')    return <span className="lw-st dl">descargando {p}%</span>
  if (s === 'stall') return <span className="lw-st stall">interrumpido</span>
  if (s === 'queue') return <span className="lw-st queue">en cola</span>
  if (s === 'error') return <span className="lw-st err">sospechoso</span>
  return null
}

export default function LimeWire({ onClose, onMin, onOpen }) {
  const [selected, setSelected] = useState(0)
  const [query, setQuery]       = useState('usuario_bloqueado')
  const current = results[selected]

  const openResult = () => {
    if (!current.opens) return
    onOpen?.(current.opens.app, current.opens.props || {})
  }

  const openRef = (user) => {
    onOpen?.('msn', { contact: user })
  }

  return (
    <section className="win lw-win">
      <header className="lw-title win-drag">
        <span className="lw-t-icon" />
        <span className="lw-t-text">donde_estas? — búsqueda global</span>
        <span className="lw-ctrls">
          <button className="mc" onClick={onMin} title="minimizar">_</button>
          <button className="mc" title="maximizar">□</button>
          <button className="mc mc-x" onClick={onClose} title="cerrar">×</button>
        </span>
      </header>

      <nav className="lw-menu">
        {['Archivo','Ver','Herramientas','Ayuda'].map(m => (
          <span key={m}><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </nav>

      <div className="lw-tabs">
        {['buscar','monitor','biblioteca','conexiones'].map((t,i) => (
          <span key={t} className={`lw-tab ${i===0 ? 'active' : ''}`}>{t}</span>
        ))}
      </div>

      <div className="lw-searchbar">
        <label>donde está</label>
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
        <select defaultValue="cualquier tipo">
          <option>cualquier tipo</option>
          <option>audio</option>
          <option>video</option>
          <option>texto</option>
        </select>
        <button className="lw-btn-search">buscar</button>
      </div>

      <div className="lw-body">
        <div className="lw-results">
          <div className="lw-results-head">
            <span>nombre</span>
            <span>tamaño</span>
            <span>calidad</span>
            <span>kbps</span>
            <span>estado</span>
          </div>
          {results.map((r, i) => (
            <div
              key={i}
              className={`lw-row ${selected === i ? 'sel' : ''} ${r.status}`}
              onClick={() => setSelected(i)}
              onDoubleClick={() => { setSelected(i); if (r.opens) onOpen?.(r.opens.app, r.opens.props || {}) }}
              title={r.opens ? 'clic para previsualizar · doble clic para abrir' : 'archivo no accesible'}
            >
              <span className="lw-name">
                <span className="lw-icon">
                  {r.name.endsWith('.mp3') || r.name.endsWith('.wav') || r.name.endsWith('.amr') ? '♪' :
                   r.name.endsWith('.exe') ? '⚠' :
                   r.name.endsWith('.txt') || r.name.endsWith('.doc') ? '▤' :
                   r.name.endsWith('.pdf') ? '▤' : '▶'}
                </span>
                {r.name}
              </span>
              <span>{r.size}</span>
              <span><Bars n={r.q} /></span>
              <span>{r.kbps}</span>
              <span><Status s={r.status} p={r.p} /></span>
            </div>
          ))}
        </div>

        <aside className="lw-preview">
          <div className="lw-preview-title">vista previa</div>

          <Slot
            dataSrc={current.src}
            label={current.status === 'error' ? 'ARCHIVO CORRUPTO' : 'VISTA PREVIA'}
            aspect="4 / 3"
          />

          <div className="lw-preview-name">{current.name}</div>

          <div className="lw-preview-meta">
            <div><b>tamaño</b> {current.size} · {current.kbps} kbps</div>
            <div><b>autor</b> {current.author}</div>
            <div><b>notas</b> {current.notes}</div>
          </div>

          {current.refs.length > 0 && (
            <div className="lw-preview-refs">
              <b>referencias:</b>
              {current.refs.map(u => (
                <button
                  key={u}
                  className="lw-ref"
                  onClick={() => openRef(u)}
                  title={`abrir chat con ${u}`}
                >
                  @{u}
                </button>
              ))}
            </div>
          )}

          {current.opens ? (
            <button className="lw-preview-play" onClick={openResult}>
              ▶ abrir {current.opens.app === 'ads' ? 'el anuncio' : `chat de ${current.opens.props.contact}`}
            </button>
          ) : (
            <button className="lw-preview-play disabled" disabled>
              archivo no accesible
            </button>
          )}
        </aside>
      </div>

      <footer className="lw-foot">
        <span>compartiendo 0 archivos</span>
        <span>4 hosts · velocidad 0 KB/s</span>
        <span className="lw-online">conectado a donde_estas?.net</span>
      </footer>
    </section>
  )
}
