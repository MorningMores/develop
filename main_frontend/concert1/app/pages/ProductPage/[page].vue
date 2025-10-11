<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Event {
  id: string;
  name: string;
  datestart: string;
  dateend: string;
  personlimit: number;
  description: string;
  ticketPrice?: number | null;
  price?: number | null;
  category?: string | null;
  type?: string | null;
}

const route = useRoute()
const router = useRouter()

const allEvents = ref<Event[]>([])
const pageSize = 6
const currentPage = ref<number>(parseInt((route.params.page as string) || '1', 10) || 1)

const filters = ['All', 'Today', 'Tomorrow', 'This Weekend', 'Free'] as const
type FilterType = typeof filters[number]
const activeFilter = ref<FilterType>('All')

const categories = [
  { label: 'Entertainment', image: 'https://picsum.photos/id/1011/200/200' },
  { label: 'Educational & Business', image: 'https://picsum.photos/id/1076/200/200' },
  { label: 'Cultural & Arts', image: 'https://picsum.photos/id/10/200/200' },
  { label: 'Sports & Fitness', image: 'https://picsum.photos/id/146/200/200' },
  { label: 'Technology & Innovation', image: 'https://picsum.photos/id/180/200/200' },
  { label: 'Travel & Adventure', image: 'https://picsum.photos/id/20/200/200' }
]

async function fetchEvents() {
  try {
    const res: any = await $fetch('/api/events', { query: { page: 0, size: 200 } })
    const items = Array.isArray(res) ? res : (res?.content ?? [])
    allEvents.value = items as Event[]
  } catch (e) {
    console.error('Failed to load events', e)
    allEvents.value = []
  }
}

function toDate(value?: string | null): Date | null {
  if (!value) return null
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  const ms = numeric > 1e12 ? numeric : numeric * 1000
  const parsed = new Date(ms)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

function eventOverlaps(event: Event, rangeStart: Date, rangeEnd: Date) {
  const start = toDate(event.datestart)
  const end = toDate(event.dateend) ?? start
  if (!start) return false
  const effectiveEnd = end ?? start
  return start < rangeEnd && effectiveEnd >= rangeStart
}

const filteredEvents = computed(() => {
  const base = allEvents.value
  if (activeFilter.value === 'All') {
    return base
  }

  const todayStart = startOfDay(new Date())
  const tomorrowStart = addDays(todayStart, 1)
  const tomorrowEnd = addDays(tomorrowStart, 1)

  if (activeFilter.value === 'Today') {
    return base.filter((event) => eventOverlaps(event, todayStart, addDays(todayStart, 1)))
  }

  if (activeFilter.value === 'Tomorrow') {
    return base.filter((event) => eventOverlaps(event, tomorrowStart, tomorrowEnd))
  }

  if (activeFilter.value === 'This Weekend') {
    const dayOfWeek = todayStart.getDay()
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7
    const weekendStart = addDays(todayStart, daysUntilSaturday)
    const weekendEnd = addDays(weekendStart, 2)
    return base.filter((event) => eventOverlaps(event, weekendStart, weekendEnd))
  }

  if (activeFilter.value === 'Free') {
    const freeEvents = base.filter((event) => {
      const price = event.ticketPrice ?? event.price ?? (event as Record<string, unknown>).ticket_price
      if (price === null || price === undefined) return false
      const numeric = Number(price)
      return Number.isFinite(numeric) && numeric <= 0
    })
    return freeEvents.length ? freeEvents : base
  }

  return base
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEvents.value.length / pageSize)))

const pagedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEvents.value.slice(start, start + pageSize)
})

watch(() => route.params.page, (val) => {
  const n = parseInt((val as string) || '1', 10) || 1
  currentPage.value = Math.min(Math.max(1, n), totalPages.value)
})

watch(totalPages, (next) => {
  if (currentPage.value > next) {
    goToPage(next)
  }
})

watch(activeFilter, () => {
  if (currentPage.value !== 1) {
    goToPage(1)
  }
})

onMounted(() => {
  fetchEvents()
})

function goToPage(n: number) {
  if (n < 1 || n > totalPages.value) return
  router.push(`/ProductPage/${n}`)
}

function formatMonthLabel(event: Event) {
  const date = toDate(event.datestart)
  return date ? date.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '--'
}

function formatDayRange(event: Event) {
  const start = toDate(event.datestart)
  const end = toDate(event.dateend)
  if (!start) return '--'
  if (!end || start.toDateString() === end.toDateString()) {
    return start.getDate().toString().padStart(2, '0')
  }
  return `${start.getDate().toString().padStart(2, '0')} - ${end.getDate().toString().padStart(2, '0')}`
}

