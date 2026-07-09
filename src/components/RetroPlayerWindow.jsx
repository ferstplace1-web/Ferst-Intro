import RetroPlayer from './RetroPlayer'
import './RetroPlayerWindow.css'

/**
 * Wrapper de RetroPlayer con titlebar Aero — se usa como ventana flotante
 * arrastrable en el WM. Contiene la playlist de "notas de voz eliminadas".
 */

// 12 tracks — public/track/*.mp3 (nombres tal cual el archivo)
const DEFAULT_TRACKS = [
  { file: '/track/1.%20Laintencion.mp3',              name: '1. Laintencion.mp3' },
  { file: '/track/2.%20hace%20cuanto%20no%20ves%20.mp3', name: '2. hace cuanto no ves .mp3' },
  { file: '/track/3.%20amodia.mp3',                   name: '3. amodia.mp3' },
  { file: '/track/4.%20Nota%20mortal.mp3',            name: '4. Nota mortal.mp3' },
  { file: '/track/5.%20Lavuelta.mp3',                 name: '5. Lavuelta.mp3' },
  { file: '/track/6.%20Asisigo.mp3',                  name: '6. Asisigo.mp3' },
  { file: '/track/7.%20Tu%20imagina.mp3',             name: '7. Tu imagina.mp3' },
  { file: '/track/8.%20PUESTA.mp3',                   name: '8. PUESTA.mp3' },
  { file: '/track/9.%20Laflema.mp3',                  name: '9. Laflema.mp3' },
  { file: '/track/10.%20directoenelheart3.mp3',       name: '10. directoenelheart3.mp3' },
  { file: '/track/no%20tengo%20ganas.mp3',            name: 'no tengo ganas.mp3' },
  { file: '/track/q%20sera%20de%20hoy.mp3',           name: 'q sera de hoy.mp3' },
]

export default function RetroPlayerWindow({
  onClose, onMin, onMax, isMaximized,
  artist    = '????',
  coverSrc,
  fileName  = '.elsonidodetuvoz',
  tracks    = DEFAULT_TRACKS,
}) {
  return (
    <section className="win rpw-win">
      <header className="rpw-title win-drag">
        <span className="rpw-t-icon" />
        <span className="rpw-t-text">{fileName}</span>
        <span className="rpw-t-ctrls">
          <button className="mc" onClick={onMin} title="minimizar">_</button>
          <button className="mc" onClick={onMax} title={isMaximized ? 'restaurar' : 'maximizar'}>{isMaximized ? '❐' : '□'}</button>
          <button className="mc mc-x" onClick={onClose} title="cerrar">×</button>
        </span>
      </header>

      <div className="rpw-body">
        <RetroPlayer
          artist={artist}
          coverSrc={coverSrc}
          tracks={tracks}
        />
      </div>
    </section>
  )
}
