// Socket.io connection
const socket = io();
let currentData = {};
let charts = {};

// DOM Elements
const connectionStatus = document.getElementById('connectionStatus');
const connectionText = document.getElementById('connectionText');
const lastUpdated = document.getElementById('lastUpdated');
const loadingOverlay = document.getElementById('loadingOverlay');

// Define consistent streamer colors globally
const STREAMER_COLORS = {
    'Abi': '#ff6b6b',
    'Sena': '#74b9ff',
    'Juan G': '#FF5722',        // Changed to bright orange-red
    'Juan g': '#FF5722',        // Handle lowercase variation
    'juan g': '#FF5722',        // Handle all lowercase
    'Juan G and Sena': '#FF5722', // Handle collaboration naming
    'Juan g and Sena': '#FF5722',
    'Kimmy': '#4CAF50',         // Changed to green
    'Jam': '#9C27B0',           // Changed to purple
    'jam': '#9C27B0',           // Handle lowercase
    'Zell': '#a29bfe'
};

// Function to get streamer color with fallback and debugging
function getStreamerColor(streamerName) {
    console.log('Getting color for streamer:', streamerName);

    if (!streamerName) return '#6c5ce7';

    // Direct match
    if (STREAMER_COLORS[streamerName]) {
        console.log('Direct match found:', STREAMER_COLORS[streamerName]);
        return STREAMER_COLORS[streamerName];
    }

    // Check if it contains Juan G (case insensitive)
    if (streamerName.toLowerCase().includes('juan g')) {
        console.log('Juan G detected, using orange-red');
        return '#FF5722';
    }

    // Check if it contains Jam (case insensitive)
    if (streamerName.toLowerCase().includes('jam')) {
        console.log('Jam detected, using purple');
        return '#9C27B0';
    }

    // Check other streamers
    const lowerName = streamerName.toLowerCase();
    if (lowerName.includes('abi')) return '#ff6b6b';
    if (lowerName.includes('sena')) return '#74b9ff';
    if (lowerName.includes('kimmy')) return '#4CAF50';
    if (lowerName.includes('zell')) return '#a29bfe';

    console.log('No match found for:', streamerName, 'using default color');
    return '#6c5ce7';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    hideLoadingOverlay();

    // Apply initial filters
    setTimeout(() => {
        applyFilters();
    }, 1000);
});

// Socket event listeners
socket.on('connect', function() {
    console.log('Connected to server');
    updateConnectionStatus(true);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
    updateConnectionStatus(false);
});

socket.on('dataUpdate', function(data) {
    console.log('Received data update:', data);
    currentData = data;
    updateDashboard(data);
});

// Update connection status
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.textContent = '🟢 Connected';
        connectionStatus.className = 'status-badge connected';
        connectionText.textContent = 'Real-time updates active';
    } else {
        connectionStatus.textContent = '🔴 Disconnected';
        connectionStatus.className = 'status-badge disconnected';
        connectionText.textContent = 'Attempting to reconnect...';
    }
}

// Update dashboard with new data
function updateDashboard(data) {
    console.log('Updating dashboard with data:', data);

    // Update last updated timestamp
    if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        lastUpdated.textContent = `Last updated: ${date.toLocaleTimeString()}`;
    }

    // Update summary stats
    if (data.summary) {
        updateStatCard('totalViews', data.summary.totalViewers || '0');
        updateStatCard('totalEngagement', data.summary.totalRevenue || '₱0');
        updateStatCard('avgViews', data.summary.activeStreamers || '0');
        updateStatCard('followerGrowth', data.summary.avgViewTime || '0 min');
    }

    // Update with sample data if no Google Sheets data
    if (!data.dashboard || data.dashboard.length === 0) {
        updateWithSampleData();
    } else {
        updateWithRealData(data);
    }

    // Update charts
    updateCharts(data);

    // Update top performers
    updateTopPerformers();

    // Update data table
    updateDataTable(data);

    // Apply current filters
    applyFilters();

    hideLoadingOverlay();
}

// Update individual stat card with animation
function updateStatCard(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const card = element.closest('.stat-card');
    card.classList.add('updating', 'data-update-animation');

    // Animate number change
    const currentValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const targetValue = parseInt(newValue.toString().replace(/[^0-9]/g, '')) || 0;

    animateValue(element, currentValue, targetValue, 1000);

    setTimeout(() => {
        card.classList.remove('updating', 'data-update-animation');
    }, 1000);
}

// Animate number values
function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    const prefix = element.textContent.replace(/[0-9,]/g, '');

    function updateValue(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        element.textContent = prefix + current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }

    requestAnimationFrame(updateValue);
}

