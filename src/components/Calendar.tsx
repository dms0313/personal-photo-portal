import { useState, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// [Modified] Interface to accept blocked dates
interface CalendarProps {
    onDateSelect: (date: Date) => void;
    selectedDate: Date | null;
    blockedDates?: Date[]; // New prop
}

export function Calendar({ onDateSelect, selectedDate, blockedDates = [] }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const months = useMemo(() => {
        const m1 = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const m2 = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        return [m1, m2];
    }, [currentMonth]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        const now = new Date();
        if (currentMonth.getMonth() === now.getMonth() && currentMonth.getFullYear() === now.getFullYear()) return;
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    // [New] Helper to check if a date is in the blocked list
    const isDateBlocked = (date: Date) => {
        return blockedDates.some(blocked => isSameDay(date, blocked));
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl border border-black/10 p-6 shadow-lg shadow-black/5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-[#000000]">Select a Date</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#000000]">
                        <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#000000]">
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {months.map((monthDate, index) => {
                    const { days, firstDay } = getDaysInMonth(monthDate);
                    const monthName = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                    return (
                        <div key={index} className="flex flex-col">
                            <h3 className="text-lg font-medium text-[#000000]/80 mb-4 text-center">{monthName}</h3>
                            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-[#000000]/60">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: days }).map((_, i) => {
                                    const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), i + 1);
                                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    const isBlocked = isDateBlocked(date);
                                    const isDisabled = isPast || isBlocked;

                                    return (
                                        <button
                                            key={i}
                                            disabled={isDisabled}
                                            onClick={() => onDateSelect(date)}
                                            className={`
                        aspect-square rounded-full flex items-center justify-center text-sm transition-all
                        ${isDisabled ? 'text-[#146C94]/40 cursor-not-allowed decoration-slice line-through opacity-50' : 'hover:bg-black/5 text-[#000000]'}
                        ${isSelected ? 'bg-gradient-to-r from-[#19A7CE]/80 to-[#F6F1F1] text-[#000000] font-bold shadow-lg scale-110' : ''}
                        ${isBlocked && !isPast ? 'bg-red-900/20 text-red-500/50' : ''} 
                      `}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
