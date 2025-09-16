// Socket.io connection for real-time updates
const socket = io();

// Complete dataset from your original file (with dynamic Google Sheets integration)
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

// Socket event listeners for real-time updates
socket.on('connect', function() {
    console.log('Connected to server');
    updateConnectionStatus(true);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
    updateConnectionStatus(false);
});

socket.on('dataUpdate', function(data) {
    console.log('Received data update from Google Sheets:', data);
    
    // Merge Google Sheets data with local data if available
    if (data.streamers && data.streamers.length > 0) {
        // Convert Google Sheets data to match our format
        const googleSheetsData = data.streamers.map(item => ({
            date: item.Date || item.date || new Date().toISOString().split('T')[0],
            views: parseInt(item.Views || item.views || 0),
            comments: parseInt(item.Comments || item.comments || 0),
            reactions: parseInt(item.Reactions || item.reactions || 0),
            shares: parseInt(item.Shares || item.shares || 0),
            linkClicks: parseInt(item.LinkClicks || item.linkClicks || 0),
            newFollowers: parseInt(item.NewFollowers || item.newFollowers || 0),
            totalFollowers: parseInt(item.TotalFollowers || item.totalFollowers || 0),
            streamer: item.Streamer || item.streamer || 'Unknown',
            type: item.Type || item.type || 'live',
            startTime: item.StartTime || item.startTime || '',
            endTime: item.EndTime || item.endTime || ''
        }));
        
        // Use Google Sheets data if available, otherwise use sample data
        streamData = googleSheetsData.length > 0 ? googleSheetsData : streamData;
        filteredData = [...streamData];
        
        console.log('Updated with Google Sheets data:', streamData.length, 'records');
    }
    
    // Refresh dashboard
    applyFilters();
    initializeCharts();
});

// Utility functions
function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = (end - start) / (1000 * 60);
    return Math.max(diff, 0);
}

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
        statusElement.textContent = '🟢 Connected - Live Updates';
        statusElement.className = 'status-connected';
    } else {
        statusElement.textContent = '🔴 Disconnected - Retrying...';
        statusElement.className = 'status-disconnected';
    }
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
                    includeDate = itemDate.getMonth() === 7 && itemDate.getFullYear() === 2025;
                    break;
                case 'september':
                    includeDate = itemDate.getMonth() === 8 && itemDate.getFullYear() === 2025;
                    break;
            }
        }
        
        return includeStreamer && includeCollab && includeType && includeDate;
    });

    updateStats();
    updateTopPerformers();
    updateIndividualPerformers();
    updateSummaryCards();
    updatePerformanceBreakdown();
    updateDataTable();
    updateCharts();
}

function updateStats() {
    const totalStreams = filteredData.length;
    const totalViews = filteredData.reduce((sum, item) => sum + item.views, 0);
    const avgViews = totalStreams > 0 ? Math.round(totalViews / totalStreams) : 0;
    const totalEngagement = filteredData.reduce((sum, item) => sum + item.comments + item.reactions + item.shares, 0);
    const totalNewFollowers = filteredData.reduce((sum, item) => sum + item.newFollowers, 0);
    const currentFollowers = Math.max(...filteredData.map(item => item.totalFollowers), 0);
    
    const engagementRate = currentFollowers > 0 ? ((totalEngagement / currentFollowers) * 100).toFixed(2) : '0.00';
    const engagementRateViews = totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : '0.00';

    document.getElementById('totalStreams').textContent = totalStreams.toLocaleString();
    document.getElementById('totalViews').textContent = totalViews.toLocaleString();
    document.getElementById('avgViews').textContent = avgViews.toLocaleString();
    document.getElementById('totalEngagement').textContent = totalEngagement.toLocaleString();
    document.getElementById('engagementRate').textContent = `${engagementRate}%`;
    document.getElementById('engagementRateViews').textContent = `${engagementRateViews}%`;
    document.getElementById('followerGrowth').textContent = `+${totalNewFollowers.toLocaleString()}`;
    document.getElementById('currentFollowers').textContent = currentFollowers.toLocaleString();
}

