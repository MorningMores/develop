<script setup lang="ts">
import { ref } from "vue";

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return;
  message.value = ''
  isSuccess.value = false

  if (!username.value || !email.value || !password.value) {
    message.value = 'Please fill all fields';
    return;
  }
  if (!/.+@.+\..+/.test(email.value)) {
    message.value = 'Please enter a valid email';
    return;
  }
  if (password.value.length < 6) {
    message.value = 'Password must be at least 6 characters';
    return;
  }

  try {
    isLoading.value = true
    const res: any = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
      }
    })

    if (res?.token || !res?.message) {
      isSuccess.value = true
      message.value = 'Registered successfully! Please login.'
      await navigateTo('/LoginPage')
      return
    }

    message.value = res.message || 'Registration failed!'
  } catch (err: any) {
    console.error('Register error:', err);
    const msg = err?.data?.message || err?.response?.data?.message || err?.message || 'Registration failed!';
    message.value = msg
  } finally {
    isLoading.value = false
  }
};

</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-md">
      <div class="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 w-full p-8 rounded-2xl shadow-2xl">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Join COSM
          </h2>
          <p class="text-purple-200 mt-2">Start your immersive journey today</p>
        </div>

        <div v-if="message" :class="[
          'px-4 py-3 rounded-lg mb-4 text-center backdrop-blur-sm border',
          isSuccess 
            ? 'bg-green-500/20 text-green-200 border-green-500/30' 
            : 'bg-red-500/20 text-red-200 border-red-500/30'
          ]">
          <p>{{ message }}</p>
        </div>

        <div class="space-y-5">
          <div>
            <label for="username" class="block text-sm font-medium text-purple-200 mb-2">
              Username
            </label>
            <input 
              v-model="username" 
              type="text" 
              id="username" 
              placeholder="Choose a unique username" 
              class="w-full py-3 px-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-purple-200 mb-2">
              Email Address
            </label>
            <input 
              v-model="email" 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              class="w-full py-3 px-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :disabled="isLoading"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-purple-200 mb-2">
              Password
            </label>
            <input 
              v-model="password" 
              type="password" 
              id="password" 
              placeholder="At least 6 characters" 
              class="w-full py-3 px-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :disabled="isLoading"
            />
          </div>
        </div>
        
        <div class="flex items-start mt-6">
          <input 
            id="terms" 
            type="checkbox" 
            class="h-4 w-4 mt-0.5 text-purple-500 bg-slate-900/50 border-purple-500/30 rounded focus:ring-purple-500 focus:ring-offset-slate-800"
            :disabled="isLoading"
          />
          <label for="terms" class="ml-3 text-sm text-purple-200">
            I agree to the 
            <a href="#" class="text-purple-400 hover:text-pink-400 transition-colors font-medium">
              Terms and Conditions
            </a>
          </label>
        </div>

        <div class="mt-8">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account</span>
          </button>
        </div>
        
        <p class="mt-8 text-center text-sm text-purple-200">
          Already a member?
          <NuxtLink to="/LoginPage" class="font-semibold text-purple-400 hover:text-pink-400 transition-colors ml-1">
            Sign In
          </NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>