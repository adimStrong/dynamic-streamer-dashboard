const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { google } = require('googleapis');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
require('dotenv').config();
const cron = require('node-cron');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
n// Add basic authentication
app.use(basicAuth({
    users: {
        [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || 'dashboard2024'
    },
    challenge: true,
    realm: 'Streaming Dashboard'
}));

const PORT = process.env.PORT || 3000;
const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL_MINUTES || 5;

// Google Sheets Configuration
const SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

let sheets;
let currentData = {};

// Helper function to normalize and capitalize names to avoid duplicates
// Global name normalization map to maintain consistency across all data processing
const globalNameMap = new Map();

function capitalizeNames(nameString) {
    if (!nameString || typeof nameString !== 'string') return nameString;
    
    // Trim and clean the input first
    nameString = nameString.trim();
    
    // Handle comma-separated format: "Kimmy, Jam and Sena" or "Name1, Name2 and Name3"
    // Also handle simple "and" format: "Name1 and Name2"
    
    // First split by commas to get main parts
    const commaParts = nameString.split(',').map(part => part.trim());
    
    const processedParts = commaParts.map(part => {
        // Split each part by "and" and process individual names
        return part
            .split(/\s+and\s+/i) // Split by "and" (case insensitive)
            .map(name => {
                name = name.trim();
                if (!name) return '';
                
                const lowerName = name.toLowerCase();
                if (lowerName === 'and') return 'and'; // Keep 'and' lowercase
                if (lowerName === 'g') return 'G'; // Handle special case for 'Juan G'
                if (!lowerName) return '';
                
                // Dynamic name normalization - check if we've seen this name before (case-insensitive)
                for (const [canonical, variations] of globalNameMap.entries()) {
                    if (variations.has(lowerName)) {
                        return canonical;
                    }
                }
                
                // This is a new name - create canonical form and track variations
                const canonical = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                if (!globalNameMap.has(canonical)) {
                    globalNameMap.set(canonical, new Set());
                }
                globalNameMap.get(canonical).add(lowerName);
                return canonical;
            })
            .filter(name => name)
            .join(' and '); // Rejoin with "and"
    });
    
    // Rejoin with commas but preserve the last "and"
    if (processedParts.length > 1) {
        const lastPart = processedParts.pop();
        return processedParts.join(', ') + ' and ' + lastPart;
    } else {
        return processedParts[0] || '';
    }
}

// Function to normalize collaboration names to handle order inconsistencies
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

// Initialize Google Sheets API
async function initializeGoogleSheets() {
    try {
        if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            // Use service account authentication (more secure)
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });
            
            sheets = google.sheets({ version: 'v4', auth });
        } else {
            // Use API key authentication (simpler setup)
            sheets = google.sheets({ 
                version: 'v4', 
                auth: API_KEY 
            });
        }
        
        console.log('Google Sheets API initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Google Sheets API:', error.message);
        return false;
    }
}

