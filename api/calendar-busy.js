import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { timeMin, timeMax } = req.query;

    if (!timeMin || !timeMax) {
        return res.status(400).json({ message: 'Missing timeMin or timeMax parameters' });
    }

    // 1. Authenticate with Service Account
    // We expect GOOGLE_SERVICE_ACCOUNT_JSON to be a stringified JSON object in env variables
    const serviceAccountStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const calendarId = process.env.VITE_GOOGLE_CALENDAR_ID;

    if (!serviceAccountStr || !calendarId) {
        console.error('Missing Google Service Account or Calendar ID');
        return res.status(500).json({ message: 'Server Configuration Error' });
    }

    try {
        const credentials = JSON.parse(serviceAccountStr);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
        });

        const calendar = google.calendar({ version: 'v3', auth });

        // 2. Fetch Events
        const response = await calendar.events.list({
            calendarId: calendarId,
            timeMin: timeMin,
            timeMax: timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });

        // 3. Return only what we need to the frontend
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Calendar API Error:', error);
        return res.status(500).json({
            message: 'Failed to fetch calendar events',
            error: error.message
        });
    }
}
