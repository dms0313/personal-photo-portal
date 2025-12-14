import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'

import { useAuthStore } from '../lib/authStore'
import { useGalleryStore } from '../lib/galleryStore'
import { imagekitConfig, isImageKitUrl, uploadToImageKit } from '../lib/imagekit'

export function LoginPage() {
    const [passcode, setPasscode] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newCategory, setNewCategory] = useState('people')
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [drafts, setDrafts] = useState<Record<string, { title: string; description: string; category: string }>>({})
    const [uploadMode, setUploadMode] = useState<'url' | 'file' | 'bulk'>('file')
    const [imageUrl, setImageUrl] = useState('')
    const [bulkUrls, setBulkUrls] = useState('')

    const { login, logout, isAuthenticated, loginError, ownerEmail, hasConfiguredPasscode } = useAuthStore()
    const { photos, addPhoto, updatePhoto } = useGalleryStore()

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    useEffect(() => {
        const mappedDrafts = photos.reduce<Record<string, { title: string; description: string; category: string }>>((acc, photo) => {
            acc[photo.id] = {
                title: photo.title,
                description: photo.description,
                category: photo.category,
            }
            return acc
        }, {})
        setDrafts(mappedDrafts)
    }, [photos])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login(passcode)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedFile(file ?? null)
        setUploadStatus(null)

        if (file) {
            const preview = URL.createObjectURL(file)
            setPreviewUrl(preview)
        } else {
            setPreviewUrl(null)
        }
    }

    const handleAddFromUrl = async () => {
        if (!imageUrl.trim()) {
            setUploadStatus('Please enter an image URL.')
            return
        }

        try {
            new URL(imageUrl)
        } catch {
            setUploadStatus('Please enter a valid URL.')
            return
        }

        setIsUploading(true)
        setUploadStatus('Adding to gallery...')

        const success = await addPhoto({
            url: imageUrl.trim(),
            title: newTitle || 'Untitled Portrait',
            description: newDescription || 'Added via URL',
            category: newCategory
        })

        if (success) {
            const isFromImageKit = isImageKitUrl(imageUrl)
            setUploadStatus(isFromImageKit
                ? '✓ Photo added and synced!'
                : '✓ Photo added! (Tip: Use ImageKit URLs for best performance)'
            )
            setImageUrl('')
            setNewTitle('')
            setNewDescription('')
        } else {
            setUploadStatus('Failed to add photo. Please try again.')
        }
        setIsUploading(false)
    }

    const handleBulkImport = async () => {
        const urls = bulkUrls
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0)

        if (urls.length === 0) {
            setUploadStatus('Please paste at least one URL.')
            return
        }

        // Validate all URLs first
        const invalidUrls: string[] = []
        urls.forEach(url => {
            try {
                new URL(url)
            } catch {
                invalidUrls.push(url)
            }
        })

        if (invalidUrls.length > 0) {
            setUploadStatus(`Invalid URLs found: ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`)
            return
        }

        setIsUploading(true)
        setUploadStatus(`Adding ${urls.length} photos...`)

        let added = 0
        let failed = 0

        for (const url of urls) {
            // Extract filename from URL for title
            const filename = url.split('/').pop()?.split('?')[0] || 'Untitled'
            const title = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')

            const success = await addPhoto({
                url,
                title: title.charAt(0).toUpperCase() + title.slice(1),
                description: 'Imported from ImageKit'
            })

            if (success) {
                added++
                setUploadStatus(`Added ${added}/${urls.length} photos...`)
            } else {
                failed++
            }
        }

        if (failed === 0) {
            setUploadStatus(`✓ Successfully added ${added} photos!`)
            setBulkUrls('')
        } else {
            setUploadStatus(`Added ${added} photos, ${failed} failed.`)
        }
        setIsUploading(false)
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please choose an image to upload.')
            return
        }

        setIsUploading(true)
        setUploadStatus('Uploading to ImageKit...')

        try {
            // Upload directly to ImageKit
            const imageUrl = await uploadToImageKit(selectedFile, undefined, 'Photography-Portfolio')

            setUploadStatus('Saving to gallery...')

            // Save to Supabase
            const success = await addPhoto({
                url: imageUrl,
                title: newTitle || 'Untitled Portrait',
                description: newDescription || 'Uploaded photo',
                category: newCategory
            })

            if (success) {
                setUploadStatus('✓ Photo uploaded and synced across all devices!')
                setSelectedFile(null)
                setPreviewUrl(null)
                setNewTitle('')
                setNewDescription('')
            } else {
                setUploadStatus('Photo uploaded to ImageKit but failed to save. Try adding via URL.')
            }
        } catch (error) {
            console.error('Upload failed:', error)
            setUploadStatus(error instanceof Error ? error.message : 'Upload failed. Please try again.')
        }
        setIsUploading(false)
    }

    const handleDraftChange = (id: string, field: 'title' | 'description' | 'category', value: string) => {
        setDrafts((current) => ({
            ...current,
            [id]: {
                ...current[id],
                [field]: value,
            },
        }))
    }

    const handleSaveDraft = (id: string) => {
        const draft = drafts[id]
        if (!draft) return
        updatePhoto(id, draft)
    }

    const managementDisabled = useMemo(() => !isAuthenticated || Boolean(loginError), [isAuthenticated, loginError])

    return (
        <div className="min-h-screen text-white flex flex-col">
            <div className={`mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 ${isAuthenticated ? 'py-24 md:py-32' : 'flex-grow justify-center items-center'}`}>
                <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400 intro-fade-up intro-delay-1">Owner Access</p>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl intro-fade-up intro-delay-2">
                        {isAuthenticated ? 'Management Dashboard' : 'Sign in'}
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur intro-glow"
                >
                    <div className="flex flex-col gap-6">
                        {!isAuthenticated ? (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <label className="block space-y-2 text-sm font-medium text-gray-200">
                                    <input
                                        type="password"
                                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-center tracking-widest"
                                        placeholder="ENTER PASSCODE"
                                        value={passcode}
                                        onChange={(event) => setPasscode(event.target.value)}
                                        required
                                        autoFocus
                                    />
                                </label>

                                {loginError && <p className="text-sm text-rose-300 text-center">{loginError}</p>}

                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    Unlock
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-300">Signed in as</p>
                                        <p className="text-lg font-semibold text-white">{ownerEmail}</p>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                        Active
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="w-full rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-200 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {isAuthenticated && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-sm text-gray-400"
                        >
                            <h2 className="mb-2 text-sm font-semibold text-white">How this works</h2>
                            <ul className="list-disc space-y-2 pl-4">
                                <li>The owner passcode is stored in the environment as <code className="font-mono">VITE_OWNER_PASSWORD</code>.</li>
                                <li>When you log in successfully, a private session is saved in your browser to keep you authenticated.</li>
                                <li>Use this session to upload photos or manage content without exposing controls to visitors.</li>
                            </ul>
                        </motion.div>

                        <motion.section
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur space-y-6"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Content management</p>
                                    <span className="flex items-center gap-2 text-xs text-emerald-300">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        Auto-synced via Supabase
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold">Upload new photos and edit descriptions</h2>
                                <p className="text-gray-300 text-sm">
                                    Photos are automatically uploaded to ImageKit and synced across all devices via Supabase.
                                </p>
                            </div>

                            <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${managementDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="col-span-2 space-y-4 rounded-2xl border border-white/10 bg-black/40 p-6">
                                    <h3 className="text-lg font-semibold">Add a new photo</h3>

                                    {/* Upload Mode Tabs */}
                                    <div className="flex gap-2 p-1 rounded-xl bg-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('file')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${uploadMode === 'file'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            📁 Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('url')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${uploadMode === 'url'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            🔗 Single URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('bulk')}
                                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${uploadMode === 'bulk'
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            📦 Bulk Import
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <label className="space-y-2 text-sm font-medium text-gray-200">
                                            <span>Photo title</span>
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(event) => setNewTitle(event.target.value)}
                                                placeholder="Sunset session"
                                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                            />
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-gray-200">
                                            <span>Category</span>
                                            <select
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none"
                                            >
                                                <option value="people">People</option>
                                                <option value="landscape">Landscape</option>
                                                <option value="events">Events</option>
                                                <option value="pets">Pets</option>
                                            </select>
                                        </label>
                                        <label className="space-y-2 text-sm font-medium text-gray-200 md:col-span-2">
                                            <span>Description</span>
                                            <input
                                                type="text"
                                                value={newDescription}
                                                onChange={(event) => setNewDescription(event.target.value)}
                                                placeholder="Where and how it was captured"
                                                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                            />
                                        </label>
                                    </div>

                                    {uploadMode === 'url' ? (
                                        <div className="space-y-4">
                                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                                                <strong>Recommended:</strong> Upload images to <a href="https://imagekit.io/dashboard/media-library" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">ImageKit Media Library</a>, then paste the URL below.
                                            </div>
                                            <label className="space-y-2 text-sm font-medium text-gray-200">
                                                <span>Image URL</span>
                                                <input
                                                    type="url"
                                                    value={imageUrl}
                                                    onChange={(event) => setImageUrl(event.target.value)}
                                                    placeholder={`${imagekitConfig.urlEndpoint}/Photography-Portfolio/your-image.jpg`}
                                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                                />
                                            </label>
                                            {imageUrl && (
                                                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                                                    <p className="text-sm text-gray-300 mb-2">Preview</p>
                                                    <img
                                                        src={imageUrl}
                                                        alt="Preview"
                                                        className="h-48 w-full rounded-lg object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23333" width="100" height="100"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12">Invalid URL</text></svg>'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : uploadMode === 'bulk' ? (
                                        <div className="space-y-4">
                                            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                                                <strong>Bulk Import:</strong> Paste multiple ImageKit URLs below (one per line). Titles will be auto-generated from filenames.
                                            </div>
                                            <label className="space-y-2 text-sm font-medium text-gray-200">
                                                <span>Image URLs (one per line)</span>
                                                <textarea
                                                    value={bulkUrls}
                                                    onChange={(e) => setBulkUrls(e.target.value)}
                                                    placeholder="https://ik.imagekit.io/dmsully/photo1.jpg"
                                                    rows={8}
                                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 font-mono text-sm"
                                                />
                                            </label>
                                            {bulkUrls && (
                                                <p className="text-xs text-gray-400">
                                                    {bulkUrls.split('\n').filter(l => l.trim()).length} URLs detected
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="space-y-2 text-sm font-medium text-gray-200">
                                                <span>Upload image</span>
                                                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/30 px-6 py-8 text-center transition hover:border-white/40 cursor-pointer">
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                                    <div className="flex flex-col items-center gap-2 text-gray-300">
                                                        <span className="text-lg font-semibold">Drop an image or click to browse</span>
                                                        <span className="text-xs text-gray-400">High-resolution JPG or PNG recommended</span>
                                                    </div>
                                                    {selectedFile && <p className="text-xs text-blue-100">{selectedFile.name}</p>}
                                                </label>
                                            </div>

                                            {previewUrl && (
                                                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                                                    <p className="text-sm text-gray-300">Preview</p>
                                                    <img src={previewUrl} alt="Selected preview" className="mt-3 h-48 w-full rounded-lg object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {uploadStatus && <p className="text-sm text-blue-100">{uploadStatus}</p>}

                                    <button
                                        type="button"
                                        onClick={uploadMode === 'bulk' ? handleBulkImport : uploadMode === 'url' ? handleAddFromUrl : handleUpload}
                                        disabled={isUploading}
                                        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isUploading ? 'Uploading...' : 'Add to gallery'}
                                    </button>
                                </div>

                                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-6">
                                    <h3 className="text-lg font-semibold">Manage existing photos</h3>
                                    <p className="text-sm text-gray-300">Update descriptions or rename titles to keep the gallery current.</p>
                                    <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                                        {photos.map((photo) => (
                                            <div key={photo.id} className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                                                <div className="flex gap-3">
                                                    <img src={photo.url} alt={photo.title} className="h-16 w-16 min-w-[4rem] rounded-lg object-cover" />
                                                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <input
                                                                type="text"
                                                                value={drafts[photo.id]?.title ?? photo.title}
                                                                onChange={(event) => handleDraftChange(photo.id, 'title', event.target.value)}
                                                                className="flex-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 w-full"
                                                            />
                                                            <select
                                                                value={drafts[photo.id]?.category ?? photo.category}
                                                                onChange={(event) => handleDraftChange(photo.id, 'category', event.target.value)}
                                                                className="w-full sm:w-32 rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 appearance-none"
                                                            >
                                                                <option value="people">People</option>
                                                                <option value="landscape">Landscape</option>
                                                                <option value="events">Events</option>
                                                                <option value="pets">Pets</option>
                                                            </select>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={drafts[photo.id]?.description ?? photo.description}
                                                            onChange={(event) => handleDraftChange(photo.id, 'description', event.target.value)}
                                                            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => updatePhoto(photo.id, { is_featured: !photo.is_featured })}
                                                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${photo.is_featured
                                                            ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/20'
                                                            : 'border-white/10 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-300'
                                                            }`}
                                                    >
                                                        {photo.is_featured ? '★ Featured' : '☆ Feature'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSaveDraft(photo.id)}
                                                        className="flex-[2] rounded-lg border border-blue-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 transition hover:border-blue-400 hover:text-white"
                                                    >
                                                        Save updates
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </>
                )}
            </div>
        </div>
    )
}
