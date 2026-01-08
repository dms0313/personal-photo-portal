import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// --- CAROUSEL SLIDES ---
const SLIDES = [
    {
        id: 'portraits',
        title: 'PORTRAITS',
        subtitle: 'Senior Photos • Business Headshots',
        image: 'https://ik.imagekit.io/dmsully/DS252153.jpg?updatedAt=1767658772217',
    },
    {
        id: 'events',
        title: 'EVENTS',
        subtitle: 'Weddings • Corporate Events • Sports',
        image: 'https://ik.imagekit.io/dmsully/_MG_4396.png?updatedAt=1765570258586',
    },
    {
        id: 'more',
        title: '& MORE',
        subtitle: 'Drone Photography/Videography • Pets • Advertising',
        image: 'https://ik.imagekit.io/dmsully/DJI_0052.JPG?updatedAt=1767706979048',
    }
]

// --- CAROUSEL SECTION ---
// --- CAROUSEL SECTION ---
function CarouselSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    // Data
    const items = [
        { id: 1, title: 'PORTRAITS', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1000', desc: 'Capturing the essence of personality in every frame.' },
        { id: 2, title: 'LIFESTYLE', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000', desc: 'Candid moments that tell your unique story.' },
        { id: 3, title: 'EVENTS', image: 'https://images.unsplash.com/photo-1519671482538-5810e2896e3d?auto=format&fit=crop&q=80&w=1000', desc: 'Preserving memories from your most special days.' },
        { id: 4, title: 'EDITORIAL', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1000', desc: 'Fashion and conceptual photography for brands.' },
        { id: 5, title: 'TRAVEL', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000', desc: 'Landscapes and cultures from around the world.' },
    ]

    const handleScroll = () => {
        if (!scrollContainerRef.current) return
        // logic
    }

    return (
        <section className="carousel-section min-h-[100vh] flex flex-col justify-end pb-20 relative snap-start bg-transparent">
            <div className="carousel-head w-full max-w-[1400px] mx-auto px-5 mb-8 flex justify-between items-end">
                <h2 className="text-white text-4xl md:text-6xl font-[790] tracking-tighter">
                    SELECTED <br /> <span className="text-[#19A7CE]">WORKS</span>
                </h2>
            </div>
            <div className="carousel-slider w-full" style={{ width: '100%' }}>
                <div
                    className="carousel-track"
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="carousel-card group"
                            active={activeIndex === index ? "true" : undefined}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => setActiveIndex(index)}
                        >
                            <img src={item.image} alt={item.title} className="carousel-card__bg" />
                            <div className="carousel-card__content">
                                <h3 className="carousel-card__title font-[790]">{item.title}</h3>
                                <img src={item.image} alt="Thumb" className="carousel-card__thumb" />
                                <p className="carousel-card__desc font-medium">{item.desc}</p>
                                <button className="carousel-card__btn">VIEW PROJECT</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-dots">
                {items.map((_, i) => (
                    <div
                        key={i}
                        className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(i)}
                    />
                ))}
            </div>
        </section>
    )
}

export function ConceptHome() {
    const [isIdle, setIsIdle] = useState(false)
    const [isHoveringPhoto, setIsHoveringPhoto] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Combined Color State
    // Color is shown if: IDLE OR Hovering Photo
    // BUT (Critical): If Hovering UI, we are NOT Hovering Photo.
    // So "showColor" = isIdle || isHoveringPhoto
    const showColor = isIdle || isHoveringPhoto

    // Idle Timer Logic
    useEffect(() => {
        const resetIdle = () => {
            setIsIdle(false)
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            idleTimerRef.current = setTimeout(() => {
                setIsIdle(true)
            }, 4000)
        }

        // Listeners for activity
        window.addEventListener('mousemove', resetIdle)
        window.addEventListener('click', resetIdle)
        window.addEventListener('touchstart', resetIdle)
        window.addEventListener('scroll', resetIdle)
        window.addEventListener('keydown', resetIdle)

        // Start timer initially
        resetIdle()

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            window.removeEventListener('mousemove', resetIdle)
            window.removeEventListener('click', resetIdle)
            window.removeEventListener('touchstart', resetIdle)
            window.removeEventListener('scroll', resetIdle)
            window.removeEventListener('keydown', resetIdle)
        }
    }, [])

    const scrollToCarousel = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            })
        }
    }

    // Hover Handlers
    const handlePhotoEnter = () => setIsHoveringPhoto(true)
    const handleUIEnter = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsHoveringPhoto(false)
    }

    return (
        <div
            className="relative h-screen w-full overflow-hidden bg-[#07090d]"
        >
            {/* Fixed Background Image */}
            <div
                className="fixed inset-0 z-0"
                onMouseEnter={handlePhotoEnter}
                onMouseLeave={() => setIsHoveringPhoto(false)}
            >
                <img
                    src="https://ik.imagekit.io/dmsully/_MG_4017%20(1).JPG?updatedAt=1765570239624"
                    alt="Dan Sullivan Photography"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-[1000ms] ease-out
                        ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
                        ${showColor ? 'grayscale-0' : 'grayscale'}
                    `}
                    style={{
                        animation: imageLoaded ? 'slowZoom 20s ease-out forwards' : 'none'
                    }}
                />
            </div>

            {/* Floating Book Button - Hidden on Mobile, Visible on Desktop */}
            <div
                className="hidden md:block fixed top-24 right-12 z-50 mix-blend-normal"
                onMouseEnter={handleUIEnter}
            >
                <Link to="/booking">
                    <button className="px-6 py-3 border border-white/50 bg-black/40 backdrop-blur-sm text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-lg">
                        Book a Session
                    </button>
                </Link>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="absolute inset-0 z-10 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
            >
                {/* HERO SECTION */}
                <section
                    className="h-[100dvh] w-full snap-start flex flex-col items-center justify-center pointer-events-none"
                >
                    <div
                        className="flex flex-col items-center pointer-events-auto p-4 md:p-12"
                        onMouseEnter={handleUIEnter} // Hovering text block reverts to B&W
                    >
                        {/* Animated Name - Responsive Text Size & Stacking */}
                        <h1 className="text-[12vw] md:text-8xl lg:text-[9vw] font-[790] tracking-tight text-white hero-title flex flex-col md:flex-row items-center">
                            {/* DAN - Gradient + Animation (Start at 0.5s) */}
                            <span className="text-gradient inline-block mr-4 mb-2 md:mb-0">
                                {['D', 'A', 'N'].map((char, i) => (
                                    <span
                                        key={char + i}
                                        className="hero-letter"
                                        style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>

                            {/* SULLIVAN - White + Animation (Start after DAN + space) */}
                            <span className="inline-flex">
                                {['S', 'U', 'L', 'L', 'I', 'V', 'A', 'N'].map((char, i) => (
                                    <span
                                        key={char + i}
                                        className="hero-letter"
                                        // Start after DAN (0.6s) -> 0.65s
                                        style={{ animationDelay: `${0.65 + i * 0.05}s` }}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl lg:text-[2vw] font-light tracking-[0.5em] text-center uppercase mt-6 text-white drop-shadow-md">
                            Photographer
                        </p>

                        {/* Explore Button - Added semi-transparent background */}
                        <button
                            onClick={scrollToCarousel}
                            className={`mt-12 px-10 py-4 border-2 border-[#19A7CE] bg-black/30 backdrop-blur-sm text-[#19A7CE] text-lg tracking-widest uppercase hover:bg-[#19A7CE] hover:text-white transition-all duration-300 shadow-lg ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                            style={{ transitionDelay: '1000ms' }}
                        >
                            Explore
                        </button>
                    </div>
                </section>

                {/* CAROUSEL SECTION */}
                <CarouselSection />
            </div>
        </div>
    )
}
