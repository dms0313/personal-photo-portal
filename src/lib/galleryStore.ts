import { create } from 'zustand'

export interface GalleryPhoto {
  id: string
  url: string
  title: string
  description: string
}

const STORAGE_KEY = 'gallery-photos'

const DEFAULT_PHOTOS: GalleryPhoto[] = [
  {
    id: 'default-1',
    url: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&q=80',
    title: 'Sunlit Portrait',
    description: 'Golden hour portrait session with dramatic shadows and soft highlights.',
  },
  {
    id: 'default-2',
    url: 'https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80',
    title: 'Studio Expression',
    description: 'Minimal studio lighting to focus on expression and presence.',
  },
  {
    id: 'default-3',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80',
    title: 'Windswept',
    description: 'Outdoor portrait capturing movement and personality against a coastal backdrop.',
  },
  {
    id: 'default-4',
    url: 'https://images.unsplash.com/photo-1501854140884-074bf6b24363?auto=format&fit=crop&q=80',
    title: 'Quiet Moment',
    description: 'Natural light portrait focused on emotion and intimacy.',
  },
  {
    id: 'default-5',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80',
    title: 'Editorial Edge',
    description: 'Moody editorial-inspired portrait with graphic lines and texture.',
  },
  {
    id: 'default-6',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80',
    title: 'Portrait in Motion',
    description: 'Soft blur and motion to convey energy and life.',
  },
]

const loadStoredPhotos = (): GalleryPhoto[] => {
  if (typeof window === 'undefined') return DEFAULT_PHOTOS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return DEFAULT_PHOTOS
  try {
    const parsed = JSON.parse(stored) as GalleryPhoto[]
    if (!Array.isArray(parsed)) return DEFAULT_PHOTOS
    return parsed
  } catch (error) {
    console.error('Failed to parse gallery photos from storage', error)
    return DEFAULT_PHOTOS
  }
}

interface GalleryState {
  photos: GalleryPhoto[]
  addPhoto: (photo: Omit<GalleryPhoto, 'id'> & { id?: string }) => void
  updatePhoto: (id: string, updates: Partial<Pick<GalleryPhoto, 'title' | 'description'>>) => void
}

const persistPhotos = (photos: GalleryPhoto[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  photos: loadStoredPhotos(),
  addPhoto: (photo) => {
    const newPhoto: GalleryPhoto = {
      id: photo.id ?? createId(),
      ...photo,
    }

    const updated = [...get().photos, newPhoto]
    persistPhotos(updated)
    set({ photos: updated })
  },
  updatePhoto: (id, updates) => {
    const updated = get().photos.map((photo) =>
      photo.id === id
        ? {
            ...photo,
            ...updates,
          }
        : photo
    )
    persistPhotos(updated)
    set({ photos: updated })
  },
}))
