import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '../components/Calendar';
import { FiCheck } from 'react-icons/fi';

import { fetchBusyDates } from '../lib/googleCalendar';

export function BookingPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Fetch busy dates on mount
    useEffect(() => {
        const loadBusyDates = async () => {
            const now = new Date();
            const threeMonthsOut = new Date();
            threeMonthsOut.setMonth(now.getMonth() + 3);

            const busy = await fetchBusyDates(now, threeMonthsOut);
            setBlockedDates(busy);
        };
        loadBusyDates();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        // --- Google Calendar Integration ---

        // 1. Set default time (10:00 AM - 11:00 AM) for the booking slot
        const startTime = new Date(selectedDate);
        startTime.setHours(10, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setHours(11, 0, 0, 0);

        // 2. Format for Google Calendar (YYYYMMDDTHHmmSS)
        const formatGCalDate = (date: Date) => {
            const pad = (n: number) => n < 10 ? '0' + n : n;
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
        };

        // 3. Construct URL
        const title = encodeURIComponent(`Photo Session: ${formState.name}`);
        const details = encodeURIComponent(`Client: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`);
        const dates = `${formatGCalDate(startTime)}/${formatGCalDate(endTime)}`;

        // [Action Required]: Change this to your actual email to receive invites automatically!
        const photographerEmail = "dms0313@gmail.com";

        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}&add=${photographerEmail}`;

        // 4. Open in new tab
        window.open(gCalUrl, '_blank');

        // 5. Show success UI
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        BOOK A <span className="text-gradient">SESSION</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Select a date below to get started. We'll confirm your appointment via email.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2">
                        <Calendar
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                            blockedDates={blockedDates}
                        />
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <motion.div
                            layout
                            className={`bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 h-full ${!selectedDate ? 'opacity-50 pointer-events-none grayscale' : ''}`}
                        >
                            {!isSubmitted ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h3 className="text-xl font-bold text-white mb-6">
                                        {selectedDate
                                            ? `Booking for ${selectedDate.toLocaleDateString()}`
                                            : 'Select a date first'
                                        }
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Message (Optional)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide hover:opacity-90 transition-opacity"
                                    >
                                        CONFIRM BOOKING
                                    </button>
                                </form>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                        <FiCheck className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                                    <p className="text-gray-400">
                                        We'll be in touch shortly to confirm your session on {selectedDate?.toLocaleDateString()}.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
