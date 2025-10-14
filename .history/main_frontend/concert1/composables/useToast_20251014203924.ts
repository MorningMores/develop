import { ref } from 'vue'import { ref } from 'vue'// Composable for easy toast notification integration



type Toast = {// Heuristic 1: Visibility of System Status - Consistent feedback mechanism

  id: number

  type: 'success' | 'error' | 'info' | 'warning'type Toast = {

  message: string

  timeout?: number  id: numberimport { ref } from 'vue'

  title?: string

}  type: 'success' | 'error' | 'info' | 'warning'



const toasts = ref<Toast[]>([])  message: stringexport interface ToastOptions {

let idSeq = 1

  timeout?: number  title: string

export function useToast() {

  function push(  title?: string  message?: string

    message: string,

    type: Toast['type'] = 'info',}  type?: 'success' | 'error' | 'warning' | 'info'

    timeout = 5000,

    title?: string  duration?: number

  ) {

    const id = idSeq++const toasts = ref<Toast[]>([])  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'

    toasts.value.push({ id, type, message, timeout, title })

    if (timeout > 0) setTimeout(() => dismiss(id), timeout)let idSeq = 1}

  }



  function success(message: string, title?: string, timeout = 5000) {

    push(message, 'success', timeout, title)export function useToast() {// Global toast state (shared across components)

  }

  function push(const toastState = ref({

  function error(message: string, title?: string, timeout = 7000) {

    push(message, 'error', timeout, title)    message: string,  show: false,

  }

    type: Toast['type'] = 'info',  title: '',

  function info(message: string, title?: string, timeout = 5000) {

    push(message, 'info', timeout, title)    timeout = 5000,  message: '',

  }

    title?: string  type: 'info' as 'success' | 'error' | 'warning' | 'info',

  function warning(message: string, title?: string, timeout = 6000) {

    push(message, 'warning', timeout, title)  ) {  duration: 5000,

  }

    const id = idSeq++  position: 'top-right' as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center'

  function dismiss(id: number) {

    toasts.value = toasts.value.filter(t => t.id !== id)    toasts.value.push({ id, type, message, timeout, title })})

  }

    if (timeout > 0) setTimeout(() => dismiss(id), timeout)

  function dismissAll() {

    toasts.value = []  }export const useToast = () => {

  }

  const showToast = (options: ToastOptions) => {

  return {

    toasts,  function success(message: string, title?: string, timeout = 5000) {    toastState.value = {

    push,

    success,    push(message, 'success', timeout, title)      show: true,

    error,

    info,  }      title: options.title,

    warning,

    dismiss,      message: options.message || '',

    dismissAll

  }  function error(message: string, title?: string, timeout = 7000) {      type: options.type || 'info',

}

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
