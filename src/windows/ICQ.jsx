import Slot from '../components/Slot'
import './ICQ.css'

const history = [
  { date: 'Vie 15/07 · 23:41', from: 'me',   text: 'estás?' },
  { date: 'Vie 15/07 · 23:42', from: 'me',   text: 'me acuerdo cuando nos escribiamos por acá' },
  { date: 'Vie 15/07 · 23:58', from: 'sys',  text: 'El mensaje se envió al buzón fuera de línea.' },
  { date: 'Sáb 16/07 · 02:03', from: 'me',   text: 'no importa' },
  { date: 'Sáb 16/07 · 02:04', from: 'me',   text: 'era solo por saludar' },
  { date: 'Dom 17/07 · 19:22', from: 'sys',  text: 'Adjunto: recuerdo.mov (2,4 MB)' },
  { date: 'Lun 18/07 · 08:11', from: 'sys',  text: 'Usuario bloqueado ha desactivado los mensajes fuera de línea.' },
]

export default function ICQ({ onClose, onMin }) {
  return (
    <section className="win icq-win">
      <header className="icq-title win-drag">
        <span className="icq-flower">✿</span>
        <span className="icq-title-text">ICQ 2003b — Mensajes con Usuario bloqueado</span>
        <span className="icq-ctrls">
          <button className="mc" onClick={onMin} title="Minimizar">_</button>
          <button className="mc" title="Maximizar">□</button>
          <button className="mc mc-x" onClick={onClose} title="Cerrar">×</button>
        </span>
      </header>

      <div className="icq-body">
        <aside className="icq-side">
          <div className="icq-me">
            <div className="icq-me-flower">✿</div>
            <div>
              <div className="icq-me-nick">yo</div>
              <div className="icq-me-num">#284-916-733</div>
            </div>
          </div>
          <div className="icq-side-title">Contactos</div>
          <ul className="icq-contacts">
            <li className="on"><span className="icq-flower on">✿</span> Usuario bloqueado</li>
            <li><span className="icq-flower off">✿</span> mamá</li>
            <li><span className="icq-flower off">✿</span> nadie más</li>
          </ul>
          <div className="icq-status-picker">
            <select defaultValue="Ocupado">
              <option>Disponible</option>
              <option>Ocupado</option>
              <option>Invisible</option>
              <option>Fuera</option>
            </select>
          </div>
        </aside>

        <main className="icq-main">
          <div className="icq-tabs">
            <div className="icq-tab active">Historial</div>
            <div className="icq-tab">Info</div>
            <div className="icq-tab">Archivos</div>
          </div>

          <div className="icq-history">
            {history.map((h, i) => (
              <div key={i} className={`icq-entry ${h.from}`}>
                <div className="icq-entry-date">{h.date}</div>
                <div className="icq-entry-text">
                  {h.from === 'sys' ? <em>· {h.text} ·</em> : h.text}
                </div>
              </div>
            ))}

            <div className="icq-attachment">
              <div className="icq-att-title">📎 recuerdo.mov</div>
              <Slot
                dataSrc="/icq-recuerdo.mp4"
                label="ARCHIVO PROTEGIDO"
                aspect="16 / 10"
              />
              <div className="icq-att-foot">Enviado por: yo · Recibido: nunca</div>
            </div>
          </div>

          <div className="icq-compose">
            <textarea placeholder="Escribí un mensaje offline..." />
            <button>Enviar</button>
          </div>
        </main>
      </div>

      <footer className="icq-foot">
        <span>Servidor: login.icq.com</span>
        <span>Contactos: 1 conectado · 2 ausentes</span>
      </footer>
    </section>
  )
}