// Fetch data from Google Sheets
async function fetchSheetsData() {
    if (!sheets || !SHEETS_ID) {
        console.error('Google Sheets not configured properly');
        return null;
    }

    try {
        // Try different sheet ranges to find data
        let streamingData = [];
        
        // First try the D.A sheet
        try {
            console.log('Trying D.A sheet...');
            const daResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEETS_ID,
                range: 'D.A!A1:Z1000',
            });
            streamingData = daResponse.data.values || [];
            console.log('D.A sheet data rows:', streamingData.length);
        } catch (error) {
            console.log('D.A sheet failed:', error.message);
        }
        
        // If no data, try the first sheet (index 0)
        if (streamingData.length === 0) {
            try {
                console.log('Trying first sheet...');
                const firstSheetResponse = await sheets.spreadsheets.values.get({
                    spreadsheetId: SHEETS_ID,
                    range: 'A1:Z1000',
                });
                streamingData = firstSheetResponse.data.values || [];
                console.log('First sheet data rows:', streamingData.length);
            } catch (error) {
                console.log('First sheet failed:', error.message);
            }
        }
        
        // If still no data, try to get sheet info
        if (streamingData.length === 0) {
            try {
                console.log('Getting sheet metadata...');
                const sheetInfo = await sheets.spreadsheets.get({
                    spreadsheetId: SHEETS_ID,
                });
                console.log('Available sheets:', sheetInfo.data.sheets.map(s => s.properties.title));
            } catch (error) {
                console.log('Failed to get sheet info:', error.message);
            }
        }
        
        // Debug: log the raw sheet data structure
        console.log('Raw sheet data sample (first 5 rows):');
        streamingData.slice(0, 5).forEach((row, index) => {
            console.log(`Row ${index}:`, row);
        });
        
        // Check if any rows have time data
        console.log('Checking for time data in rows...');
        let timeDataFound = false;
        for (let i = 0; i < Math.min(10, streamingData.length); i++) {
            if (streamingData[i] && streamingData[i][1]) { // TIME is column index 1
                console.log(`Row ${i} TIME value:`, streamingData[i][1]);
                timeDataFound = true;
            }
        }
        if (!timeDataFound) {
            console.log('No time data found in first 10 rows');
        }
        
        // Process the streaming data from D.A sheet
        const processedStreamers = processArrayToObject(streamingData);
        console.log('Processed streamers count:', processedStreamers.length);
        
        // Transform data to include proper time handling and duration calculation
        const enhancedStreamers = processedStreamers.map(item => {
            // Debug: log the first item to see actual column names
            if (processedStreamers.indexOf(item) === 0) {
                console.log('First processed item keys:', Object.keys(item));
                console.log('First processed item:', item);
            }
            
            // Handle time column with format "7:30 to 9:30" (all PM)
            // Based on actual headers: 'TIME'
            const timeColumn = item['TIME'] || item['Time'] || item.time || item['Stream Time'] || 
                              item['TIME RANGE'] || item['Time Range'] || '';
            
            let startTime = '';
            let endTime = '';
            let duration = null;
            
            // Handle blank/empty time entries gracefully
            if (!timeColumn || timeColumn.toString().trim() === '') {
                console.log(`Row has blank time entry, checking for separate start/end time columns...`);
            } else if (timeColumn.toString().toLowerCase().includes('to')) {
                // Parse "7:30 to 9:30" format (all times are PM)
                // Handle extra spaces around "to" and in times
                let cleanTimeColumn = timeColumn.toString().replace(/\s+/g, ' ').trim(); // Normalize spaces
                const parts = cleanTimeColumn.split(/\s*to\s*/i).map(t => t.trim());
                
                if (parts.length === 2) {
                    let [start, end] = parts;
                    
                    // Clean up any existing AM/PM markers and extra spaces
                    start = start.replace(/\s*(AM|PM)\s*/gi, '').replace(/\s+/g, '').trim();
                    end = end.replace(/\s*(AM|PM)\s*/gi, '').replace(/\s+/g, '').trim();
                    
                    // Validate and fix time format (should be HH:MM or H:MM)
                    const timeRegex = /^\d{1,2}:\d{2}$/;
                    if (timeRegex.test(start) && timeRegex.test(end)) {
                        // Add PM to both times since all streaming times are PM according to user
                        startTime = start + ' PM';
                        endTime = end + ' PM';
                        
                        console.log(`Parsed time: "${timeColumn}" -> Start: "${startTime}", End: "${endTime}"`);
                        duration = calculateDurationFromTimes(startTime, endTime);
                    } else {
                        console.log(`Invalid time format in "${timeColumn}" (start: "${start}", end: "${end}"), attempting to fix...`);
                        
                        // Try to fix common issues like "9: 30" -> "9:30"
                        start = start.replace(/:\s+/, ':').replace(/\s+:/, ':');
                        end = end.replace(/:\s+/, ':').replace(/\s+:/, ':');
                        
                        if (timeRegex.test(start) && timeRegex.test(end)) {
                            startTime = start + ' PM';
                            endTime = end + ' PM';
                            console.log(`Fixed and parsed time: "${timeColumn}" -> Start: "${startTime}", End: "${endTime}"`);
                            duration = calculateDurationFromTimes(startTime, endTime);
                        } else {
                            console.log(`Could not parse time format: "${timeColumn}" (cleaned start: "${start}", end: "${end}"), skipping`);
                        }
                    }
                }
            }
            
            // Fallback: try separate start/end time columns if main time column parsing failed
            if (!startTime && !endTime) {
                const separateStartTime = item['Start Time'] || item['Start time'] || item.StartTime || item.startTime || 
                                         item['Start'] || item.start || item['TIME START'] || item['Time Start'] || '';
                const separateEndTime = item['End Time'] || item['End time'] || item.EndTime || item.endTime || 
                                       item['End'] || item.end || item['TIME END'] || item['Time End'] || '';
                
                if (separateStartTime && separateEndTime) {
                    startTime = separateStartTime.toString();
                    endTime = separateEndTime.toString();
                    console.log(`Using separate time columns: Start: "${startTime}", End: "${endTime}"`);
                    duration = calculateDurationFromTimes(startTime, endTime);
                } else if (item.Duration || item.duration || item['DURATION'] || item['Duration (minutes)']) {
                    // Use duration directly if available
                    duration = parseInt(item.Duration || item.duration || item['DURATION'] || item['Duration (minutes)']) || null;
                    console.log(`Using direct duration: ${duration} minutes`);
                }
            }
            
            // Convert date from DD/MM/YYYY to YYYY-MM-DD format for proper sorting
            let formattedDate = item['DATE'] || item.Date || item.date || '';
            if (formattedDate && formattedDate.includes('/')) {
                const dateParts = formattedDate.split('/');
                if (dateParts.length === 3) {
                    // Your date format is DD/MM/YYYY (e.g., 09/08/2025 = 9th August 2025)
                    const [day, month, year] = dateParts;
                    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    console.log(`Date converted: "${item['DATE'] || item.Date || item.date}" -> "${formattedDate}"`);
                }
            }
            
            return {
                ...item,
                startTime: startTime,
                endTime: endTime,
                duration: duration,
                // Map actual sheet column names to expected format
                date: formattedDate,
                streamer: normalizeCollaborationName(capitalizeNames(item['Name of Streamer'] || item.Streamer || item.streamer || '')),
                type: item['Stream'] || item.Type || item.type || 'live',
                // Map actual numeric column names from the sheet - handle commas in numbers
                views: parseInt((item['TOTAL VIEWS'] || item.Views || item.views || '0').toString().replace(/,/g, '')) || 0,
                comments: parseInt((item['COMMENTS'] || item.Comments || item.comments || '0').toString().replace(/,/g, '')) || 0,
                reactions: parseInt((item['REACTIONS'] || item.Reactions || item.reactions || '0').toString().replace(/,/g, '')) || 0,
                shares: parseInt((item['SHARE'] || item.Shares || item.shares || '0').toString().replace(/,/g, '')) || 0,
                linkClicks: parseInt((item['LINK CLICKS'] || item.LinkClicks || item.linkClicks || '0').toString().replace(/,/g, '')) || 0,
                newFollowers: parseInt((item['EOD New Follower'] || item['New Followers'] || item.newFollowers || '0').toString().replace(/,/g, '')) || 0,
                totalFollowers: parseInt((item['OVERALL TOTAL FOLLOWERS'] || item['Total Followers'] || item.totalFollowers || '0').toString().replace(/,/g, '')) || 0,
                extraNewFollowers: parseInt((item['EOD New Follower'] || item['Extra New Followers'] || item.extraNewFollowers || '0').toString().replace(/,/g, '')) || 0
            };
        });
        
        // Sort by date (latest first)
        enhancedStreamers.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Latest dates first
        });
        
        console.log('Data sorted by date (latest first)');

        // Debug: Show September 13 data for comparison
        const sept13Data = enhancedStreamers.filter(item => item.date.includes('2025-09-13'));
        if (sept13Data.length > 0) {
            console.log('=== SEPTEMBER 13 DATA COMPARISON ===');
            sept13Data.forEach((item, index) => {
                console.log(`Sept 13 Stream ${index + 1}:`, {
                    streamer: item.streamer,
                    views: item.views,
                    comments: item.comments,
                    reactions: item.reactions,
                    shares: item.shares,
                    extraNewFollowers: item.extraNewFollowers,
                    engagementTotal: item.comments + item.reactions + item.shares,
                    engagementRate: ((item.comments + item.reactions + item.shares) / item.views * 100).toFixed(2) + '%'
                });
            });
        }

        // Debug: Check row 58 specifically
        console.log('=== ROW 58 DEBUG ===');
        if (streamingData.length > 58) {
            console.log(`Row 58 raw data:`, streamingData[58]);
        }

        // Find the Sept 10 data in processed data
        const sept10Data = enhancedStreamers.filter(item => item.date.includes('2025-09-10'));
        console.log('September 10 processed data:');
        sept10Data.forEach((item, index) => {
            console.log(`${index + 1}. ${item.date}: ${item.views} views (${item.streamer})`);
        });
        console.log('=== END ROW 58 DEBUG ===');

        // Debug: Check Zell's data
        console.log('=== ZELL DATA CHECK ===');
        const zellData = enhancedStreamers.filter(item =>
            item.streamer && item.streamer.toLowerCase().includes('zell')
        );
        console.log(`Zell participated in ${zellData.length} streams:`);
        let zellTotalViews = 0;
        zellData.forEach((item, index) => {
            console.log(`${index + 1}. ${item.date}: ${item.views} views (${item.streamer})`);
            zellTotalViews += item.views;
        });
        console.log(`Zell total views from server data: ${zellTotalViews}`);
        console.log('=== END ZELL DATA CHECK ===');
        
        // Calculate summary statistics from the processed data
        let totalViews = 0;
        let totalEngagement = 0;
        let totalStreams = 0;
        
        if (enhancedStreamers && enhancedStreamers.length > 0) {
            totalStreams = enhancedStreamers.length;
            totalViews = enhancedStreamers.reduce((sum, item) => sum + (item.views || 0), 0);
            totalEngagement = enhancedStreamers.reduce((sum, item) => {
                const comments = item.comments || 0;
                const reactions = item.reactions || 0;
                const shares = item.shares || 0;
                return sum + comments + reactions + shares;
            }, 0);
        }

        // Process and structure the data
        const processedData = {
            lastUpdated: new Date().toISOString(),
            streamers: enhancedStreamers,
            summary: {
                totalViewers: totalViews.toString(),
                totalRevenue: `₱${totalEngagement}`,
                activeStreamers: totalStreams.toString(),
                avgViewTime: totalStreams > 0 ? Math.round(totalViews / totalStreams).toString() + ' avg views' : '0'
            }
        };

        console.log('Data fetched successfully from Google Sheets');
        return processedData;

    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error.message);
        return null;
    }
}

