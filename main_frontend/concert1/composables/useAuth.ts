import { ref, computed } from 'vue'

export interface AuthState {
  token?: string
  email?: string
  username?: string
}

const user = ref<AuthState | null>(null)
const remember = ref(false)

function clearStorageKeys(storage: Storage) {
  storage.removeItem('jwt_token')
  storage.removeItem('user_email')
  storage.removeItem('username')
}

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(user.value?.token))

  function loadFromStorage() {
    if (typeof window === 'undefined') return
    try {
      const rememberMe = localStorage.getItem('remember_me') === 'true'
      remember.value = rememberMe

      const primary = rememberMe ? localStorage : sessionStorage
      const fallback = rememberMe ? sessionStorage : localStorage

      const token = primary.getItem('jwt_token') || fallback.getItem('jwt_token') || undefined
      const email = primary.getItem('user_email') || fallback.getItem('user_email') || undefined
      const username = primary.getItem('username') || fallback.getItem('username') || undefined

      if (token) {
        user.value = { token, email, username }
      }
    } catch (err) {
      console.warn('Failed to restore auth from storage', err)
    }
  }

  function saveAuth(payload: { token: string; email?: string; username?: string }, rememberMe: boolean) {
    if (typeof window === 'undefined') return

    clearStorageKeys(localStorage)
    clearStorageKeys(sessionStorage)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('jwt_token', payload.token)
    if (payload.email) storage.setItem('user_email', payload.email)
    if (payload.username) storage.setItem('username', payload.username)

    if (rememberMe) {
      localStorage.setItem('remember_me', 'true')
    } else {
      localStorage.removeItem('remember_me')
    }

    user.value = { token: payload.token, email: payload.email, username: payload.username }
    remember.value = rememberMe
  }

  function clearAuth() {
    if (typeof window === 'undefined') return
    clearStorageKeys(localStorage)
    clearStorageKeys(sessionStorage)
    localStorage.removeItem('remember_me')
    user.value = null
    remember.value = false
  }

  function shouldCompleteProfile(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('profile_completed') !== 'true'
  }

  function logout() {
    clearAuth()
    if (typeof window !== 'undefined') {
      window.location.href = '/LoginPage'
    }
  }

  return {
    user,
    remember,
    isLoggedIn,
    loadFromStorage,
    saveAuth,
    clearAuth,
    shouldCompleteProfile,
    logout
  }
}
