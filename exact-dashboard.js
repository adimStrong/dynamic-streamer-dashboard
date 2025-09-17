// D.A Streaming Analytics Dashboard - GitHub Pages version with Google Sheets integration

// Google Sheets Configuration - Using CORS proxy for API access
const SHEETS_ID = '1SyplmNbPp3kfLFjhD-n1ZO0q8g1gF_GvaqmQXj_QLZQ';
const API_KEY = 'AIzaSyBBPe8nxlLRAWfLMWMrKQJ5iwtdOHiDvt8';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/D.A!A1:Z1000?key=${API_KEY}`;
const PROXIED_URL = CORS_PROXY + encodeURIComponent(SHEETS_API_URL);

// Initial dataset (will be replaced by Google Sheets data)
let streamData = [
    {date: '2025-08-09', views: 1037, comments: 257, reactions: 131, shares: 282, linkClicks: 1, newFollowers: 7, totalFollowers: 294, extraNewFollowers: 294, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-10', views: 931, comments: 298, reactions: 78, shares: 282, linkClicks: 0, newFollowers: 1, totalFollowers: 346, extraNewFollowers: 52, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-11', views: 18147, comments: 5800, reactions: 498, shares: 453, linkClicks: 4, newFollowers: 248, totalFollowers: 668, extraNewFollowers: 322, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-12', views: 10007, comments: 3436, reactions: 986, shares: 395, linkClicks: 2, newFollowers: 83, totalFollowers: 997, extraNewFollowers: 329, streamer: 'Abi and Juan G', type: 'live'},
    {date: '2025-08-13', views: 1689, comments: 1200, reactions: 267, shares: 162, linkClicks: 2, newFollowers: 5, totalFollowers: 1100, extraNewFollowers: 103, streamer: 'Abi and Kimmy', type: 'live'},
    {date: '2025-08-14', views: 1561, comments: 1200, reactions: 114, shares: 223, linkClicks: 1, newFollowers: 3, totalFollowers: 1268, extraNewFollowers: 43, streamer: 'Abi and Juan G', type: 'live'},
    {date: '2025-08-15', views: 1655, comments: 416, reactions: 209, shares: 198, linkClicks: 0, newFollowers: 0, totalFollowers: 1504, extraNewFollowers: 92, streamer: 'Abi and Juan G', type: 'live'},
    {date: '2025-08-15', views: 2126, comments: 2329, reactions: 649, shares: 203, linkClicks: 0, newFollowers: 0, totalFollowers: 1504, extraNewFollowers: 0, streamer: 'Abi and Juan G', type: 'relive'},
    {date: '2025-08-16', views: 1595, comments: 1012, reactions: 338, shares: 279, linkClicks: 1, newFollowers: 10, totalFollowers: 1780, extraNewFollowers: 276, streamer: 'Juan G and Kimmy', type: 'live'},
    {date: '2025-08-16', views: 2940, comments: 2940, reactions: 171, shares: 328, linkClicks: 1, newFollowers: 8, totalFollowers: 1818, extraNewFollowers: 69, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-17', views: 2197, comments: 1311, reactions: 341, shares: 288, linkClicks: 1, newFollowers: 10, totalFollowers: 2026, extraNewFollowers: 208, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-17', views: 2143, comments: 2845, reactions: 384, shares: 235, linkClicks: 1, newFollowers: 10, totalFollowers: 2093, extraNewFollowers: 67, streamer: 'Abi and Kimmy', type: 'live'},
    {date: '2025-08-18', views: 2856, comments: 3900, reactions: 195, shares: 333, linkClicks: 0, newFollowers: 10, totalFollowers: 2470, extraNewFollowers: 377, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-19', views: 2230, comments: 2876, reactions: 623, shares: 227, linkClicks: 0, newFollowers: 0, totalFollowers: 2730, extraNewFollowers: 260, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-20', views: 2053, comments: 2284, reactions: 565, shares: 287, linkClicks: 2, newFollowers: 0, totalFollowers: 2952, extraNewFollowers: 222, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-21', views: 2646, comments: 5268, reactions: 928, shares: 406, linkClicks: 1, newFollowers: 0, totalFollowers: 3228, extraNewFollowers: 276, streamer: 'Abi and Juan G', type: 'live'},
    {date: '2025-08-22', views: 3682, comments: 7135, reactions: 1852, shares: 488, linkClicks: 0, newFollowers: 0, totalFollowers: 3455, extraNewFollowers: 227, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-23', startTime: '17:00', endTime: '19:00', views: 2419, comments: 7673, reactions: 1015, shares: 401, linkClicks: 1, newFollowers: 0, totalFollowers: 3677, extraNewFollowers: 111, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-08-23', startTime: '19:30', endTime: '21:30', views: 2686, comments: 6264, reactions: 1022, shares: 324, linkClicks: 0, newFollowers: 0, totalFollowers: 3677, extraNewFollowers: 111, streamer: 'Jam and Sena', type: 'live'},
    {date: '2025-08-24', startTime: '18:30', endTime: '20:00', views: 2705, comments: 11939, reactions: 921, shares: 402, linkClicks: 0, newFollowers: 0, totalFollowers: 3836, extraNewFollowers: 79.5, streamer: 'Jam and Abi', type: 'live'},
    {date: '2025-08-24', startTime: '20:30', endTime: '22:00', views: 1805, comments: 5341, reactions: 389, shares: 121, linkClicks: 0, newFollowers: 0, totalFollowers: 3836, extraNewFollowers: 79.5, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-25', startTime: '17:30', endTime: '19:00', views: 8159, comments: 12300, reactions: 1339, shares: 528, linkClicks: 0, newFollowers: 0, totalFollowers: 4148, extraNewFollowers: 312, streamer: 'Juan G and Zell', type: 'live'},
    {date: '2025-08-25', startTime: '20:00', endTime: '22:00', views: 8232, comments: 9852, reactions: 1286, shares: 371, linkClicks: 3, newFollowers: 0, totalFollowers: 4331, extraNewFollowers: 183, streamer: 'Kimmy, Jam and Sena', type: 'live'},
    {date: '2025-08-26', startTime: '17:00', endTime: '19:00', views: 9795, comments: 16454, reactions: 1981, shares: 604, linkClicks: 1, newFollowers: 0, totalFollowers: 4671, extraNewFollowers: 340, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-08-26', startTime: '19:30', endTime: '21:30', views: 8586, comments: 15871, reactions: 1341, shares: 498, linkClicks: 0, newFollowers: 0, totalFollowers: 4851, extraNewFollowers: 180, streamer: 'Kimmy and Jam', type: 'live'},
    {date: '2025-08-27', startTime: '17:00', endTime: '19:00', views: 2603, comments: 8958, reactions: 751, shares: 298, linkClicks: 0, newFollowers: 0, totalFollowers: 4979, extraNewFollowers: 128, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-27', startTime: '19:30', endTime: '21:30', views: 9005, comments: 12565, reactions: 1232, shares: 513, linkClicks: 0, newFollowers: 0, totalFollowers: 5164, extraNewFollowers: 185, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-08-28', startTime: '17:00', endTime: '19:00', views: 6465, comments: 7101, reactions: 908, shares: 240, linkClicks: 0, newFollowers: 0, totalFollowers: 5280, extraNewFollowers: 116, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-08-28', startTime: '19:30', endTime: '21:30', views: 7016, comments: 6364, reactions: 911, shares: 323, linkClicks: 0, newFollowers: 0, totalFollowers: 5502, extraNewFollowers: 222, streamer: 'Jam and Abi', type: 'live'},
    {date: '2025-08-29', startTime: '17:00', endTime: '19:00', views: 5137, comments: 8100, reactions: 882, shares: 631, linkClicks: 0, newFollowers: 0, totalFollowers: 5756, extraNewFollowers: 127, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-08-29', startTime: '19:30', endTime: '21:30', views: 11620, comments: 16100, reactions: 550, shares: 730, linkClicks: 0, newFollowers: 0, totalFollowers: 5756, extraNewFollowers: 127, streamer: 'Zell and Jam', type: 'live'},
    {date: '2025-08-30', startTime: '17:00', endTime: '19:00', views: 6589, comments: 13119, reactions: 1580, shares: 613, linkClicks: 1, newFollowers: 0, totalFollowers: 6033, extraNewFollowers: 277, streamer: 'Abi', type: 'live'},
    {date: '2025-08-30', startTime: '19:30', endTime: '21:30', views: 2662, comments: 7557, reactions: 1494, shares: 407, linkClicks: 2, newFollowers: 0, totalFollowers: 6044, extraNewFollowers: 11, streamer: 'Sena and Zell', type: 'live'},
    {date: '2025-08-31', startTime: '17:00', endTime: '19:00', views: 8945, comments: 10300, reactions: 1608, shares: 759, linkClicks: 1, newFollowers: 0, totalFollowers: 6100, extraNewFollowers: 56, streamer: 'Jam and Sena', type: 'live'},
    {date: '2025-08-31', startTime: '19:30', endTime: '21:30', views: 5016, comments: 10065, reactions: 1961, shares: 824, linkClicks: 0, newFollowers: 0, totalFollowers: 6274, extraNewFollowers: 174, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-09-01', startTime: '17:00', endTime: '19:00', views: 8568, comments: 6967, reactions: 1444, shares: 381, linkClicks: 1, newFollowers: 0, totalFollowers: 6394, extraNewFollowers: 120, streamer: 'Juan G and Jam', type: 'live'},
    {date: '2025-09-01', startTime: '19:30', endTime: '21:30', views: 10337, comments: 9395, reactions: 2322, shares: 1068, linkClicks: 0, newFollowers: 0, totalFollowers: 6518, extraNewFollowers: 124, streamer: 'Sena and Zell', type: 'live'},
    {date: '2025-09-02', startTime: '17:00', endTime: '19:00', views: 6879, comments: 8828, reactions: 1423, shares: 731, linkClicks: 0, newFollowers: 0, totalFollowers: 6642, extraNewFollowers: 124, streamer: 'Zell and Jam', type: 'live'},
    {date: '2025-09-02', startTime: '19:30', endTime: '21:30', views: 11355, comments: 10788, reactions: 2351, shares: 1159, linkClicks: 2, newFollowers: 0, totalFollowers: 6781, extraNewFollowers: 139, streamer: 'Abi', type: 'live'},
    {date: '2025-09-03', startTime: '17:00', endTime: '19:00', views: 5975, comments: 6562, reactions: 1552, shares: 574, linkClicks: 1, newFollowers: 0, totalFollowers: 6887, extraNewFollowers: 106, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-09-03', startTime: '19:30', endTime: '21:30', views: 9881, comments: 9274, reactions: 1982, shares: 1067, linkClicks: 3, newFollowers: 0, totalFollowers: 6989, extraNewFollowers: 102, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-09-04', startTime: '17:00', endTime: '19:00', views: 7915, comments: 8893, reactions: 2650, shares: 1058, linkClicks: 0, newFollowers: 0, totalFollowers: 7242, extraNewFollowers: 126.5, streamer: 'Abi and Sena', type: 'live'},
    {date: '2025-09-04', startTime: '19:30', endTime: '21:30', views: 7555, comments: 7564, reactions: 4199, shares: 625, linkClicks: 1, newFollowers: 0, totalFollowers: 7242, extraNewFollowers: 126.5, streamer: 'Juan G and Jam', type: 'live'},
    {date: '2025-09-05', startTime: '17:00', endTime: '19:00', views: 6810, comments: 9925, reactions: 2428, shares: 1066, linkClicks: 2, newFollowers: 0, totalFollowers: 7373, extraNewFollowers: 65.5, streamer: 'Jam and Abi', type: 'live'},
    {date: '2025-09-05', startTime: '19:30', endTime: '21:30', views: 6820, comments: 7460, reactions: 2095, shares: 1089, linkClicks: 0, newFollowers: 0, totalFollowers: 7373, extraNewFollowers: 65.5, streamer: 'Zell and Sena', type: 'live'},
    {date: '2025-09-06', startTime: '17:00', endTime: '19:00', views: 10385, comments: 9398, reactions: 2969, shares: 1413, linkClicks: 0, newFollowers: 0, totalFollowers: 7537, extraNewFollowers: 164, streamer: 'Sena and Zell', type: 'live'},
    {date: '2025-09-06', startTime: '19:30', endTime: '21:30', views: 8755, comments: 9927, reactions: 2440, shares: 1562, linkClicks: 0, newFollowers: 0, totalFollowers: 7601, extraNewFollowers: 64, streamer: 'Jam and Abi', type: 'live'},
    {date: '2025-09-07', startTime: '17:00', endTime: '19:00', views: 6464, comments: 12154, reactions: 1456, shares: 1557, linkClicks: 0, newFollowers: 0, totalFollowers: 7720, extraNewFollowers: 119, streamer: 'Jam and Sena', type: 'live'},
    {date: '2025-09-07', startTime: '19:30', endTime: '21:30', views: 6344, comments: 12318, reactions: 3263, shares: 2005, linkClicks: 0, newFollowers: 0, totalFollowers: 7783, extraNewFollowers: 63, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-09-08', startTime: '14:00', endTime: '16:30', views: 4454, comments: 8346, reactions: 719, shares: 740, linkClicks: 0, newFollowers: 0, totalFollowers: 7894, extraNewFollowers: 111, streamer: 'Jam', type: 'live'},
    {date: '2025-09-08', startTime: '17:00', endTime: '19:00', views: 5209, comments: 12966, reactions: 2985, shares: 976, linkClicks: 0, newFollowers: 0, totalFollowers: 7952, extraNewFollowers: 58, streamer: 'Abi and Zell', type: 'live'},
    {date: '2025-09-08', startTime: '19:30', endTime: '21:30', views: 5608, comments: 9642, reactions: 1695, shares: 1120, linkClicks: 0, newFollowers: 0, totalFollowers: 8030, extraNewFollowers: 78, streamer: 'Juan G and Sena', type: 'live'},
    {date: '2025-09-09', startTime: '14:00', endTime: '16:30', views: 10481, comments: 10224, reactions: 1353, shares: 1087, linkClicks: 1, newFollowers: 0, totalFollowers: 8214, extraNewFollowers: 184, streamer: 'Jam', type: 'live'},
    {date: '2025-09-09', startTime: '17:00', endTime: '19:00', views: 7574, comments: 9476, reactions: 3194, shares: 1526, linkClicks: 0, newFollowers: 0, totalFollowers: 8287, extraNewFollowers: 73, streamer: 'Zell and Kimmy', type: 'live'},
    {date: '2025-09-09', startTime: '19:30', endTime: '21:30', views: 3743, comments: 7455, reactions: 2367, shares: 1120, linkClicks: 0, newFollowers: 0, totalFollowers: 8287, extraNewFollowers: 0, streamer: 'Abi', type: 'live'},
    {date: '2025-09-10', startTime: '14:00', endTime: '16:30', views: 3283, comments: 7981, reactions: 1856, shares: 744, linkClicks: 0, newFollowers: 0, totalFollowers: 8431, extraNewFollowers: 144, streamer: 'Jam', type: 'live'},
    {date: '2025-09-10', startTime: '17:00', endTime: '19:00', views: 4147, comments: 7646, reactions: 2083, shares: 830, linkClicks: 0, newFollowers: 0, totalFollowers: 8514, extraNewFollowers: 83, streamer: 'Zell and Kimmy', type: 'live'},
    {date: '2025-09-10', startTime: '19:30', endTime: '21:30', views: 4407, comments: 6870, reactions: 1476, shares: 743, linkClicks: 1, newFollowers: 0, totalFollowers: 8514, extraNewFollowers: 0, streamer: 'Abi', type: 'live'},
    {date: '2025-09-11', startTime: '14:00', endTime: '16:30', views: 3094, comments: 7897, reactions: 966, shares: 824, linkClicks: 1, newFollowers: 0, totalFollowers: 8750, extraNewFollowers: 236, streamer: 'Jam', type: 'live'},
    {date: '2025-09-11', startTime: '17:00', endTime: '19:00', views: 3649, comments: 8984, reactions: 2067, shares: 1046, linkClicks: 0, newFollowers: 0, totalFollowers: 8819, extraNewFollowers: 69, streamer: 'Sena and Zell', type: 'live'},
    {date: '2025-09-11', startTime: '19:30', endTime: '21:30', views: 3167, comments: 4993, reactions: 587, shares: 470, linkClicks: 1, newFollowers: 0, totalFollowers: 8819, extraNewFollowers: 0, streamer: 'Juan G', type: 'live'}
];

// Calculate duration for items with start/end times
streamData.forEach(item => {
    if (item.startTime && item.endTime) {
        item.duration = calculateDuration(item.startTime, item.endTime);
    }
});

let filteredData = [...streamData];
let charts = {};

// Initialize dashboard without server connection
function initializeDashboard() {
    console.log('Initializing D.A Dashboard with static data');
    console.log('Available stream data:', streamData.length, 'records');
    updateConnectionStatus(true); // Set as connected since we have static data

    // Ensure data is properly initialized
    filteredData = [...streamData];
    console.log('Filtered data initialized:', filteredData.length, 'records');

    // Populate the collaboration dropdown
    populateCollaborationDropdown();

    // Apply filters and update all dashboard components
    applyFilters();

    console.log('Dashboard initialization complete');

    // Fetch Google Sheets data (with 10 second timeout fallback)
    fetchGoogleSheetsData();

    // Fallback timeout in case Google Sheets takes too long
    setTimeout(() => {
        const statusElement = document.getElementById('statusText');
        if (statusElement && statusElement.textContent.includes('Loading')) {
            console.log('Google Sheets timeout - falling back to static data');
            updateConnectionStatus(true);
            statusElement.textContent = '⚠️ Using Static Data - Google Sheets Timeout';
            statusElement.className = 'status-disconnected';
        }
    }, 10000);

    // Set up auto-refresh every 5 minutes
    setInterval(fetchGoogleSheetsData, 5 * 60 * 1000);
}

// Google Sheets data fetching functions
async function fetchGoogleSheetsData() {
    try {
        console.log('Fetching data from Google Sheets API via CORS proxy...');
        console.log('Proxied URL:', PROXIED_URL);
        updateConnectionStatus(false); // Show as loading

        const response = await fetch(PROXIED_URL);
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Google Sheets API response:', data);
        const rows = data.values || [];

        if (rows.length === 0) {
            console.log('No data found in Google Sheets');
            // Fall back to static data and show as connected
            updateConnectionStatus(true);
            return;
        }

        // Process the data using the same logic as localhost:3000
        const processedData = processGoogleSheetsData(rows);

        if (processedData.length > 0) {
            console.log(`Fetched ${processedData.length} records from Google Sheets API`);
            streamData = processedData;
            filteredData = [...streamData];

            // Update the dashboard with new data
            populateCollaborationDropdown();
            applyFilters();
            updateConnectionStatus(true);
        } else {
            console.log('No valid data processed from Google Sheets');
            // Fall back to static data and show as connected
            updateConnectionStatus(true);
        }

    } catch (error) {
        console.error('Error fetching Google Sheets API data:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // Fall back to static data and show as connected with error note
        updateConnectionStatus(true);

        // Show user-friendly error message
        setTimeout(() => {
            const statusElement = document.getElementById('statusText');
            if (statusElement) {
                statusElement.textContent = '⚠️ Using Static Data - Google Sheets Unavailable';
                statusElement.className = 'status-disconnected';
            }
        }, 2000);
    }
}


function processGoogleSheetsData(rows) {
    if (rows.length === 0) return [];

    const headers = rows[0].map(header => header.toString().trim());
    const dataRows = rows.slice(1);

    console.log('Headers found:', headers);
    console.log(`Processing ${dataRows.length} data rows`);

    const streamers = dataRows.map((row, index) => {
        const item = {};
        headers.forEach((header, colIndex) => {
            item[header] = row[colIndex] || '';
        });

        // Parse date using the same logic as localhost:3000
        let dateStr = item['DATE'] || item.Date || item.date || '';
        let parsedDate = null;

        if (dateStr) {
            if (typeof dateStr === 'string' && dateStr.includes('/')) {
                const [month, day, year] = dateStr.split('/');
                if (month && day && year) {
                    const fullYear = year.length === 2 ? `20${year}` : year;
                    parsedDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                }
            } else if (typeof dateStr === 'number') {
                // Excel serial date
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + dateStr * 24 * 60 * 60 * 1000);
                parsedDate = date.toISOString().split('T')[0];
            }
        }

        if (!parsedDate) {
            console.log(`Skipping row ${index + 2} - invalid date: "${dateStr}"`);
            return null;
        }

        // Use the exact same column mapping as localhost:3000
        return {
            date: parsedDate,
            views: parseInt((item['TOTAL VIEWS'] || item.Views || item.views || '0').toString().replace(/,/g, '')) || 0,
            comments: parseInt((item['COMMENTS'] || item.Comments || item.comments || '0').toString().replace(/,/g, '')) || 0,
            reactions: parseInt((item['REACTIONS'] || item.Reactions || item.reactions || '0').toString().replace(/,/g, '')) || 0,
            shares: parseInt((item['SHARE'] || item.Shares || item.shares || '0').toString().replace(/,/g, '')) || 0,
            linkClicks: parseInt((item['LINK CLICKS'] || item.LinkClicks || item.linkClicks || '0').toString().replace(/,/g, '')) || 0,
            newFollowers: parseInt((item['EOD New Follower'] || item['New Followers'] || item.newFollowers || '0').toString().replace(/,/g, '')) || 0,
            totalFollowers: parseInt((item['OVERALL TOTAL FOLLOWERS'] || item['Total Followers'] || item.totalFollowers || '0').toString().replace(/,/g, '')) || 0,
            extraNewFollowers: parseInt((item['EOD New Follower'] || item['Extra New Followers'] || item.extraNewFollowers || '0').toString().replace(/,/g, '')) || 0,
            streamer: capitalizeNames(item['STREAMER'] || item.Streamer || item.streamer || 'Unknown'),
            type: (item['TYPE'] || item.Type || item.type || 'live').toLowerCase(),
            startTime: item['START TIME'] || item.StartTime || item.startTime || '',
            endTime: item['END TIME'] || item.EndTime || item.endTime || ''
        };
    }).filter(item => item !== null);

    // Sort by date (latest first)
    streamers.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    console.log(`Processed ${streamers.length} valid records`);
    return streamers;
}

// Helper function to capitalize names (same as localhost:3000)
function capitalizeNames(nameString) {
    if (!nameString || typeof nameString !== 'string') return nameString;

    nameString = nameString.trim();

    const commaParts = nameString.split(',').map(part => part.trim());

    const processedParts = commaParts.map(part => {
        return part
            .split(/\s+and\s+/i)
            .map(name => {
                name = name.trim();
                if (!name) return '';

                const lowerName = name.toLowerCase();
                if (lowerName === 'and') return 'and';
                if (lowerName === 'g') return 'G';
                if (!lowerName) return '';

                return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            })
            .filter(name => name)
            .join(' and ');
    });

    if (processedParts.length > 1) {
        const lastPart = processedParts.pop();
        return processedParts.join(', ') + ' and ' + lastPart;
    } else {
        return processedParts[0] || '';
    }
}

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStreamerTag(streamer) {
    const classes = {
        'Abi': 'streamer-abi',
        'Sena': 'streamer-sena',
        'Juan G': 'streamer-juan',
        'Kimmy': 'streamer-kimmy',
        'Zell': 'streamer-zell',
        'Jam': 'streamer-jam',
    };

    let className = 'streamer-abi';
    Object.keys(classes).forEach(name => {
        if (streamer.includes(name)) {
            className = classes[name];
        }
    });

    return `<span class="streamer-tag ${className}">${streamer}</span>`;
}

function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('statusText');
    if (connected) {
        statusElement.textContent = '🟢 Connected - Google Sheets Live Updates';
        statusElement.className = 'status-connected';
    } else {
        statusElement.textContent = '🔄 Loading Google Sheets Data...';
        statusElement.className = 'status-disconnected';
    }
}

function calculateDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    return endTotalMin - startTotalMin;
}

function applyFilters() {
    const streamerFilter = document.getElementById('streamerFilter').value;
    const collabFilter = document.getElementById('collabFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const streamTypeFilter = document.getElementById('streamTypeFilter').value;

    filteredData = streamData.filter(item => {
        // Individual streamer filter
        let includeStreamer = streamerFilter === 'all' || item.streamer.includes(streamerFilter);

        // Collaboration filter (exact match for specific collaborations)
        let includeCollab = collabFilter === 'all' || item.streamer === collabFilter;

        // Stream type filter
        let includeType = streamTypeFilter === 'all' || item.type === streamTypeFilter;

        // Date filter
        let includeDate = true;
        if (dateFilter !== 'all') {
            const itemDate = new Date(item.date);
            const today = new Date('2025-09-11');
            const daysDiff = Math.ceil((today - itemDate) / (1000 * 60 * 60 * 24));

            switch(dateFilter) {
                case 'last3':
                    includeDate = daysDiff <= 2;
                    break;
                case 'last7':
                    includeDate = daysDiff <= 6;
                    break;
                case 'last14':
                    includeDate = daysDiff <= 13;
                    break;
                case 'august':
                    includeDate = itemDate.getMonth() === 7; // August is month 7 (0-indexed)
                    break;
                case 'september':
                    includeDate = itemDate.getMonth() === 8; // September is month 8 (0-indexed)
                    break;
            }
        }

        return includeStreamer && includeCollab && includeDate && includeType;
    });

    updateDashboard();
}

function calculateStats() {
    if (filteredData.length === 0) return;

    const totalStreams = filteredData.length;
    const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
    const avgViews = Math.round(totalViews / totalStreams);
    const totalEngagement = filteredData.reduce((sum, item) => sum + item.comments + item.reactions + item.shares, 0);
    const followerGrowth = filteredData.reduce((sum, item) => sum + item.extraNewFollowers, 0);

    // Calculate total engagement rate: (Total Engagement / Current Followers) × 100
    const currentTotalFollowers = Math.max(...filteredData.map(item => item.totalFollowers));
    const totalEngagementRate = (totalEngagement / currentTotalFollowers) * 100;

    // Debug: Log calculations to compare with HTML file
    console.log('=== DASHBOARD CALCULATIONS DEBUG ===');
    console.log('Total Streams:', totalStreams);
    console.log('Total Views:', totalViews.toLocaleString());
    console.log('Average Views:', avgViews.toLocaleString());
    console.log('Total Engagement:', totalEngagement.toLocaleString());
    console.log('Follower Growth:', followerGrowth);
    console.log('Current Total Followers:', currentTotalFollowers);
    console.log('Total Engagement Rate:', totalEngagementRate.toFixed(2) + '%');
    const totalViewsEngagementRate = (totalEngagement / totalViews) * 100;

    document.getElementById('totalStreams').textContent = totalStreams;
    document.getElementById('totalViews').textContent = totalViews.toLocaleString();
    document.getElementById('avgViews').textContent = avgViews.toLocaleString();
    document.getElementById('totalEngagement').textContent = totalEngagement.toLocaleString();
    document.getElementById('engagementRate').textContent = totalEngagementRate.toFixed(2) + '%';
    document.getElementById('engagementRateViews').textContent = totalViewsEngagementRate.toFixed(2) + '%';
    document.getElementById('followerGrowth').textContent = '+' + followerGrowth.toLocaleString();
    document.getElementById('currentFollowers').textContent = currentTotalFollowers.toLocaleString();

    // Update summary cards
    if (filteredData.length > 0) {
        const bestStream = filteredData.reduce((max, item) => item.views > max.views ? item : max, filteredData[0]);
        const topEngagementDay = filteredData.reduce((max, item) => {
            const engagement = item.comments + item.reactions + item.shares;
            const maxEngagement = max.comments + max.reactions + max.shares;
            return engagement > maxEngagement ? item : max;
        }, filteredData[0]);
        const biggestGrowthDay = filteredData.reduce((max, item) => item.newFollowers > max.newFollowers ? item : max, filteredData[0]);

        document.getElementById('bestStream').textContent = bestStream.views.toLocaleString() + ' views';
        document.getElementById('topEngagement').textContent = (topEngagementDay.comments + topEngagementDay.reactions + topEngagementDay.shares).toLocaleString();
        document.getElementById('biggestGrowth').textContent = '+' + biggestGrowthDay.newFollowers.toLocaleString();

        document.getElementById('bestStreamDesc').textContent = `${bestStream.streamer} - ${formatDate(bestStream.date)}`;
        document.getElementById('topEngagementDesc').textContent = `${topEngagementDay.streamer} - ${formatDate(topEngagementDay.date)}`;
        document.getElementById('biggestGrowthDesc').textContent = `${biggestGrowthDay.streamer} - ${formatDate(biggestGrowthDay.date)}`;
    }

    // Update performance breakdown cards
    updatePerformanceBreakdown();
}

function updateTopPerformers() {
    const topN = document.getElementById('topNFilter').value;
    const sortBy = document.getElementById('sortByFilter').value;
    const container = document.getElementById('topPerformersGrid');

    if (!container) return;

    // Instead of grouping, show individual streams with their engagement rates
    // This matches what users see in the data table
    const individualStreams = filteredData.map(item => {
        const totalEngagement = item.comments + item.reactions + item.shares;
        const engagementRate = item.views > 0 ? ((totalEngagement / item.views) * 100) : 0;

        return {
            name: `${item.streamer} (${item.date})`,
            streamer: item.streamer,
            date: item.date,
            totalViews: item.views,
            avgViews: item.views, // For individual streams, total = avg
            totalEngagement: totalEngagement,
            engagementRate: isFinite(engagementRate) ? engagementRate : 0,
            streams: 1, // Individual stream
            extraNewFollowers: item.extraNewFollowers || 0
        };
    });

    // Debug: Log top engagement rates for troubleshooting
    console.log('=== TOP PERFORMERS ENGAGEMENT RATES DEBUG ===');
    individualStreams
        .sort((a, b) => b.engagementRate - a.engagementRate)
        .slice(0, 10)
        .forEach((stream, index) => {
            console.log(`${index + 1}. ${stream.streamer} (${stream.date}): ${stream.engagementRate.toFixed(2)}% (${stream.totalEngagement}/${stream.totalViews})`);
        });
    console.log('=== END DEBUG ===');

    // Sort by selected metric with proper error handling
    let sortedStreamers = individualStreams.sort((a, b) => {
        let aValue, bValue;

        switch(sortBy) {
            case 'engagementRate':
                aValue = isFinite(a.engagementRate) ? a.engagementRate : 0;
                bValue = isFinite(b.engagementRate) ? b.engagementRate : 0;
                break;
            case 'totalViews':
                aValue = a.totalViews || 0;
                bValue = b.totalViews || 0;
                break;
            case 'avgViews':
                aValue = a.avgViews || 0;
                bValue = b.avgViews || 0;
                break;
            case 'totalEngagement':
                aValue = a.totalEngagement || 0;
                bValue = b.totalEngagement || 0;
                break;
            default:
                aValue = isFinite(a.engagementRate) ? a.engagementRate : 0;
                bValue = isFinite(b.engagementRate) ? b.engagementRate : 0;
        }

        // Sort in descending order (highest first)
        if (bValue !== aValue) {
            return bValue - aValue;
        }
        // If values are equal, sort by name alphabetically as tiebreaker
        return a.name.localeCompare(b.name);
    });

    // Limit to top N
    if (topN !== 'all') {
        sortedStreamers = sortedStreamers.slice(0, parseInt(topN));
    }

    // Generate HTML for individual streams with dynamic colors
    container.innerHTML = sortedStreamers.map((streamer, index) => `
        <div class="top-performer-card">
            <div class="rank-badge rank-${Math.min(index + 1, 3)}">${index + 1}</div>
            <div class="performer-name">${streamer.streamer}</div>
            <div class="performer-metrics">
                <div class="metric-item">
                    <div class="metric-value">${streamer.totalViews.toLocaleString()}</div>
                    <div class="metric-label">Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.date}</div>
                    <div class="metric-label">Date</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.totalEngagement.toLocaleString()}</div>
                    <div class="metric-label">Total Engagement</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">+${streamer.extraNewFollowers}</div>
                    <div class="metric-label">New Followers</div>
                </div>
            </div>
            <div class="engagement-rate-highlight">
                <div class="rate">${streamer.engagementRate.toFixed(2)}%</div>
                <div>Engagement Rate (Views-Based)</div>
            </div>
        </div>
    `).join('');
}

function updateIndividualPerformers() {
    const topN = document.getElementById('topNIndividualFilter').value;
    const sortBy = document.getElementById('sortByIndividualFilter').value;
    const container = document.getElementById('topIndividualPerformersGrid');

    if (!container) return;

    // Calculate individual streamer statistics across all their participations
    const streamerStats = {};

    filteredData.forEach(item => {
        // Match HTML parsing logic exactly: handle both "Name1, Name2 and Name3" and "Name1 and Name2"
        const streamers = item.streamer.split(/,\s*|\s+and\s+/).filter(s => s.trim());
        const totalEngagement = item.comments + item.reactions + item.shares;

        streamers.forEach(streamer => {
            streamer = streamer.trim();
            if (!streamerStats[streamer]) {
                streamerStats[streamer] = {
                    name: streamer,
                    totalViews: 0,
                    totalEngagement: 0,
                    totalFollowers: 0,
                    streams: 0,
                    collaborationCount: 0,
                    soloCount: 0,
                    avgViews: 0,
                    engagementRate: 0
                };
            }

            // Give full stream stats to each participant (like HTML file)
            streamerStats[streamer].totalViews += item.views;
            streamerStats[streamer].totalEngagement += totalEngagement;
            streamerStats[streamer].totalFollowers += item.extraNewFollowers || 0;
            streamerStats[streamer].streams += 1;

            // Track collaboration vs solo participation like HTML file
            if (streamers.length === 1) {
                streamerStats[streamer].soloCount += 1;
            } else {
                streamerStats[streamer].collaborationCount += 1;
            }
        });
    });

    // Calculate averages and engagement rates
    console.log('=== INDIVIDUAL STREAMER PERFORMANCE DEBUG ===');
    let totalIndividualViews = 0;
    let totalIndividualEngagement = 0;
    Object.values(streamerStats).forEach(stats => {
        stats.avgViews = Math.round(stats.totalViews / stats.streams);
        stats.engagementRate = stats.totalViews > 0 ? (stats.totalEngagement / stats.totalViews * 100) : 0;
        console.log(`${stats.name}: ${stats.totalViews} views, ${stats.totalEngagement} engagement, ${stats.streams} streams`);
        totalIndividualViews += stats.totalViews;
        totalIndividualEngagement += stats.totalEngagement;
    });
    console.log(`Individual Performance Total Views: ${totalIndividualViews}`);
    console.log(`Individual Performance Total Engagement: ${totalIndividualEngagement}`);
    console.log('=== END INDIVIDUAL STREAMER DEBUG ===');

    // Convert to array and sort
    const streamersArray = Object.values(streamerStats);
    streamersArray.sort((a, b) => {
        switch(sortBy) {
            case 'engagementRate':
                return b.engagementRate - a.engagementRate;
            case 'totalViews':
                return b.totalViews - a.totalViews;
            case 'avgViews':
                return b.avgViews - a.avgViews;
            case 'streams':
                return b.streams - a.streams;
            default:
                return b.engagementRate - a.engagementRate;
        }
    });

    // Limit to top N like HTML file
    const topStreamers = topN === 'all' ? streamersArray : streamersArray.slice(0, parseInt(topN));

    // Update the grid like HTML file does
    container.innerHTML = '';
    topStreamers.forEach((streamer, index) => {
        const card = document.createElement('div');
        card.className = 'top-performer-card';

        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';

        // Create participation breakdown like HTML file
        let participationType = '';
        if (streamer.soloCount > 0 && streamer.collaborationCount > 0) {
            participationType = `${streamer.soloCount} solo, ${streamer.collaborationCount} collab`;
        } else if (streamer.soloCount > 0) {
            participationType = `${streamer.soloCount} solo streams`;
        } else {
            participationType = `${streamer.collaborationCount} collaborations`;
        }

        card.innerHTML = `
            <div class="rank-badge ${rankClass}">${index + 1}</div>
            <div class="performer-name">${streamer.name}</div>
            <div class="performer-metrics">
                <div class="metric-item">
                    <div class="metric-value">${streamer.totalViews.toLocaleString()}</div>
                    <div class="metric-label">Total Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.avgViews.toLocaleString()}</div>
                    <div class="metric-label">Avg Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.totalEngagement.toLocaleString()}</div>
                    <div class="metric-label">Total Engagement</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.streams}</div>
                    <div class="metric-label">Streams</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.collaborationCount}</div>
                    <div class="metric-label">Collaborations</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${streamer.soloCount}</div>
                    <div class="metric-label">Solo</div>
                </div>
            </div>
            <div class="participation-breakdown">
                <div style="font-size: 0.9em; color: #666; text-align: center; margin: 8px 0;">${participationType}</div>
            </div>
            <div class="engagement-rate-highlight">
                <div class="rate">${streamer.engagementRate.toFixed(2)}%</div>
                <div style="font-size: 0.9em;">Engagement Rate (Views-Based)</div>
            </div>
        `;

        container.appendChild(card);
    });
}

function updatePerformanceBreakdown() {
    // Separate individual streamers from collaborations
    const streamerStats = {};
    const collabStats = {};
    const individualStreamerStats = {};

    filteredData.forEach(item => {
        // Match HTML parsing logic exactly: handle both "Name1, Name2 and Name3" and "Name1 and Name2"
        const streamers = item.streamer.split(/,\s*|\s+and\s+/).filter(s => s.trim());
        const totalEngagement = item.comments + item.reactions + item.shares;

        // Track individual streamer performance across all their streams (solo + collabs)
        streamers.forEach(streamer => {
            if (!individualStreamerStats[streamer]) {
                individualStreamerStats[streamer] = {
                    views: 0,
                    engagement: 0,
                    followers: 0,
                    streams: 0,
                    avgViews: 0,
                    collaborations: new Set()
                };
            }
            individualStreamerStats[streamer].views += item.views;
            individualStreamerStats[streamer].engagement += totalEngagement;
            individualStreamerStats[streamer].followers += item.newFollowers;
            individualStreamerStats[streamer].streams += 1;

            if (streamers.length > 1) {
                // Add collaboration partners
                streamers.forEach(partner => {
                    if (partner !== streamer) {
                        individualStreamerStats[streamer].collaborations.add(partner);
                    }
                });
            }
        });

        if (streamers.length === 1) {
            // Solo streamer
            const streamer = streamers[0];
            if (!streamerStats[streamer]) {
                streamerStats[streamer] = {
                    views: 0,
                    engagement: 0,
                    followers: 0,
                    streams: 0,
                    avgViews: 0
                };
            }
            streamerStats[streamer].views += item.views;
            streamerStats[streamer].engagement += totalEngagement;
            streamerStats[streamer].followers += item.newFollowers;
            streamerStats[streamer].streams += 1;
        } else {
            // Collaboration
            if (!collabStats[item.streamer]) {
                collabStats[item.streamer] = {
                    views: 0,
                    engagement: 0,
                    followers: 0,
                    streams: 0,
                    avgViews: 0
                };
            }
            collabStats[item.streamer].views += item.views;
            collabStats[item.streamer].engagement += totalEngagement;
            collabStats[item.streamer].followers += item.newFollowers;
            collabStats[item.streamer].streams += 1;
        }
    });

    // Calculate averages
    Object.keys(individualStreamerStats).forEach(streamer => {
        individualStreamerStats[streamer].avgViews = Math.round(individualStreamerStats[streamer].views / individualStreamerStats[streamer].streams);
    });
    Object.keys(collabStats).forEach(collab => {
        collabStats[collab].avgViews = Math.round(collabStats[collab].views / collabStats[collab].streams);
    });

    // Update individual streamers cards
    const individualContainer = document.getElementById('individualStreamersCards');
    if (individualContainer) {
        individualContainer.innerHTML = '';

        Object.entries(individualStreamerStats).forEach(([streamer, stats]) => {
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.style.background = getStreamerGradient(streamer);
            card.innerHTML = `
                <h4>👤 ${streamer}</h4>
                <div class="metric">${stats.views.toLocaleString()}</div>
                <p><strong>Total Views</strong> • ${stats.streams} streams<br>
                <small>+${stats.followers} total followers</small></p>
            `;
            individualContainer.appendChild(card);
        });
    }

    // Update collaborations cards
    const collabContainer = document.getElementById('collaborationsCards');
    if (collabContainer) {
        collabContainer.innerHTML = '';

        Object.entries(collabStats).forEach(([collab, stats]) => {
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.style.background = getCollabGradient(collab);
            card.innerHTML = `
                <h4>🤝 ${collab}</h4>
                <div class="metric">${stats.views.toLocaleString()}</div>
                <p><strong>Views</strong> • ${stats.streams} streams<br>
                <small>Avg: ${stats.avgViews.toLocaleString()} views • +${stats.followers} followers</small></p>
            `;
            collabContainer.appendChild(card);
        });
    }
}

function getStreamerGradient(streamer) {
    // Base colors for each streamer from original HTML
    const streamerColors = {
        'Abi': '#ff7675',
        'Sena': '#74b9ff',
        'Juan G': '#00b894',
        'Kimmy': '#fdcb6e',
        'Jam': '#a29bfe',
        'Zell': '#fd79a8'
    };

    // Parse streamer names from collaboration string
    const participants = streamer.split(/,\s*|\s+and\s+/).filter(s => s.trim());

    if (participants.length === 1) {
        // Solo streamer - use their original gradient with darkened version
        const color = streamerColors[participants[0]] || '#a29bfe';
        return `linear-gradient(135deg, ${color}, ${darkenColor(color, 20)})`;
    } else if (participants.length === 2) {
        // Special mappings to match HTML file exactly
        const normalizedPair = participants.map(p => p.trim()).sort().join(' and ');
        const htmlMappings = {
            'Jam and Juan G': 'linear-gradient(135deg, #00b894, #a29bfe)', // Juan G first like HTML
            'Abi and Juan G': 'linear-gradient(135deg, #ff7675, #00b894)',
            'Abi and Kimmy': 'linear-gradient(135deg, #ff7675, #fdcb6e)',
            'Abi and Sena': 'linear-gradient(135deg, #ff7675, #74b9ff)',
            'Abi and Zell': 'linear-gradient(135deg, #ff7675, #fd79a8)',
            'Juan G and Kimmy': 'linear-gradient(135deg, #00b894, #fdcb6e)',
            'Juan G and Sena': 'linear-gradient(135deg, #00b894, #74b9ff)',
            'Juan G and Zell': 'linear-gradient(135deg, #00b894, #fd79a8)',
            'Jam and Sena': 'linear-gradient(135deg, #a29bfe, #74b9ff)',
            'Abi and Jam': 'linear-gradient(135deg, #a29bfe, #ff7675)',
            'Jam and Kimmy': 'linear-gradient(135deg, #a29bfe, #fdcb6e)',
            'Jam and Zell': 'linear-gradient(135deg, #a29bfe, #fd79a8)',
            'Kimmy and Zell': 'linear-gradient(135deg, #fd79a8, #fdcb6e)', // Zell first for this combo
            'Sena and Zell': 'linear-gradient(135deg, #74b9ff, #fd79a8)'
        };

        // Use exact HTML mapping if available, otherwise generate dynamically
        if (htmlMappings[normalizedPair]) {
            return htmlMappings[normalizedPair];
        }

        // Fallback to dynamic generation
        const sortedParticipants = [...participants].sort();
        const color1 = streamerColors[sortedParticipants[0]] || '#a29bfe';
        const color2 = streamerColors[sortedParticipants[1]] || '#6c5ce7';
        return `linear-gradient(135deg, ${color1}, ${color2})`;
    } else if (participants.length >= 3) {
        // Three or more streamers - sort for consistent order
        const sortedParticipants = [...participants].sort();
        const colors = sortedParticipants.map(p => streamerColors[p] || '#a29bfe');
        return `linear-gradient(135deg, ${colors.join(', ')})`;
    }

    return 'linear-gradient(135deg, #a29bfe, #6c5ce7)'; // fallback
}

function darkenColor(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Darken each component
    const newR = Math.round(r * (100 - percent) / 100);
    const newG = Math.round(g * (100 - percent) / 100);
    const newB = Math.round(b * (100 - percent) / 100);

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function getCollabGradient(collab) {
    // Use the same dynamic system as getStreamerGradient
    return getStreamerGradient(collab);
}

function updateDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    // Sort by date (latest first)
    const sortedData = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedData.forEach(item => {
        const totalEngagement = item.comments + item.reactions + item.shares;
        const engagementRate = item.totalFollowers > 0 ? ((totalEngagement / item.totalFollowers) * 100).toFixed(2) : '0.00';
        const engagementRateViews = item.views > 0 ? ((totalEngagement / item.views) * 100).toFixed(2) : '0.00';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.type}</td>
            <td>${item.startTime || '-'}</td>
            <td>${item.endTime || '-'}</td>
            <td>${item.duration || '-'}</td>
            <td>${item.views.toLocaleString()}</td>
            <td>${item.comments.toLocaleString()}</td>
            <td>${item.reactions.toLocaleString()}</td>
            <td>${item.shares.toLocaleString()}</td>
            <td>${item.linkClicks.toLocaleString()}</td>
            <td>${item.newFollowers.toLocaleString()}</td>
            <td>${item.totalFollowers.toLocaleString()}</td>
            <td>${getStreamerTag(item.streamer)}</td>
            <td>${engagementRate}%</td>
            <td>${engagementRateViews}%</td>
        `;
        tableBody.appendChild(row);
    });
}

