<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { loadFromStorage, isLoggedIn, user } = useAuth()

const form = reactive({
  name: '',
  description: '',
  address: '',
  city: '',
  country: '',
  capacity: 0,
  phone: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  ticketPrice: '',
  category: ''
})

const submitting = ref(false)
const message = ref('')
const isSuccess = ref(false)

const startDateTime = computed(() => combineDateTime(form.startDate, form.startTime))
const endDateTime = computed(() => combineDateTime(form.endDate || form.startDate, form.endTime))

onMounted(() => {
  loadFromStorage()
  if (!isLoggedIn.value) {
    router.push('/LoginPage')
    return
  }

  const now = new Date()
  const start = new Date(now.getTime() + 60 * 60 * 1000)
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  form.startDate = start.toISOString().slice(0, 10)
  form.startTime = start.toISOString().slice(11, 16)
  form.endDate = end.toISOString().slice(0, 10)
  form.endTime = end.toISOString().slice(11, 16)
})

function combineDateTime(date: string, time: string) {
  if (!date || !time) return ''
  return `${date}T${time}`
}

function validateForm() {
  if (!form.name.trim()) return 'Event name is required'
  if (!startDateTime.value || !endDateTime.value) return 'Start and end date/time are required'
  if (new Date(endDateTime.value) <= new Date(startDateTime.value)) return 'End time must be after start time'
  return ''
}

async function handleSubmit() {
  message.value = ''
  isSuccess.value = false

  const validationError = validateForm()
  if (validationError) {
    message.value = validationError
    return
  }

  const token = user.value?.token || localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token')
  if (!token) {
    message.value = 'Please login again to create events.'
    router.push('/LoginPage')
    return
  }

  submitting.value = true
  try {
    const payload = {
      name: form.name,
      description: form.description,
      address: form.address,
      city: form.city,
      country: form.country,
      phone: form.phone,
      personLimit: form.capacity || 0,
      ticketPrice: form.ticketPrice ? Number(form.ticketPrice) : undefined,
      category: form.category || undefined,
      startDate: startDateTime.value,
      endDate: endDateTime.value
    }

    await $fetch('/api/events', {
      method: 'post',
      body: payload,
      headers: { Authorization: `Bearer ${token}` }
    })

    isSuccess.value = true
    message.value = 'Event created successfully!'
    setTimeout(() => router.push('/MyEventsPage'), 800)
  } catch (error: any) {
    console.error('Create event error', error)
    message.value = error?.data?.message || error?.response?._data?.message || error?.message || 'Failed to create event.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="main-container">
    <header class="create-event-header">
      <NuxtLink to="/" class="back-arrow"><i class="fa-solid fa-arrow-left"></i></NuxtLink>
      <div class="header-info">
        <h1>Create a New Event</h1>
        <p>Fill out details and publish your event</p>
      </div>
    </header>

    <!-- Stepper -->
    <div class="stepper">
      <div class="stepper-progress"><div class="stepper-progress-bar" style="width:33%"></div></div>
      <div class="step-item active" data-step="1"><div class="step-marker"></div><div class="step-name">Details</div></div>
      <div class="step-item" data-step="2"><div class="step-marker"></div><div class="step-name">Ticketing</div></div>
      <div class="step-item" data-step="3"><div class="step-marker"></div><div class="step-name">Review</div></div>
    </div>

    <!-- Step 1: Event Details -->
    <div id="step-1" class="step-content active">
      <h2 class="section-title">Event Details</h2>
      <form @submit.prevent="handleSubmit">
        <div v-if="message" :class="['alert', isSuccess ? 'success' : 'error']">
          {{ message }}
        </div>
        <div class="form-group">
          <label>Event Name <span>*</span></label>
          <input v-model="form.name" type="text" placeholder="Enter event name" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" placeholder="Tell attendees about your event" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Address</label>
            <input v-model="form.address" type="text" placeholder="123 Main St" />
          </div>
          <div class="form-group">
            <label>City/Town</label>
            <input v-model="form.city" type="text" placeholder="Bangkok" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Country</label>
            <input v-model="form.country" type="text" placeholder="Thailand" />
          </div>
          <div class="form-group">
            <label>People</label>
            <input v-model.number="form.capacity" type="number" placeholder="Limit People" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="form.phone" type="tel" placeholder="08x-xxx-xxxx" />
          </div>
          <div class="form-group">
            <label>Category</label>
            <input v-model="form.category" type="text" placeholder="Concert, Workshop..." />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input v-model="form.startDate" type="date" required />
          </div>
          <div class="form-group">
            <label>Start Time</label>
            <input v-model="form.startTime" type="time" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>End Date</label>
            <input v-model="form.endDate" type="date" required />
          </div>
          <div class="form-group">
            <label>End Time</label>
            <input v-model="form.endTime" type="time" required />
          </div>
        </div>

        <div class="form-group">
          <label>Ticket Price (THB)</label>
          <input v-model="form.ticketPrice" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>

        <div class="form-actions">
          <NuxtLink class="btn btn-secondary" to="/">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save & Continue' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.main-container { 
  --primary-blue: #2F80ED;
  --light-gray: #E0E0E0;
  --medium-gray: #BDBDBD;
  --dark-gray: #4F4F4F;
  --text-dark: #333;
  --text-light: #828282;
  --border-color: #CED4DA;
  --bg-color: #F8F9FA;
}

.main-container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
.create-event-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.back-arrow { font-size: 1.2rem; color: var(--text-dark); text-decoration: none; }
.header-info h1 { font-size: 1.6rem; margin: 0 0 4px; }
.header-info p { font-size: 0.9rem; color: var(--text-light); margin: 0; }

.stepper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; position: relative; }
.stepper-progress { position: absolute; top: 10px; left: 0; height: 2px; background: var(--light-gray); width: 100%; z-index: 1; }
.stepper-progress-bar { height: 100%; background: var(--primary-blue); width: 33%; }
.step-item { display: flex; flex-direction: column; align-items: center; z-index: 2; width: 80px; }
.step-marker { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2px solid var(--light-gray); margin-bottom: 8px; }
.step-item.active .step-marker { border-color: var(--primary-blue); background: var(--primary-blue); }
.step-name { font-size: 0.9rem; color: var(--medium-gray); }
.step-item.active .step-name { color: var(--text-dark); font-weight: 500; }

.step-content { background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #dee2e6; }
.section-title { font-size: 1.2rem; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border-color); }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 1rem; }
.form-row { display: flex; gap: 16px; }
.form-row .form-group { flex: 1; }
.form-actions { display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-top: 16px; }
.btn { padding: 10px 22px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 1rem; }
.btn-primary { background: var(--primary-blue); color: #fff; }
.btn-secondary { background: none; color: var(--text-light); text-decoration: none; }
.btn[disabled] { opacity: 0.7; cursor: not-allowed; }
.alert { padding: 12px; border-radius: 8px; margin-bottom: 16px; font-weight: 500; text-align: center; }
.alert.success { background: #22c55e; color: #fff; }
.alert.error { background: #ef4444; color: #fff; }
</style>
