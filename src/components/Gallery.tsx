
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'

import { useGalleryStore } from '../lib/galleryStore'
import { useAuthStore } from '../lib/authStore'

export const Gallery = ({ featuredOnly = false, category = 'all' }: { featuredOnly?: boolean; category?: string }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const allPhotos = useGalleryStore((state) => state.photos)
    const deletePhoto = useGalleryStore((state) => state.deletePhoto)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    // Filter photos based on props
    const photos = allPhotos.filter(p => {
        if (featuredOnly && !p.is_featured) return false
        if (category !== 'all' && p.category !== category) return false
        return true
    })

    const handleDeleteClick = (e: React.MouseEvent, photoId: string) => {
        e.stopPropagation()
        setConfirmDeleteId(photoId)
    }

    const handleConfirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirmDeleteId) {
            deletePhoto(confirmDeleteId)
            setConfirmDeleteId(null)
        }
    }

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setConfirmDeleteId(null)
    }

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

                            {/* Delete button - only visible when authenticated */}
                            {isAuthenticated && (
                                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {confirmDeleteId === photo.id ? (
                                        <div className="flex gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-2">
                                            <button
                                                onClick={handleConfirmDelete}
                                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-md transition"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={handleCancelDelete}
                                                className="px-3 py-1.5 bg-[#3A4750] hover:bg-[#00ADB5] text-[#EEEEEE] text-xs font-semibold rounded-md transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => handleDeleteClick(e, photo.id)}
                                            className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                                            title="Delete photo"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Simple glassmorphism overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                            {/* Glass card content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 backdrop-blur-md bg-white/10 border-t border-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                <span className="block text-white text-lg font-semibold tracking-wide mb-1">
                                    {photo.title}
                                </span>
                                <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">
                                    {photo.description}
                                </p>
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
