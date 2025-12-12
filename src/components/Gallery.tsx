import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { useGalleryStore } from '../lib/galleryStore'

export const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const photos = useGalleryStore((state) => state.photos)

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
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-[4/5] overflow-hidden rounded-xl cursor-pointer group"
                            onClick={() => setSelectedImage(photo.url)}
                        >
                            <motion.img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
                                <span className="text-white text-lg font-semibold tracking-wide">{photo.title}</span>
                                <p className="text-gray-200 text-sm leading-snug line-clamp-2">{photo.description}</p>
                                <span className="self-start mt-1 text-white text-xs font-medium border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    View
                                </span>
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
