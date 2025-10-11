<script setup lang="ts">
import { ref } from 'vue'

// Form model (skeleton aligned to provided design)
const form = ref({
  name: '',
  description: '',
  address: '',
  city: '',
  country: '',
  capacity: 0,
  phone: '',
  date: ''
})

const handleSubmit = () => {
  // TODO: wire to backend via Nuxt server route, e.g., /api/events (POST)
  console.log('Submit event', form.value)
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
            <label>Date</label>
            <input v-model="form.date" type="date" />
          </div>
        </div>

        <div class="form-actions">
          <NuxtLink class="btn btn-secondary" to="/">Cancel</NuxtLink>
          <button type="submit" class="btn btn-primary">Save & Continue</button>
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
</style>
