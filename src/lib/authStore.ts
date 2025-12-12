import { create } from 'zustand'

const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? 'you'
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD
const STORAGE_KEY = 'owner-session'

const getStoredAuthState = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

interface AuthState {
  isAuthenticated: boolean
  ownerEmail: string
  loginError?: string
  hasConfiguredPasscode: boolean
  login: (passcode: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: getStoredAuthState(),
  ownerEmail: OWNER_EMAIL,
  loginError: undefined,
  hasConfiguredPasscode: Boolean(OWNER_PASSWORD),
  login: (passcode: string) => {
    if (!OWNER_PASSWORD) {
      set({
        isAuthenticated: false,
        loginError: 'Set VITE_OWNER_PASSWORD in your environment to enable owner login.',
      })
      return false
    }

    const success = passcode === OWNER_PASSWORD

    if (success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, 'true')
      }
      set({ isAuthenticated: true, loginError: undefined })
    } else {
      set({ isAuthenticated: false, loginError: 'Incorrect passcode. Try again.' })
    }

    return success
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    set({ isAuthenticated: false, loginError: undefined })
  },
}))
