import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// --- USER CONFIGURATION ---
const SLIDES = [
    {
        id: 'intro',
        title: 'Dan Sullivan',
        subtitle: 'Photographer',
        images: [
            'https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'
        ],
        isMain: true
    },
    {
        id: 'portraits',
        title: 'PORTRAITS',
        subtitle: 'Senior Photos • Business Headshots',
        images: [
            'https://ik.imagekit.io/dmsully/DS252153.jpg?updatedAt=1767658772217',
            'https://ik.imagekit.io/dmsully/DS252112.jpg?updatedAt=1767658772112',
            'https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'
        ],
    },
    {
        id: 'events',
        title: 'EVENTS',
        subtitle: 'Weddings • Corporate Events • Sports',
        images: [
            'https://ik.imagekit.io/dmsully/_MG_4396.png?updatedAt=1765570258586',
            'https://ik.imagekit.io/dmsully/RKB10507.png?updatedAt=1765570245001'
        ],
    },
    {
        id: 'more',
        title: '& MORE',
        subtitle: 'Drone Photography/Videography • Pets • Advertising',
        images: [
            'https://ik.imagekit.io/dmsully/DJI_0052.JPG?updatedAt=1767706979048',
            'https://ik.imagekit.io/dmsully/DJI_0461.png?updatedAt=1767706979294'
        ],
        showCta: true
    }
]

function CarouselSlide({ slide }: { slide: typeof SLIDES[0] }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev + 1) % slide.images.length)
    }, [slide.images.length])

    const prevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - 1 + slide.images.length) % slide.images.length)
    }, [slide.images.length])

    // Preload the next image to prevent glitches
    useEffect(() => {
        if (slide.images.length <= 1) return
        const nextIndex = (currentImageIndex + 1) % slide.images.length
        const img = new Image()
        img.src = slide.images[nextIndex]
    }, [currentImageIndex, slide.images])

    useEffect(() => {
        // Only auto-advance if there's more than one image
        if (slide.images.length <= 1) return

        const timer = setInterval(() => {
            nextImage()
        }, 7000) // Change image every 7 seconds (slower)

        return () => clearInterval(timer)
    }, [slide.images.length, nextImage])

    return (
        <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden bg-white">

            {/* Image Container with Padding - creates the white border effect */}
            <div className="absolute inset-0 w-full h-full p-4 md:p-12 flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden shadow-sm">
                    {/* Background Overlay for Depth/Vignette if needed - removed for cleaner look, or kept minimal */}

                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            // Initial state: Start scale 1.1 (zoomed in slightly) or 1.0
                            // User wants "page to begin with all white screen, the first photo fades in gently"
                            initial={{ opacity: 0, scale: 1.0 }}
                            animate={{ opacity: 1, scale: 1.1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                opacity: { duration: 1.5, ease: "easeInOut" },
                                scale: { duration: 15, ease: "linear" } // Slow continuous zoom
                            }}
                            src={slide.images[currentImageIndex]}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:grayscale-0 grayscale transition-all duration-700"
                        />
                    </AnimatePresence>

                    {/* Carousel Controls (only if > 1 image) */}
                    {slide.images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <FiChevronLeft size={32} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                                <FiChevronRight size={32} />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                                {slide.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-500 box-content border border-black/10 ${idx === currentImageIndex ? 'bg-white w-8 opacity-100' : 'bg-white/40 w-2 hover:w-4 opacity-70'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Text Overlay - Centered - NO Mix Blend Mode */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                {slide.isMain ? (
                    // Main Intro Styling
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-center uppercase whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#00ADB5] to-black">
                            {slide.title}
                        </h1>
                        <p className="text-[4vw] font-light tracking-[0.5em] text-center uppercase mt-2 md:mt-6 text-black">
                            {slide.subtitle}
                        </p>
                    </motion.div>
                ) : (
                    // Category Header Styling
                    <div className="flex flex-col items-center overflow-hidden">
                        {/* Animate IN from Side (Left) */}
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase text-center opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-out text-transparent bg-clip-text bg-gradient-to-r from-[#00ADB5] to-black">
                            {slide.title}
                        </h2>
                        {/* Animate IN from Side (Right) */}
                        <p className="text-xl md:text-3xl font-light tracking-[0.1em] uppercase mt-4 opacity-0 group-hover:opacity-100 transform translate-x-full group-hover:translate-x-0 transition-all duration-700 delay-100 ease-out text-black">
                            {slide.subtitle}
                        </p>
                    </div>
                )}
            </div>

            {/* CTA separate from mix-blend to keep its own colors */}
            {slide.showCta && (
                <div className="absolute bottom-24 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                    <Link to="/booking">
                        <button className="px-10 py-4 border-2 border-[#00ADB5] bg-[#00ADB5] text-[#1f2a33] text-xl tracking-widest uppercase hover:bg-black hover:border-black hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(0,173,181,0.4)] hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            Book Now
                        </button>
                    </Link>
                </div>
            )}
        </section>
    )
}

export function ConceptHome() {
    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-white text-[#1f2a33]">
            {SLIDES.map((slide) => (
                <CarouselSlide key={slide.id} slide={slide} />
            ))}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[#1f2a33]/70 animate-bounce pointer-events-none z-30">
                <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
            </div>
        </div>
    )
}
