import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        let dotX = 0, dotY = 0
        let ringX = 0, ringY = 0
        let mouseX = 0, mouseY = 0

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'LABEL' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('label') ||
                target.getAttribute('role') === 'button'

            setIsHovering(!!isInteractive)
        }

        const animate = () => {
            // Smooth follow for dot (faster)
            dotX += (mouseX - dotX) * 0.5
            dotY += (mouseY - dotY) * 0.5
            dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`

            // Smoother, slower follow for ring
            ringX += (mouseX - ringX) * 0.15
            ringY += (mouseY - ringY) * 0.15
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`

            requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseover', handleMouseOver)
        animate()

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseover', handleMouseOver)
        }
    }, [])

    return (
        <>
            <div ref={dotRef} className="custom-cursor cursor-dot" />
            <div ref={ringRef} className={`custom-cursor cursor-ring ${isHovering ? 'hovering' : ''}`} />
        </>
    )
}
