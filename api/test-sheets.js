module.exports = async function handler(req, res) {
    try {
        // Check if environment variables are available
        const hasSheetId = !!process.env.GOOGLE_SHEETS_ID;
        const hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const hasKey = !!process.env.GOOGLE_PRIVATE_KEY;

        res.status(200).json({
            message: "Environment check",
            environment: {
                hasSheetId,
                hasEmail,
                hasKey,
                sheetId: process.env.GOOGLE_SHEETS_ID || 'missing',
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'missing'
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};