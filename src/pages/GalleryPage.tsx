import { useState } from 'react'
import { Gallery } from '../components/Gallery'
import { motion } from 'framer-motion'

const categories = [
    { id: 'all', label: 'All Work' },
    { id: 'people', label: 'People' },
    { id: 'landscape', label: 'Landscape' },
    { id: 'events', label: 'Events' },
    { id: 'pets', label: 'Pets' },
]

export function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState('all')

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="text-center mb-12 space-y-8">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tighter"
                >
                    FULL <span className="text-gradient">GALLERY</span>
                </motion.h1>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 px-4"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-[#00ADB5] text-[#303841] scale-105 shadow-lg'
                                : 'bg-white/5 text-[#EEEEEE]/70 hover:bg-white/10 hover:text-[#EEEEEE]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>
            </div>
            <Gallery category={activeCategory} />
        </div>
    )
}
