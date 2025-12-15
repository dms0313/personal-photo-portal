
import fs from 'fs';
import path from 'path';
// import { google } from 'googleapis'; // Commented out static import

console.log("Starting debug-jwt.js");

async function main() {
    console.log('--- JWT Debug Script ---');

    // 1. Load .env manually
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log('Found .env file');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            // Handle KEY="VAL", KEY='VAL', KEY=VAL, and whitespace
            const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Basic unquote
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);

                // console.log(`Found key: ${key}`); // Debug print
                if (key === 'GOOGLE_SERVICE_ACCOUNT_JSON') {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.log('No .env file found');
    }

    const serviceAccountStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    let credentials;

    if (!serviceAccountStr) {
        console.error('ERROR: GOOGLE_SERVICE_ACCOUNT_JSON not found in .env via manual parsing');
        console.log('Attempting to read service-account.json file instead...');
        const jsonPath = path.resolve(process.cwd(), 'service-account.json');
        if (fs.existsSync(jsonPath)) {
            console.log('Found service-account.json');
            try {
                credentials = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                console.log('JSON Parse from file success.');
            } catch (e) {
                console.error('ERROR: Failed to parse service-account.json:', e.message);
                return;
            }
        } else {
            console.error('ERROR: service-account.json NOT found.');
            return;
        }
    } else {
        console.log('GOOGLE_SERVICE_ACCOUNT_JSON found.');
        try {
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
            console.log('JSON Parse success.');
        } catch (e) {
            console.error('ERROR: Failed to parse JSON:', e.message);
            return;
        }
    }

    if (!credentials.private_key) {
        console.error('ERROR: No private_key in credentials.');
        return;
    }

    console.log('--- Key Analysis ---');
    let key = credentials.private_key;
    console.log('Original Length:', key.length);
    console.log('Is String:', typeof key === 'string');

    // Check for literal \n
    const literalNewlineCount = (key.match(/\\n/g) || []).length;
    console.log(`Literal "\\n" count: ${literalNewlineCount}`);

    // Check for actual newlines
    const actualNewlineCount = (key.match(/\n/g) || []).length;
    console.log(`Actual newline count: ${actualNewlineCount}`);

    // Apply the fix logic from creates-event.js
    if (typeof key === 'string') {
        key = key.replace(/\\n/g, '\n');
    }

    // Check after fix
    const actualNewlineCountAfter = (key.match(/\n/g) || []).length;
    console.log(`Actual newline count AFTER fix: ${actualNewlineCountAfter}`);

    const firstLine = key.split('\n')[0];
    const lastLine = key.split('\n').filter(l => l.trim()).pop();
    console.log('First line:', firstLine);
    console.log('Last line:', lastLine);

    if (!firstLine.includes('BEGIN PRIVATE KEY')) {
        console.error('ERROR: First line does not contain BEGIN PRIVATE KEY');
    }
    if (!lastLine.includes('END PRIVATE KEY')) {
        console.error('ERROR: Last line does not contain END PRIVATE KEY');
    }

    credentials.private_key = key;

    console.log('--- Attempting GoogleAuth (Dynamic Import) ---');
    try {
        const googleapis = await import('googleapis');
        const google = googleapis.google;

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const client = await auth.getClient();
        console.log('SUCCESS: GoogleAuth client created successfully.');
        console.log('Client Email:', await client.getCredentials().client_email);

        // Try getting an access token (verifies signing works)
        console.log('Attempting to get access token...');
        const token = await client.getAccessToken();
        console.log('SUCCESS: Access Token generation works!');

    } catch (error) {
        console.error('FAILURE: GoogleAuth threw an error:');
        console.error(error);
    }
}

main().catch(console.error);
