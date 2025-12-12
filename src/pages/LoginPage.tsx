import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'

import { useAuthStore } from '../lib/authStore'

export function LoginPage() {
    const [passcode, setPasscode] = useState('')
    const { login, logout, isAuthenticated, loginError, ownerEmail, hasConfiguredPasscode } = useAuthStore()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        login(passcode)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 text-white">
            <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-24 md:py-32">
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

                            {loginError && (
                                <p className="text-sm text-rose-300">{loginError}</p>
                            )}

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
            </div>
        </div>
    )
}
