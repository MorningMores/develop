<script setup>
// Heuristic 5: Error Prevention - Confirmation before destructive actions
// Heuristic 3: User Control and Freedom - Clear exit options

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'danger', 'info'
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmButtonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

// Get icon based on type
const getIcon = () => {
  switch (props.type) {
    case 'danger':
      return '⚠️'
    case 'warning':
      return '❓'
    case 'info':
      return 'ℹ️'
    default:
      return '❓'
  }
}

// Get button styles based on type
const getConfirmButtonClass = () => {
  if (props.confirmButtonClass) {
    return props.confirmButtonClass
  }
  
  switch (props.type) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600 text-white'
    case 'info':
      return 'bg-indigo-500 hover:bg-indigo-600 text-white'
    default:
      return 'bg-indigo-500 hover:bg-indigo-600 text-white'
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

// Close on Escape key - Heuristic 7: Efficiency
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    handleCancel()
  }
}
</script>

<template>
  <!-- Heuristic 3: Easy exit - Click outside or X button to close -->
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="handleCancel"
      @keydown="handleKeyDown"
      tabindex="0"
    >
      <div 
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-modal-enter"
        @click.stop
      >
        <!-- Header with close button -->
        <div class="flex justify-between items-start p-6 border-b border-gray-200">
          <div class="flex items-center">
            <span class="text-4xl mr-3">{{ getIcon() }}</span>
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
          </div>
          <button
            @click="handleCancel"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Message Body -->
        <div class="p-6">
          <p class="text-gray-600 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <!-- Action Buttons - Heuristic 4: Consistent button placement -->
        <div class="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
          <!-- Cancel button (secondary action) on left -->
          <button
            @click="handleCancel"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
          >
            {{ cancelText }}
          </button>
          
          <!-- Confirm button (primary action) on right -->
          <button
            @click="handleConfirm"
            class="flex-1 px-6 py-3 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md"
            :class="getConfirmButtonClass()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal transitions - Heuristic 1: Visual feedback for system state */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animate modal content */
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-enter {
  animation: modal-enter 0.3s ease-out;
}

/* Focus ring for accessibility */
button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
</style>
