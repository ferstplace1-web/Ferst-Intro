import './ApologyPopup.css'

/**
 * Popup "I'm sorry please come back" — aparece cuando el usuario cierra
 * el RetroPlayer fijo de la home.
 *
 * Contenido: aforismos-metáfora sobre patrones, casas embrujadas y ciclos
 * de retorno. Se omiten las líneas de imaginería directa (blood/knife/wounds)
 * — el latido emocional queda cubierto por las metáforas.
 */
const APHORISMS = [
  'HAUNTED HOUSES ONLY WORK IF YOU KEEP WALKING IN',
  'RENOVATING THE ROOMS DOES NOT REMOVE THE GHOST',
  'CIRCLES FEEL LIKE PROGRESS WHEN YOU DON’T LOOK DOWN',
  'EVERY DOOR LEADS BACK TO THE SAME ROOM',
  'NEW BODIES DO NOT CHANGE OLD GHOSTS',
  'THE SAME PERSON WEARS A DIFFERENT FACE EACH TIME',
  'DISGUST IS RECOGNITION IN DISGUISE',
  'REPETITION DISGUISED AS NOVELTY IS STILL A PATTERN',
  'THE HOUSE IS NOT HAUNTED, YOU ARE',
  'REPEATING A MISTAKE CAN FEEL LIKE A CHOICE',
  'THE MAP HAS NO EXITS BECAUSE YOU DREW IT',
  'MEMORY IS A HOUSE YOU KEEP BUYING BACK',
  'THE MIRROR REMEMBERS WHAT YOU FORGOT',
  'ANY PLACE CAN BECOME A ROOM YOU CAN’T LEAVE',
  'PATTERN IS A LULLABY YOU SANG TO YOURSELF',
]

export default function ApologyPopup({ open, onClose }) {
  if (!open) return null
  return (
    <>
      <div className="apop-backdrop" onClick={onClose} />
      <div className="apop" role="dialog" aria-modal="true" aria-labelledby="apop-title">
        <header className="apop-title-bar">
          <span className="apop-tb-text">Prompt</span>
          <button className="apop-tb-close" onClick={onClose} title="cerrar">×</button>
        </header>
        <h2 id="apop-title" className="apop-title">I’m sorry please come back</h2>
        <div className="apop-scroll">
          <ul className="apop-list">
            {APHORISMS.map((line, i) => (
              <li key={i} className="apop-line">{line}</li>
            ))}
          </ul>
        </div>
        <footer className="apop-foot">
          <button className="apop-btn" onClick={onClose}>OK</button>
        </footer>
      </div>
    </>
  )
}
