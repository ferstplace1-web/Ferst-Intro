import { useEffect, useRef, useState } from 'react'
import './Slot.css'

/**
 * Slot: contenedor drag-and-drop / click-to-browse para video o imagen.
 * Props:
 *   - dataSrc: ruta local opcional (ej. "/cam01.mp4") a auto-cargar si existe
 *   - label:   texto del overlay "sin señal"
 *   - className: clases extra
 *   - aspect:  aspect-ratio css (default '4 / 3')
 *   - fit:     'cover' | 'contain' (default 'cover')
 */
export default function Slot({
  dataSrc,
  label = 'SIN SEÑAL',
  className = '',
  aspect = '4 / 3',
  fit = 'cover',
  style,
}) {
  const [mediaUrl, setMediaUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'video' | 'image'
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  // Auto-cargar data-src si existe al montar
  useEffect(() => {
    if (!dataSrc) return
    let cancelled = false
    fetch(dataSrc, { method: 'HEAD' })
      .then((r) => {
        if (cancelled || !r.ok) return
        const ext = dataSrc.split('.').pop().toLowerCase()
        const isVideo = ['mp4', 'webm', 'mov', 'ogg', 'ogv', 'm4v'].includes(ext)
        setMediaUrl(dataSrc)
        setMediaType(isVideo ? 'video' : 'image')
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [dataSrc])

  const loadFile = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setMediaUrl(url)
    setMediaType(file.type.startsWith('video/') ? 'video' : 'image')
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    loadFile(file)
  }

  return (
    <div
      className={`slot ${className} ${dragOver ? 'is-drag' : ''} ${mediaUrl ? 'has-media' : ''}`}
      data-slot
      style={{ aspectRatio: aspect, ...style }}
      onClick={(e) => {
        // no re-abrir picker si clickea sobre el video ya cargado
        if (mediaUrl) return
        inputRef.current?.click()
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      title={mediaUrl ? '' : 'Arrastrá un video/imagen o hacé clic'}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,image/*"
        style={{ display: 'none' }}
        onChange={(e) => loadFile(e.target.files && e.target.files[0])}
      />

      {mediaUrl && mediaType === 'video' && (
        <video
          className="slot-media"
          src={mediaUrl}
          autoPlay
          loop
          muted
          playsInline
          style={{ objectFit: fit }}
        />
      )}
      {mediaUrl && mediaType === 'image' && (
        <img
          className="slot-media"
          src={mediaUrl}
          alt=""
          style={{ objectFit: fit }}
        />
      )}

      {!mediaUrl && (
        <div className="slot-empty">
          <div className="slot-noise" />
          <div className="slot-bars" />
          <span className="slot-label">{label}</span>
          <span className="slot-sub">no signal · drop file</span>
        </div>
      )}
    </div>
  )
}
