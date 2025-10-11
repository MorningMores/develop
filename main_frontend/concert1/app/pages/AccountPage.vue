<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { loadFromStorage, isLoggedIn, clearAuth } = useAuth()

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const address = ref('')
const city = ref('')
const country = ref('')
const pincode = ref('')

const message = ref('')
const isSuccess = ref(false)

const activeSection = ref<'account' | 'email' | 'password'>('account')

const newEmail = ref('')
const confirmEmail = ref('')
const emailMessage = ref('')
const emailSuccess = ref(false)

const newPassword = ref('')
const confirmPassword = ref('')
const passwordMessage = ref('')
const passwordSuccess = ref(false)

onMounted(() => {
  if (!process.client) return

  loadFromStorage()
  if (!isLoggedIn.value) {
    navigateTo('/LoginPage')
    return
  }

  try {
    const saved = localStorage.getItem('profile_data')
    if (saved) {
      const p = JSON.parse(saved)
      email.value = p.email || localStorage.getItem('user_email') || sessionStorage.getItem('user_email') || ''
      firstName.value = p.firstName || ''
      lastName.value = p.lastName || ''
      phone.value = p.phone || ''
      address.value = p.address || ''
      city.value = p.city || ''
      country.value = p.country || ''
      pincode.value = p.pincode || ''
    } else {
      email.value = localStorage.getItem('user_email') || sessionStorage.getItem('user_email') || ''
    }
  } catch (err) {
    console.warn('Failed to load cached profile', err)
  }
})

function resetMessages() {
  message.value = ''
  isSuccess.value = false
  emailMessage.value = ''
  emailSuccess.value = false
  passwordMessage.value = ''
  passwordSuccess.value = false
}

function setSection(section: 'account' | 'email' | 'password') {
  activeSection.value = section
  resetMessages()
}

function buildPayload() {
  return {
    firstName: firstName.value,
    lastName: lastName.value,
    phone: phone.value || '',
    address: address.value,
    city: city.value,
    country: country.value,
    pincode: pincode.value || '',
  }
}

async function handleSubmit() {
  message.value = ''
  isSuccess.value = false

  if (!firstName.value || !lastName.value) {
    message.value = 'Please provide your first and last name'
    return
  }

  try {
    const token = localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token') || ''
    await $fetch('/api/users/me', {
      method: 'PUT',
      body: buildPayload(),
      headers: { Authorization: `Bearer ${token}` }
    })

    localStorage.setItem('profile_data', JSON.stringify({ ...buildPayload(), email: email.value }))
    localStorage.setItem('profile_completed', 'true')

    isSuccess.value = true
    message.value = 'Profile saved successfully'
  } catch (e: any) {
    console.error('Save profile error', e)
    message.value = e?.data?.message || 'Failed to save profile'
  }
}

function handleEmailSubmit() {
  emailMessage.value = ''
  emailSuccess.value = false

  if (!newEmail.value || !confirmEmail.value) {
    emailMessage.value = 'Please fill in both email fields.'
    return
  }
  if (newEmail.value !== confirmEmail.value) {
    emailMessage.value = 'Email addresses do not match.'
    return
  }

  // Placeholder until backend endpoint is available
  emailSuccess.value = true
  emailMessage.value = 'Email change request submitted.'
  newEmail.value = ''
  confirmEmail.value = ''
}

function handlePasswordSubmit() {
  passwordMessage.value = ''
  passwordSuccess.value = false

  if (!newPassword.value || !confirmPassword.value) {
    passwordMessage.value = 'Please fill in both password fields.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordMessage.value = 'Passwords do not match.'
    return
  }
  if (newPassword.value.length < 8) {
    passwordMessage.value = 'Password must be at least 8 characters.'
    return
  }

  // Placeholder until backend endpoint exists
  passwordSuccess.value = true
  passwordMessage.value = 'Password update submitted.'
  newPassword.value = ''
  confirmPassword.value = ''
}

function onSignOut() {
  clearAuth()
  localStorage.removeItem('profile_data')
  navigateTo('/LoginPage')
}
</script>

