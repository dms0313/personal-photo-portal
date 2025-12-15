
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const jsonPath = path.resolve(process.cwd(), 'service-account.json');

if (!fs.existsSync(jsonPath)) {
    console.error('service-account.json not found!');
    process.exit(1);
}

try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    // Validate JSON
    JSON.parse(jsonContent);
    const minified = JSON.stringify(JSON.parse(jsonContent));

    // Read existing .env
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Replace or Append
    const key = 'GOOGLE_SERVICE_ACCOUNT_JSON';
    const newLine = `${key}='${minified}'`;

    if (envContent.includes(key)) {
        // Regex replace to handle multiline or widely varying formats
        // This regex looks for KEY=... until end of line or start of next key?
        // Simplest: Split by lines, remove usage of KEY, append new one.
        const lines = envContent.split('\n');
        const newLines = lines.filter(l => !l.trim().startsWith(key));
        newLines.push(newLine);
        envContent = newLines.join('\n');
        console.log('Updated existing key in .env');
    } else {
        envContent += `\n${newLine}\n`;
        console.log('Appended key to .env');
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('Success: .env updated.');

} catch (e) {
    console.error('Error:', e);
}
