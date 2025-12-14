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
            {/* Base dark layer to ensure text readability */}
            <div className="absolute inset-0 bg-[#020203]" />

            {/* Subtle Gradient Mesh (Static Base) */}
            <div className="absolute inset-0 opacity-40"
                style={{
                    background: `
                        radial-gradient(circle at 10% 20%, rgba(29, 24, 75, 0.4) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(55, 48, 163, 0.2) 0%, transparent 40%)
                    `
                }}
            />

            {/* Parallax Blobs Layer */}
            <div className="absolute inset-0 opacity-30 w-full h-full">
                {/* Purple Blob (Top Left) -> Moves Down & Left */}
                <motion.div
                    style={{ y, x: xLeft }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px] will-change-transform"
                />

                {/* Blue Blob (Bottom Right) -> Moves Down & Right */}
                <motion.div
                    style={{ y, x: xRight }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px] will-change-transform"
                />
            </div>

            {/* Grain/Noise Overlay (Optional but premium) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    )
}
