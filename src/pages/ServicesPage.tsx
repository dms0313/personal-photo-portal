import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiCamera, FiCalendar, FiBriefcase, FiHeart } from 'react-icons/fi';
import { FaDog } from 'react-icons/fa';

const services = [
    {
        id: 'portrait',
        title: 'PORTRAITS',
        description: 'Professional headshots, senior photos, and creative portraiture.',
        icon: <FiCamera />,
        options: [
            { label: 'Mini Session', details: '30 Minutes • 1 Location', price: '$150', value: 'Portrait: 30 Min' },
            { label: 'Standard Session', details: '1 Hour • 1-2 Locations', price: '$250', value: 'Portrait: 1 Hour' },
            { label: 'Extended Session', details: '2 Hours • Multiple Locations', price: '$400', value: 'Portrait: 2 Hours' },
        ]
    },
    {
        id: 'events',
        title: 'EVENTS',
        description: 'Coverage for parties, corporate events, and special occasions.',
        icon: <FiCalendar />,
        options: [
            { label: 'Short Coverage', details: '2 Hours of Coverage', price: '$500', value: 'Events: 2 Hours' },
            { label: 'Half Day', details: '4 Hours of Coverage', price: '$900', value: 'Events: 4 Hours' },
            { label: 'Full Day', details: 'Up to 8 Hours of Coverage', price: '$1600', value: 'Events: All Day' },
        ]
    },
    {
        id: 'pets',
        title: 'PETS',
        description: 'Fun and patient sessions for your furry friends.',
        icon: <FaDog />,
        options: [
            { label: 'Standard Pet Session', details: '1 Hour • 1 Location', price: '$200', value: 'Pets: 1 Hour' },
            { label: 'Adventure Pet Session', details: '2 Hours • Hike/Park', price: '$350', value: 'Pets: 2 Hours' },
        ]
    },
    {
        id: 'business',
        title: 'BUSINESS',
        description: 'Corporate headshots, branding, and commercial photography.',
        icon: <FiBriefcase />,
        options: [
            { label: 'Headshot Session', details: '30 Minutes • Studio/Office', price: '$200', value: 'Business: Headshots' },
            { label: 'Branding Package', details: '2 Hours • Product/Team', price: '$600', value: 'Business: Branding' },
            { label: 'Team Coverage', details: 'Half Day • Staff Photos', price: '$1200', value: 'Business: Team' },
        ]
    },
    {
        id: 'weddings',
        title: 'WEDDINGS',
        description: 'Capturing the magic of your special day.',
        icon: <FiHeart />,
        options: [
            { label: 'Elopement', details: '4 Hours • Intimate Ceremony', price: '$1800', value: 'Wedding: Elopement' },
            { label: 'Full Day', details: '8 Hours • Getting Ready to Dance', price: '$3200', value: 'Wedding: Full Day' },
            { label: 'Destination', details: 'Full Weekend Coverage', price: '$5000+', value: 'Wedding: Destination' },
        ]
    }
];

export function ServicesPage() {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        OUR <span className="text-gradient">SERVICES</span>
                    </h1>
                    <p className="text-[#1f2a33]/70 text-lg max-w-2xl mx-auto">
                        Choose the perfect package for your needs. Simple pricing, exceptional results.
                    </p>
                </div>

                <div className="space-y-4">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            className="bg-white/85 backdrop-blur-md rounded-2xl border border-black/10 overflow-hidden shadow-lg shadow-black/5"
                            initial={false}
                        >
                            <button
                                onClick={() => setExpanded(expanded === service.id ? null : service.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full bg-black/5 text-2xl ${expanded === service.id ? 'text-[#00ADB5]' : 'text-[#1f2a33]/70'}`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-wide text-[#1f2a33]">{service.title}</h3>
                                        <p className="text-sm text-[#1f2a33]/70">{service.description}</p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: expanded === service.id ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[#1f2a33]/60"
                                >
                                    <FiChevronDown size={24} />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {expanded === service.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="border-t border-black/10 p-6 space-y-4">
                                            {service.options.map((option, index) => (
                                                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-black/5 border border-black/5 hover:border-black/20 transition-all">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-[#1f2a33]">{option.label}</h4>
                                                        <p className="text-sm text-[#1f2a33]/70">{option.details}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-xl font-bold text-[#1f2a33]">{option.price}</span>
                                                        <Link
                                                            to={`/booking?service=${encodeURIComponent(option.value)}`}
                                                            className="px-6 py-2 rounded-lg bg-[#00ADB5] text-[#1f2a33] font-bold text-sm tracking-wide hover:bg-[#1f2a33] hover:text-white transition-colors"
                                                        >
                                                            BOOK NOW
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