function updateTopPerformers() {
    const topNFilter = document.getElementById('topNFilter')?.value || 'all';
    const sortByFilter = document.getElementById('sortByFilter')?.value || 'engagementRate';
    
    let performers = [...filteredData];
    
    // Calculate engagement rates
    performers.forEach(item => {
        const totalEngagement = item.comments + item.reactions + item.shares;
        item.engagementRateCalc = item.views > 0 ? (totalEngagement / item.views) * 100 : 0;
        item.totalEngagementCalc = totalEngagement;
    });
    
    // Sort by selected criteria
    performers.sort((a, b) => {
        switch(sortByFilter) {
            case 'totalViews':
                return b.views - a.views;
            case 'avgViews':
                return b.views - a.views;
            case 'totalEngagement':
                return b.totalEngagementCalc - a.totalEngagementCalc;
            default:
                return b.engagementRateCalc - a.engagementRateCalc;
        }
    });
    
    // Limit results
    if (topNFilter !== 'all') {
        performers = performers.slice(0, parseInt(topNFilter));
    }
    
    const grid = document.getElementById('topPerformersGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    performers.forEach((performer, index) => {
        const card = document.createElement('div');
        card.className = 'top-performer-card';
        
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        
        card.innerHTML = `
            <div class="rank-badge ${rankClass}">${index + 1}</div>
            <div class="performer-name">${performer.streamer}</div>
            <div class="performer-metrics">
                <div class="metric-item">
                    <div class="metric-value">${performer.views.toLocaleString()}</div>
                    <div class="metric-label">Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${performer.totalEngagementCalc.toLocaleString()}</div>
                    <div class="metric-label">Engagement</div>
                </div>
            </div>
            <div class="engagement-rate-highlight">
                <div class="rate">${performer.engagementRateCalc.toFixed(2)}%</div>
                <div>Engagement Rate</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function updateIndividualPerformers() {
    // Group by individual streamers
    const streamerStats = {};
    
    filteredData.forEach(item => {
        const streamers = item.streamer.split(' and ').concat(item.streamer.split(', '));
        
        streamers.forEach(streamer => {
            streamer = streamer.trim();
            if (!streamerStats[streamer]) {
                streamerStats[streamer] = {
                    name: streamer,
                    totalViews: 0,
                    totalEngagement: 0,
                    streams: 0,
                    totalFollowers: 0
                };
            }
            
            streamerStats[streamer].totalViews += item.views;
            streamerStats[streamer].totalEngagement += (item.comments + item.reactions + item.shares);
            streamerStats[streamer].streams++;
            streamerStats[streamer].totalFollowers = Math.max(streamerStats[streamer].totalFollowers, item.totalFollowers);
        });
    });
    
    let performers = Object.values(streamerStats)
        .filter(performer => ['Abi', 'Sena', 'Juan G', 'Kimmy', 'Jam', 'Zell'].includes(performer.name))
        .map(performer => ({
            ...performer,
            avgViews: performer.streams > 0 ? Math.round(performer.totalViews / performer.streams) : 0,
            engagementRate: performer.totalViews > 0 ? (performer.totalEngagement / performer.totalViews) * 100 : 0
        }));
    
    const sortBy = document.getElementById('sortByIndividualFilter')?.value || 'engagementRate';
    const topN = document.getElementById('topNIndividualFilter')?.value || 'all';
    
    performers.sort((a, b) => {
        switch(sortBy) {
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
    
    if (topN !== 'all') {
        performers = performers.slice(0, parseInt(topN));
    }
    
    const grid = document.getElementById('topIndividualPerformersGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    performers.forEach((performer, index) => {
        const card = document.createElement('div');
        card.className = 'top-performer-card';
        
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        
        card.innerHTML = `
            <div class="rank-badge ${rankClass}">${index + 1}</div>
            <div class="performer-name">${performer.name}</div>
            <div class="performer-metrics">
                <div class="metric-item">
                    <div class="metric-value">${performer.totalViews.toLocaleString()}</div>
                    <div class="metric-label">Total Views</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${performer.streams}</div>
                    <div class="metric-label">Streams</div>
                </div>
            </div>
            <div class="engagement-rate-highlight">
                <div class="rate">${performer.engagementRate.toFixed(2)}%</div>
                <div>Engagement Rate</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function updateSummaryCards() {
    // Find best performing stream
    let bestStream = filteredData.reduce((best, current) => 
        current.views > best.views ? current : best, filteredData[0] || {views: 0});
    
    // Find top engagement day
    let topEngagement = filteredData.reduce((best, current) => {
        const currentEng = current.comments + current.reactions + current.shares;
        const bestEng = best.comments + best.reactions + best.shares;
        return currentEng > bestEng ? current : best;
    }, filteredData[0] || {comments: 0, reactions: 0, shares: 0});
    
    // Find biggest follower growth
    let biggestGrowth = filteredData.reduce((best, current) => 
        current.newFollowers > best.newFollowers ? current : best, filteredData[0] || {newFollowers: 0});
    
    if (bestStream) {
        document.getElementById('bestStream').textContent = `${bestStream.views.toLocaleString()} views`;
        document.getElementById('bestStreamDesc').textContent = `${bestStream.streamer} - ${formatDate(bestStream.date)}`;
    }
    
    if (topEngagement) {
        const totalEng = topEngagement.comments + topEngagement.reactions + topEngagement.shares;
        document.getElementById('topEngagement').textContent = totalEng.toLocaleString();
        document.getElementById('topEngagementDesc').textContent = `Total interactions - ${formatDate(topEngagement.date)}`;
    }
    
    if (biggestGrowth) {
        document.getElementById('biggestGrowth').textContent = `+${biggestGrowth.newFollowers}`;
        document.getElementById('biggestGrowthDesc').textContent = `New followers - ${formatDate(biggestGrowth.date)}`;
    }
}

function updatePerformanceBreakdown() {
    // Individual streamers
    const individualStreamers = ['Abi', 'Sena', 'Juan G', 'Kimmy', 'Jam', 'Zell'];
    const individualCards = document.getElementById('individualStreamersCards');
    if (individualCards) {
        individualCards.innerHTML = '';
        
        individualStreamers.forEach(streamer => {
            const streamerData = filteredData.filter(item => item.streamer === streamer);
            if (streamerData.length === 0) return;
            
            const totalViews = streamerData.reduce((sum, item) => sum + item.views, 0);
            const totalEngagement = streamerData.reduce((sum, item) => sum + item.comments + item.reactions + item.shares, 0);
            const avgViews = Math.round(totalViews / streamerData.length);
            
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.innerHTML = `
                <h4>${streamer}</h4>
                <div class="metric">${totalViews.toLocaleString()} views</div>
                <p>${streamerData.length} streams • ${avgViews.toLocaleString()} avg • ${totalEngagement.toLocaleString()} engagement</p>
            `;
            individualCards.appendChild(card);
        });
    }
    
    // Collaborations
    const collabData = {};
    filteredData.forEach(item => {
        if (item.streamer.includes(' and ') || item.streamer.includes(', ')) {
            if (!collabData[item.streamer]) {
                collabData[item.streamer] = {views: 0, engagement: 0, streams: 0};
            }
            collabData[item.streamer].views += item.views;
            collabData[item.streamer].engagement += (item.comments + item.reactions + item.shares);
            collabData[item.streamer].streams++;
        }
    });
    
    const collabCards = document.getElementById('collaborationsCards');
    if (collabCards) {
        collabCards.innerHTML = '';
        
        Object.entries(collabData).forEach(([collaboration, data]) => {
            const avgViews = Math.round(data.views / data.streams);
            
            const card = document.createElement('div');
            card.className = 'summary-card';
            card.innerHTML = `
                <h4>${collaboration}</h4>
                <div class="metric">${data.views.toLocaleString()} views</div>
                <p>${data.streams} streams • ${avgViews.toLocaleString()} avg • ${data.engagement.toLocaleString()} engagement</p>
            `;
            collabCards.appendChild(card);
        });
    }
}

function updateDataTable() {
    const tableBody = document.getElementById('dataTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredData.forEach(item => {
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
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Views Chart
    const viewsCtx = document.getElementById('viewsChart');
    if (viewsCtx) {
        charts.views = new Chart(viewsCtx, {
            type: 'line',
            data: {
                labels: filteredData.map(item => formatDate(item.date)),
                datasets: [{
                    label: 'Views',
                    data: filteredData.map(item => item.views),
                    borderColor: '#74b9ff',
                    backgroundColor: 'rgba(116, 185, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Follower Growth Chart
    const followersCtx = document.getElementById('followersChart');
    if (followersCtx) {
        charts.followers = new Chart(followersCtx, {
            type: 'line',
            data: {
                labels: filteredData.map(item => formatDate(item.date)),
                datasets: [{
                    label: 'Total Followers',
                    data: filteredData.map(item => item.totalFollowers),
                    borderColor: '#00b894',
                    backgroundColor: 'rgba(0, 184, 148, 0.1)',
                    borderWidth: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
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
                labels: filteredData.map(item => formatDate(item.date)),
                datasets: [
                    {
                        label: 'Comments',
                        data: filteredData.map(item => item.comments),
                        backgroundColor: '#ff6b6b'
                    },
                    {
                        label: 'Reactions',
                        data: filteredData.map(item => item.reactions),
                        backgroundColor: '#74b9ff'
                    },
                    {
                        label: 'Shares',
                        data: filteredData.map(item => item.shares),
                        backgroundColor: '#00b894'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        });
    }
}

function updateCharts() {
    initializeCharts();
}

// Event listeners for filters
document.getElementById('streamerFilter')?.addEventListener('change', applyFilters);
document.getElementById('collabFilter')?.addEventListener('change', applyFilters);
document.getElementById('dateFilter')?.addEventListener('change', applyFilters);
document.getElementById('streamTypeFilter')?.addEventListener('change', applyFilters);
document.getElementById('topNFilter')?.addEventListener('change', updateTopPerformers);
document.getElementById('sortByFilter')?.addEventListener('change', updateTopPerformers);
document.getElementById('topNIndividualFilter')?.addEventListener('change', updateIndividualPerformers);
document.getElementById('sortByIndividualFilter')?.addEventListener('change', updateIndividualPerformers);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    applyFilters();
    initializeCharts();
});

// Auto-refresh every 5 minutes
setInterval(() => {
    console.log('Auto-refreshing dashboard...');
    socket.emit('requestRefresh');
}, 5 * 60 * 1000);