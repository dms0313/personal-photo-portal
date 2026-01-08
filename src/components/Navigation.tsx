import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const links = [
        { name: 'SERVICES', path: '/services' },
        { name: 'GALLERY', path: '/gallery' },
        { name: 'BOOK', path: '/booking' },
        { name: 'LOGIN', path: '/login' },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md px-4 md:px-12 py-4 flex justify-between items-center shadow-sm"
        >
            <Link to="/" className="text-xl font-bold tracking-tighter z-50 relative text-[#1f2a33]">
                DAN<span className="text-gradient">SULLIVAN</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-1 justify-end">
                <ul className="flex gap-8 text-sm font-medium tracking-wide text-[#1f2a33]">
                    {links.map((link) => (
                        <li key={link.name}>
                            <Link to={link.path} className="hover:text-black transition-colors relative group">
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#00ADB5] to-black"
                                    />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden z-50 relative p-2 transition-colors text-[#1f2a33]"
                aria-label="Toggle Menu"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 md:hidden"
                        >
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-2xl font-light tracking-widest text-[#1f2a33] hover:text-gradient transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.nav>
    );
}
