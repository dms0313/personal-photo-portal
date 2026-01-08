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
function CarouselSection() {
    const trackRef = useRef<HTMLDivElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<HTMLDivElement>(null)
    const prevRef = useRef<HTMLButtonElement>(null)
    const nextRef = useRef<HTMLButtonElement>(null)
    const currentRef = useRef(0)
    const touchStart = useRef({ x: 0, y: 0 })

    const isMobile = useCallback(() => {
        return window.matchMedia("(max-width:767px)").matches
    }, [])

    const center = useCallback((i: number) => {
        const track = trackRef.current
        const wrap = wrapRef.current
        if (!track || !wrap) return

        const cards = Array.from(track.children) as HTMLElement[]
        const card = cards[i]
        if (!card) return

        const axis = isMobile() ? "top" : "left"
        const sizeProp = isMobile() ? "clientHeight" : "clientWidth"
        const startProp = isMobile() ? "offsetTop" : "offsetLeft"
        const start = card[startProp]

        wrap.scrollTo({
            [axis]: start - (wrap[sizeProp] / 2 - card[sizeProp] / 2),
            behavior: "smooth"
        } as ScrollToOptions)
    }, [isMobile])

    const toggleUI = useCallback((i: number) => {
        const track = trackRef.current
        const dots = dotsRef.current
        const prev = prevRef.current
        const next = nextRef.current
        if (!track || !dots || !prev || !next) return

        const cards = Array.from(track.children)
        const dotElements = Array.from(dots.children)

        cards.forEach((c, k) => {
            if (k === i) {
                c.setAttribute('active', '')
            } else {
                c.removeAttribute('active')
            }
        })

        dotElements.forEach((d, k) => {
            d.classList.toggle("active", k === i)
        })

        prev.disabled = i === 0
        next.disabled = i === cards.length - 1
    }, [])

    const activate = useCallback((i: number, scroll: boolean) => {
        if (i === currentRef.current) return
        currentRef.current = i
        toggleUI(i)
        if (scroll) center(i)
    }, [toggleUI, center])

    const go = useCallback((step: number) => {
        const track = trackRef.current
        if (!track) return
        const cards = Array.from(track.children)
        activate(Math.min(Math.max(currentRef.current + step, 0), cards.length - 1), true)
    }, [activate])

    useEffect(() => {
        const track = trackRef.current
        const dots = dotsRef.current
        if (!track || !dots) return

        // Create dots
        const cards = Array.from(track.children)
        dots.innerHTML = ''
        cards.forEach((_, i) => {
            const dot = document.createElement("span")
            dot.className = "carousel-dot"
            dot.onclick = () => activate(i, true)
            dots.appendChild(dot)
        })

        // Initialize
        toggleUI(0)
        center(0)

        // Keyboard navigation
        const handleKeydown = (e: KeyboardEvent) => {
            if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1)
            if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1)
        }
        window.addEventListener("keydown", handleKeydown, { passive: true })

        // Mouse enter handlers for cards
        const cardElements = Array.from(track.children) as HTMLElement[]
        cardElements.forEach((card, i) => {
            const handleMouseEnter = () => {
                if (window.matchMedia("(hover:hover)").matches) {
                    activate(i, true)
                }
            }
            const handleClick = () => activate(i, true)

            card.addEventListener("mouseenter", handleMouseEnter)
            card.addEventListener("click", handleClick)
        })

        // Touch swipe handlers
        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            const dx = e.changedTouches[0].clientX - touchStart.current.x
            const dy = e.changedTouches[0].clientY - touchStart.current.y
            const mobile = isMobile()
            if (mobile ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
                go((mobile ? dy : dx) > 0 ? -1 : 1)
            }
        }

        track.addEventListener("touchstart", handleTouchStart, { passive: true })
        track.addEventListener("touchend", handleTouchEnd, { passive: true })

        // Hide dots on mobile
        if (isMobile()) {
            dots.hidden = true
        }

        // Resize handler
        const handleResize = () => center(currentRef.current)
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("keydown", handleKeydown)
            window.removeEventListener("resize", handleResize)
            track.removeEventListener("touchstart", handleTouchStart)
            track.removeEventListener("touchend", handleTouchEnd)
        }
    }, [activate, center, go, toggleUI, isMobile])


    return (
        <section
            className="carousel-section h-[100dvh] min-w-full flex-shrink-0 snap-start flex flex-col overflow-hidden bg-black/40 backdrop-blur-sm"
        // bg-black/40 adds the "transparency UI features" and matches landing page vibe
        >
            {/* Controls Removed as per request */}

            {/* Slider */}
            <div className="carousel-slider flex-1 flex items-center" ref={wrapRef}>
                <div className="carousel-track" id="track" ref={trackRef}>
                    {SLIDES.map((slide, index) => (
                        <article
                            key={slide.id}
                            className="carousel-card group"
                            {...(index === 0 ? { active: '' } : {})}
                        >
                            <img
                                className="carousel-card__bg grayscale group-hover:grayscale-0 transition-all duration-500"
                                src={slide.image}
                                alt={slide.title}
                            />
                            <div className="carousel-card__content">
                                <h3 className="carousel-card__title">{slide.title}</h3>
                                <p className="carousel-card__desc">{slide.subtitle}</p>
                                <Link to="/gallery">
                                    <button className="carousel-card__btn">View Gallery</button>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="carousel-dots" id="dots" ref={dotsRef}></div>
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
                            {/* DAN - Solid Color + Animation (Start at 0.5s) */}
                            <span className="text-[#0e4c60] drop-shadow-md inline-flex mb-2 md:mb-0 md:mr-4">
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
