import { create } from 'zustand'
import { photosTable, type PhotoRecord } from './supabase'

export interface GalleryPhoto {
  id: string
  url: string
  title: string
  description: string
  is_featured: boolean
  category: string
}

interface GalleryState {
  photos: GalleryPhoto[]
  isLoading: boolean
  error: string | null
  fetchPhotos: () => Promise<void>
  addPhoto: (photo: Omit<GalleryPhoto, 'id' | 'is_featured' | 'category'> & { category?: string }) => Promise<boolean>
  updatePhoto: (id: string, updates: Partial<Pick<GalleryPhoto, 'title' | 'description' | 'is_featured' | 'category'>>) => Promise<boolean>
  deletePhoto: (id: string) => Promise<boolean>
}

const mapRecordToPhoto = (record: PhotoRecord): GalleryPhoto => ({
  id: record.id,
  url: record.url,
  title: record.title,
  description: record.description || '',
  is_featured: record.is_featured ?? false,
  category: record.category || 'people', // Default category
})

export const useGalleryStore = create<GalleryState>((set, get) => ({
  photos: [],
  isLoading: true,
  error: null,

  fetchPhotos: async () => {
    set({ isLoading: true, error: null })
    try {
      const records = await photosTable.getAll()
      const photos = records.map(mapRecordToPhoto)
      set({ photos, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch photos:', error)
      set({ error: 'Failed to load photos', isLoading: false })
    }
  },

  addPhoto: async (photo) => {
    const record = await photosTable.insert({
      url: photo.url,
      title: photo.title,
      description: photo.description || null,
      display_order: get().photos.length,
      is_featured: false,
      category: photo.category || 'people',
    })

    if (record) {
      set((state) => ({
        photos: [...state.photos, mapRecordToPhoto(record)],
      }))
      return true
    }
    return false
  },

  updatePhoto: async (id, updates) => {
    const success = await photosTable.update(id, updates)
    if (success) {
      set((state) => ({
        photos: state.photos.map((photo) =>
          photo.id === id ? { ...photo, ...updates } : photo
        ),
      }))
    }
    return success
  },

  deletePhoto: async (id) => {
    const success = await photosTable.delete(id)
    if (success) {
      set((state) => ({
        photos: state.photos.filter((photo) => photo.id !== id),
      }))
    }
    return success
  },
}))

// Auto-fetch on load
if (typeof window !== 'undefined') {
  useGalleryStore.getState().fetchPhotos()
}
