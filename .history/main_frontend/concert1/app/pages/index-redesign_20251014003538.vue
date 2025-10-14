<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State management
const currentSlide = ref(0)
const isLoading = ref(true)
const featuredEvents = ref([])
const upcomingEvents = ref([])

// Hero slides with event-focused content
const heroSlides = [
  {
    id: 1,
    title: 'Welcome to EventHub',
    subtitle: 'Your Gateway to Unforgettable Experiences',
    description: 'Discover concerts, festivals, and live events happening near you',
    buttonText: 'Browse Events',
    link: '/ProductPage',
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🎵'
  },
  {
    id: 2,
    title: 'Live Music This Weekend',
    subtitle: 'Don\'t Miss Out',
    description: 'Exclusive lineup of artists performing in your city',
    buttonText: 'See Lineup',
    link: '/ProductPage',
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '🎸'
  },
  {
    id: 3,
    title: 'Early Bird Tickets',
    subtitle: 'Save Up to 30%',
    description: 'Book now and get the best seats at discounted prices',
    buttonText: 'Get Tickets',
    link: '/ProductPage',
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🎫'
  }
]

// Category quick links
const categories = [
  { name: 'Concerts', icon: '🎤', color: 'bg-indigo-500', count: '24 events' },
  { name: 'Festivals', icon: '🎉', color: 'bg-pink-500', count: '12 events' },
  { name: 'Theater', icon: '🎭', color: 'bg-purple-500', count: '8 events' },
  { name: 'Sports', icon: '⚽', color: 'bg-green-500', count: '15 events' },
  { name: 'Comedy', icon: '😂', color: 'bg-amber-500', count: '6 events' },
  { name: 'Workshops', icon: '🎨', color: 'bg-blue-500', count: '10 events' }
]

// Featured benefits
const benefits = [
  {
    icon: '🎟️',
    title: 'Secure Booking',
    description: 'Safe and encrypted payment processing'
  },
  {
    icon: '📱',
    title: 'Mobile Tickets',
    description: 'Access your tickets anytime, anywhere'
  },
  {
    icon: '🔔',
    title: 'Event Alerts',
    description: 'Get notified about events you love'
  },
  {
    icon: '💳',
    title: 'Easy Refunds',
    description: 'Hassle-free cancellation policy'
  }
]

let autoplayInterval = null

// Heuristic 1: Visibility of System Status - Loading indicator
onMounted(async () => {
  // Simulate loading events
  setTimeout(() => {
    isLoading.value = false
  }, 1000)

  // Auto-advance carousel
  autoplayInterval = setInterval(() => {
    nextSlide()
  }, 5000)

  // Keyboard shortcut: '/' to focus search
  document.addEventListener('keydown', handleKeyboardShortcut)
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
  document.removeEventListener('keydown', handleKeyboardShortcut)
})

// Heuristic 7: Flexibility and Efficiency - Keyboard shortcuts
const handleKeyboardShortcut = (e) => {
  if (e.key === '/' && e.target.tagName !== 'INPUT') {
    e.preventDefault()
    // Focus search input (implement when search component exists)
  }
}

// Carousel controls
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + heroSlides.length) % heroSlides.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Heuristic 3: User Control and Freedom - Easy navigation
const navigateTo = (path) => {
  router.push(path)
}

// Computed property for current slide
const activeSlide = computed(() => heroSlides[currentSlide.value])
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Heuristic 1: Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Loading amazing events for you...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Hero Section with Carousel -->
      <section class="relative bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl">
            <!-- Carousel Container -->
            <div class="relative h-[400px] md:h-[500px]">
              <!-- Slides -->
              <TransitionGroup name="slide-fade">
                <div
                  v-for="(slide, index) in heroSlides"
                  :key="slide.id"
                  v-show="currentSlide === index"
                  class="absolute inset-0 w-full h-full"
                >
                  <!-- Heuristic 8: Aesthetic and Minimalist Design - Clean gradient background -->
                  <div 
                    class="w-full h-full flex items-center justify-center"
                    :style="{ background: slide.image }"
                  >
                    <div class="text-center text-white px-6 max-w-3xl">
                      <!-- Heuristic 2: Match Between System and Real World - Clear, friendly language -->
                      <div class="text-6xl mb-4 animate-bounce">{{ slide.icon }}</div>
                      <h1 class="text-4xl md:text-5xl font-bold mb-3">
                        {{ slide.title }}
                      </h1>
                      <p class="text-xl md:text-2xl font-semibold mb-2 text-white/90">
                        {{ slide.subtitle }}
                      </p>
                      <p class="text-lg mb-8 text-white/80">
                        {{ slide.description }}
                      </p>
                      
                      <!-- Heuristic 6: Recognition Rather Than Recall - Clear CTA button -->
                      <button
                        @click="navigateTo(slide.link)"
                        class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                      >
                        {{ slide.buttonText }} →
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Heuristic 3: User Control - Navigation Controls -->
              <button
                @click="prevSlide"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
                aria-label="Previous slide"
              >
                <span class="text-2xl">←</span>
              </button>
              
              <button
                @click="nextSlide"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10"
                aria-label="Next slide"
              >
                <span class="text-2xl">→</span>
              </button>

              <!-- Slide Indicators -->
              <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                <button
                  v-for="(slide, index) in heroSlides"
                  :key="index"
                  @click="goToSlide(index)"
                  class="w-3 h-3 rounded-full transition-all"
                  :class="currentSlide === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'"
                  :aria-label="`Go to slide ${index + 1}`"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Search Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Heuristic 2: Familiar Search Pattern -->
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Events
              </label>
              <input
                type="text"
                placeholder="Concert, Festival, Artist..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📍 Location
              </label>
              <input
                type="text"
                placeholder="City or venue..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div class="flex items-end">
              <button class="w-full md:w-auto px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors shadow-md">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <!-- Heuristic 6: Recognition - Visual category cards -->
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button
            v-for="category in categories"
            :key="category.name"
            @click="navigateTo('/ProductPage')"
            class="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all transform hover:scale-105 group"
          >
            <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {{ category.icon }}
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ category.name }}</h3>
            <p class="text-sm text-gray-500">{{ category.count }}</p>
          </button>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="bg-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose EventHub?</h2>
            <p class="text-lg text-gray-600">The easiest way to discover and book amazing events</p>
          </div>
          
          <!-- Heuristic 2: Real-world benefits -->
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              v-for="benefit in benefits"
              :key="benefit.title"
              class="text-center"
            >
              <div class="text-5xl mb-4">{{ benefit.icon }}</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ benefit.title }}</h3>
              <p class="text-gray-600">{{ benefit.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-gradient-to-r from-indigo-500 to-pink-500 py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Something Amazing?
          </h2>
          <p class="text-xl mb-8 text-white/90">
            Join thousands of event-goers and never miss out on the action
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="navigateTo('/ProductPage')"
              class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Browse All Events
            </button>
            <button
              @click="navigateTo('/RegisterPage')"
              class="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-indigo-600 transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      <!-- Heuristic 10: Help - Quick Tips Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <div class="flex items-start">
            <span class="text-3xl mr-4">💡</span>
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-2">New to EventHub?</h3>
              <p class="text-blue-800 mb-4">
                Discover how easy it is to find and book tickets for your favorite events. 
                Use our search bar above or browse by category to get started!
              </p>
              <button class="text-blue-600 font-semibold hover:text-blue-700">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Carousel Transitions - Heuristic 1: Visual feedback */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Smooth animations */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}
</style>