// Update with sample data when no Google Sheets data is available
function updateWithSampleData() {
    console.log('Using sample data');

    // Sample streaming data
    const sampleData = [
        { streamer: 'Abi', views: 8500, engagement: 650, rate: '7.6%', growth: '+15%', date: '2025-09-11', type: 'Live' },
        { streamer: 'Sena', views: 7200, engagement: 580, rate: '8.1%', growth: '+12%', date: '2025-09-11', type: 'Live' },
        { streamer: 'Juan G', views: 6800, engagement: 520, rate: '7.6%', growth: '+18%', date: '2025-09-10', type: 'Re-Live' },
        { streamer: 'Kimmy', views: 6200, engagement: 480, rate: '7.7%', growth: '+10%', date: '2025-09-10', type: 'Live' },
        { streamer: 'Jam', views: 5900, engagement: 420, rate: '7.1%', growth: '+8%', date: '2025-09-09', type: 'Live' },
        { streamer: 'Zell', views: 5100, engagement: 380, rate: '7.5%', growth: '+14%', date: '2025-09-09', type: 'Re-Live' }
    ];

    // Calculate totals
    const totalViews = sampleData.reduce((sum, item) => sum + item.views, 0);
    const totalEngagement = sampleData.reduce((sum, item) => sum + item.engagement, 0);
    const avgViews = Math.round(totalViews / sampleData.length);
    const engagementRate = ((totalEngagement / totalViews) * 100).toFixed(2);

    // Update stat cards
    updateStatCard('totalStreams', sampleData.length.toString());
    updateStatCard('totalViews', totalViews.toString());
    updateStatCard('avgViews', avgViews.toString());
    updateStatCard('totalEngagement', totalEngagement.toString());
    updateStatCard('engagementRate', engagementRate + '%');
    updateStatCard('followerGrowth', '+156');

    // Store sample data for filtering and display
    currentData.streamingData = sampleData;
}

// Update with real Google Sheets data
function updateWithRealData(data) {
    console.log('Using real Google Sheets data');

    if (data.streamers && data.streamers.length > 0) {
        currentData.streamingData = data.streamers;

        // Calculate real totals
        const totalViews = data.streamers.reduce((sum, item) => sum + parseInt(item.views || 0), 0);
        const totalEngagement = data.streamers.reduce((sum, item) => sum + parseInt(item.engagement || 0), 0);
        const avgViews = Math.round(totalViews / data.streamers.length);

        updateStatCard('totalStreams', data.streamers.length.toString());
        updateStatCard('totalViews', totalViews.toString());
        updateStatCard('avgViews', avgViews.toString());
        updateStatCard('totalEngagement', totalEngagement.toString());
    }
}

