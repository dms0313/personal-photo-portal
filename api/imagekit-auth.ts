import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || ''

export default function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (!IMAGEKIT_PRIVATE_KEY) {
        return res.status(500).json({ error: 'ImageKit private key not configured' })
    }

    // Generate authentication parameters for ImageKit client-side upload
    const token = crypto.randomUUID()
    const expire = Math.floor(Date.now() / 1000) + 60 * 30 // 30 minutes
    const signature = crypto
        .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
        .update(token + expire)
        .digest('hex')

    return res.status(200).json({
        token,
        expire,
        signature,
    })
}
