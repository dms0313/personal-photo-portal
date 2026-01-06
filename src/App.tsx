
import { Routes, Route } from 'react-router-dom'
import { FiInstagram, FiMail, FiTwitter } from 'react-icons/fi'

import { CustomCursor } from './components/CustomCursor'
import { Navigation } from './components/Navigation'
import { BookingPage } from './pages/BookingPage'
import { GalleryPage } from './pages/GalleryPage'
import { Home } from './pages/Home'
import { LoginPage } from './pages/LoginPage'

import { ServicesPage } from './pages/ServicesPage'
import { ConceptHome } from './pages/ConceptHome'
import { Background } from './components/Background'

function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-foreground">
      <Background />
      <CustomCursor />
      <Navigation />


      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ConceptHome />} />

          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/concept" element={<Home />} />
        </Routes>

      </main>



      {/* Footer */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4">
          <div className="flex gap-8 text-[#1f2a33]">
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-black/5">
              <FiInstagram className="h-6 w-6 transition-colors group-hover:text-[#00ADB5]" />
            </a>
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-black/5">
              <FiTwitter className="h-6 w-6 transition-colors group-hover:text-[#00ADB5]" />
            </a>
            <a href="#" className="group rounded-full p-3 transition-colors hover:bg-black/5">
              <FiMail className="h-6 w-6 transition-colors group-hover:text-[#00ADB5]" />
            </a>
          </div>
          <p className="text-sm text-[#1f2a33]/70">© 2026 Dan Sullivan Photography. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
