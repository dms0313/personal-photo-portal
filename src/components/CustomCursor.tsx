import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const dot = dotRef.current
        if (!dot) return

        const handleMouseMove = (e: MouseEvent) => {
            // INSTANT UPDATE for the dot - Zero Latency
            if (dot) {
                dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
            }
        }

        document.addEventListener('mousemove', handleMouseMove)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <div ref={dotRef} className="custom-cursor cursor-dot" />
    )
}
