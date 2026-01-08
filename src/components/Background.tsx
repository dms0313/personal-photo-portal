import { motion, useScroll, useTransform } from 'framer-motion'

export function Background() {
    // Track scroll progress for the PROPER parallax effect the user asked for
    const { scrollYProgress } = useScroll()

    // Move the background vertically slower than the scroll
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

    // Add HORIZONTAL parallax: Blobs separate (move outward) as you scroll down
    const xLeft = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
    const xRight = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Base light layer to keep the canvas bright */}
            <div className="absolute inset-0 bg-[#F6F1F1]" />

            {/* Subtle Gradient Mesh (Static Base) */}
            <div className="absolute inset-0 opacity-40"
                style={{
                    background: `
                        radial-gradient(circle at 10% 20%, rgba(25, 167, 206, 0.25) 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(20, 108, 148, 0.18) 0%, transparent 55%)
                    `
                }}
            />

            {/* Parallax Blobs Layer */}
            <div className="absolute inset-0 opacity-30 w-full h-full">
                {/* Purple Blob (Top Left) -> Moves Down & Left */}
                <motion.div
                    style={{ y, x: xLeft }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#19A7CE]/35 rounded-full blur-[140px] will-change-transform"
                />

                {/* Blue Blob (Bottom Right) -> Moves Down & Right */}
                <motion.div
                    style={{ y, x: xRight }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F6F1F1] rounded-full blur-[140px] will-change-transform"
                />
            </div>

            {/* Grain/Noise Overlay (Optional but premium) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    )
}
