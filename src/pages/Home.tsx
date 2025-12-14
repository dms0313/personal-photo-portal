import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowDown } from 'react-icons/fi'
import { Gallery } from '../components/Gallery'

export function Home() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

    return (
        <div ref={containerRef} className="relative">
            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center relative overflow-hidden">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0 opacity-30"
                >
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
                </motion.div>

                <div className="z-10 text-center px-4 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                    >
                        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6">
                            <span className="text-white">DAN</span>
                            <br />
                            <span className="text-gradient">SULLIVAN</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 2.2 }}
                        className="text-xl md:text-3xl text-gray-100 font-light tracking-widest uppercase mb-8"
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
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    borderColor: "rgba(255, 255, 255, 0.6)",
                                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ delay: 5.0, duration: 1.5 }}
                                className="px-8 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 text-white font-medium transition-all duration-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10">BOOK A SESSION</span>
                                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-12 animate-bounce"
                >
                    <FiArrowDown className="w-6 h-6 text-gray-500" />
                </motion.div>
            </section>

            {/* Preview Gallery Section */}
            <Gallery />
        </div>
    )
}
