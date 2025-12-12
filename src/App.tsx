import { Navigation } from './components/Navigation'
import { FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { GalleryPage } from './pages/GalleryPage'
import { BookingPage } from './pages/BookingPage'

function App() {
  return (
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
        </div>
      </footer>
    </div>
  )
}

export default App

