<script setup>
import { ref } from 'vue'

const props = defineProps({
  error: Object
})

const goHome = () => {
  navigateTo('/concert/')
}

const goBack = () => {
  window.history.back()
}

const errorCode = ref(props.error?.statusCode || 404)
const errorMessage = ref(props.error?.message || 'Page Not Found')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full text-center">
      <!-- Animated Cosmic Background -->
      <div class="absolute inset-0 opacity-20 overflow-hidden">
        <div class="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div class="absolute top-40 right-32 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
        <div class="absolute bottom-32 left-40 w-1 h-1 bg-pink-300 rounded-full animate-pulse" style="animation-delay: 1s"></div>
        <div class="absolute bottom-48 right-24 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
        <div class="absolute top-64 left-64 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <!-- Error Content -->
      <div class="relative z-10">
        <!-- Error Code with Glow Effect -->
        <div class="mb-8 animate-fade-in">
          <h1 class="text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl animate-pulse">
            {{ errorCode }}
          </h1>
          <div class="w-32 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mx-auto rounded-full"></div>
        </div>

        <!-- Error Message -->
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6 animate-fade-in" style="animation-delay: 0.2s">
          {{ errorCode === 404 ? 'Lost in the Cosmos' : 'Something Went Wrong' }}
        </h2>
        
        <p class="text-xl text-purple-200/80 mb-12 max-w-lg mx-auto animate-fade-in" style="animation-delay: 0.4s">
          {{ errorCode === 404 
            ? 'The page you\'re looking for has drifted into another dimension.' 
            : errorMessage || 'An unexpected error occurred in our immersive universe.' }}
        </p>

        <!-- Floating Cosmic Illustration -->
        <div class="mb-12 flex justify-center animate-float">
          <svg class="w-64 h-64 text-purple-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style="animation-delay: 0.6s">
          <button
            @click="goHome"
            class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to COSM
          </button>
          
          <button
            @click="goBack"
            class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-purple-400/50 hover:border-purple-400 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        <!-- Help Text -->
        <p class="mt-12 text-purple-300/60 text-sm animate-fade-in" style="animation-delay: 0.8s">
          Need assistance? <NuxtLink to="/AboutUS" class="text-purple-400 hover:text-purple-300 underline">Contact Support</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
  animation-fill-mode: both;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
