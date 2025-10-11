<script setup lang="ts">
// Placeholder for fetching user's events
</script>

<template>
  <div class="main-content container">
    <div class="page-header">
      <h2>My Events</h2>
      <NuxtLink to="/CreateEventPage" class="btn-create">Create Event</NuxtLink>
    </div>

    <div class="user-event-list">
      <NuxtLink to="/EditEventPage" class="user-event-card">
        <div class="event-info">
          <h3>Lakeside Camping</h3>
          <p>NOV 25 - 26 | 6:30 AM - 7:30 PM</p>
        </div>
        <div class="event-status">
          <span class="status-tag">Published</span>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </NuxtLink>

      <NuxtLink to="/EditEventPage" class="user-event-card">
        <div class="event-info">
          <h3>Soccer team meetup</h3>
          <p>DEC 08 | 6:30 PM - 9:30 PM</p>
        </div>
        <div class="event-status">
          <span class="status-tag">Published</span>
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.main-content { padding: 20px 0; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-header h2 { font-size: 2rem; font-weight: 600; margin: 0; }
.btn-create { background: linear-gradient(45deg, #2B293D 0%, #4e4a71 100%); color: #fff; border: none; padding: 10px 16px; border-radius: 8px; text-decoration: none; }
.user-event-list { display: grid; gap: 16px; }
.user-event-card { background: #fff; border-radius: 8px; border: 1px solid #EAEAEA; box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 16px; display: flex; justify-content: space-between; align-items: center; text-decoration: none; color: #333; }
.user-event-card:hover { transform: translateY(-2px); transition: .2s; }
.event-info h3 { font-size: 1.2rem; margin-bottom: 4px; }
.event-info p { color: #666; }
.event-status { display: flex; align-items: center; gap: 12px; }
.status-tag { background: #28a745; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
</style>
