<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { loadFromStorage, isLoggedIn } = useAuth()

const loading = ref(true)
const message = ref('')

const username = ref('')
const email = ref('')
const profile = ref<{ firstName?: string; lastName?: string; phone?: string; address?: string; city?: string; country?: string; pincode?: string } | null>(null)

onMounted(async () => {
  loadFromStorage()
  if (!isLoggedIn.value) {
    message.value = 'Please login to view your profile'
    loading.value = false
    return
  }
  try {
    const token = localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || ''
    const me: any = await $fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    username.value = me?.username || ''
    email.value = me?.email || ''

    // Load additional profile data from local cache (saved in AccountPage)
    const saved = localStorage.getItem('profile_data')
    profile.value = saved ? JSON.parse(saved) : null
  } catch (e: any) {
    console.error('Load profile error', e)
    message.value = e?.data?.message || 'Failed to load profile'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12 sm:py-16">
    <div class="max-w-3xl mx-auto px-6">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">My Profile</h1>

      <div v-if="message" class="mt-4 px-3 py-2 rounded bg-red-500/20 border border-red-500/30 text-red-300">{{ message }}</div>

      <div v-if="loading" class="mt-6 text-purple-300">Loading...</div>

      <div v-else class="mt-8 space-y-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-lg font-semibold text-gray-800">Account</h2>
          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Username</p>
              <p class="font-medium text-gray-800">{{ username || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium text-gray-800">{{ email || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h2 class="text-lg font-semibold text-gray-800">Personal Info</h2>
          <div v-if="profile" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">First Name</p>
              <p class="font-medium text-gray-800">{{ profile.firstName || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Last Name</p>
              <p class="font-medium text-gray-800">{{ profile.lastName || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium text-gray-800">{{ profile.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Pincode</p>
              <p class="font-medium text-gray-800">{{ profile.pincode || '-' }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-sm text-gray-500">Address</p>
              <p class="font-medium text-gray-800">{{ profile.address || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">City</p>
              <p class="font-medium text-gray-800">{{ profile.city || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Country</p>
              <p class="font-medium text-gray-800">{{ profile.country || '-' }}</p>
            </div>
          </div>
          <div v-else class="mt-3 text-gray-500">No personal info yet.</div>
        </div>

        <div class="mt-8">
          <NuxtLink to="/AccountPage" class="inline-block bg-indigo-600 text-white px-5 py-2 rounded-md font-medium hover:bg-indigo-700">Edit Profile</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
