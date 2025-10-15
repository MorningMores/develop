<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 sm:py-16">
    <div class="max-w-5xl mx-auto px-6">
      <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        About COSM
      </h1>
      <p class="mt-4 text-purple-200 leading-relaxed text-lg">
        COSM is your gateway to immersive entertainment experiences. We connect event creators with audiences seeking unforgettable moments in music, art, sports, and beyond.
      </p>

      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="font-semibold text-white text-xl">Discover</h3>
          <p class="mt-2 text-purple-200 text-sm">Browse upcoming events and find experiences that match your interests and passions.</p>
        </div>
        <div class="p-6 bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
          <div class="text-4xl mb-3">🎪</div>
          <h3 class="font-semibold text-white text-xl">Create</h3>
          <p class="mt-2 text-purple-200 text-sm">Host your own event and manage tickets, attendees, and create memorable experiences.</p>
        </div>
        <div class="p-6 bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
          <div class="text-4xl mb-3">🌐</div>
          <h3 class="font-semibold text-white text-xl">Connect</h3>
          <p class="mt-2 text-purple-200 text-sm">Stay in touch with your audience and build a vibrant, engaged community.</p>
        </div>
      </div>

      <div class="mt-12">
        <NuxtLink 
          to="/ContactPage" 
          class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105"
        >
          Contact Us
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>