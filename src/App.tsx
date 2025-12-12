<<<<<<< HEAD
import { Navigation } from './components/Navigation'
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { GalleryPage } from './pages/GalleryPage'
import { BookingPage } from './pages/BookingPage'
=======
import { type FormEvent, useMemo, useState, type ReactNode } from 'react'
import { FiGithub, FiImage, FiLock, FiLogOut, FiMoon, FiShield, FiSun, FiUpload, FiYoutube } from 'react-icons/fi'

import { useAuthStore } from '@/lib/authStore'
import { useThemeContext } from '@/theme/ThemeProvider'

interface FeatureProps {
  title: ReactNode
  description: string
  codeExample: string
}

export const Feature = ({ title, description, codeExample }: FeatureProps): ReactNode => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 sm:p-6 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/80">
    <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl dark:text-white">{title}</h3>
    <p className="mb-4 text-sm text-gray-600 sm:text-base dark:text-gray-300">{description}</p>
    <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs break-words whitespace-pre-wrap text-gray-800 sm:p-3 sm:text-sm dark:bg-gray-900 dark:text-gray-200">
      <code>{codeExample}</code>
    </pre>
  </div>
)

function App(): ReactNode {
  const { isDarkMode, toggleDarkMode } = useThemeContext()
  const {
    isAuthenticated,
    loginError,
    login,
    logout,
    ownerEmail,
    hasConfiguredPasscode,
  } = useAuthStore()
  const [passcode, setPasscode] = useState('')

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const success = login(passcode.trim())
    if (success) {
      setPasscode('')
    }
  }

  const managementActions = useMemo(
    () => [
      {
        title: 'Upload photos',
        description: 'Drop new shots into the gallery with the correct album, captions, and alt text.',
        Icon: FiUpload,
      },
      {
        title: 'Manage visibility',
        description: 'Toggle drafts live, archive old sets, or keep personal albums private.',
        Icon: FiShield,
      },
      {
        title: 'Curate hero images',
        description: 'Pick featured photos for the homepage and social share cards.',
        Icon: FiImage,
      },
    ],
    [],
  )
>>>>>>> 04a7da7665902f3dc0c075b8892c7f05b51ca52e

function App() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen relative overflow-x-hidden bg-background text-foreground flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <a href="#" className="p-3 rounded-full hover:bg-white/10 transition-colors group">
              <FiInstagram className="w-6 h-6 group-hover:text-pink-500 transition-colors" />
            </a>
            <a href="#" className="p-3 rounded-full hover:bg-white/10 transition-colors group">
              <FiTwitter className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
            </a>
            <a href="#" className="p-3 rounded-full hover:bg-white/10 transition-colors group">
              <FiMail className="w-6 h-6 group-hover:text-purple-400 transition-colors" />
            </a>
          </div>
          <p className="text-gray-500 text-sm">© 2024 Dan Sullivan Photography. All rights reserved.</p>
