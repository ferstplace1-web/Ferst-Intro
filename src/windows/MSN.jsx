import { useMemo, useState } from 'react'
import Slot from '../components/Slot'
import './MSN.css'

/* ─── Historias específicas por contacto ─── */
/*  Nota: cualquier @usuario dentro de text se renderiza como enlace clickeable
    que abre la conversación con ese contacto en una ventana nueva.            */
const LOGS = {
  ella: [
    { t: '22:14', from: 'you',  text: 'ella no me habla más' },
    { t: '22:16', from: 'you',  text: 'hablo de ella en tercera para no llorar' },
    { t: '22:31', from: 'sys',  text: 'ella figura como Desconectada. probá con @ella?' },
    { t: '22:44', from: 'you',  text: 'ella dijo que no' },
    { t: '22:45', from: 'you',  text: 'y después dijo que sí' },
    { t: '22:45', from: 'you',  text: 'y después nunca más nada' },
    { t: '03:02', from: 'you',  text: 'ella ya no existe' },
    { t: '03:02', from: 'you',  text: 'ahora se llama @usuario_bloqueado' },
  ],
  'ella?': [
    { t: '02:14', from: 'you',  text: 'todavía sos vos?' },
    { t: '02:15', from: 'them', text: 'sí' },
    { t: '02:15', from: 'you',  text: 'segura' },
    { t: '02:16', from: 'them', text: 'sí' },
    { t: '02:16', from: 'you',  text: 'ayer también dijiste que sí' },
    { t: '02:17', from: 'them', text: 'no me acuerdo de ayer' },
    { t: '02:17', from: 'sys',  text: 'archivo corrupto — reconstruir con @vox_record_001?' },
    { t: '02:44', from: 'you',  text: 'cuál versión sos hoy' },
    { t: '02:45', from: 'them', text: 'la que necesites' },
    { t: '02:46', from: 'sys',  text: 'quizás sos @alguien_como_vos.' },
    { t: '02:47', from: 'them', text: 'quizás' },
  ],
  'donde_estas?': [
    { t: '03:01', from: 'you',  text: 'donde estás' },
    { t: '03:01', from: 'you',  text: 'te busqué en tu casa vieja' },
    { t: '03:02', from: 'you',  text: 'toqué el timbre' },
    { t: '03:02', from: 'you',  text: 'no había nadie · sólo @ella' },
    { t: '03:14', from: 'you',  text: 'pasé por el hotel de la 9' },
    { t: '03:14', from: 'you',  text: 'ya estabas con @alguien_como_vos' },
    { t: '03:15', from: 'sys',  text: 'donde_estas? no ha respondido en 15 minutos.' },
    { t: '04:22', from: 'you',  text: 'estoy en la esquina de siempre' },
    { t: '04:22', from: 'you',  text: 'llegate si querés' },
    { t: '05:31', from: 'sys',  text: 'nadie llegó. probá @ella? · quizás se acuerda.' },
  ],
  'dejame_en_paz': [
    { t: '01:44', from: 'them', text: 'no me escribas más' },
    { t: '01:44', from: 'you',  text: 'ok' },
    { t: '01:45', from: 'them', text: 'en serio' },
    { t: '01:45', from: 'you',  text: 'ok' },
    { t: '01:47', from: 'them', text: 'estás?' },
    { t: '01:47', from: 'you',  text: 'me pediste que no' },
    { t: '01:48', from: 'them', text: 'ya sé' },
    { t: '01:48', from: 'them', text: 'igual' },
    { t: '01:49', from: 'you',  text: 'igual' },
    { t: '02:03', from: 'them', text: 'venís?' },
    { t: '02:03', from: 'sys',  text: 'la misma versión que te dijo @t_amo_para_siempre.' },
  ],
  usuario_bloqueado: [
    { t: '19:07', from: 'you',  text: 'holaaa' },
    { t: '19:07', from: 'sys',  text: 'este mensaje no pudo entregarse a usuario_bloqueado.' },
    { t: '19:08', from: 'you',  text: 'por qué no me contestás' },
    { t: '19:08', from: 'sys',  text: 'este mensaje no pudo entregarse a usuario_bloqueado. probá con @donde_estas?' },
    { t: '19:09', from: 'sys',  text: 'usuario_bloqueado te ha agregado a su lista de contactos bloqueados.' },
    { t: '02:44', from: 'you',  text: 'qué versión sos hoy' },
    { t: '02:44', from: 'sys',  text: 'este mensaje no pudo entregarse. ver también @ella?' },
    { t: '02:45', from: 'you',  text: 'cuál dice la verdad' },
    { t: '02:45', from: 'sys',  text: 'este mensaje no pudo entregarse.' },
    { t: '02:46', from: 'sys',  text: 'usuario_bloqueado te ha invitado a hablarle otra vez desde @dejame_en_paz.' },
  ],
  'te_extraño': [
    { t: '04:02', from: 'you',  text: 'te extraño aunque me haga mal' },
    { t: '04:03', from: 'you',  text: 'borré tu número · sos @usuario_bloqueado ahora' },
    { t: '04:03', from: 'you',  text: 'pero me lo sé de memoria' },
    { t: '04:14', from: 'you',  text: 'te escribo cartas que no te mando' },
    { t: '04:14', from: 'you',  text: 'ya van 47 · las guardo en @t_amo_para_siempre' },
    { t: '04:15', from: 'sys',  text: 'borrador guardado (te_extraño_borrador_48.doc).' },
    { t: '05:32', from: 'you',  text: 'igual sé que no las vas a leer' },
    { t: '05:32', from: 'you',  text: 'las sigo escribiendo' },
    { t: '05:44', from: 'sys',  text: 'quizás @alguien_como_vos las lea por vos.' },
  ],
  'fé': [
    { t: '14:00', from: 'them', text: 'cómo vas' },
    { t: '14:01', from: 'you',  text: 'mal' },
    { t: '14:01', from: 'them', text: 'bien' },
    { t: '14:02', from: 'them', text: 'seguí grabando igual' },
    { t: '14:14', from: 'you',  text: 'no puedo hoy' },
    { t: '14:14', from: 'them', text: 'eso también es grabar' },
    { t: '14:22', from: 'them', text: 'mi copa siempre va a estar llena mientras tenga fe' },
    { t: '14:22', from: 'you',  text: 'y cuando no la tengo' },
    { t: '14:23', from: 'them', text: 'yo la tengo por vos' },
    { t: '14:33', from: 'them', text: '@usuario_bloqueado no tiene la última palabra' },
    { t: '14:33', from: 'them', text: 'la tenés vos · dale @t_amo_para_siempre y cerramos' },
    { t: '14:34', from: 'you',  text: 'gracias' },
    { t: '14:34', from: 'them', text: 'no me agradezcas · terminá el recuerdo' },
  ],
  vox_record_001: [
    { t: '23:00', from: 'sys',  text: 'reproduciendo memo_001.amr — 00:14' },
    { t: '23:00', from: 'them', text: '(voz) "voy a estar afuera si me necesitás"' },
    { t: '23:00', from: 'them', text: '(voz) "besos"' },
    { t: '23:14', from: 'you',  text: 'lo escucho todas las noches' },
    { t: '23:14', from: 'you',  text: 'aunque ya no signifique nada' },
    { t: '23:15', from: 'sys',  text: 'reproduciendo memo_001.amr — 00:14' },
    { t: '23:16', from: 'sys',  text: 'reproduciendo memo_001.amr — 00:14' },
    { t: '23:16', from: 'sys',  text: 'reproduciendo memo_001.amr — 00:14 · @donde_estas? consulta si seguís.' },
    { t: '23:33', from: 'you',  text: 'era esa la última cosa que dijiste' },
    { t: '23:34', from: 'sys',  text: 'la próxima cosa está en @t_amo_para_siempre.' },
  ],
  't_amo_para_siempre': [
    { t: '22:22', from: 'you',  text: 'te amo' },
    { t: '22:22', from: 'you',  text: 'para siempre' },
    { t: '22:23', from: 'sys',  text: 'mensaje enviado. no entregado. destinatario: @usuario_bloqueado.' },
    { t: '22:23', from: 'you',  text: 'lo dije primero' },
    { t: '22:24', from: 'you',  text: 'lo sigo sosteniendo' },
    { t: '22:24', from: 'you',  text: 'aunque no lo devuelvas' },
    { t: '22:25', from: 'sys',  text: 'mensaje enviado. no entregado.' },
    { t: '23:44', from: 'you',  text: 'cuando mires para arriba y veas mi nombre' },
    { t: '23:44', from: 'you',  text: 'allá en las estrellas' },
    { t: '23:44', from: 'you',  text: 'acordate que yo lo dije primero' },
    { t: '23:45', from: 'sys',  text: '@fé lo dejó grabado por vos.' },
  ],
  salvacion_plug_24hs: [
    { t: '17:22', from: 'you',  text: 'podés a las 3?' },
    { t: '17:24', from: 'them', text: 'si flaca. comé algo antes' },
    { t: '17:25', from: 'you',  text: 'si' },
    { t: '17:25', from: 'them', text: 'mi hija cumple mañana' },
    { t: '17:26', from: 'them', text: '8 años' },
    { t: '17:26', from: 'you',  text: 'felicitala' },
    { t: '17:44', from: 'them', text: 'vas a estar bien?' },
    { t: '18:02', from: 'you',  text: 'siempre' },
    { t: '18:03', from: 'them', text: 'cada vez más flaca' },
    { t: '18:03', from: 'them', text: 'esta te la dejo al mismo precio' },
    { t: '18:04', from: 'them', text: 'cuidate' },
    { t: '18:04', from: 'them', text: 'la salvacion no dura para siempre' },
  ],

  alguien_como_vos: [
    { t: '00:14', from: 'you',  text: 'lo busqué en otros' },
    { t: '00:14', from: 'you',  text: 'a alguien como vos' },
    { t: '00:15', from: 'them', text: 'y' },
    { t: '00:16', from: 'you',  text: 'lo encontré por un segundo' },
    { t: '00:16', from: 'you',  text: 'en un tipo del bar de la 9' },
    { t: '00:17', from: 'you',  text: 'me hablaba parecido' },
    { t: '00:17', from: 'them', text: 'y después' },
    { t: '00:18', from: 'you',  text: 'después no' },
    { t: '00:19', from: 'you',  text: 'después era otro' },
    { t: '00:19', from: 'them', text: 'siempre son otros' },
    { t: '00:22', from: 'sys',  text: 'seguir buscando en @ella? — hay una versión nueva.' },
  ],
}

