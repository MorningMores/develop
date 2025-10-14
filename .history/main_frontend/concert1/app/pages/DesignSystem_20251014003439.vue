<!-- Design System Component Library -->
<script setup>
// This component serves as a design system showcase
// Import this in other components to maintain consistency
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">EventHub Design System</h1>

    <!-- Color Palette -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Color Palette</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <!-- Primary Colors -->
        <div>
          <p class="text-sm font-medium mb-2">Primary</p>
          <div class="bg-indigo-500 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium">
            #6366f1
          </div>
        </div>
        
        <!-- Secondary -->
        <div>
          <p class="text-sm font-medium mb-2">Secondary</p>
          <div class="bg-pink-500 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium">
            #ec4899
          </div>
        </div>
        
        <!-- Success -->
        <div>
          <p class="text-sm font-medium mb-2">Success</p>
          <div class="bg-green-500 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium">
            #10b981
          </div>
        </div>
        
        <!-- Warning -->
        <div>
          <p class="text-sm font-medium mb-2">Warning</p>
          <div class="bg-amber-500 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium">
            #f59e0b
          </div>
        </div>
        
        <!-- Error -->
        <div>
          <p class="text-sm font-medium mb-2">Error</p>
          <div class="bg-red-500 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium">
            #ef4444
          </div>
        </div>
      </div>
    </section>

    <!-- Typography -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Typography</h2>
      <div class="space-y-2">
        <p class="text-4xl font-bold">Heading 1 - Bold 36px</p>
        <p class="text-3xl font-bold">Heading 2 - Bold 30px</p>
        <p class="text-2xl font-semibold">Heading 3 - Semibold 24px</p>
        <p class="text-xl font-semibold">Heading 4 - Semibold 20px</p>
        <p class="text-lg font-medium">Body Large - Medium 18px</p>
        <p class="text-base">Body - Regular 16px</p>
        <p class="text-sm text-gray-600">Body Small - Regular 14px</p>
        <p class="text-xs text-gray-500">Caption - Regular 12px</p>
      </div>
    </section>

    <!-- Buttons -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Buttons</h2>
      <div class="flex flex-wrap gap-4">
        <!-- Primary -->
        <button class="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-md">
          Primary Button
        </button>
        
        <!-- Secondary -->
        <button class="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors shadow-md">
          Secondary Button
        </button>
        
        <!-- Outline -->
        <button class="px-6 py-3 border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 font-medium rounded-lg transition-colors">
          Outline Button
        </button>
        
        <!-- Ghost -->
        <button class="px-6 py-3 text-indigo-500 hover:bg-indigo-50 font-medium rounded-lg transition-colors">
          Ghost Button
        </button>
        
        <!-- Disabled -->
        <button class="px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed" disabled>
          Disabled Button
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-4 items-center">
        <button class="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg">
          Small
        </button>
        <button class="px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg">
          Medium
        </button>
        <button class="px-8 py-4 bg-indigo-500 text-white text-lg font-medium rounded-lg">
          Large
        </button>
      </div>
    </section>

    <!-- Form Inputs -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Form Inputs</h2>
      <div class="max-w-md space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Default Input</label>
          <input 
            type="text" 
            placeholder="Enter text..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">With Icon</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search events..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Error State</label>
          <input 
            type="text" 
            placeholder="Invalid input" 
            class="w-full px-4 py-2 border-2 border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
          <p class="text-sm text-red-500 mt-1">This field is required</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Success State</label>
          <input 
            type="text" 
            value="Valid input" 
            class="w-full px-4 py-2 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <p class="text-sm text-green-500 mt-1">✓ Looks good!</p>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Cards</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Basic Card -->
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-lg font-semibold mb-2">Basic Card</h3>
          <p class="text-gray-600">Simple card with shadow and rounded corners</p>
        </div>
        
        <!-- Card with Image -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div class="h-32 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2">Image Card</h3>
            <p class="text-gray-600">Card with image header</p>
          </div>
        </div>
        
        <!-- Outlined Card -->
        <div class="border-2 border-indigo-500 rounded-xl p-6 hover:bg-indigo-50 transition-colors">
          <h3 class="text-lg font-semibold mb-2">Outlined Card</h3>
          <p class="text-gray-600">Card with colored border</p>
        </div>
      </div>
    </section>

    <!-- Badges & Pills -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Badges & Status</h2>
      <div class="flex flex-wrap gap-3">
        <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          ✓ Confirmed
        </span>
        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
          ⏱ Pending
        </span>
        <span class="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          ✗ Cancelled
        </span>
        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          🎟 Active
        </span>
        <span class="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
          📅 Upcoming
        </span>
        <span class="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
          🔥 Popular
        </span>
      </div>
    </section>

    <!-- Loading States -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Loading States</h2>
      <div class="space-y-4">
        <!-- Spinner -->
        <div class="flex items-center gap-4">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <span>Loading spinner</span>
        </div>
        
        <!-- Skeleton -->
        <div class="space-y-3 max-w-md">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
        
        <!-- Progress Bar -->
        <div class="max-w-md">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-indigo-500 h-2 rounded-full w-2/3 transition-all"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alerts & Toasts -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Alerts</h2>
      <div class="space-y-4 max-w-2xl">
        <!-- Success -->
        <div class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <div class="flex items-start">
            <span class="text-2xl mr-3">✓</span>
            <div>
              <p class="font-semibold text-green-800">Success</p>
              <p class="text-green-700">Your booking has been confirmed!</p>
            </div>
          </div>
        </div>
        
        <!-- Warning -->
        <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
          <div class="flex items-start">
            <span class="text-2xl mr-3">⚠</span>
            <div>
              <p class="font-semibold text-amber-800">Warning</p>
              <p class="text-amber-700">Only 5 tickets remaining for this event.</p>
            </div>
          </div>
        </div>
        
        <!-- Error -->
        <div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div class="flex items-start">
            <span class="text-2xl mr-3">✗</span>
            <div>
              <p class="font-semibold text-red-800">Error</p>
              <p class="text-red-700">Failed to process booking. Please try again.</p>
            </div>
          </div>
        </div>
        
        <!-- Info -->
        <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div class="flex items-start">
            <span class="text-2xl mr-3">ℹ</span>
            <div>
              <p class="font-semibold text-blue-800">Information</p>
              <p class="text-blue-700">Event details have been updated by the organizer.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Additional custom animations if needed */
</style>