<template>
  <div class="account-page">
    <div class="profile-page-container">
      <aside class="profile-sidebar">
        <h2>Account Settings</h2>
        <nav class="sidebar-nav">
          <button type="button" class="nav-link" :class="{ active: activeSection === 'account' }" @click="setSection('account')">Account Info</button>
          <button type="button" class="nav-link" :class="{ active: activeSection === 'email' }" @click="setSection('email')">Change Email</button>
          <button type="button" class="nav-link" :class="{ active: activeSection === 'password' }" @click="setSection('password')">Password</button>
          <button type="button" class="nav-link signout" @click="onSignOut">Sign Out</button>
        </nav>
      </aside>

      <main class="profile-content">
        <section class="form-section" :class="{ active: activeSection === 'account' }">
          <h1>Account Information</h1>

          <div v-if="message" :class="['alert', isSuccess ? 'success' : 'error']">
            {{ message }}
          </div>

          <div class="profile-photo-section">
            <h3>Profile Photo</h3>
            <div class="photo-uploader">
              <i class="fa-solid fa-user user-icon"></i>
              <button type="button" class="camera-btn">
                <i class="fa-solid fa-camera"></i>
              </button>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="form-stack">
            <div class="form-subsection">
              <h3>Profile Information</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="first-name">First Name</label>
                  <input id="first-name" v-model="firstName" type="text" placeholder="Enter first name" />
                </div>
                <div class="form-group">
                  <label for="last-name">Last Name</label>
                  <input id="last-name" v-model="lastName" type="text" placeholder="Enter last name" />
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" placeholder="Enter email" disabled />
              </div>
            </div>

            <div class="form-subsection">
              <h3>Contact Details</h3>
              <p class="form-description">These details are private and only used to contact you for ticketing or prizes.</p>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input id="phone" v-model="phone" type="text" placeholder="Enter phone number" />
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input id="address" v-model="address" type="text" placeholder="Enter address" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="city">City/Town</label>
                  <input id="city" v-model="city" type="text" placeholder="Enter city" />
                </div>
                <div class="form-group">
                  <label for="country">Country</label>
                  <input id="country" v-model="country" type="text" placeholder="Enter country" />
                </div>
              </div>
              <div class="form-group">
                <label for="pincode">Pincode</label>
                <input id="pincode" v-model="pincode" type="text" placeholder="Enter pincode" />
              </div>
            </div>

            <button type="submit" class="btn-primary">Save My Profile</button>
          </form>
        </section>

        <section class="form-section" :class="{ active: activeSection === 'email' }">
          <h1>Change Email</h1>
          <div v-if="emailMessage" :class="['alert', emailSuccess ? 'success' : 'error']">{{ emailMessage }}</div>
          <form @submit.prevent="handleEmailSubmit" class="form-stack">
            <p class="current-email-display">Current Email: <span>{{ email || 'Not available' }}</span></p>
            <div class="form-group">
              <label for="new-email">New Email</label>
              <input id="new-email" v-model="newEmail" type="email" placeholder="Enter new email" />
            </div>
            <div class="form-group">
              <label for="confirm-email">Confirm Email</label>
              <input id="confirm-email" v-model="confirmEmail" type="email" placeholder="Enter again" />
            </div>
            <button type="submit" class="btn-primary">Save New Email</button>
          </form>
        </section>

        <section class="form-section" :class="{ active: activeSection === 'password' }">
          <h1>Change Password</h1>
          <div v-if="passwordMessage" :class="['alert', passwordSuccess ? 'success' : 'error']">{{ passwordMessage }}</div>
          <form @submit.prevent="handlePasswordSubmit" class="form-stack">
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input id="new-password" v-model="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div class="form-group">
              <label for="confirm-password">Confirm New Password</label>
              <input id="confirm-password" v-model="confirmPassword" type="password" placeholder="Enter again" />
            </div>
            <button type="submit" class="btn-primary">Save New Password</button>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.account-page { background-color: #fff; padding: 40px 0; font-family: 'Poppins', sans-serif; color: #333; }
.profile-page-container { display: flex; max-width: 1200px; margin: 0 auto; gap: 30px; padding: 0 20px; }

.profile-sidebar { flex: 0 0 250px; }
.profile-sidebar h2 { font-size: 1.5rem; background: #f0f0f0; padding: 20px; margin: 0; border-radius: 8px 8px 0 0; font-weight: 600; }
.sidebar-nav { display: flex; flex-direction: column; background: #f9f9f9; border-radius: 0 0 8px 8px; padding: 10px 0; }
.nav-link { text-align: left; background: transparent; border: none; padding: 15px 20px; font-weight: 500; color: #333; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s ease; }
.nav-link:hover, .nav-link.active { background: #f0f0f0; color: #4A90E2; border-left-color: #4A90E2; }
.nav-link.signout { margin-top: 10px; padding-top: 15px; border-top: 1px solid #EAEAEA; color: #dc3545; font-weight: 600; }
.nav-link.signout:hover { background: #f8d7da; border-left-color: #dc3545; color: #dc3545; }

.profile-content { flex: 1; background: #fff; border: 1px solid #EAEAEA; border-radius: 8px; padding: 30px; }
.profile-content h1 { font-size: 2rem; font-weight: 600; margin-bottom: 24px; }

.form-section { display: none; }
.form-section.active { display: block; }
.alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-weight: 500; text-align: center; }
.alert.success { background: #22c55e; color: #fff; }
.alert.error { background: #ef4444; color: #fff; }

.profile-photo-section { margin-bottom: 30px; }
.profile-photo-section h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 15px; }
.photo-uploader { width: 120px; height: 120px; border-radius: 50%; background: #e9ecef; display: flex; align-items: center; justify-content: center; position: relative; }
.user-icon { font-size: 3rem; color: #adb5bd; }
.camera-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #dee2e6; background: #fff; display: flex; align-items: center; justify-content: center; position: absolute; right: 0; bottom: 0; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

.form-stack { display: flex; flex-direction: column; gap: 24px; }
.form-subsection h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #EAEAEA; }
.form-description { font-size: 0.9rem; color: #666; margin-bottom: 16px; }
.form-row { display: flex; gap: 20px; flex-wrap: wrap; }
.form-row .form-group { flex: 1; min-width: 0; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 500; color: #495057; }
.form-group input { padding: 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 1rem; font-family: 'Poppins', sans-serif; }
.form-group input:disabled { background: #f8f9fa; color: #6c757d; }

.btn-primary { background: #343a40; color: #fff; border: none; border-radius: 6px; padding: 14px 24px; font-weight: 600; cursor: pointer; transition: background 0.2s ease; }
.btn-primary:hover { background: #495057; }

.current-email-display { font-size: 0.95rem; color: #666; }
.current-email-display span { color: #333; font-weight: 500; }

@media (max-width: 960px) {
  .profile-page-container { flex-direction: column; }
  .profile-sidebar { flex: none; }
}
</style>