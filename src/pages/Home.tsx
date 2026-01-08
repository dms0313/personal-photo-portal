import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowDown } from 'react-icons/fi'
import { Gallery } from '../components/Gallery'
import { ShatterText } from '../components/ShatterText'

export function Home() {
    const containerRef = useRef(null)



    return (
        <div ref={containerRef} className="relative">
            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
                {/* Background is now global in App.tsx */}

                <div className="z-10 text-center px-4 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        className="mb-6 text-[#000000]"
                    >
                        <ShatterText label="Dan Sullivan" />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 2.2 }}
                        className="text-xl md:text-3xl text-[#000000]/70 font-light tracking-widest uppercase mb-8"
                    >
                        PROFESSIONAL PHOTOGRAPHER
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                    >
                        <Link to="/booking">
                            <motion.button
                                whileHover={{
                                    scale: 2.05,
                                    backgroundColor: "rgba(25, 167, 206, 0.18)",
                                    borderColor: "rgba(25, 167, 206, 0.4)",
                                    boxShadow: "0 0 20px rgba(25, 167, 206, 0.25)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ delay: 5.0, duration: 1.5 }}
                                className="px-8 py-3 rounded-full bg-[#19A7CE]/10 backdrop-blur-sm border border-[#19A7CE]/30 text-[#000000] font-medium transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10">BOOK A SESSION</span>
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-[#19A7CE]/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 animate-bounce cursor-pointer z-20"
                    onClick={() => {
                        document.getElementById('featured-gallery')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <FiArrowDown className="w-6 h-6 text-[#000000]/60 hover:text-[#000000] transition-colors" />
                </motion.div>
            </section>

            {/* Preview Gallery Section - Only Featured */}
            <div id="featured-gallery">
                <Gallery featuredOnly={true} />
            </div>
        </div>
    )
}
