<script setup lang="ts">
import { ref } from 'vue'

const deleting = ref(false)
</script>

<template>
  <div class="main-container">
    <header class="create-event-header">
      <NuxtLink to="/MyEventsPage" class="back-arrow"><i class="fa-solid fa-arrow-left"></i></NuxtLink>
      <div class="header-info">
        <h1>Edit Event</h1>
        <p>Update details, tickets, and publish</p>
      </div>
    </header>

    <div class="stepper">
      <div class="stepper-progress"><div class="stepper-progress-bar" style="width:66%"></div></div>
      <div class="step-item completed"><div class="step-marker"></div><div class="step-name">Details</div></div>
      <div class="step-item active"><div class="step-marker"></div><div class="step-name">Ticketing</div></div>
      <div class="step-item"><div class="step-marker"></div><div class="step-name">Review</div></div>
    </div>

    <div id="step-2" class="step-content active">
      <h2 class="section-title">Tickets</h2>
      <div class="form-actions">
        <button class="btn btn-danger" @click="deleting = true">Delete Event</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleting" class="modal-overlay">
      <div class="modal-content">
        <h2>Delete this event?</h2>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="btn-modal-secondary" @click="deleting = false">Cancel</button>
          <button class="btn-modal-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root { --primary-blue:#2F80ED; --danger-red:#dc3545; --light-gray:#E0E0E0; --medium-gray:#BDBDBD; --text-dark:#333; --text-light:#828282; --border-color:#CED4DA; }
.main-container { max-width: 900px; margin: 20px auto; padding: 0 20px; }
.create-event-header { display:flex; align-items:center; gap:20px; margin-bottom: 20px; }
.back-arrow { font-size: 1.2rem; color:#333; text-decoration:none; }
.stepper { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; position:relative; }
.stepper-progress { position:absolute; top:10px; left:0; height:2px; background:var(--light-gray); width:100%; z-index:1; }
.stepper-progress-bar { height:100%; background:var(--primary-blue); width:66%; }
.step-item { display:flex; flex-direction:column; align-items:center; z-index:2; width:80px; }
.step-marker { width:20px; height:20px; border-radius:50%; background:#fff; border:2px solid var(--light-gray); margin-bottom:8px; }
.step-item.active .step-marker, .step-item.completed .step-marker { border-color:var(--primary-blue); background:var(--primary-blue); }
.step-name { font-size:.9rem; color:var(--medium-gray); }
.step-content { background:#fff; padding:24px; border-radius:8px; border:1px solid #dee2e6; }
.form-actions { display:flex; justify-content:flex-end; align-items:center; gap:12px; }
.btn { padding: 10px 22px; border-radius:6px; border:none; cursor:pointer; font-weight:600; font-size:1rem; }
.btn-primary { background:var(--primary-blue); color:#fff; }
.btn-danger { background: var(--danger-red); color:#fff; }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; justify-content:center; align-items:center; }
.modal-content { background:#fff; padding:24px; border-radius:8px; width:90%; max-width:400px; }
.modal-actions { display:flex; justify-content:center; gap:12px; margin-top:16px; }
.btn-modal-secondary { background:#e9ecef; border:1px solid #ced4da; padding:10px 18px; border-radius:6px; }
.btn-modal-danger { background: var(--danger-red); color:#fff; padding:10px 18px; border:none; border-radius:6px; }
</style>