function formatTimeRange(event: Event) {
  const start = toDate(event.datestart)
  const end = toDate(event.dateend)
  if (!start) return 'Schedule coming soon'
  const startTime = start.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  if (!end) return startTime
  const endTime = end.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${startTime} - ${endTime}`
}

function formatInterested(event: Event) {
  const seats = Number(event.personlimit)
  if (!Number.isFinite(seats) || seats <= 0) {
    return 'Capacity available'
  }
  return `${seats} Seats Remaining`
}

function categoryMeta(event: Event) {
  const raw = (event.category ?? event.type ?? '').toString()
  const normalized = raw.toLowerCase()
  const tagClassMap: Record<string, string> = {
    'travel': 'travel',
    'travel & adventure': 'travel',
    'cultural': 'cultural',
    'cultural & arts': 'cultural',
    'arts': 'cultural',
    'education': 'education',
    'educational & business': 'education',
    'business': 'education',
    'sports': 'sports',
    'sports & fitness': 'sports',
  }

  return {
    label: raw || 'General',
    className: tagClassMap[normalized] ?? 'general'
  }
}

const hasEvents = computed(() => pagedEvents.value.length > 0)
</script>

<template>
  <div class="product-page">
    <section class="section categories">
      <div class="section-container">
        <h2>Explore Categories</h2>
        <div class="category-list">
          <div v-for="category in categories" :key="category.label" class="category-item">
            <img :src="category.image" :alt="category.label" loading="lazy" />
            <p>{{ category.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section popular-events">
      <div class="section-container">
        <h2>Popular Events</h2>
        <div class="event-filters">
          <button
            v-for="filter in filters"
            :key="filter"
            class="filter-btn"
            :class="{ active: filter === activeFilter }"
            type="button"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>

        <div v-if="hasEvents" class="event-grid">
          <div v-for="event in pagedEvents" :key="event.id" class="event-card">
            <div class="card-header">
              <span class="tag" :class="categoryMeta(event).className">{{ categoryMeta(event).label }}</span>
              <button type="button" class="interest-btn" aria-label="Add to interested">
                <i class="fa-regular fa-star" />
              </button>
            </div>
            <div class="card-content">
              <div class="date">
                <span class="month">{{ formatMonthLabel(event) }}</span>
                <span class="day">{{ formatDayRange(event) }}</span>
              </div>
              <div class="details">
                <h3>{{ event.name }}</h3>
                <p class="description line-clamp">{{ event.description }}</p>
                <p class="time">{{ formatTimeRange(event) }}</p>
                <p class="interested">
                  <i class="fa-solid fa-star" />
                  {{ formatInterested(event) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No events match this filter just yet. Try a different filter or check back soon.</p>
        </div>

        <div class="pagination-controls">
          <button type="button" class="nav-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            Previous
          </button>
          <span class="page-indicator">Page {{ currentPage }} of {{ totalPages }}</span>
          <button type="button" class="nav-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>

        <div class="see-more">
          <button
            type="button"
            class="btn-secondary"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            See More
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.product-page {
  --primary-color: #4A90E2;
  --dark-blue: #2C2C3E;
  --text-dark: #333;
  --text-light: #666;
  --border-color: #EAEAEA;
  --bg-light: #F9F9F9;
  color: var(--text-dark);
  font-family: 'Poppins', sans-serif;
}

.section {
  width: 100%;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
}

.categories {
  padding: 3.5rem 0;
}

.category-list {
  display: flex;
  justify-content: space-around;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.category-item {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.category-item img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.75rem;
  transition: transform 0.3s ease;
}

.category-item:hover img {
  transform: scale(1.05);
}

.category-item p {
  font-weight: 500;
}

.popular-events {
  background-color: var(--bg-light);
  padding: 3.5rem 0;
}

.event-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.filter-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-light);
  transition: all 0.3s ease;
}

.filter-btn.active,
.filter-btn:hover {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.event-card {
  background-color: #fff;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  color: #fff;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.tag.travel {
  background-color: #007991;
}

.tag.cultural {
  background-color: #7b4397;
}

.tag.education {
  background-color: #d35400;
}

.tag.sports {
  background-color: #27ae60;
}

.tag.general {
  background-color: var(--primary-color);
}

.interest-btn {
  background: none;
  border: none;
  color: var(--text-light);
  font-size: 1.25rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.interest-btn:hover {
  color: var(--primary-color);
}

.card-content {
  display: flex;
  gap: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.date {
  text-align: center;
  color: var(--primary-color);
  min-width: 70px;
}

.month {
  font-size: 0.85rem;
  font-weight: 600;
}

.day {
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1;
}

.details h3 {
  font-size: 1.2rem;
  margin-bottom: 0.35rem;
}

.details p {
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 0.35rem;
}

.details .interested {
  color: var(--text-dark);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.see-more {
  text-align: center;
  margin-top: 2.5rem;
}

.btn-secondary {
  background-color: #fff;
  color: var(--text-dark);
  border: 1px solid var(--border-color);
  padding: 0.85rem 2.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-secondary:hover:enabled {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.nav-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-dark);
  transition: all 0.3s ease;
}

.nav-btn:hover:enabled {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.95rem;
  color: var(--text-light);
}

.empty-state {
  background-color: #fff;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  padding: 2rem;
  text-align: center;
  color: var(--text-light);
}

.line-clamp {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  h2 {
    font-size: 1.75rem;
  }

  .card-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .date {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .day {
    font-size: 1.5rem;
  }
}
</style>
