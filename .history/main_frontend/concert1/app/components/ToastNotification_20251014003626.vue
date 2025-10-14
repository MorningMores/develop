<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000 // Auto-dismiss after 5 seconds
  },
  position: {
    type: String,
    default: 'top-right' // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center'
  }
})

const emit = defineEmits(['close'])

const visible = ref(props.show)
let timeout = null

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal && props.duration > 0) {
    // Auto-dismiss after duration
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})

const handleClose = () => {
  visible.value = false
  emit('close')
  clearTimeout(timeout)
}

// Get icon based on type
const getIcon = () => {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'error':
      return '✗'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return 'ℹ'
  }
}

// Get color classes based on type
const getColorClasses = () => {
  switch (props.type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-500',
        icon: 'text-green-500',
        title: 'text-green-900',
        message: 'text-green-700',
        button: 'text-green-500 hover:text-green-700'
      }
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-500',
        icon: 'text-red-500',
        title: 'text-red-900',
        message: 'text-red-700',
        button: 'text-red-500 hover:text-red-700'
      }
    case 'warning':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        icon: 'text-amber-500',
        title: 'text-amber-900',
        message: 'text-amber-700',
        button: 'text-amber-500 hover:text-amber-700'
      }
    case 'info':
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        icon: 'text-blue-500',
        title: 'text-blue-900',
        message: 'text-blue-700',
        button: 'text-blue-500 hover:text-blue-700'
      }
  }
}

const colors = getColorClasses()

// Get position classes
const getPositionClasses = () => {
  switch (props.position) {
    case 'top-left':
      return 'top-4 left-4'
    case 'top-right':
      return 'top-4 right-4'
    case 'bottom-left':
      return 'bottom-4 left-4'
    case 'bottom-right':
      return 'bottom-4 right-4'
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2'
    default:
      return 'top-4 right-4'
  }
}
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed z-50 max-w-md w-full shadow-lg rounded-lg pointer-events-auto"
      :class="[colors.bg, colors.border, getPositionClasses()]"
    >
      <div class="p-4 border-l-4" :class="colors.border">
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <span 
              class="text-2xl font-bold"
              :class="colors.icon"
            >
              {{ getIcon() }}
            </span>
          </div>
          
          <!-- Content -->
          <div class="ml-3 flex-1">
            <p class="font-semibold" :class="colors.title">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm" :class="colors.message">
              {{ message }}
            </p>
          </div>
          
          <!-- Close Button - Heuristic 3: User Control -->
          <button
            @click="handleClose"
            class="ml-4 flex-shrink-0 inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="colors.button"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div v-if="duration > 0" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              class="h-1 rounded-full animate-shrink"
              :class="colors.border.replace('border-', 'bg-')"
              :style="{ animationDuration: `${duration}ms` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Toast enter/leave transitions - Heuristic 1: Visual feedback */
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Progress bar animation */
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.animate-shrink {
  animation: shrink linear;
}
</style>
