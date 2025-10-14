import { ref } from 'vue'// Composable for easy toast notification integration

// Heuristic 1: Visibility of System Status - Consistent feedback mechanism

type Toast = {

  id: numberimport { ref } from 'vue'

  type: 'success' | 'error' | 'info' | 'warning'

  message: stringexport interface ToastOptions {

  timeout?: number  title: string

  title?: string  message?: string

}  type?: 'success' | 'error' | 'warning' | 'info'

  duration?: number

const toasts = ref<Toast[]>([])  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'

let idSeq = 1}



export function useToast() {// Global toast state (shared across components)

  function push(const toastState = ref({

    message: string,  show: false,

    type: Toast['type'] = 'info',  title: '',

    timeout = 5000,  message: '',

    title?: string  type: 'info' as 'success' | 'error' | 'warning' | 'info',

  ) {  duration: 5000,

    const id = idSeq++  position: 'top-right' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'

    toasts.value.push({ id, type, message, timeout, title })})

    if (timeout > 0) setTimeout(() => dismiss(id), timeout)

  }export const useToast = () => {

  const showToast = (options: ToastOptions) => {

  function success(message: string, title?: string, timeout = 5000) {    toastState.value = {

    push(message, 'success', timeout, title)      show: true,

  }      title: options.title,

      message: options.message || '',

  function error(message: string, title?: string, timeout = 7000) {      type: options.type || 'info',

    push(message, 'error', timeout, title)      duration: options.duration ?? 5000,

  }      position: options.position || 'top-right'

    }

  function info(message: string, title?: string, timeout = 5000) {  }

    push(message, 'info', timeout, title)

  }  const hideToast = () => {

    toastState.value.show = false

  function warning(message: string, title?: string, timeout = 6000) {  }

    push(message, 'warning', timeout, title)

  }  // Convenience methods for common toast types

  const success = (title: string, message?: string, duration?: number) => {

  function dismiss(id: number) {    showToast({ title, message, type: 'success', duration })

    toasts.value = toasts.value.filter(t => t.id !== id)  }

  }

  const error = (title: string, message?: string, duration?: number) => {

  function dismissAll() {    showToast({ title, message, type: 'error', duration })

    toasts.value = []  }

  }

  const warning = (title: string, message?: string, duration?: number) => {

  return {    showToast({ title, message, type: 'warning', duration })

    toasts,  }

    push,

    success,  const info = (title: string, message?: string, duration?: number) => {

    error,    showToast({ title, message, type: 'info', duration })

    info,  }

    warning,

    dismiss,  return {

    dismissAll    toastState,

  }    showToast,

}    hideToast,

    success,
    error,
    warning,
    info
  }
}