// Helper function to process 2D array into key-value object
function processArrayToObject(data) {
    if (!data || data.length < 2) return [];
    
    // Find the first non-empty row to use as headers
    let headerRowIndex = -1;
    let headers = [];
    
    for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].length > 0 && data[i].some(cell => cell && cell.trim() !== '')) {
            headers = data[i];
            headerRowIndex = i;
            console.log('Found header row at index:', i, 'Headers:', headers);
            break;
        }
    }
    
    if (headerRowIndex === -1 || headers.length === 0) {
        console.log('No valid header row found');
        return [];
    }
    
    const result = [];
    
    // Process data rows starting after the header row
    for (let i = headerRowIndex + 1; i < data.length; i++) {
        if (!data[i] || data[i].length === 0) continue; // Skip empty rows
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = data[i][index] || '';
        });
        
        // Only add rows that have some actual data
        if (Object.values(row).some(value => value && value.toString().trim() !== '')) {
            result.push(row);
        }
    }
    
    return result;
}

// Helper function to extract specific values from sheet data
function extractValue(data, key) {
    for (let row of data) {
        if (row[0] === key) {
            return row[1];
        }
    }
    return null;
}

// Helper function to calculate duration from start and end times
function calculateDurationFromTimes(startTime, endTime) {
    try {
        // Handle different time formats (HH:MM, HH:MM AM/PM, etc.)
        const parseTime = (timeStr) => {
            if (!timeStr) return null;
            
            // Remove any extra spaces and convert to string
            timeStr = timeStr.toString().trim();
            
            // Handle AM/PM format
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
                const parts = timeStr.split(' ');
                const timePart = parts[0];
                const period = parts[1].toUpperCase();
                
                const timeParts = timePart.split(':');
                if (timeParts.length < 2) return null;
                
                const hours = parseInt(timeParts[0]) || 0;
                const minutes = parseInt(timeParts[1]) || 0;
                let hour24 = hours;
                
                if (period === 'PM' && hours !== 12) {
                    hour24 += 12;
                } else if (period === 'AM' && hours === 12) {
                    hour24 = 0;
                }
                
                console.log(`Parsed time "${timeStr}" -> ${hour24}:${minutes.toString().padStart(2, '0')} (${hour24 * 60 + minutes} minutes)`);
                return hour24 * 60 + minutes;
            }
            
            // Handle 24-hour format (HH:MM)
            const parts = timeStr.split(':');
            if (parts.length >= 2) {
                const hours = parseInt(parts[0]) || 0;
                const minutes = parseInt(parts[1]) || 0;
                console.log(`Parsed 24h time "${timeStr}" -> ${hours}:${minutes.toString().padStart(2, '0')} (${hours * 60 + minutes} minutes)`);
                return hours * 60 + minutes;
            }
            
            return null;
        };
        
        const startMinutes = parseTime(startTime);
        const endMinutes = parseTime(endTime);
        
        if (startMinutes !== null && endMinutes !== null) {
            let duration = endMinutes - startMinutes;
            // Handle case where end time is next day
            if (duration < 0) {
                duration += 24 * 60; // Add 24 hours in minutes
            }
            return duration;
        }
        
        return null;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return null;
    }
}

