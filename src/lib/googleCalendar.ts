export interface BusyDate {
    start: Date;
    end: Date;
}



export async function fetchBusyDates(timeMin: Date, timeMax: Date): Promise<Date[]> {
    const startStr = timeMin.toISOString();
    const endStr = timeMax.toISOString();

    // Call our own backend API instead of Google directly
    const url = `/api/calendar-busy?timeMin=${startStr}&timeMax=${endStr}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Calendar API Error: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        const busyDates: Date[] = [];

        // Process events
        data.items?.forEach((item: any) => {
            if (item.start) {
                const startDate = new Date(item.start.date || item.start.dateTime);
                const endDate = new Date(item.end.date || item.end.dateTime);

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