=======
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <header className="sticky top-0 z-10 bg-white shadow-sm dark:border-b dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/m6.svg" alt="M6 Logo" className="h-8 w-auto" aria-hidden="true" />
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Personal photo portal</p>
              <span className="font-bold text-gray-900 dark:text-white">Content controls</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@m6io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none active:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
              aria-label="Visit m6io on YouTube"
            >
              <FiYoutube className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/m6io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none active:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
              aria-label="Visit m6io on GitHub"
            >
              <FiGithub className="h-6 w-6" />
            </a>
            <span className="h-6 w-px bg-gray-300 dark:bg-gray-700" aria-hidden="true"></span>
            <button
              onClick={toggleDarkMode}
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none active:bg-gray-400 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500"
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 py-6 sm:p-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                <FiLock />
                Owner access
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">Sign in to manage your photo library</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                This login is only for you. Once signed in, you can upload new photos, hide drafts, and keep sensitive
                albums private without exposing management links to visitors.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-900 dark:border-blue-500/40 dark:bg-blue-900/40 dark:text-blue-50">
                  <p className="text-sm font-semibold uppercase tracking-wide">Private controls</p>
                  <p className="mt-1 text-sm">
                    Only the owner login can publish or update photos. Guests never see these controls.
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-50">
                  <p className="text-sm font-semibold uppercase tracking-wide">Persistent session</p>
                  <p className="mt-1 text-sm">Successful logins stay active in your browser so you do not re-enter the code every visit.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Owner session</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {isAuthenticated ? 'Authenticated' : 'Sign in required'}
                  </p>
                </div>
                {isAuthenticated ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100">
                    Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    Locked
                  </span>
                )}
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="space-y-2 text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="owner-passcode">
                  Owner passcode
                  <input
                    id="owner-passcode"
                    name="owner-passcode"
                    type="password"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
                    placeholder="Enter your private code"
                    autoComplete="current-password"
                    disabled={!hasConfiguredPasscode && !isAuthenticated}
                  />
                </label>

                {!hasConfiguredPasscode && !isAuthenticated ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-50">
                    Set <code className="font-semibold">VITE_OWNER_PASSWORD</code> to enable sign-in. Without it, the form stays locked.
                  </p>
                ) : null}

                {loginError ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-50">{loginError}</p>
                ) : null}

                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-50">
                      Signed in as <span className="font-semibold">{ownerEmail}</span>. Content controls are now unlocked.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      >
                        <FiLogOut aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
                    disabled={!hasConfiguredPasscode}
                  >
                    <FiLock aria-hidden="true" />
                    Sign in as owner
                  </button>
                )}
              </form>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Content management</p>
                <h2 className="text-2xl font-bold">Owner-only actions</h2>
              </div>
              <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-200">
                {isAuthenticated ? 'Unlocked' : 'Login to unlock'}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {managementActions.map(({ title, description, Icon }) => (
                <div
                  key={title}
                  className="flex h-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                      <Icon aria-hidden="true" />
                      {title}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isAuthenticated
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100'
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {isAuthenticated ? 'Ready' : 'Locked'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                  <button
                    type="button"
                    className={`mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                      isAuthenticated
                        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400'
                        : 'cursor-not-allowed bg-gray-100 text-gray-500 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-gray-700'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Open panel' : 'Login first'}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Foundation</p>
              <h2 className="text-2xl font-bold">Built on the existing toolkit</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The portal still uses the same starter stack—just tuned for your own admin access.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Feature
                title={
                  <>
                    🌗 Theme management
                  </>
                }
                description="Dark mode toggles are available even on the admin views so you can manage the library in any lighting."
                codeExample={`import { ThemeProvider, useThemeContext } from '@/theme/ThemeProvider'

const Controls = () => {
  const { isDarkMode, toggleDarkMode } = useThemeContext()
  return <button onClick={toggleDarkMode}>{isDarkMode ? 'Lights on' : 'Lights off'}</button>
}

createRoot(...).render(
  <ThemeProvider>
    <Controls />
  </ThemeProvider>
)`}
              />

              <Feature
                title={
                  <>
                    🔐 Single-owner login
                  </>
                }
                description="A lightweight Zustand store keeps track of your authenticated session and persists it in local storage."
                codeExample={`import { useAuthStore } from '@/lib/authStore'

const { isAuthenticated, login, logout } = useAuthStore()

if (!isAuthenticated) {
  login('your-passcode')
} else {
  logout()
}`}
              />
            </div>
          </section>
        </div>
      </main>

      <footer className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-gray-500 sm:text-base dark:text-gray-400">
          <p>Ready to curate your next set? Sign in above to unlock uploads and publishing controls.</p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Owner login only • Sessions stay on this device</p>
>>>>>>> 04a7da7665902f3dc0c075b8892c7f05b51ca52e
        </div>
      </footer>
    </div>
  )
}

export default App

