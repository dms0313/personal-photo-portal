import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using local storage fallback.')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)

export interface PhotoRecord {
    id: string
    url: string
    title: string
    description: string | null
    created_at: string
    display_order: number
    is_featured?: boolean
    category?: string
}

export const photosTable = {
    async getAll(): Promise<PhotoRecord[]> {
        const { data, error } = await supabase
            .from('photos')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to fetch photos:', error)
            return []
        }
        return data || []
    },

    async insert(photo: Omit<PhotoRecord, 'id' | 'created_at'>): Promise<PhotoRecord | null> {
        const { data, error } = await supabase
            .from('photos')
            .insert(photo)
            .select()
            .single()

        if (error) {
            console.error('Failed to insert photo:', error)
            return null
        }
        return data
    },

    async update(id: string, updates: Partial<PhotoRecord>): Promise<boolean> {
        const { error } = await supabase
            .from('photos')
            .update(updates)
            .eq('id', id)

        if (error) {
            console.error('Failed to update photo:', error)
            return false
        }
        return true
    },

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('photos')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Failed to delete photo:', error)
            return false
        }
        return true
    },
}
