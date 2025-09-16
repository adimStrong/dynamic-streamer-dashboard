const { google } = require('googleapis');

// Google Sheets Configuration
const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let sheets;

async function initializeGoogleSheets() {
    try {
        if (!SHEETS_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
            console.log('Missing Google Sheets configuration');
            return false;
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                client_email: SERVICE_ACCOUNT_EMAIL,
                private_key: PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        sheets = google.sheets({ version: 'v4', auth });
        return true;
    } catch (error) {
        console.error('Failed to initialize Google Sheets:', error);
        return false;
    }
}

async function fetchSheetsData() {
    try {
        if (!sheets) {
            const initialized = await initializeGoogleSheets();
            if (!initialized) {
                return null;
            }
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEETS_ID,
            range: 'Sheet1!A:Z',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return { error: 'No data found in spreadsheet' };
        }

        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        // Calculate summary
        const summary = {
            totalViewers: data.reduce((sum, row) => sum + (parseInt(row['TOTAL VIEWS']?.replace(/,/g, '')) || 0), 0).toLocaleString(),
            totalRevenue: '₱0', // Add revenue calculation if needed
            activeStreamers: new Set(data.map(row => row['Name of Streamer']).filter(Boolean)).size.toString(),
            avgViewTime: '120 min' // Add calculation if needed
        };

        return {
            lastUpdated: new Date().toISOString(),
            streamers: data,
            summary
        };
    } catch (error) {
        console.error('Error fetching sheets data:', error);
        return { error: error.message };
    }
}

export default async function handler(req, res) {
    const data = await fetchSheetsData();

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}