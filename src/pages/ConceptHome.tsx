import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react'
=======
import { useEffect, useMemo, useState } from 'react'
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// --- USER CONFIGURATION ---
const SLIDES = [
    {
        id: 'intro',
        title: 'Dan Sullivan',
        subtitle: 'Photographer',
<<<<<<< HEAD
        images: [
            'https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'
        ],
=======
        images: ['https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'],
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
        isMain: true
    },
    {
        id: 'portraits',
        title: 'PORTRAITS',
        subtitle: 'Senior Photos • Business Headshots',
        images: [
            'https://ik.imagekit.io/dmsully/DS252153.jpg?updatedAt=1767658772217',
            'https://ik.imagekit.io/dmsully/DS252112.jpg?updatedAt=1767658772112',
<<<<<<< HEAD
            'https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'
=======
            'https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624',
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
        ],
    },
    {
        id: 'events',
        title: 'EVENTS',
        subtitle: 'Weddings • Corporate Events • Sports',
        images: [
            'https://ik.imagekit.io/dmsully/_MG_4396.png?updatedAt=1765570258586',
<<<<<<< HEAD
            'https://ik.imagekit.io/dmsully/RKB10507.png?updatedAt=1765570245001'
=======
            'https://ik.imagekit.io/dmsully/RKB10507.png?updatedAt=1765570245001',
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
        ],
    },
    {
        id: 'more',
        title: '& MORE',
        subtitle: 'Drone Photography/Videography • Pets • Advertising',
<<<<<<< HEAD
        images: [
            'https://ik.imagekit.io/dmsully/DJI_0052.JPG?updatedAt=1767706979048',
            'https://ik.imagekit.io/dmsully/DJI_0461.png?updatedAt=1767706979294'
        ],
=======
        images: ['https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624'],
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
        showCta: true
    }
]