// Initialize charts
function initializeCharts() {
    // Views Chart
    const viewsCtx = document.getElementById('viewsChart');
    if (viewsCtx) {
        charts.views = new Chart(viewsCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Views',
                    data: [],
                    borderColor: '#74b9ff',
                    backgroundColor: 'rgba(116, 185, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
        charts.engagement = new Chart(engagementCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Engagement',
                    data: [],
                    backgroundColor: [], // Will be set dynamically
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Update charts with new data and consistent colors
function updateCharts(data) {
    const streamingData = currentData.streamingData || [];

    if (charts.views && streamingData.length > 0) {
        const labels = streamingData.map(item => item.streamer || item.date);
        const viewsData = streamingData.map(item => parseInt(item.views) || 0);

        charts.views.data.labels = labels;
        charts.views.data.datasets[0].data = viewsData;
        charts.views.update('none');
    }

    if (charts.engagement && streamingData.length > 0) {
        const labels = streamingData.map(item => item.streamer || item.date);
        const engagementData = streamingData.map(item => parseInt(item.engagement) || 0);
        const colors = labels.map(label => getStreamerColor(label));

        charts.engagement.data.labels = labels;
        charts.engagement.data.datasets[0].data = engagementData;
        charts.engagement.data.datasets[0].backgroundColor = colors;
        charts.engagement.update('none');
    }
}

// Update top performers section with original format and proper filters
function updateTopPerformers() {
    const topNFilter = document.getElementById('topNFilter')?.value || '5';
    const sortByFilter = document.getElementById('sortByFilter')?.value || 'engagementRate';
    const streamingData = currentData.streamingData || [];

    if (streamingData.length === 0) return;

    let performers = [...streamingData];

    // Calculate engagement rates for proper sorting
    performers.forEach(item => {
        const views = parseInt(item.views) || 0;
        const engagement = parseInt(item.engagement) || 0;
        item.engagementRateCalc = views > 0 ? (engagement / views) * 100 : 0;
        item.totalEngagementCalc = engagement;
    });

    // Sort by selected criteria
    performers.sort((a, b) => {
        switch(sortByFilter) {
            case 'totalViews':
                return (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
            case 'avgViews':
                return (parseInt(b.views) || 0) - (parseInt(a.views) || 0);
            case 'totalEngagement':
                return b.totalEngagementCalc - a.totalEngagementCalc;
            default:
                return b.engagementRateCalc - a.engagementRateCalc;
        }
    });

    // Limit results based on top N filter
    if (topNFilter !== 'all') {
        performers = performers.slice(0, parseInt(topNFilter));
    }

    const topPerformersGrid = document.getElementById('topPerformersGrid');
    if (!topPerformersGrid) return;

    topPerformersGrid.innerHTML = '';

    performers.forEach((performer, index) => {
        const card = document.createElement('div');
        card.className = 'top-performer-card';

        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        const streamerName = performer.streamer || 'Unknown';
        const streamerColor = getStreamerColor(streamerName);

        card.innerHTML = `
            <div class="rank-badge ${rankClass}">${index + 1}</div>
            <div class="performer-name" style="color: ${streamerColor}; font-weight: bold;">${streamerName}</div>
            <div class="performer-metrics">
                <div class="metric-item">
                    <div class="metric-value">${(parseInt(performer.views) || 0).toLocaleString()}</div>
                    <div class="metric-label">Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${(parseInt(performer.engagement) || 0).toLocaleString()}</div>
                    <div class="metric-label">Engagement</div>
                </div>
            </div>
            <div class="engagement-rate-highlight">
                <div class="rate">${performer.engagementRateCalc.toFixed(2)}%</div>
                <div>Engagement Rate</div>
            </div>
        `;

        topPerformersGrid.appendChild(card);
    });
}

// Update data table
function updateDataTable(data) {
    const tableBody = document.getElementById('streamingTableBody');
    if (!tableBody) return;

    const streamingData = currentData.streamingData || [];

    tableBody.innerHTML = '';

    streamingData.forEach(item => {
        const row = document.createElement('tr');
        const streamerColor = getStreamerColor(item.streamer);

        row.innerHTML = `
            <td style="color: ${streamerColor}; font-weight: bold;">${item.streamer || 'Unknown'}</td>
            <td>${item.date || 'N/A'}</td>
            <td>${item.type || 'N/A'}</td>
            <td>${(parseInt(item.views) || 0).toLocaleString()}</td>
            <td>${(parseInt(item.engagement) || 0).toLocaleString()}</td>
            <td>${item.rate || '0%'}</td>
            <td>${item.growth || '+0%'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Apply filters to data
function applyFilters() {
    const streamerFilter = document.getElementById('streamerFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';
    const streamTypeFilter = document.getElementById('streamTypeFilter')?.value || 'all';

    let filteredData = currentData.streamingData || [];

    // Apply streamer filter
    if (streamerFilter !== 'all') {
        filteredData = filteredData.filter(item => item.streamer === streamerFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
        const now = new Date();
        filteredData = filteredData.filter(item => {
            if (!item.date) return true;
            const itemDate = new Date(item.date);

            switch (dateFilter) {
                case 'last3':
                    return (now - itemDate) <= (3 * 24 * 60 * 60 * 1000);
                case 'last7':
                    return (now - itemDate) <= (7 * 24 * 60 * 60 * 1000);
                case 'last14':
                    return (now - itemDate) <= (14 * 24 * 60 * 60 * 1000);
                case 'september':
                    return itemDate.getMonth() === 8 && itemDate.getFullYear() === 2025;
                case 'august':
                    return itemDate.getMonth() === 7 && itemDate.getFullYear() === 2025;
                default:
                    return true;
            }
        });
    }

    // Apply stream type filter
    if (streamTypeFilter !== 'all') {
        filteredData = filteredData.filter(item =>
            item.type && item.type.toLowerCase().includes(streamTypeFilter.toLowerCase())
        );
    }

    // Update displays with filtered data
    const originalData = currentData.streamingData;
    currentData.streamingData = filteredData;

    updateCharts(currentData);
    updateTopPerformers();
    updateDataTable(currentData);

    // Calculate and update filtered stats
    if (filteredData.length > 0) {
        const totalViews = filteredData.reduce((sum, item) => sum + (parseInt(item.views) || 0), 0);
        const totalEngagement = filteredData.reduce((sum, item) => sum + (parseInt(item.engagement) || 0), 0);
        const avgViews = Math.round(totalViews / filteredData.length);

        updateStatCard('totalStreams', filteredData.length.toString());
        updateStatCard('totalViews', totalViews.toString());
        updateStatCard('avgViews', avgViews.toString());
        updateStatCard('totalEngagement', totalEngagement.toString());
    }

    // Restore original data
    currentData.streamingData = originalData;
}

// Request manual refresh
function requestRefresh() {
    showLoadingOverlay();
    socket.emit('requestRefresh');

    // Auto-hide loading after 10 seconds
    setTimeout(() => {
        hideLoadingOverlay();
    }, 10000);
}

// Show/hide loading overlay
function showLoadingOverlay() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoadingOverlay() {
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 500);
}

// Auto-refresh every 5 minutes
setInterval(() => {
    console.log('Auto-refreshing data...');
    requestRefresh();
}, 5 * 60 * 1000);