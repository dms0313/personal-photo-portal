import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'

import { useAuthStore } from '../lib/authStore'
import { useGalleryStore } from '../lib/galleryStore'

const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Unable to read file. Please try another image.'))
        reader.readAsDataURL(file)
    })

export function LoginPage() {
    const [passcode, setPasscode] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const [drafts, setDrafts] = useState<Record<string, { title: string; description: string }>>({})

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
        const mappedDrafts = photos.reduce<Record<string, { title: string; description: string }>>((acc, photo) => {
            acc[photo.id] = {
                title: photo.title,
                description: photo.description,
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

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please choose an image to upload.')
            return
        }

        setUploadStatus('Uploading...')
        try {
            const url = await fileToDataUrl(selectedFile)
            addPhoto({ url, title: newTitle || 'Untitled Portrait', description: newDescription || 'Added by owner' })
            setUploadStatus('Photo uploaded and added to your gallery.')
            setSelectedFile(null)
            setPreviewUrl(null)
            setNewTitle('')
            setNewDescription('')
        } catch (error) {
            setUploadStatus(error instanceof Error ? error.message : 'Upload failed. Please try again.')
        }
    }

    const handleDraftChange = (id: string, field: 'title' | 'description', value: string) => {
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
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
            <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-24 md:py-32">
                <div className="space-y-3 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Owner Access</p>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Sign in to manage content</h1>
                    <p className="text-gray-400">
                        Use your private passcode to unlock management tools such as uploading and organizing photos.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-300">Signed in as</p>
                                <p className="text-lg font-semibold text-white">{ownerEmail}</p>
                            </div>
                            {isAuthenticated ? (
                                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                                    Active Session
                                </span>
                            ) : (
                                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
                                    Authentication Required
                                </span>
                            )}
                        </div>

                        {!hasConfiguredPasscode && (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                                Set <code className="font-mono">VITE_OWNER_PASSWORD</code> in your environment to enable secure owner login.
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <label className="block space-y-2 text-sm font-medium text-gray-200">
                                <span>Owner passcode</span>
                                <input
                                    type="password"
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                    placeholder="Enter your passcode"
                                    value={passcode}
                                    onChange={(event) => setPasscode(event.target.value)}
                                    required
                                />
                            </label>

                            {loginError && <p className="text-sm text-rose-300">{loginError}</p>}

                            {isAuthenticated && !loginError && (
                                <p className="text-sm text-emerald-200">You are signed in. You can continue managing content.</p>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {isAuthenticated ? 'Re-authenticate' : 'Log in'}
                                </button>
                                {isAuthenticated && (
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-200 transition hover:border-white/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                                    >
                                        Log out
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-sm text-gray-400">
                    <h2 className="mb-2 text-sm font-semibold text-white">How this works</h2>
                    <ul className="list-disc space-y-2 pl-4">
                        <li>The owner passcode is stored in the environment as <code className="font-mono">VITE_OWNER_PASSWORD</code>.</li>
                        <li>When you log in successfully, a private session is saved in your browser to keep you authenticated.</li>
                        <li>Use this session to upload photos or manage content without exposing controls to visitors.</li>
                    </ul>
                </div>

                <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur space-y-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Content management</p>
                        <h2 className="text-2xl font-semibold">Upload new photos and edit descriptions</h2>
                        <p className="text-gray-300 text-sm">Your changes are stored locally in this browser so you can curate the gallery before publishing.</p>
                    </div>

                    {managementDisabled && (
                        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
                            Log in with your owner passcode above to enable uploads and edits.
                        </div>
                    )}

                    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${managementDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="col-span-2 space-y-4 rounded-2xl border border-white/10 bg-black/40 p-6">
                            <h3 className="text-lg font-semibold">Upload a new photo</h3>
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

                            <div className="space-y-2 text-sm font-medium text-gray-200">
                                <span>Upload image</span>
                                <label className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/30 px-6 py-8 text-center transition hover:border-white/40">
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

                            {uploadStatus && <p className="text-sm text-blue-100">{uploadStatus}</p>}

                            <button
                                type="button"
                                onClick={handleUpload}
                                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            >
                                Add to gallery
                            </button>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-6">
                            <h3 className="text-lg font-semibold">Manage existing photos</h3>
                            <p className="text-sm text-gray-300">Update descriptions or rename titles to keep the gallery current.</p>
                            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                                        <div className="flex gap-3">
                                            <img src={photo.url} alt={photo.title} className="h-16 w-16 rounded-lg object-cover" />
                                            <div className="flex flex-col gap-2 flex-1">
                                                <input
                                                    type="text"
                                                    value={drafts[photo.id]?.title ?? photo.title}
                                                    onChange={(event) => handleDraftChange(photo.id, 'title', event.target.value)}
                                                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                                />
                                                <input
                                                    type="text"
                                                    value={drafts[photo.id]?.description ?? photo.description}
                                                    onChange={(event) => handleDraftChange(photo.id, 'description', event.target.value)}
                                                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleSaveDraft(photo.id)}
                                            className="w-full rounded-lg border border-blue-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 transition hover:border-blue-400 hover:text-white"
                                        >
                                            Save updates
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