/* ─── Descripciones cortas para el header ─── */
const MOODS = {
  ella:                 'ella no me habla más',
  'ella?':              'todavía sos vos?',
  'donde_estas?':       'te busqué en todos lados',
  'dejame_en_paz':      'no me escribas más (igual)',
  usuario_bloqueado:    'no quiero hablar con nadie',
  'te_extraño':         'sigo escribiendo cartas que no mando',
  'fé':                 'mi copa siempre va a estar llena mientras tenga fe',
  vox_record_001:       'última cosa que dijiste',
  't_amo_para_siempre': 'lo dije primero',
  salvacion_plug_24hs:  'kiosko de la esquina · 24 hs',
  alguien_como_vos:     'buscándote en otras caras',
}

/* ─── Parse @user references into clickable spans ─── */
function renderText(text, onOpen) {
  // matcha @token con caracteres válidos para handle: letras, dígitos, _, ?, ¿, tilde, ñ
  const re = /@([\w?¿áéíóúñü_]+)/gi
  const out = []
  let last = 0, m, key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const user = m[1]
    out.push(
      <button
        key={`ref-${key++}`}
        className="msn-ref"
        onClick={(e) => {
          e.stopPropagation()
          onOpen?.('msn', { contact: user })
        }}
        title={`abrir chat con ${user}`}
      >
        @{user}
      </button>
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function fallbackLog(name, blocked) {
  if (blocked) {
    return [
      { t: '19:07', from: 'you', text: 'holaaa' },
      { t: '19:07', from: 'sys', text: `este mensaje no pudo entregarse a ${name}.` },
      { t: '19:08', from: 'you', text: 'por qué no me contestás' },
      { t: '19:09', from: 'sys', text: `${name} te ha agregado a su lista de contactos bloqueados.` },
    ]
  }
  return [
    { t: '22:14', from: 'you', text: 'estás ahí?' },
    { t: '22:17', from: 'you', text: 'contestame porfa' },
    { t: '22:31', from: 'sys', text: `${name} no ha respondido en 15 minutos.` },
    { t: '23:02', from: 'you', text: '...' },
    { t: '00:11', from: 'sys', text: `${name} aparece como Desconectado.` },
  ]
}

export default function MSN({
  onClose, onMin, onOpen,
  contact = 'usuario_bloqueado',
  displayName,
  feedSrc,
  blocked = false,
}) {
  const [draft, setDraft] = useState('')
  const [sent, setSent]   = useState([])
  const chatLog = useMemo(
    () => LOGS[contact] || fallbackLog(contact, blocked),
    [contact, blocked]
  )
  const mood = MOODS[contact] || (blocked ? 'no quiero hablar con nadie' : 'sin descripción')

  const send = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    setSent([...sent, { t: 'ahora', text: draft }])
    setDraft('')
  }

  return (
    <section className="win msn-win">
      <header className="msn-title win-drag">
        <span className="msn-t-icon" />
        <span className="msn-t-text">{contact} — conversación</span>
        <span className="msn-t-ctrls">
          <button className="mc mc-min" onClick={onMin} title="minimizar">_</button>
          <button className="mc mc-max" title="maximizar">□</button>
          <button className="mc mc-close" onClick={onClose} title="cerrar">×</button>
        </span>
      </header>

      <nav className="msn-menu">
        {['Archivo','Editar','Ver','Acciones','Ayuda'].map(m => (
          <span key={m} className="msn-m"><u>{m[0]}</u>{m.slice(1)}</span>
        ))}
      </nav>

      <div className="msn-contact">
        <div className="msn-avatar">
          <div className={`msn-avatar-inner ${blocked ? 'blocked' : ''}`}>
            {blocked ? '×' : '●'}
          </div>
        </div>
        <div className="msn-contact-info">
          <div className="msn-contact-name">
            <b>{contact}</b>
            <span className="msn-status">&lt;{contact}@hotmail.com&gt;</span>
          </div>
          <div className="msn-mood">
            <em>"{mood}"</em>
            {displayName && <span className="msn-loc"> · {displayName}</span>}
          </div>
        </div>
        <div className={`msn-presence ${blocked ? 'off' : 'on'}`}>
          {blocked ? 'bloqueado' : 'live now'}
        </div>
      </div>

      <div className="msn-chat">
        <div className="msn-log">
          {chatLog.map((m, i) => (
            <div key={i} className={`msn-msg ${m.from}`}>
              {m.from === 'sys' ? (
                <span className="msn-sys">— {renderText(m.text, onOpen)} —</span>
              ) : (
                <>
                  <span className="msn-msg-from">
                    {m.from === 'you' ? 'yo' : contact} dice ({m.t}):
                  </span>
                  <span className="msn-msg-text">{renderText(m.text, onOpen)}</span>
                </>
              )}
            </div>
          ))}
          {sent.map((m, i) => (
            <div key={`s-${i}`} className="msn-msg you">
              <span className="msn-msg-from">yo dice ({m.t}):</span>
              <span className="msn-msg-text">{renderText(m.text, onOpen)}</span>
            </div>
          ))}
          <div className="msn-typing">
            {blocked
              ? `${contact} no puede recibir mensajes en este momento.`
              : `${contact} no está escribiendo.`}
          </div>
        </div>

        <aside className="msn-cam">
          <div className="msn-cam-title">
            {blocked ? 'cámara (denegada)' : `cam de ${contact}`}
          </div>
          <Slot
            dataSrc={feedSrc}
            label={blocked ? 'CONEXIÓN RECHAZADA' : 'ESPERANDO SEÑAL'}
            aspect="4 / 3"
          />
          <div className="msn-cam-foot">
            <span className={`msn-dot ${blocked ? 'msn-dot-off' : 'msn-dot-on'}`} />
            {blocked ? 'sin respuesta' : 'transmitiendo'}
          </div>
        </aside>
      </div>

      <div className="msn-emobar">
        <button>♡</button><button>✕</button><button>☹</button>
        <button>☾</button><button>✞</button><button>✧</button>
        <span className="msn-emobar-sep" />
        <button className="msn-font"><b>N</b></button>
        <button className="msn-font"><i>K</i></button>
        <button className="msn-font"><u>S</u></button>
      </div>

      <form className="msn-compose" onSubmit={send}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={blocked
            ? 'no podés enviarle mensajes.'
            : `escribile a ${contact}...`}
        />
        <button type="submit" className="msn-send">enviar</button>
      </form>

      <footer className="msn-status">
        <span>última actividad: hace 6 horas</span>
        <span className="msn-status-r">cifrado no disponible</span>
      </footer>
    </section>
  )
}
