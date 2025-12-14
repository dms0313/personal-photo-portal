import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const dot = dotRef.current
        const ring = ringRef.current
        if (!dot || !ring) return

        let ringX = 0, ringY = 0
        let mouseX = 0, mouseY = 0
        // We no longer track dotX/dotY separately as they will be instant

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY

            // INSTANT UPDATE for the dot - Zero Latency
            if (dot) {
                dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
            }
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Expanded interactive list for better feel
            const isInteractive =
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('[role="button"]')

            setIsHovering(!!isInteractive)
        }

        const animate = () => {
            // Smooth follow for ring only
            // Increased lerp factor from 0.15 to 0.2 for snappier feel
            ringX += (mouseX - ringX) * 0.2
            ringY += (mouseY - ringY) * 0.2

            if (ring) {
                ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
            }

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
