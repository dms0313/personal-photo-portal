
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

async function main() {
    console.log('--- Testing Service Account Directly ---');
    const jsonPath = path.resolve(process.cwd(), 'service-account.json');
    console.log('Reading:', jsonPath);

    if (!fs.existsSync(jsonPath)) {
        console.error('File not found!');
        return;
    }

    const content = fs.readFileSync(jsonPath, 'utf-8');
    let credentials;
    try {
        credentials = JSON.parse(content);
        console.log('Parsed JSON. Client Email:', credentials.client_email);
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const client = await auth.getClient();
        console.log('Client created.');

        console.log('Requesting Access Token...');
        const token = await client.getAccessToken();
        console.log('SUCCESS: Generated Access Token');
        console.log('Token starts with:', token.token ? token.token.substring(0, 10) + '...' : 'No token string?');

    } catch (e) {
        console.error('AUTH ERROR:', e.message);
        if (e.response && e.response.data) {
            console.error('Response Data:', e.response.data);
        }
    }
}

main();
