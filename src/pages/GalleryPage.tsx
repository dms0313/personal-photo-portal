import { Gallery } from '../components/Gallery'
import { motion } from 'framer-motion'

export function GalleryPage() {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tighter"
                >
                    FULL <span className="text-gradient">GALLERY</span>
                </motion.h1>
            </div>
            <Gallery />
        </div>
    )
}
