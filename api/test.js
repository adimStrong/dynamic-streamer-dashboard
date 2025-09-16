export default function handler(req, res) {
    res.status(200).json({
        message: "API is working!",
        timestamp: new Date().toISOString(),
        environment: {
            hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_ID,
            hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
            hasAuth: !!process.env.AUTH_USERNAME
        }
    });
}