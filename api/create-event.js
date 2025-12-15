import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    // Add CORS headers just in case
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Received booking request');
        const { name, email, message, date } = req.body;

        // Use environment variable for credentials (works in Vercel and locally)
        const serviceAccountStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

        if (!serviceAccountStr) {
            throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON environment variable');
        }

        const credentials = JSON.parse(serviceAccountStr);

        // Fix for Vercel/env var newline issues in private key
        if (credentials.private_key) {
            // Robust sanitization: verify it's a string, handle standard and double escaped newlines
            let key = credentials.private_key;
            if (typeof key === 'string') {
                // Replace literal "\n" (two chars) with real newline
                key = key.replace(/\\n/g, '\n');

                // If that didn't work (maybe double escaped?), try checking if we still have no newlines 
                // and the string contains "-----BEGIN"
                if (key.indexOf('\n') === -1 && key.indexOf('-----BEGIN') !== -1) {
                    console.log('Detected potential issue: Private Key has no newlines after first pass. Trying stronger fix.');
                }

                credentials.private_key = key;
            }

            console.log('--- CREDENTIALS DEBUG ---');
            console.log('Client Email:', credentials.client_email);
            console.log('Private Key length:', credentials.private_key.length);
            const firstLine = credentials.private_key.split('\n')[0];
            const lastLine = credentials.private_key.split('\n').filter(l => l.trim()).pop();
            console.log('Private Key first line:', firstLine);
            console.log('Private Key last line:', lastLine);
            console.log('-------------------------');
        } else {
            console.warn('Warning: No private_key found in credentials object');
        }

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });

        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

        const event = {
            summary: `Photo Session: ${name}`,
            description: `Client: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() }
            // attendees: [
            //     { email: email },
            // ]
        };

        const calendarId = process.env.VITE_GOOGLE_CALENDAR_ID || 'dms0313@gmail.com';

        const response = await calendar.events.insert({
            calendarId: calendarId,
            requestBody: event,
        });

        console.log('Event created:', response.data.htmlLink);
        return res.status(200).json({ success: true, link: response.data.htmlLink });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}
