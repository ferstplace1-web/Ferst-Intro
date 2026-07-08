import { useEffect, useRef, useState } from 'react'
import './WindowFrame.css'

/**
 * Contenedor draggable para ventanas flotantes.
 * - El arrastre se activa desde cualquier elemento con clase .win-drag
 * - Click en cualquier parte trae la ventana al frente (onFocus)
 * - En mobile (< 640px) las ventanas se maximizan y se desactiva el drag
 */
export default function WindowFrame({
  children,
  defaultPos = { x: 60, y: 60 },
  zIndex = 100,
  onFocus,
  minimized = false,
}) {
  const [pos, setPos] = useState(defaultPos)
  const posRef = useRef(pos)
  useEffect(() => { posRef.current = pos }, [pos])

  const startDrag = (e) => {
    if (window.innerWidth < 640) return
    const handle = e.target.closest('.win-drag')
    if (!handle) return
    if (e.target.closest('button, input, textarea, select, .mc')) return

    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const origX = posRef.current.x
    const origY = posRef.current.y

    const onMove = (ev) => {
      const nx = Math.max(0, origX + ev.clientX - startX)
      const ny = Math.max(0, origY + ev.clientY - startY)
      setPos({ x: nx, y: ny })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div
      className={`win-frame ${minimized ? 'minimized' : ''}`}
      style={{ left: pos.x, top: pos.y, zIndex }}
      onPointerDown={(e) => { onFocus?.(); startDrag(e) }}
    >
      {children}
    </div>
  )
}
