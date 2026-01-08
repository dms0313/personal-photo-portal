import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiCamera, FiCalendar, FiNavigation, FiHome } from 'react-icons/fi';

const services = [
    {
        id: 'portrait',
        title: 'PORTRAITS',
        description: 'Professional headshots, senior photos, and creative portraiture.',
        icon: <FiCamera />,
        options: [
            { label: 'Standard Session', details: '1 Person • 1 Hour • 1 Location', price: '$125', value: 'Portrait: Standard' },
            { label: 'Additional Person', details: 'Per person, per hour', price: '+$25', value: 'Portrait: Plus Person' },
            { label: 'Additional Location', details: 'Per additional location', price: '+$50', value: 'Portrait: Plus Location' },
        ]
    },
    {
        id: 'events',
        title: 'EVENTS & WEDDINGS',
        description: 'Comprehensive coverage for your most important moments.',
        icon: <FiCalendar />,
        options: [
            { label: 'Event Coverage', details: 'Hourly Rate', price: '$125/hr', value: 'Event: Hourly' },
            { label: 'Weddings', details: 'Custom packages available', price: 'Inquire', value: 'Wedding: Inquiry' },
        ]
    },
    {
        id: 'aerial',
        title: 'AERIAL',
        description: 'Cinematic drone photography and videography from a new perspective.',
        icon: <FiNavigation />,
        options: [
            { label: 'Aerial Session', details: 'Photo & Video • Hourly Rate', price: '$150/hr', value: 'Aerial: Hourly' },
        ]
    },
    {
        id: 'studio',
        title: 'STUDIO SESSION',
        description: 'Coming Soon - controlled environment for high-end results.',
        isComingSoon: true,
        icon: <FiHome />,
        options: [
            { label: 'Studio Package', details: 'Standard Studio Session', price: 'N/A', value: 'Studio' },
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
                    <p className="text-[#000000]/70 text-lg max-w-2xl mx-auto">
                        Choose the perfect package for your needs. Simple pricing, exceptional results.
                    </p>
                </div>

                <div className="space-y-4">
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            className={`bg-white/85 backdrop-blur-md rounded-2xl border border-black/10 overflow-hidden shadow-lg shadow-black/5 transition-all duration-300 ${service.isComingSoon ? 'opacity-50 grayscale select-none' : ''}`}
                            initial={false}
                        >
                            <button
                                onClick={() => !service.isComingSoon && setExpanded(expanded === service.id ? null : service.id)}
                                className={`w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition-colors ${service.isComingSoon ? 'cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full bg-black/5 text-2xl ${expanded === service.id ? 'text-[#19A7CE]' : 'text-[#000000]/70'}`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-wide text-[#000000]">
                                            {service.title}
                                            {service.isComingSoon && <span className="ml-3 text-xs font-medium uppercase tracking-widest px-2 py-1 rounded-full bg-black/10 text-[#000000]/60">Inactive</span>}
                                        </h3>
                                        <p className="text-sm text-[#000000]/70">{service.description}</p>
                                    </div>
                                </div>
                                {!service.isComingSoon && (
                                    <motion.div
                                        animate={{ rotate: expanded === service.id ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-[#000000]/60"
                                    >
                                        <FiChevronDown size={24} />
                                    </motion.div>
                                )}
                            </button>

                            <AnimatePresence initial={false}>
                                {expanded === service.id && !service.isComingSoon && (
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
                                                        <h4 className="text-lg font-bold text-[#000000]">{option.label}</h4>
                                                        <p className="text-sm text-[#000000]/70">{option.details}</p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <span className="text-xl font-bold text-[#000000]">{option.price}</span>
                                                        <Link
                                                            to={`/booking?service=${encodeURIComponent(option.value)}`}
                                                            className="px-6 py-2 rounded-lg bg-[#19A7CE] text-[#000000] font-bold text-sm tracking-wide hover:bg-[#000000] hover:text-white transition-colors"
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
