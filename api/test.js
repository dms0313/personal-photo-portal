export default function handler(req, res) {
    res.status(200).json({
        message: 'API is working',
        cwd: process.cwd(),
        env: {
            hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
            hasApiKey: !!process.env.VITE_GOOGLE_API_KEY
        }
    });
}