function initializeCharts() {
    console.log('Initializing charts...');
    // Initialize all charts with empty data - they will be updated when filters are applied
    createViewsChart();
    createFollowersChart();
    createEngagementChart();
    createEngagementRateChart();
    createStreamerChart();
    createWeeklyChart();
    createEngagementRateViewsChart();
    createDurationChart();
}

function updateCharts() {
    console.log('Updating charts...');
    // Update all charts with current filtered data
    createViewsChart();
    createFollowersChart();
    createEngagementChart();
    createEngagementRateChart();
    createStreamerChart();
    createWeeklyChart();
    createEngagementRateViewsChart();
    createDurationChart();
}

function createViewsChart() {
    const ctx = document.getElementById('viewsChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts.viewsChart) {
        charts.viewsChart.destroy();
    }

    // Group data by date and sum views (matching HTML logic exactly)
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                views: 0
            };
        }
        dailyData[item.date].views += item.views;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    charts.viewsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDailyData.map(item => formatDate(item.date)),
            datasets: [{
                label: 'Daily Views',
                data: sortedDailyData.map(item => item.views),
                borderColor: 'rgb(116, 185, 255)',
                backgroundColor: 'rgba(116, 185, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const item = sortedData[context.dataIndex];
                            return [`Streamer: ${item.streamer}`, `Type: ${item.type}`];
                        }
                    }
                }
            }
        }
    });
}

