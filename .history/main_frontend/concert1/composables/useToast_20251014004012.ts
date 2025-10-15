// Composable for easy toast notification integration
// Heuristic 1: Visibility of System Status - Consistent feedback mechanism

import { ref } from 'vue'

export interface ToastOptions {
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'
}

// Global toast state (shared across components)
const toastState = ref({
  show: false,
  title: '',
  message: '',
  type: 'info' as 'success' | 'error' | 'warning' | 'info',
  duration: 5000,
  position: 'top-right' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'
})

export const useToast = () => {
  const showToast = (options: ToastOptions) => {
    toastState.value = {
      show: true,
      title: options.title,
      message: options.message || '',
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      position: options.position || 'top-right'
    }
  }

  const hideToast = () => {
    toastState.value.show = false
  }

  // Convenience methods for common toast types
  const success = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'success', duration })
  }

  const error = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'error', duration })
  }

  const warning = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'warning', duration })
  }

  const info = (title: string, message?: string, duration?: number) => {
    showToast({ title, message, type: 'info', duration })
  }

  return {
    toastState,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }
}
