<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const show2 = ref(false)
const currentSlide = ref(0)
const isMenuOpen = ref(false)

const slides = [
  {
    id: 1,
    title: 'COSM Experience',
    subtitle: 'Immersive Entertainment Awaits',
    description: 'Step into extraordinary worlds of music, art, and wonder',
    buttonText: 'Explore Events',
    link: '/ProductPage',
    gradient: 'linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #6b46c1 100%)',
    image: '🌌'
  },
  {
    id: 2,
    title: 'Reserve Your Journey',
    subtitle: 'Exclusive Immersive Experiences',
    description: 'Premium concerts, festivals & interactive performances',
    buttonText: 'Book Now',
    link: '/ProductPage',
    gradient: 'linear-gradient(135deg, #0a0e27 0%, #1e3a8a 50%, #3b82f6 100%)',
    image: '✨'
  },
  {
    id: 3,
    title: 'Limited Availability',
    subtitle: 'Secure Your Spot Today',
    description: 'Early access to the most anticipated events of the season',
    buttonText: 'View Calendar',
    link: '/ProductPage',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    image: '🎭'
  }
]

const categories = [
  { name: 'Immersive Concerts', icon: '🎵', count: '24 Events', color: 'from-purple-600 to-blue-600' },
  { name: 'Visual Art Shows', icon: '🎨', count: '18 Events', color: 'from-pink-600 to-purple-600' },
  { name: 'Interactive Theater', icon: '🎭', count: '12 Events', color: 'from-indigo-600 to-purple-600' },
  { name: 'VR Experiences', icon: '🥽', count: '15 Events', color: 'from-blue-600 to-cyan-600' },
  { name: 'Music Festivals', icon: '🎪', count: '8 Events', color: 'from-violet-600 to-purple-600' },
  { name: 'Light Installations', icon: '💫', count: '20 Events', color: 'from-fuchsia-600 to-pink-600' }
]

let intervalId = null

const click = () => {
  show.value = !show.value
  if (show.value) show2.value = false
}

const click2 = () => {
  show2.value = !show2.value
  if (show2.value) show.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  intervalId = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="">
    <!-- Navigation Header -->
    
    <!-- Modals -->
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" @click.self="show = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all" @click.stop>
          <Login @close="show = false" />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="show2" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" @click.self="show2 = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all" @click.stop>
          <Register @close="show2 = false" />
        </div>
      </div>
    </transition>

    <!-- Hero Carousel Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="relative rounded-3xl overflow-hidden shadow-2xl">
        <!-- Carousel Container -->
        <div class="relative h-[500px] sm:h-[600px]">
          <!-- Slides -->
          <transition-group name="slide">
            <div
              v-for="(slide, index) in slides"
              :key="slide.id"
              v-show="currentSlide === index"
              class="absolute inset-0 w-full h-full"
            >
              <div 
                class="w-full h-full bg-gradient-to-r flex items-center justify-center"
                :style="{ background: slide.gradient }"
              >
                <div class="text-center text-white px-6 max-w-3xl">
                  <h2 class="text-5xl sm:text-6xl font-bold mb-6 animate-fade-in">
                    {{ slide.title }}
                  </h2>
                  <p class="text-xl sm:text-2xl mb-8 opacity-90">
                    {{ slide.description }}
                  </p>
                  <NuxtLink 
                    :to="slide.link"
                    class="inline-block px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    {{ slide.buttonText }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </transition-group>

          <!-- Navigation Arrows -->
          <button 
            @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-3 backdrop-blur-sm transition-all duration-200 z-10"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Indicators -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <button
              v-for="(slide, index) in slides"
              :key="slide.id"
              @click="currentSlide = index"
              class="transition-all duration-200"
              :class="currentSlide === index ? 'w-12 bg-white' : 'w-3 bg-white bg-opacity-50 hover:bg-opacity-75'"
              style="height: 12px; border-radius: 6px;"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Links Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink 
          to="/ProductPage"
          class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="relative z-10">
            <h3 class="text-3xl font-bold mb-3">Browse Products</h3>
            <p class="text-blue-100 mb-4">Discover our amazing collection</p>
            <span class="inline-flex items-center text-sm font-semibold">
              Explore Now
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </NuxtLink>

        <NuxtLink 
          to="/ProductPageDetail/1"
          class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-8 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div class="relative z-10">
            <h3 class="text-3xl font-bold mb-3">Product Details</h3>
            <p class="text-purple-100 mb-4">View detailed information</p>
            <span class="inline-flex items-center text-sm font-semibold">
              View Details
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.6s ease;
}

.slide-leave-active {
  transition: all 0.6s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

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

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>