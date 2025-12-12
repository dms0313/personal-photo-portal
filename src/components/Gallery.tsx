import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'

// Placeholder images from Unsplash
const PHOTOS = [
    'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501854140884-074bf6b24363?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80',
]

export const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold mb-12 text-center"
                >
                    Featured <span className="text-gradient">Work</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PHOTOS.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer group"
                            onClick={() => setSelectedImage(src)}
                        >
                            <motion.img
                                src={src}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-lg font-medium tracking-wide border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative max-w-full max-h-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="max-h-[85vh] w-auto rounded-lg shadow-2xl"
                                />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-12 right-0 text-white hover:text-gray-300"
                                >
                                    Close [ESC]
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    )
}