// Update data and broadcast to all clients
async function updateAndBroadcast() {
    console.log('Fetching updated data from Google Sheets...');
    const newData = await fetchSheetsData();
    
    if (newData) {
        currentData = newData;
        io.emit('dataUpdate', currentData);
        console.log('Data updated and broadcasted to all clients');
    }
}

// API Routes
app.get('/api/data', (req, res) => {
    res.json(currentData);
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        lastUpdated: currentData.lastUpdated,
        sheetsConfigured: !!SHEETS_ID 
    });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send current data to newly connected client
    socket.emit('dataUpdate', currentData);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    
    // Manual refresh request
    socket.on('requestRefresh', async () => {
        console.log('Manual refresh requested by client:', socket.id);
        await updateAndBroadcast();
    });
});

// Schedule automatic updates
cron.schedule(`*/${UPDATE_INTERVAL} * * * *`, updateAndBroadcast);

// Initialize and start server
async function startServer() {
    const sheetsInitialized = await initializeGoogleSheets();
    
    if (sheetsInitialized) {
        // Fetch initial data
        await updateAndBroadcast();
    } else {
        console.warn('Starting server without Google Sheets integration. Configure .env file to enable data sync.');
        currentData = {
            lastUpdated: new Date().toISOString(),
            error: 'Google Sheets not configured',
            summary: {
                totalViewers: '0',
                totalRevenue: '₱0',
                activeStreamers: '0',
                avgViewTime: '0 min'
            }
        };
    }
    
    server.listen(PORT, () => {
        console.log(`🚀 Dynamic Streamer Dashboard running on http://localhost:${PORT}`);
        console.log(`📊 Data updates every ${UPDATE_INTERVAL} minutes`);
        console.log(`📋 Google Sheets ID: ${SHEETS_ID ? 'Configured' : 'Not configured'}`);
    });
}

startServer();