<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { loadFromStorage, isLoggedIn, clearAuth } = useAuth()

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

const accountUrl = 'http://localhost:3000/concert/AccountPage'
const onSignOut = () => { clearAuth(); window.location.href = accountUrl }
</script>

<template>
  <div class="profile-page">
    <!-- Sidebar + Content Layout based on provided design -->
    <div class="profile-page-container">
      <!-- Sidebar Navigation -->
      <aside class="profile-sidebar">
        <h2>Account</h2>
        <nav class="sidebar-nav">
          <a class="active">Profile</a>
          <a>Security</a>
          <a>Notifications</a>
          <a id="nav-signout" :href="accountUrl" @click.prevent="onSignOut">Sign Out</a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="profile-content">
        <h2>My Profile</h2>

        <div v-if="message" class="alert">{{ message }}</div>
        <div v-if="loading" class="muted">Loading...</div>

        <div v-else>
          <section class="form-subsection">
            <h3>Account</h3>
            <div class="grid-2">
              <div>
                <p class="label">Username</p>
                <p class="value">{{ username || '-' }}</p>
              </div>
              <div>
                <p class="label">Email</p>
                <p class="value">{{ email || '-' }}</p>
              </div>
            </div>
          </section>

          <section class="form-subsection">
            <h3>Personal Info</h3>
            <div v-if="profile" class="grid-2">
              <div>
                <p class="label">First Name</p>
                <p class="value">{{ profile.firstName || '-' }}</p>
              </div>
              <div>
                <p class="label">Last Name</p>
                <p class="value">{{ profile.lastName || '-' }}</p>
              </div>
              <div>
                <p class="label">Phone</p>
                <p class="value">{{ profile.phone || '-' }}</p>
              </div>
              <div>
                <p class="label">Pincode</p>
                <p class="value">{{ profile.pincode || '-' }}</p>
              </div>
              <div class="col-2">
                <p class="label">Address</p>
                <p class="value">{{ profile.address || '-' }}</p>
              </div>
              <div>
                <p class="label">City</p>
                <p class="value">{{ profile.city || '-' }}</p>
              </div>
              <div>
                <p class="label">Country</p>
                <p class="value">{{ profile.country || '-' }}</p>
              </div>
            </div>
            <div v-else class="muted">No personal info yet.</div>
          </section>

          <div class="actions">
            <NuxtLink to="/AccountPage" class="btn">Edit Profile</NuxtLink>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.profile-page-container { display: flex; gap: 30px; }
.profile-sidebar { flex: 0 0 250px; }
.profile-sidebar h2 { font-size: 1.5rem; background: #f0f0f0; padding: 20px; margin: 0; border-radius: 8px 8px 0 0; font-weight: 600; }
.sidebar-nav { display: flex; flex-direction: column; background: #f9f9f9; border-radius: 0 0 8px 8px; padding: 10px 0; }
.sidebar-nav a { text-decoration: none; color: #333; padding: 15px 20px; font-weight: 500; border-left: 3px solid transparent; cursor: pointer; }
.sidebar-nav a.active, .sidebar-nav a:hover { background: #f0f0f0; color: #4A90E2; border-left: 3px solid #4A90E2; }
#nav-signout { margin-top: 10px; padding-top: 15px; border-top: 1px solid #EAEAEA; color: #dc3545; font-weight: 600; }
#nav-signout:hover { background: #f8d7da; border-left-color: #dc3545; color: #dc3545; }

.profile-content { flex: 1; background: #fff; padding: 30px; border: 1px solid #EAEAEA; border-radius: 8px; }
.profile-content h2 { font-size: 2rem; font-weight: 600; margin-bottom: 20px; }

.form-subsection { margin-bottom: 24px; }
.form-subsection h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #EAEAEA; }
.label { color: #666; font-size: 0.9rem; }
.value { font-weight: 600; color: #333; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.col-2 { grid-column: span 2; }
.muted { color: #666; }
.alert { background: #ef4444; color: #fff; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px; }
.actions { margin-top: 16px; }
.btn { display: inline-block; background: #4A90E2; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none; }
</style>
