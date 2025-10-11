<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/ProductPage/1')
})
</script>

<template>
  <div class="p-8 text-center text-gray-600">Loading products…</div>
</template>