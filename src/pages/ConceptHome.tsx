import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGalleryStore } from '../lib/galleryStore'
import { Link } from 'react-router-dom'

export function ConceptHome() {
    const { photos } = useGalleryStore()
    const [displayPhotos, setDisplayPhotos] = useState<string[]>([])

    // Select 4 random photos (or fallbacks) on mount
    useEffect(() => {
        // Fallback placeholder if no photos
        const fallback = '/default-hero.png'

        let selected: string[] = []

        if (photos.length > 0) {
            // Shuffle and pick 4 (repeating if necessary, but ideally unique)
            const shuffled = [...photos].sort(() => 0.5 - Math.random())
            selected = shuffled.slice(0, 4).map(p => p.url)

            // If we have fewer than 4, fill with random picks
            while (selected.length < 4) {
                const random = photos[Math.floor(Math.random() * photos.length)]
                if (random) selected.push(random.url)
                else selected.push(fallback)
            }
        } else {
            // Fill 4 slots with the fallback
            selected = [fallback, fallback, fallback, fallback]
        }

        setDisplayPhotos(selected)
    }, [photos])

    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#352F44] text-[#FAF0E6]">

            {/* Slide 1: Main Title + Image */}
            <section className="relative h-screen w-full snap-start flex items-center justify-center overflow-hidden">
                {displayPhotos[0] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src={displayPhotos[0]}
                            alt="Concept 1"
                            className="w-full h-full object-cover grayscale opacity-60 transition-all duration-700 hover:grayscale-0 hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#352F44]/20 mix-blend-multiply" />
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 1.0 }}
                    className="relative z-10 w-full px-4 flex flex-col items-center shadow-black drop-shadow-2xl"
                >
                    <h1 className="text-[15vw] leading-[0.8] font-bold tracking-tighter text-center uppercase whitespace-nowrap text-[#FAF0E6]">
                        Dan Sullivan
                    </h1>
                    <p className="text-[5vw] font-light tracking-[0.5em] text-center uppercase mt-4 w-full text-[#B9B4C7]">
                        Photographer
                    </p>
                </motion.div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#B9B4C7] animate-bounce">
                    <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
                </div>
            </section>

            {/* Slide 2 */}
            <section className="relative h-screen w-full snap-start overflow-hidden group bg-[#352F44]">
                {displayPhotos[1] && (
                    <img
                        src={displayPhotos[1]}
                        alt="Concept 2"
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    />
                )}
            </section>

            {/* Slide 3 */}
            <section className="relative h-screen w-full snap-start overflow-hidden group bg-[#352F44]">
                {displayPhotos[2] && (
                    <img
                        src={displayPhotos[2]}
                        alt="Concept 3"
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    />
                )}
            </section>

            {/* Slide 4 + CTA */}
            <section className="relative h-screen w-full snap-start flex flex-col items-center justify-center overflow-hidden group bg-[#352F44]">
                {displayPhotos[3] && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={displayPhotos[3]}
                            alt="Concept 4"
                            className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#352F44]/60" />
                    </div>
                )}

                <div className="relative z-10">
                    <Link to="/booking">
                        <button className="px-12 py-6 border-2 border-[#FAF0E6] text-[#FAF0E6] text-2xl tracking-widest uppercase hover:bg-[#FAF0E6] hover:text-[#352F44] transition-all duration-300 backdrop-blur-sm">
                            Book Now
                        </button>
                    </Link>
                </div>
            </section>

        </div>
    )
}
