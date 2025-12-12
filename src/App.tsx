import { Routes, Route } from 'react-router-dom'
import { FiInstagram, FiMail, FiTwitter } from 'react-icons/fi'

import { Navigation } from './components/Navigation'
import { BookingPage } from './pages/BookingPage'
import { GalleryPage } from './pages/GalleryPage'
import { Home } from './pages/Home'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Navigation />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/50 py-12 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
          <div className="flex gap-8">
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-white/10">
              <FiInstagram className="h-6 w-6 transition-colors group-hover:text-pink-500" />
            </a>
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-white/10">
              <FiTwitter className="h-6 w-6 transition-colors group-hover:text-blue-400" />
            </a>
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-white/10">
              <FiMail className="h-6 w-6 transition-colors group-hover:text-purple-400" />
            </a>
          </div>
          <p className="text-sm text-gray-500">© 2024 Dan Sullivan Photography. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
