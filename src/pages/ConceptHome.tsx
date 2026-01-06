import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// --- USER CONFIGURATION ---
// Paste your specific image URLs here to replace the placeholders
const SLIDES = [
    {
        id: 'intro',
        title: 'Dan Sullivan',
        subtitle: 'Photographer',
        image: '/default-hero.png', // Fallback
        isMain: true
    },
    {
        id: 'portraits',
        title: 'PORTRAITS',
        subtitle: 'Senior Photos • Business Headshots',
        image: '/default-hero.png', // Fallback
    },
    {
        id: 'events',
        title: 'EVENTS',
        subtitle: 'Weddings • Corporate Events • Sports',
        image: '/default-hero.png', // Fallback
    },
    {
        id: 'more',
        title: '& MORE',
        subtitle: 'Drone Photography/Videography • Pets • Advertising',
        image: '/default-hero.png', // Fallback
        showCta: true
    }
]

export function ConceptHome() {
    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#303841] text-[#EEEEEE]">

            {SLIDES.map((slide, index) => (
                <section key={slide.id} className="relative h-screen w-full snap-start flex flex-col items-center justify-center py-12 px-6 md:px-12 group">

                    {/* Image Container with Padding */}
                    <div className="relative w-full h-[85%] max-w-7xl overflow-hidden shadow-2xl bg-[#3A4750]">
                        {/* Background Overlay for Depth - using Teal accent */}
                        <div className="absolute inset-0 bg-[#00ADB5]/10 z-10 pointer-events-none mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />

                        <motion.img
                            initial={index === 0 ? { scale: 1.1, opacity: 0 } : undefined}
                            animate={index === 0 ? { scale: 1, opacity: 1 } : undefined}
                            transition={{ duration: 1.5 }}
                            src={slide.image}
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
                                <p className="text-xl md:text-3xl font-light tracking-[0.1em] uppercase mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0 text-[#EEEEEE] bg-[#3A4750]/80 px-4 py-2 rounded-full backdrop-blur-md">
                                    {slide.subtitle}
                                </p>
                            </div>
                        )}

                        {/* CTA Button */}
                        {slide.showCta && (
                            <div className="mt-12 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                                <Link to="/booking">
                                    <button className="px-10 py-4 border-2 border-[#00ADB5] bg-[#00ADB5] text-[#303841] text-xl tracking-widest uppercase hover:bg-[#EEEEEE] hover:border-[#EEEEEE] hover:text-[#303841] transition-all duration-300 shadow-xl">
                                        Book Now
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            ))}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[#EEEEEE] animate-bounce pointer-events-none z-30">
                <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
            </div>

        </div>
    )
}
