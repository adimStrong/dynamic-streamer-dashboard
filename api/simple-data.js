module.exports = function handler(req, res) {
    // Simple mock data to test if the dashboard works
    const mockData = {
        lastUpdated: new Date().toISOString(),
        summary: {
            totalViewers: "125,295",
            totalRevenue: "₱0",
            activeStreamers: "6",
            avgViewTime: "120 min"
        },
        streamers: [
            {
                "DATE": "14/9/2025",
                "TIME": "2:30 TO 4:30",
                "Stream": "Stream 1",
                "Name of Streamer": "Jam",
                "TOTAL VIEWS": "2,768",
                "COMMENTS": "5,673",
                "REACTIONS": "663",
                "SHARE": "808",
                "LINK CLICKS": "0",
                "EOD New Follower": "232",
                "OVERALL TOTAL FOLLOWERS": "9,802"
            },
            {
                "DATE": "14/9/2025",
                "TIME": "5:00 TO 7:00",
                "Stream": "Stream 2",
                "Name of Streamer": "Sena and Zell",
                "TOTAL VIEWS": "3,227",
                "COMMENTS": "5,776",
                "REACTIONS": "924",
                "SHARE": "1,003",
                "LINK CLICKS": "0",
                "EOD New Follower": "0",
                "OVERALL TOTAL FOLLOWERS": "9,802"
            },
            {
                "DATE": "14/9/2025",
                "TIME": "7:30 TO 9:30",
                "Stream": "Stream 3",
                "Name of Streamer": "Abi",
                "TOTAL VIEWS": "6,426",
                "COMMENTS": "6,694",
                "REACTIONS": "1,446",
                "SHARE": "1,433",
                "LINK CLICKS": "1",
                "EOD New Follower": "107",
                "OVERALL TOTAL FOLLOWERS": "9,909"
            }
        ]
    };

    res.status(200).json(mockData);
};