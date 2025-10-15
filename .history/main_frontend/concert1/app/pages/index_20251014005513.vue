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
    gradient: 'linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #6b46c1 100%)'
  },
  {
    id: 2,
    title: 'Reserve Your Journey',
    subtitle: 'Exclusive Immersive Experiences',
    description: 'Premium concerts, festivals & interactive performances',
    buttonText: 'Book Now',
    link: '/ProductPage',
    gradient: 'linear-gradient(135deg, #0a0e27 0%, #1e3a8a 50%, #3b82f6 100%)'
  },
  {
    id: 3,
    title: 'Limited Availability',
    subtitle: 'Secure Your Spot Today',
    description: 'Early access to the most anticipated events of the season',
    buttonText: 'View Calendar',
    link: '/ProductPage',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)'
  }
]

const categories = [
  { name: 'Immersive Concerts', icon: 'music', count: '24 Events', color: 'from-purple-600 to-blue-600' },
  { name: 'Visual Art Shows', icon: 'palette', count: '18 Events', color: 'from-pink-600 to-purple-600' },
  { name: 'Interactive Theater', icon: 'theater', count: '12 Events', color: 'from-indigo-600 to-purple-600' },
  { name: 'VR Experiences', icon: 'vr', count: '15 Events', color: 'from-blue-600 to-cyan-600' },
  { name: 'Music Festivals', icon: 'festival', count: '8 Events', color: 'from-violet-600 to-purple-600' },
  { name: 'Light Installations', icon: 'sparkle', count: '20 Events', color: 'from-fuchsia-600 to-pink-600' }
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
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
    <!-- Modern Cosmic Header -->
    <header class="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-purple-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                COSM
              </h1>
              <p class="text-xs text-purple-300/70">Immersive Entertainment</p>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <NuxtLink to="/ProductPage" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              Events
            </NuxtLink>
            <NuxtLink to="/MyBookingsPage" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              My Reservations
            </NuxtLink>
            <NuxtLink to="/AboutUS" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              About
            </NuxtLink>
          </nav>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-3">
            <button 
              @click="click" 
              class="hidden md:block px-5 py-2.5 text-purple-200 hover:text-white border border-purple-400/50 hover:border-purple-400 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button 
              @click="click2" 
              class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Join COSM
            </button>
            
            <!-- Mobile Menu Button -->
            <button @click="toggleMenu" class="md:hidden text-purple-200 hover:text-white p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <transition name="slide-down">
          <div v-if="isMenuOpen" class="md:hidden py-4 space-y-2 border-t border-purple-500/20">
            <NuxtLink to="/ProductPage" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              Events
            </NuxtLink>
            <NuxtLink to="/MyBookingsPage" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              My Reservations
            </NuxtLink>
            <NuxtLink to="/AboutUS" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              About
            </NuxtLink>
            <button @click="click" class="w-full text-left px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              Sign In
            </button>
          </div>
        </transition>
      </div>
    </header>

    <!-- Login/Register Modals -->
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="show = false">
        <div class="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl shadow-purple-500/50 max-w-md w-full transform transition-all border border-purple-500/30" @click.stop>
          <Login @close="show = false" />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="show2" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="show2 = false">
        <div class="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl shadow-2xl shadow-purple-500/50 max-w-md w-full transform transition-all border border-purple-500/30" @click.stop>
          <Register @close="show2 = false" />
        </div>
      </div>
    </transition>

    <!-- Hero Carousel Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/30 border border-purple-500/20">
          <!-- Carousel Container -->
          <div class="relative h-[500px] sm:h-[600px]">
            <!-- Animated Background Stars -->
            <div class="absolute inset-0 opacity-30">
              <div class="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div class="absolute top-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
              <div class="absolute bottom-32 left-32 w-1 h-1 bg-pink-300 rounded-full animate-pulse" style="animation-delay: 1s"></div>
              <div class="absolute bottom-20 right-40 w-2 h-2 bg-blue-300 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
            </div>

            <!-- Slides -->
            <transition-group name="slide">
              <div
                v-for="(slide, index) in slides"
                :key="slide.id"
                v-show="currentSlide === index"
                class="absolute inset-0 w-full h-full"
              >
                <div 
                  class="w-full h-full flex items-center justify-center relative"
                  :style="{ background: slide.gradient }"
                >
                  <div class="text-center text-white px-6 max-w-4xl z-10">
                    <p class="text-sm uppercase tracking-wider text-purple-200 mb-2 font-semibold">
                      {{ slide.subtitle }}
                    </p>
                    <h2 class="text-5xl sm:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                      {{ slide.title }}
                    </h2>
                    <p class="text-xl sm:text-2xl mb-10 opacity-90 leading-relaxed">
                      {{ slide.description }}
                    </p>
                    <NuxtLink 
                      :to="slide.link"
                      class="inline-block px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-purple-100 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50"
                    >
                      {{ slide.buttonText }} →
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </transition-group>

            <!-- Navigation Arrows -->
            <button 
              @click="prevSlide"
              class="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all duration-200 z-20 border border-white/20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              @click="nextSlide"
              class="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all duration-200 z-20 border border-white/20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Slide Indicators -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
              <button
                v-for="(slide, index) in slides"
                :key="slide.id"
                @click="currentSlide = index"
                class="transition-all duration-300 rounded-full"
                :class="currentSlide === index ? 'w-12 h-3 bg-white' : 'w-3 h-3 bg-white/40 hover:bg-white/60'"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Categories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h2 class="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Immersive Experiences
        </h2>
        <p class="text-xl text-purple-200/80">
          Explore extraordinary events that blur the line between reality and imagination
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.name"
          class="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
          :class="category.color"
        >
          <!-- Glowing effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="text-5xl mb-4 group-hover:scale-110 transition-transform">{{ category.icon }}</div>
            <h3 class="text-2xl font-bold text-white mb-2">{{ category.name }}</h3>
            <p class="text-purple-100/70 font-semibold">{{ category.count }}</p>
          </div>

          <!-- Corner accent -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform"></div>
        </div>
      </div>
    </section>

    <!-- Why Choose COSM Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-3xl p-12 backdrop-blur-xl border border-purple-500/20">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">
            Why Choose COSM?
          </h2>
          <p class="text-xl text-purple-200/80">
            Your gateway to unforgettable immersive entertainment
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-5xl mb-4">🎟️</div>
            <h3 class="text-xl font-bold text-white mb-2">Secure Reservations</h3>
            <p class="text-purple-200/70">Guaranteed entry with encrypted booking system</p>
          </div>
          <div class="text-center">
            <div class="text-5xl mb-4">📱</div>
            <h3 class="text-xl font-bold text-white mb-2">Digital Tickets</h3>
            <p class="text-purple-200/70">Contactless entry via mobile QR codes</p>
          </div>
          <div class="text-center">
            <div class="text-5xl mb-4">🔔</div>
            <h3 class="text-xl font-bold text-white mb-2">Event Alerts</h3>
            <p class="text-purple-200/70">Never miss your favorite experiences</p>
          </div>
          <div class="text-center">
            <div class="text-5xl mb-4">💳</div>
            <h3 class="text-xl font-bold text-white mb-2">Flexible Refunds</h3>
            <p class="text-purple-200/70">Easy cancellation up to 48 hours before</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="relative overflow-hidden rounded-3xl p-16 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-2xl shadow-purple-500/50">
        <!-- Animated background -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl animate-blob"></div>
          <div class="absolute bottom-0 right-0 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl animate-blob" style="animation-delay: 2s"></div>
        </div>

        <div class="relative z-10">
          <h2 class="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Experience the Extraordinary?
          </h2>
          <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of adventurers exploring immersive entertainment. Reserve your spot today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/ProductPage"
              class="px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-purple-100 transform hover:scale-105 transition-all shadow-xl"
            >
              Browse Events
            </NuxtLink>
            <button 
              @click="click2"
              class="px-10 py-4 bg-purple-900/50 backdrop-blur-sm text-white border-2 border-white rounded-full font-bold text-lg hover:bg-purple-900 transform hover:scale-105 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modern Footer -->
    <footer class="mt-20 border-t border-purple-500/20 bg-slate-950/50 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="text-4xl">🌌</div>
              <div>
                <h3 class="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  COSM
                </h3>
                <p class="text-sm text-purple-300/70">Immersive Entertainment Platform</p>
              </div>
            </div>
            <p class="text-purple-200/70 mb-4 max-w-md">
              Discover and reserve extraordinary immersive experiences. From concerts to installations, we bring you closer to the art.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-purple-300 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="text-purple-300 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" class="text-purple-300 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-white font-bold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/ProductPage" class="text-purple-200/70 hover:text-white transition-colors">Browse Events</NuxtLink></li>
              <li><NuxtLink to="/MyBookingsPage" class="text-purple-200/70 hover:text-white transition-colors">My Reservations</NuxtLink></li>
              <li><NuxtLink to="/CreateEventPage" class="text-purple-200/70 hover:text-white transition-colors">Create Event</NuxtLink></li>
              <li><NuxtLink to="/AboutUS" class="text-purple-200/70 hover:text-white transition-colors">About Us</NuxtLink></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-bold mb-4">Support</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-purple-200/70 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" class="text-purple-200/70 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" class="text-purple-200/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-purple-200/70 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="pt-8 border-t border-purple-500/20 text-center text-purple-200/60">
          <p>&copy; 2025 COSM. All rights reserved. Powered by immersive technology.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Slide transition for carousel */
.slide-enter-active {
  transition: all 0.8s ease;
}
.slide-leave-active {
  transition: all 0.8s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Slide down for mobile menu */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom animations */
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

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1e1b4b;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
}
</style>
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