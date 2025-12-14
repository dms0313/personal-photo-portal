export interface BusyDate {
    start: Date;
    end: Date;
}

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

export async function fetchBusyDates(timeMin: Date, timeMax: Date): Promise<Date[]> {
    if (!API_KEY || !CALENDAR_ID) {
        console.warn('Google Calendar API Key or Calendar ID not configured');
        return [];
    }

    const startStr = timeMin.toISOString();
    const endStr = timeMax.toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${startStr}&timeMax=${endStr}&singleEvents=true&orderBy=startTime&fields=items(start,end)`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Calendar API Error: ${response.statusText}`);
        }
        const data = await response.json();

        const busyDates: Date[] = [];

        // Process events into a list of "Busy" days
        // Note: This logic assumes if ANY part of the day is busy, we might want to flag it?
        // Or strictly if it's an "All Day" event? 
        // For simplicity in this freelance context, if there is an event, we treat the day as "busy" 
        // OR we can pass exact ranges. But the UI is date-picker based.
        // Let's being conservative: If there is an event on that day, mark it.

        data.items?.forEach((item: any) => {
            if (item.start) {
                const startDate = new Date(item.start.date || item.start.dateTime);
                const endDate = new Date(item.end.date || item.end.dateTime);

                // Iterate through days between start and end
                let loop = new Date(startDate);
                while (loop < endDate) {
                    busyDates.push(new Date(loop));
                    loop.setDate(loop.getDate() + 1);
                }
            }
        });

        return busyDates;

    } catch (error) {
        console.error('Failed to fetch calendar events:', error);
        return [];
    }
}
