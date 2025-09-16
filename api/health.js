export default async function handler(req, res) {
    res.status(200).json({
        status: 'OK',
        lastUpdated: new Date().toISOString(),
        sheetsConfigured: !!(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
    });
}