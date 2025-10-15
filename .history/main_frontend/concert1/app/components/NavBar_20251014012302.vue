<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import Login from '~/components/Login.vue'
import Register from '~/components/Register.vue'

const router = useRouter()
const { loadFromStorage, isLoggedIn, clearAuth } = useAuth()
const { success } = useToast()
const showLogoutModal = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const isMenuOpen = ref(false)

onMounted(() => {
  loadFromStorage()
})

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function openLogin() {
  showLoginModal.value = true
  isMenuOpen.value = false
}

function openRegister() {
  showRegisterModal.value = true
  isMenuOpen.value = false
}

function closeLogin() {
  showLoginModal.value = false
}

function closeRegister() {
  showRegisterModal.value = false
}

function handleLogout() {
  showLogoutModal.value = true
}

function confirmLogout() {
  clearAuth()
  localStorage.removeItem('profile_data')
  showLogoutModal.value = false
  success('Logged out successfully', 'Goodbye!')
  router.push('/')
}

function cancelLogout() {
  showLogoutModal.value = false
}
</script>

<template>
  <!-- Modern COSM Header -->
  <header class="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/70 border-b border-purple-500/20">
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
          <NuxtLink to="/" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            Home
          </NuxtLink>
          <NuxtLink to="/ProductPage" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            Events
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/MyEventsPage" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            My Events
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/MyBookingsPage" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            My Bookings
          </NuxtLink>
          <NuxtLink to="/AboutUS" class="px-4 py-2 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            About
          </NuxtLink>
        </nav>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-3">
          <!-- Logged Out State -->
          <template v-if="!isLoggedIn">
            <button 
              @click="openLogin" 
              class="hidden md:block px-5 py-2.5 text-purple-200 hover:text-white border border-purple-400/50 hover:border-purple-400 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button 
              @click="openRegister" 
              class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Join COSM
            </button>
          </template>

          <!-- Logged In State -->
          <template v-else>
            <NuxtLink 
              to="/CreateEventPage"
              class="hidden md:block px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              Create Event
            </NuxtLink>
            <NuxtLink 
              to="/AccountPage"
              class="hidden md:block px-4 py-2 text-purple-200 hover:text-white border border-purple-400/50 hover:border-purple-400 rounded-xl transition-all"
            >
              Account
            </NuxtLink>
            <button 
              @click="handleLogout" 
              class="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all"
            >
              🚪 Logout
            </button>
          </template>
          
          <!-- Mobile Menu Button -->
          <button @click="toggleMenu" class="md:hidden text-purple-200 hover:text-white p-2">
            <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div v-if="isMenuOpen" class="md:hidden py-4 space-y-2 border-t border-purple-500/20">
          <NuxtLink to="/" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            Home
          </NuxtLink>
          <NuxtLink to="/ProductPage" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            Events
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/MyEventsPage" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            My Events
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/MyBookingsPage" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            My Bookings
          </NuxtLink>
          <NuxtLink to="/AboutUS" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
            About
          </NuxtLink>
          
          <!-- Mobile Auth Buttons -->
          <template v-if="!isLoggedIn">
            <button @click="openLogin" class="w-full text-left px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              Sign In
            </button>
            <button @click="openRegister" class="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold">
              Join COSM
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/CreateEventPage" @click="toggleMenu" class="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-center">
              Create Event
            </NuxtLink>
            <NuxtLink to="/AccountPage" @click="toggleMenu" class="block px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all">
              Account
            </NuxtLink>
          </template>
        </div>
      </transition>
    </div>
  </header>

  <!-- Login Modal -->
  <transition name="fade">
    <div v-if="showLoginModal" @click="closeLogin" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div @click.stop class="w-full max-w-md">
        <div class="relative">
          <button @click="closeLogin" class="absolute top-4 right-4 z-10 text-purple-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Login />
        </div>
      </div>
    </div>
  </transition>

  <!-- Register Modal -->
  <transition name="fade">
    <div v-if="showRegisterModal" @click="closeRegister" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div @click.stop class="w-full max-w-md">
        <div class="relative">
          <button @click="closeRegister" class="absolute top-4 right-4 z-10 text-purple-300 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Register />
        </div>
      </div>
    </div>
  </transition>

  <!-- Logout Confirmation Modal -->
  <LogoutModal 
    :show="showLogoutModal" 
    @confirm="confirmLogout" 
    @cancel="cancelLogout" 
  />
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>