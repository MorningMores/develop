<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductTag from '~/components/ProductTag.vue'

interface Event {
  id: string;
  name: string;
  datestart: string;
  dateend: string;
  personlimit: number;
  description: string;
}

const route = useRoute()
const router = useRouter()

const allEvents = ref<Event[]>([])
const pageSize = 8
const currentPage = ref<number>(parseInt((route.params.page as string) || '1', 10) || 1)

async function fetchEvents() {
  const { data } = await useFetch<Event[]>(`/api/product/data`)
  if (data.value) allEvents.value = data.value
}

const totalPages = computed(() => Math.max(1, Math.ceil(allEvents.value.length / pageSize)))

const pagedEvents = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return allEvents.value.slice(start, start + pageSize)
})

watch(() => route.params.page, (val) => {
  const n = parseInt((val as string) || '1', 10) || 1
  currentPage.value = Math.min(Math.max(1, n), totalPages.value)
})

onMounted(() => {
  fetchEvents()
})

function goToPage(n: number) {
  if (n < 1 || n > totalPages.value) return
  router.push(`/ProductPage/${n}`)
}
</script>

<template>
  <div class="bg-white rounded shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <section class="my-16">
        <div class="text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Upcoming Events</h2>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-500">See what's trending and join the excitement.</p>
        </div>

        <div class="mt-8 mb-12 flex items-center justify-center">
          <ProductTag />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="event in pagedEvents" :key="event.id">
            <ProductCard :event="event" />
          </div>
        </div>

        <div class="mt-12 flex items-center justify-center gap-2">
          <button class="btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
          <button v-for="n in totalPages" :key="n" class="btn" :class="{ active: n === currentPage }" @click="goToPage(n)">{{ n }}</button>
          <button class="btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.btn { padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #e5e7eb; font-size: 0.875rem; }
.btn.active { background-color: #4f46e5; color: #fff; border-color: #4f46e5; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
