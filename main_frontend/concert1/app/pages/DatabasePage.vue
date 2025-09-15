<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Database Page</h1>
      <button
        class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="refresh"
      >
        Refresh
      </button>
    </div>

    <div v-if="pending" class="py-10 text-gray-600">Loading users...</div>

    <div v-else-if="error" class="py-4 px-3 rounded bg-red-100 text-red-700">
      <p class="font-medium">Failed to load users</p>
      <p class="text-sm break-all">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <div v-if="users?.length" class="overflow-x-auto border rounded">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(u, i) in users" :key="u.id ?? i">
              <td class="px-4 py-2 text-sm text-gray-600">{{ i + 1 }}</td>
              <td class="px-4 py-2 text-sm">{{ u.username || '-' }}</td>
              <td class="px-4 py-2 text-sm">{{ u.email || '-' }}</td>
              <td class="px-4 py-2 text-sm">{{ u.name || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="py-10 text-gray-600">No users found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id?: number
  username?: string
  email?: string
  name?: string
}

const { data, pending, error, refresh } = await useFetch<User[]>(
  'http://localhost:8080/api/users',
  {
    // Fetch on client to avoid SSR CORS issues in dev
    server: false,
    // Simple error handling
    onRequest({ options }) {
      // Could attach auth header here if needed
      // options.headers = { ...options.headers, Authorization: `Bearer ${token}` }
    }
  }
)

const users = computed(() => data.value || [])
const errorMessage = computed(() => {
  if (!error.value) return ''
  // Try to unwrap common error shapes
  return (error.value as any)?.data?.message || (error.value as any)?.message || String(error.value)
})
</script>