function CarouselSlide({ slide, index }: { slide: typeof SLIDES[0], index: number }) {
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
        <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden group">

            {/* Full Screen Image Container */}
            <div className="absolute inset-0 w-full h-full bg-[#f0f4f7] group/carousel">
                {/* Background Overlay for Depth - slightly reduced opacity for cleaner shots */}
                <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />

                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        initial={index === 0 && currentImageIndex === 0 ? { scale: 1.1, opacity: 0 } : { opacity: 0 }}
                        animate={index === 0 && currentImageIndex === 0 ? { scale: 1, opacity: 1 } : { opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} // Smoother transition
                        src={slide.images[currentImageIndex]}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-[10s] ease-linear group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                </AnimatePresence>

                {/* Carousel Controls (only if > 1 image) */}
                {slide.images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover/carousel:translate-x-0"
                        >
                            <FiChevronLeft size={32} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 transform translate-x-4 group-hover/carousel:translate-x-0"
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

            {/* Text Overlay - Centered with Mix Blend Mode AND Shadow for visibility */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                {slide.isMain ? (
                    // Main Intro Styling
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex flex-col items-center text-white"
                    >
                        <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-center uppercase whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                            {slide.title}
                        </h1>
                        <p className="text-[4vw] font-light tracking-[0.5em] text-center uppercase mt-2 md:mt-6 drop-shadow-md">
                            {slide.subtitle}
                        </p>
                    </motion.div>
                ) : (
                    // Category Header Styling
                    <div className="flex flex-col items-center text-white">
                        {/* drop-shadow is critical here for fallback visibility */}
                        <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-8 group-hover:translate-y-0 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            {slide.title}
                        </h2>
                        <div className="overflow-hidden">
                            <p className="text-xl md:text-3xl font-light tracking-[0.1em] uppercase mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-full group-hover:translate-y-0 drop-shadow-md">
                                {slide.subtitle}
                            </p>
                        </div>
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
    const slideCount = SLIDES.length
    const initialIndices = useMemo(
        () => SLIDES.map(() => 0),
        []
    )
    const [activeIndices, setActiveIndices] = useState<number[]>(initialIndices)

    useEffect(() => {
        const intervals = SLIDES.map((slide, slideIndex) => {
            if (slide.images.length <= 1) return null
            return window.setInterval(() => {
                setActiveIndices((prev) => {
                    const next = [...prev]
                    next[slideIndex] = (next[slideIndex] + 1) % slide.images.length
                    return next
                })
            }, 4500)
        })

        return () => {
            intervals.forEach((intervalId) => {
                if (intervalId) {
                    window.clearInterval(intervalId)
                }
            })
        }
    }, [])

    const handlePrev = (slideIndex: number) => {
        setActiveIndices((prev) => {
            const next = [...prev]
            const slideImages = SLIDES[slideIndex].images
            next[slideIndex] = (next[slideIndex] - 1 + slideImages.length) % slideImages.length
            return next
        })
    }

    const handleNext = (slideIndex: number) => {
        setActiveIndices((prev) => {
            const next = [...prev]
            const slideImages = SLIDES[slideIndex].images
            next[slideIndex] = (next[slideIndex] + 1) % slideImages.length
            return next
        })
    }

    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-white text-[#1f2a33]">
            {SLIDES.map((slide, index) => (
<<<<<<< HEAD
                <CarouselSlide key={slide.id} slide={slide} index={index} />
=======
                <section key={slide.id} className="relative h-screen w-full snap-start flex flex-col items-center justify-center py-12 px-6 md:px-12 group">

                    {/* Image Container with Padding */}
                    <div className="relative w-full h-[85%] max-w-7xl overflow-hidden shadow-2xl bg-[#f0f4f7]">
                        {/* Background Overlay for Depth - using Teal accent */}
                        <div className="absolute inset-0 bg-[#00ADB5]/10 z-10 pointer-events-none mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />

                        {slide.images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handlePrev(index)}
                                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 p-3 text-white transition hover:bg-black/50"
                                    aria-label="Previous photo"
                                >
                                    <FiChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNext(index)}
                                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 p-3 text-white transition hover:bg-black/50"
                                    aria-label="Next photo"
                                >
                                    <FiChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        <motion.img
                            initial={index === 0 ? { scale: 1.1, opacity: 0 } : undefined}
                            animate={index === 0 ? { scale: 1, opacity: 1 } : undefined}
                            transition={{ duration: 1.5 }}
                            src={slide.images[activeIndices[index]]}
                            alt={slide.title}
                            className="w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105"
                        />
                    </div>

                    {/* Text Overlay */}
                    {/* mix-blend-difference works best with WHITE text to create a true inverse */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                        {slide.isMain ? (
                            // Main Intro Styling
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="flex flex-col items-center text-inverse"
                            >
                                <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter text-center uppercase whitespace-nowrap">
                                    {slide.title}
                                </h1>
                                <p className="text-[4vw] font-light tracking-[0.5em] text-center uppercase mt-2 md:mt-6">
                                    {slide.subtitle}
                                </p>
                            </motion.div>
                        ) : (
                            // Category Header Styling
                            <div className="flex flex-col items-center">
                                {/* Use pure white text with difference mode to ensure visibility against ANY background */}
                                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 text-inverse">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-3xl font-light tracking-[0.1em] uppercase mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0 text-[#1f2a33] bg-white/80 px-4 py-2 rounded-full backdrop-blur-md">
                                    {slide.subtitle}
                                </p>
                            </div>
                        )}

                        {/* CTA Button */}
                        {slide.showCta && (
                            <div className="mt-12 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                                <Link to="/booking">
                                    <button className="px-10 py-4 border-2 border-[#00ADB5] bg-[#00ADB5] text-[#1f2a33] text-xl tracking-widest uppercase hover:bg-[#1f2a33] hover:border-[#1f2a33] hover:text-white transition-all duration-300 shadow-xl">
                                        Book Now
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
>>>>>>> f593d47b3819f44cf033b440230f86e171368de6
            ))}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[#1f2a33]/70 animate-bounce pointer-events-none z-30">
                <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
            </div>
        </div>
    )
}
