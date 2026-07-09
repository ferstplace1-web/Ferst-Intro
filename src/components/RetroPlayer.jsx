import { useEffect, useRef, useState } from 'react'
import './RetroPlayer.css'

/**
 * Reproductor de audio estilo Windows XP media player.
 *
 * Modos:
 *  1. Single track: pasar `src` + `track` (texto).
 *  2. Playlist:     pasar `tracks` (array de { file, name }).
 *     - El campo Track muestra el nombre del archivo actual.
 *     - El botón <D:> de la fila Track abre un dropdown real con los 12 tracks.
 *     - Los botones ◀◀ / ▶▶ pasan al track anterior / siguiente.
 */
export default function RetroPlayer({
  src,
  artist = '????',
  track = 'xfavor no t olvides de esto',
  coverSrc,
  tracks = null,
}) {
  const audioRef = useRef(null)
  const wrapRef  = useRef(null)
  const [playing, setPlaying]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [idx, setIdx]           = useState(0)
  const [dropOpen, setDropOpen] = useState(false)

  const hasList  = Array.isArray(tracks) && tracks.length > 0
  const current  = hasList ? tracks[idx] : null
  const audioSrc = hasList ? current?.file : src
  const trackTxt = hasList ? (current?.name || current?.file || '') : track

  /* ── Audio event bindings ─────────────────────────────── */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime   = () => setProgress(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnded  = () => {
      if (hasList && idx < tracks.length - 1) {
        setIdx(i => i + 1)
      } else {
        setPlaying(false)
      }
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioSrc, hasList, idx, tracks])

  /* Al cambiar de track — reset progress y auto-play si ya estaba sonando */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setProgress(0)
    if (playing) {
      audio.play().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  /* Click fuera → cerrar dropdown */
  useEffect(() => {
    if (!dropOpen) return
    const onDoc = (e) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [dropOpen])

  /* ── Controles ────────────────────────────────────────── */
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }
  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause(); audio.currentTime = 0
    setPlaying(false); setProgress(0)
  }
  const prev = () => {
    if (hasList) {
      setIdx(i => (i - 1 + tracks.length) % tracks.length)
    } else {
      skip(-10)
    }
  }
  const next = () => {
    if (hasList) {
      setIdx(i => (i + 1) % tracks.length)
    } else {
      skip(10)
    }
  }
  const skip = (delta) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(duration || 0, audio.currentTime + delta))
  }
  const scrub = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const val = Number(e.target.value)
    audio.currentTime = (val / 100) * duration
    setProgress(audio.currentTime)
  }
  const pickTrack = (i) => {
    setIdx(i)
    setDropOpen(false)
    // usuario elige explícitamente → arrancar reproducción
    setPlaying(true)
    // el useEffect de idx se encarga de audio.play()
  }

  const canControl = !!audioSrc

  return (
    <div className="retro-player" ref={wrapRef}>
      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      <div className="rp-cover">
        {coverSrc ? (
          <img src={coverSrc} alt="album cover" />
        ) : (
          <span className="rp-cover-txt">(album<br/>cover<br/>here)</span>
        )}
      </div>

      <div className="rp-body">
        <div className="rp-field">
          <label>Artist:</label>
          <input type="text" value={artist} readOnly onChange={() => {}} />
          <button className="rp-drop" tabIndex={-1}>
            &lt;D:&gt;<span className="rp-arrow">▼</span>
          </button>
        </div>

        <div className="rp-field rp-field-track">
          <label>Track:</label>
          <input type="text" value={trackTxt} readOnly onChange={() => {}} />
          <button
            className="rp-drop"
            onClick={() => hasList && setDropOpen(o => !o)}
            title={hasList ? 'elegir track' : undefined}
            disabled={!hasList}
          >
            &lt;D:&gt;<span className="rp-arrow">▼</span>
          </button>
          {hasList && dropOpen && (
            <ul className="rp-drop-menu" role="listbox">
              {tracks.map((t, i) => (
                <li
                  key={i}
                  role="option"
                  aria-selected={i === idx}
                  className={`rp-drop-item ${i === idx ? 'is-current' : ''}`}
                  onClick={() => pickTrack(i)}
                  title={t.name || t.file}
                >
                  <span className="rp-drop-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="rp-drop-name">{t.name || t.file}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rp-progress-wrap">
          <input
            className="rp-progress"
            type="range"
            min="0" max="100"
            step="0.1"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={scrub}
            disabled={!canControl}
          />
        </div>

        <div className="rp-buttons">
          {/* ︎ = VARIATION SELECTOR-15: fuerza render texto (no color emoji en iOS) */}
          <button className="rp-btn" title={hasList ? 'track anterior' : 'anterior'} onClick={prev} disabled={!canControl}>
            <span className="rp-ico">{'◀︎◀︎'}</span>
          </button>
          <button className="rp-btn" title={hasList ? 'track siguiente' : 'siguiente'} onClick={next} disabled={!canControl}>
            <span className="rp-ico">{'▶︎▶︎'}</span>
          </button>
          <button className="rp-btn" title={playing ? 'pausar' : 'reproducir'} onClick={togglePlay} disabled={!canControl}>
            <span className="rp-ico">{playing ? '❙❙' : '▶︎'}</span>
          </button>
          <button className="rp-btn" title="detener" onClick={stop} disabled={!canControl}>
            <span className="rp-ico rp-ico-sq">{'■︎'}</span>
          </button>
          <button className="rp-btn" title="grabar" disabled>
            <span className="rp-ico rp-ico-rec">{'●︎'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
