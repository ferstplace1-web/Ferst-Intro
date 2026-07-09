import { useEffect, useRef, useState } from 'react'
import './WindowFrame.css'

/**
 * Contenedor draggable para ventanas flotantes.
 * - Drag por elemento con clase .win-drag (funciona en mouse Y touch)
 * - Click en cualquier parte trae al frente (onFocus)
 * - Constraints: la ventana nunca sale del viewport (deja mínimo 80px visible)
 */
export default function WindowFrame({
  children,
  defaultPos = { x: 60, y: 60 },
  zIndex = 100,
  onFocus,
  minimized = false,
  maximized = false,
}) {
  const [pos, setPos] = useState(defaultPos)
  const posRef = useRef(pos)
  useEffect(() => { posRef.current = pos }, [pos])

  const startDrag = (e) => {
    const handle = e.target.closest('.win-drag')
    if (!handle) return
    if (e.target.closest('button, input, textarea, select, .mc')) return

    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const origX = posRef.current.x
    const origY = posRef.current.y

    // Bloquear selección de texto durante el drag
    document.body.classList.add('is-dragging')
    // Clear cualquier selección en curso
    if (window.getSelection) window.getSelection().removeAllRanges()

    const onMove = (ev) => {
      // Cap: al menos 80px visible siempre (para que no se pierda la ventana)
      const maxX = Math.max(0, window.innerWidth - 80)
      const maxY = Math.max(0, window.innerHeight - 80)
      const nx = Math.max(0, Math.min(maxX, origX + ev.clientX - startX))
      const ny = Math.max(0, Math.min(maxY, origY + ev.clientY - startY))
      setPos({ x: nx, y: ny })
    }
    const onUp = () => {
      document.body.classList.remove('is-dragging')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  return (
    <div
      className={`win-frame ${minimized ? 'minimized' : ''} ${maximized ? 'maximized' : ''}`}
      style={maximized ? { zIndex } : { left: pos.x, top: pos.y, zIndex }}
      onPointerDown={(e) => { onFocus?.(); if (!maximized) startDrag(e) }}
    >
      {children}
    </div>
  )
}