function createFollowersChart() {
    const ctx = document.getElementById('followersChart');
    if (!ctx) return;

    if (charts.followersChart) {
        charts.followersChart.destroy();
    }

    // Group data by date and sum values (using newFollowers field)
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                newFollowers: 0
            };
        }
        dailyData[item.date].newFollowers += item.newFollowers || 0;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedDailyData.map(item => formatDate(item.date));

    charts.followersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily New Followers',
                data: sortedDailyData.map(item => item.newFollowers),
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                }
            }
        }
    });
}

function createEngagementChart() {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;

    if (charts.engagementChart) {
        charts.engagementChart.destroy();
    }

    // Group data by date and sum values like HTML file does
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                views: 0,
                comments: 0,
                reactions: 0,
                shares: 0,
                newFollowers: 0,
                totalFollowers: 0,
                streamCount: 0
            };
        }
        dailyData[item.date].views += item.views;
        dailyData[item.date].comments += item.comments;
        dailyData[item.date].reactions += item.reactions;
        dailyData[item.date].shares += item.shares;
        dailyData[item.date].newFollowers += item.newFollowers;
        dailyData[item.date].totalFollowers = Math.max(dailyData[item.date].totalFollowers, item.totalFollowers);
        dailyData[item.date].streamCount += 1;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    charts.engagementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDailyData.map(item => formatDate(item.date)),
            datasets: [
                {
                    label: 'Comments',
                    data: sortedDailyData.map(item => item.comments),
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Reactions',
                    data: sortedDailyData.map(item => item.reactions),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Shares',
                    data: sortedDailyData.map(item => item.shares),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createEngagementRateChart() {
    const ctx = document.getElementById('engagementRateChart');
    if (!ctx) return;

    if (charts.engagementRateChart) {
        charts.engagementRateChart.destroy();
    }

    // Group data by date and sum values like HTML file does
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                views: 0,
                comments: 0,
                reactions: 0,
                shares: 0,
                newFollowers: 0,
                totalFollowers: 0,
                streamCount: 0
            };
        }
        dailyData[item.date].views += item.views;
        dailyData[item.date].comments += item.comments;
        dailyData[item.date].reactions += item.reactions;
        dailyData[item.date].shares += item.shares;
        dailyData[item.date].newFollowers += item.newFollowers;
        dailyData[item.date].totalFollowers = Math.max(dailyData[item.date].totalFollowers, item.totalFollowers);
        dailyData[item.date].streamCount += 1;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    const maxFollowers = Math.max(...sortedDailyData.map(item => item.totalFollowers));

    const engagementRates = sortedDailyData.map(item => {
        const totalEng = item.comments + item.reactions + item.shares;
        return maxFollowers > 0 ? (totalEng / maxFollowers * 100) : 0;
    });

    charts.engagementRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDailyData.map(item => formatDate(item.date)),
            datasets: [{
                label: 'Engagement Rate (%)',
                data: engagementRates,
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

function createEngagementRateViewsChart() {
    const ctx = document.getElementById('engagementRateViewsChart');
    if (!ctx) return;

    if (charts.engagementRateViewsChart) {
        charts.engagementRateViewsChart.destroy();
    }

    // Group data by date and sum values like HTML file does
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                views: 0,
                comments: 0,
                reactions: 0,
                shares: 0,
                newFollowers: 0,
                totalFollowers: 0,
                streamCount: 0
            };
        }

        // Add this stream's data to the daily totals
        dailyData[item.date].views += item.views;
        dailyData[item.date].comments += item.comments;
        dailyData[item.date].reactions += item.reactions;
        dailyData[item.date].shares += item.shares;
        dailyData[item.date].newFollowers += item.newFollowers;
        dailyData[item.date].totalFollowers = Math.max(dailyData[item.date].totalFollowers, item.totalFollowers);
        dailyData[item.date].streamCount += 1;

        // Debug: Log individual stream contributions for multi-stream days
        if (dailyData[item.date].streamCount > 1) {
            const totalEng = item.comments + item.reactions + item.shares;
            console.log(`Multi-stream day ${item.date}: Stream ${dailyData[item.date].streamCount} (${item.streamer}): Views +${item.views}, Engagement +${totalEng}`);
            console.log(`Running totals for ${item.date}: Views=${dailyData[item.date].views}, Engagement=${dailyData[item.date].comments + dailyData[item.date].reactions + dailyData[item.date].shares}`);
        }
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    charts.engagementRateViewsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDailyData.map(item => formatDate(item.date)),
            datasets: [{
                label: 'Views Engagement Rate (%)',
                data: sortedDailyData.map(item => {
                    const totalEng = item.comments + item.reactions + item.shares;
                    const result = item.views > 0 ? ((totalEng / item.views) * 100).toFixed(2) : 0;

                    // Detailed comparison logging
                    if (item.date.includes('2025-09-13') || item.date.includes('2025-09-11') || item.date.includes('2025-09-10') || item.date.includes('2025-09-09')) {
                        console.log(`COMPARISON - ${item.date}: Views=${item.views}, Comments=${item.comments}, Reactions=${item.reactions}, Shares=${item.shares}`);
                        console.log(`COMPARISON - ${item.date}: TotalEng=${totalEng}, Rate=${result}%`);
                    }

                    return result;
                }),
                borderColor: 'rgb(0, 206, 201)',
                backgroundColor: 'rgba(0, 206, 201, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(0, 206, 201)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const dayData = sortedDailyData[context.dataIndex];
                            const totalEng = dayData.comments + dayData.reactions + dayData.shares;
                            return `Total Engagement: ${totalEng.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function createStreamerChart() {
    const ctx = document.getElementById('streamerChart');
    if (!ctx) return;

    if (charts.streamerChart) {
        charts.streamerChart.destroy();
    }

    // Aggregate data by streamer
    const streamerStats = {};
    filteredData.forEach(item => {
        const streamers = item.streamer.split(/,\s*|\s+and\s+/).filter(s => s.trim());
        streamers.forEach(streamer => {
            streamer = streamer.trim();
            if (!streamerStats[streamer]) {
                streamerStats[streamer] = { views: 0, engagement: 0, streams: 0 };
            }
            streamerStats[streamer].views += item.views;
            streamerStats[streamer].engagement += item.comments + item.reactions + item.shares;
            streamerStats[streamer].streams += 1;
        });
    });

    const streamers = Object.keys(streamerStats);
    const views = Object.values(streamerStats).map(s => s.views);

    charts.streamerChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: streamers,
            datasets: [{
                data: views,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    if (charts.weeklyChart) {
        charts.weeklyChart.destroy();
    }

    // Group data by date and sum values like HTML file does first
    const dailyData = {};
    filteredData.forEach(item => {
        if (!dailyData[item.date]) {
            dailyData[item.date] = {
                date: item.date,
                views: 0,
                comments: 0,
                reactions: 0,
                shares: 0,
                newFollowers: 0,
                totalFollowers: 0,
                streamCount: 0
            };
        }
        dailyData[item.date].views += item.views;
        dailyData[item.date].comments += item.comments;
        dailyData[item.date].reactions += item.reactions;
        dailyData[item.date].shares += item.shares;
        dailyData[item.date].newFollowers += item.newFollowers;
        dailyData[item.date].totalFollowers = Math.max(dailyData[item.date].totalFollowers, item.totalFollowers);
        dailyData[item.date].streamCount += 1;
    });

    const sortedDailyData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Generate dynamic week ranges based on data
    const dataStartDate = new Date(Math.min(...sortedDailyData.map(item => new Date(item.date))));
    const dataEndDate = new Date(Math.max(...sortedDailyData.map(item => new Date(item.date))));

    const weekRanges = [];
    let currentWeekStart = new Date(dataStartDate);

    // Start from the beginning of the week containing the first data point
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

    while (currentWeekStart <= dataEndDate) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // End of week (6 days after start)

        // Don't go beyond our data range
        if (weekEnd > dataEndDate) {
            weekEnd.setTime(dataEndDate.getTime());
        }

        const startMonth = currentWeekStart.getMonth() + 1;
        const startDay = currentWeekStart.getDate();
        const endMonth = weekEnd.getMonth() + 1;
        const endDay = weekEnd.getDate();

        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let label = '';

        if (startMonth === endMonth) {
            label = `${monthNames[startMonth]} ${startDay}-${endDay}`;
        } else {
            label = `${monthNames[startMonth]} ${startDay}-${monthNames[endMonth]} ${endDay}`;
        }

        weekRanges.push({
            start: currentWeekStart.toISOString().split('T')[0],
            end: weekEnd.toISOString().split('T')[0],
            label: label
        });

        // Move to next week
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    const weeklyData = {};
    weekRanges.forEach(range => {
        weeklyData[range.label] = { views: 0, engagement: 0, followers: 0 };

        sortedDailyData.forEach(item => {
            const itemDate = new Date(item.date);
            const startDate = new Date(range.start);
            const endDate = new Date(range.end);

            if (itemDate >= startDate && itemDate <= endDate) {
                weeklyData[range.label].views += item.views;
                weeklyData[range.label].engagement += item.comments + item.reactions + item.shares;
                weeklyData[range.label].followers += item.newFollowers;
            }
        });
    });

    charts.weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(weeklyData),
            datasets: [
                {
                    label: 'Views',
                    data: Object.values(weeklyData).map(week => week.views),
                    backgroundColor: 'rgba(116, 185, 255, 0.8)',
                    borderColor: 'rgba(116, 185, 255, 1)',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'New Followers',
                    data: Object.values(weeklyData).map(week => week.followers),
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}


function createDurationChart() {
    const ctx = document.getElementById('durationChart');
    if (!ctx) return;

    if (charts.durationChart) {
        charts.durationChart.destroy();
    }

    // Time slot groups based on actual data patterns
    const timeSlotGroups = {
        'Afternoon (2:30-4:30 PM)': ['14:30', '15:00'],  // 2:30-3:00 PM streams
        'Early Evening (5:00-7:00 PM)': ['17:00', '17:30', '18:00', '18:38'],  // 5:00-6:38 PM streams
        'Prime Time (7:00-9:30 PM)': ['19:00', '19:30', '20:00', '20:30']  // 7:00-8:30 PM streams
    };

    const groupedTimeData = {};

    // Initialize groups
    Object.keys(timeSlotGroups).forEach(groupName => {
        groupedTimeData[groupName] = {};
    });

    // Process each stream and categorize by time slot (matching HTML logic exactly)
    filteredData.forEach(item => {
        if (!item.startTime || !item.date) return;

        // Convert startTime to 24-hour format for matching
        const timeMatch = item.startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) return;

        let hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);
        const ampm = timeMatch[3].toUpperCase();

        // Convert to 24-hour format
        if (ampm === 'PM' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }

        const timeKey = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Find which group this stream belongs to (exact match logic from HTML)
        for (const [groupName, times] of Object.entries(timeSlotGroups)) {
            if (times.includes(timeKey)) {
                if (!groupedTimeData[groupName][item.date]) {
                    groupedTimeData[groupName][item.date] = {
                        totalViews: 0,
                        totalEngagement: 0,
                        streamCount: 0,
                        streamers: [],
                        startTimes: []
                    };
                }

                groupedTimeData[groupName][item.date].totalViews += item.views;
                groupedTimeData[groupName][item.date].totalEngagement += (item.comments + item.reactions + item.shares);
                groupedTimeData[groupName][item.date].streamCount += 1;
                groupedTimeData[groupName][item.date].streamers.push(item.streamer);
                groupedTimeData[groupName][item.date].startTimes.push(item.startTime);
                break;
            }
        }
    });

    // Check if we have any time slot data
    const hasTimeSlotData = Object.keys(groupedTimeData).some(group =>
        Object.keys(groupedTimeData[group]).length > 0
    );

    if (!hasTimeSlotData) {
        charts.durationChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'No time slot data available'
                    }
                }
            }
        });
        return;
    }

    // Create datasets for each time slot group
    const colors = [
        { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgba(255, 99, 132, 1)' },      // Red for Afternoon
        { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgba(54, 162, 235, 1)' },      // Blue for Early Evening
        { bg: 'rgba(255, 205, 86, 0.6)', border: 'rgba(255, 205, 86, 1)' }       // Yellow for Prime Time
    ];

    // Get all unique dates for labels
    const allDates = new Set();
    Object.values(groupedTimeData).forEach(group => {
        Object.keys(group).forEach(date => allDates.add(date));
    });

    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

    // Create datasets
    const datasets = [];
    let colorIndex = 0;

    Object.entries(groupedTimeData).forEach(([groupName, groupData]) => {
        if (Object.keys(groupData).length > 0) {
            const data = sortedDates.map(date => {
                return groupData[date] ? groupData[date].totalViews : null;
            });

            datasets.push({
                label: groupName,
                data: data,
                backgroundColor: colors[colorIndex].bg,
                borderColor: colors[colorIndex].border,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                spanGaps: false,
                fill: false
            });

            colorIndex++;
        }
    });

    charts.durationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates.map(date => formatDate(date)),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        afterBody: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            const datasetIndex = tooltipItems[0].datasetIndex;
                            const groupName = Object.keys(groupedTimeData)[datasetIndex];
                            const date = sortedDates[dataIndex];
                            const dayData = groupedTimeData[groupName][date];

                            if (dayData) {
                                const uniqueStartTimes = [...new Set(dayData.startTimes)].join(', ');
                                return [
                                    `Streams: ${dayData.streamCount}`,
                                    `Start Times: ${uniqueStartTimes}`,
                                    `Total Engagement: ${dayData.totalEngagement.toLocaleString()}`,
                                    `Streamers: ${dayData.streamers.join(', ')}`
                                ];
                            }
                            return [];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Views'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

function updateDashboard() {
    calculateStats();
    updateTopPerformers();
    updateIndividualPerformers();
    updateDataTable();
    updateCharts();
}

// Function to normalize collaboration names for consistent ordering
function normalizeCollaborationName(streamerName) {
    if (!streamerName) return '';

    // Split the collaboration by "and" and commas
    const streamers = streamerName
        .split(/,\s*|\s+and\s+/i)
        .map(s => s.trim())
        .filter(s => s);

    // Sort streamers alphabetically to create consistent ordering
    const sortedStreamers = streamers.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Rejoin with "and" for pairs or commas and "and" for multiple
    if (sortedStreamers.length === 2) {
        return sortedStreamers.join(' and ');
    } else if (sortedStreamers.length > 2) {
        const lastStreamer = sortedStreamers.pop();
        return sortedStreamers.join(', ') + ' and ' + lastStreamer;
    } else {
        return sortedStreamers[0] || '';
    }
}

function populateCollaborationDropdown() {
    const collabFilter = document.getElementById('collabFilter');
    if (!collabFilter) return;

    // Get unique collaborations from stream data with normalized names
    const collaborations = new Set();
    streamData.forEach(item => {
        if (item.streamer) {
            const normalizedName = normalizeCollaborationName(item.streamer);
            collaborations.add(normalizedName);
        }
    });

    // Sort collaborations alphabetically
    const sortedCollaborations = Array.from(collaborations).sort();

    // Clear existing options except "All Collaborations"
    collabFilter.innerHTML = '<option value="all">All Collaborations</option>';

    // Add dynamic options
    sortedCollaborations.forEach(collab => {
        const option = document.createElement('option');
        option.value = collab;
        option.textContent = collab;
        collabFilter.appendChild(option);
    });
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    console.log('Stream data length:', streamData.length);
    initializeDashboard();
});

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM not ready yet, wait for DOMContentLoaded
} else {
    // DOM is ready, initialize immediately
    console.log('DOM already ready, initializing dashboard...');
    console.log('Stream data length:', streamData.length);
    initializeDashboard();
}

// HTML Export function (disabled for GitHub Pages)
function exportToHTML() {
    alert('Export feature not available in static GitHub Pages version');
}