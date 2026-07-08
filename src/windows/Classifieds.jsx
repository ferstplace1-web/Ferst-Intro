import Slot from '../components/Slot'
import './Classifieds.css'

export default function Classifieds({ onClose, onMin }) {
  return (
    <section className="win ads-win">
      <header className="ads-titlebar win-drag">
        <span className="ads-tb-icon">▤</span>
        <span className="ads-tb-text">el_anuncio.pdf — visor de documentos</span>
        <span className="ads-tb-ctrls">
          <button className="mc" onClick={onMin} title="minimizar">_</button>
          <button className="mc" title="maximizar">□</button>
          <button className="mc mc-x" onClick={onClose} title="cerrar">×</button>
        </span>
      </header>

      <div className="ads-paper">
        <header className="ads-masthead">
          <div className="ads-date">sábado 14 de julio</div>
          <h1 className="ads-title">El Anuncio</h1>
          <div className="ads-issue">sección clasificados · $ 0,00 · edición última oportunidad</div>
        </header>

        <div className="ads-rules">
          <span>objetos perdidos</span>
          <span>·</span>
          <span>se busca</span>
          <span>·</span>
          <span>se vende</span>
          <span>·</span>
          <span>fúnebres</span>
        </div>

        <div className="ads-columns">
          {/* Columna 1 — Objetos perdidos */}
          <div className="ads-col">
            <h3 className="ads-head">objetos perdidos</h3>

            <article className="ads-item">
              <p className="ads-lead">extravié</p>
              <p>
                una conversación con <em>usuario_bloqueado</em> el 14 de julio.
                Duraba tres horas y terminaba con la palabra "chau".
                Recompensa: no preguntar por qué. Escribir a <em>t_amo_para_siempre</em>.
              </p>
            </article>

            <article className="ads-item photo">
              <div className="ads-photoslot">
                <Slot dataSrc="/ad-photo-1.jpg" label="FOTO · SIN FIRMAR" aspect="4 / 3" fit="cover" />
              </div>
              <p className="ads-cap">última fotografía conocida · <em>ella</em></p>
            </article>

            <article className="ads-item">
              <p className="ads-lead">perdí</p>
              <p>
                el número. Lo borré pero me lo sigo sabiendo de memoria. Si
                alguien lo tiene guardado en un nokia viejo, contactar a
                <em> te_extraño</em>. No es urgente. Nunca es urgente. Siempre es urgente.
              </p>
            </article>

            <article className="ads-item">
              <p className="ads-lead">se perdió</p>
              <p>
                la voz que decía <em>"voy a estar afuera si me necesitás"</em>.
                Está grabada en <b>memo_001.amr</b>. La escucho todas las noches
                aunque ya no signifique nada. Preguntar por <em>vox_record_001</em>.
              </p>
            </article>
          </div>

          {/* Columna 2 — Se busca / Se vende */}
          <div className="ads-col">
            <h3 className="ads-head">se busca</h3>

            <article className="ads-item">
              <p className="ads-lead">busco</p>
              <p>
                a <em>ella</em>. Camina las mismas calles. Da la misma vuelta.
                Buena presencia, cada vez más flaca. Si la ven, no le digan que
                pregunté. Cualquier información a <em>donde_estas?</em>.
              </p>
            </article>

            <article className="ads-item photo">
              <div className="ads-photoslot small">
                <Slot dataSrc="/ad-photo-2.jpg" label="FOTO · CAM 3AM" aspect="1 / 1" fit="cover" />
              </div>
              <p className="ads-cap">vista desde el hotel de la 9 · sin confirmar</p>
            </article>

            <article className="ads-item">
              <p className="ads-lead">empleo</p>
              <p>
                se solicita persona para atender un teléfono que no suena.
                Horario 22 a 06. Entender que quien llama nunca va a llamar,
                y aún así seguir esperando. Enviar CV a <em>Casilla 33 · Correo Central</em>.
              </p>
            </article>

            <article className="ads-item">
              <p className="ads-lead">se vende</p>
              <p>
                <em>vox_record_001</em>. Cassette virgen con un solo memo grabado.
                14 segundos. Última cosa que dijiste. <b>$ 25 000</b>.
                Llamar tarde, preguntar por quien no atiende.
              </p>
            </article>

            <article className="ads-item">
              <p className="ads-lead">se ofrece</p>
              <p>
                <em>salvacion_plug_24hs</em>. Kiosko de la esquina abierto siempre.
                Cada vez más barato. Conoce a mis hijos, se acuerda de mi nombre,
                me pide que me cuide. La salvación no dura para siempre.
              </p>
            </article>
          </div>

          {/* Columna 3 — Fúnebres */}
          <div className="ads-col">
            <h3 className="ads-head">fúnebres</h3>

            <article className="ads-item obit">
              <p className="ads-obit-name">usuario_bloqueado</p>
              <p className="ads-obit-dates">(desconocida · —)</p>
              <p>
                Su familia digital participa con profundo dolor su retiro del
                clasificado, del sistema, y de la lista de contactos.
                Sus seres queridos ruegan una oración y <b>un mensaje sin leer</b>.
              </p>
            </article>

            <article className="ads-item photo">
              <div className="ads-photoslot tall">
                <Slot dataSrc="/ad-photo-3.jpg" label="RETRATO" aspect="3 / 4" fit="cover" />
              </div>
              <p className="ads-cap">— Q.E.P.D. — cuando mires para arriba y veas mi nombre</p>
            </article>

            <article className="ads-item small">
              <p>
                Los que quieran despedirse pueden hacerlo desde cualquier
                programa de mensajería. Escribirle a <em>dejame_en_paz</em>,
                a <em>ella?</em>, a <em>t_amo_para_siempre</em>. Todos figuran
                como desconectados. Igual.
              </p>
            </article>

            <article className="ads-item obit">
              <p className="ads-obit-name">t_amo_para_siempre</p>
              <p className="ads-obit-dates">(mensaje enviado · nunca entregado)</p>
              <p>
                Lo dije primero. Lo sigo sosteniendo aunque no lo devuelvas.
                Cuando mires para arriba y veas mi nombre <em>allá en las estrellas</em>,
                acordate que yo lo dije primero.
              </p>
            </article>
          </div>
        </div>

        <footer className="ads-foot">
          <span>impresión — talleres illuno</span>
          <span>dirección — fé</span>
          <span>página 47 · última</span>
        </footer>
      </div>
    </section>
  )
}
