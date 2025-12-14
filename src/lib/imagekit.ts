// ImageKit configuration and upload service
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dmsully'
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || ''

export interface ImageKitConfig {
    urlEndpoint: string
    publicKey: string
}

export const imagekitConfig: ImageKitConfig = {
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    publicKey: IMAGEKIT_PUBLIC_KEY,
}

interface AuthResponse {
    token: string
    expire: number
    signature: string
}

/**
 * Fetches authentication parameters from our Vercel serverless function
 */
export async function getImageKitAuth(): Promise<AuthResponse> {
    const response = await fetch('/api/imagekit-auth')
    if (!response.ok) {
        throw new Error('Failed to get ImageKit authentication')
    }
    return response.json()
}

/**
 * Uploads a file directly to ImageKit
 */
export async function uploadToImageKit(
    file: File,
    fileName?: string,
    folder: string = 'Photography-Portfolio'
): Promise<string> {
    const auth = await getImageKitAuth()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName || file.name)
    formData.append('folder', folder)
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY)
    formData.append('signature', auth.signature)
    formData.append('expire', auth.expire.toString())
    formData.append('token', auth.token)

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        const error = await response.text()
        console.error('ImageKit upload failed:', error)
        throw new Error('Failed to upload image')
    }

    const result = await response.json()
    return result.url as string
}

/**
 * Generates a full ImageKit URL for an image
 */
export function getImageKitUrl(fileName: string, transformations?: string): string {
    const baseUrl = IMAGEKIT_URL_ENDPOINT.replace(/\/$/, '')

    if (transformations) {
        return `${baseUrl}/${transformations}/${fileName}`
    }

    return `${baseUrl}/${fileName}`
}

/**
 * Common image transformations for the gallery
 */
export const imageTransformations = {
    thumbnail: 'tr:w-400,h-500,fo-auto',
    medium: 'tr:w-800,h-1000,fo-auto',
    full: 'tr:q-90',
    blur: 'tr:bl-10',
}

/**
 * Validates if a URL is an ImageKit URL from your account
 */
export function isImageKitUrl(url: string): boolean {
    return url.startsWith(IMAGEKIT_URL_ENDPOINT)
}
