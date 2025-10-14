<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const { saveAuth, loadFromStorage, shouldCompleteProfile } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const message = ref('')
const isSuccess = ref(false)

onMounted(() => {
  if (process.client) {
    loadFromStorage()
    const remembered = localStorage.getItem('remember_me') === 'true'
    if (remembered) {
      rememberMe.value = true
      const savedEmail = localStorage.getItem('user_email') || ''
      if (savedEmail) email.value = savedEmail
    }
  }
})

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    message.value = "Please fill in all fields";
    isSuccess.value = false;
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { usernameOrEmail: email.value, password: password.value }
    })

    if (res?.token) {
      message.value = `Login successful! Welcome back ${res.username}!`;
      isSuccess.value = true;

      if (process.client) {
        saveAuth({ token: res.token, email: res.email, username: res.username }, rememberMe.value)
      }

      password.value = ''

      // Redirect after successful login
      if (shouldCompleteProfile()) {
        await navigateTo('/AccountPage')
      } else {
        await navigateTo('/')  // Redirect to home page
      }
    } else if (res?.message) {
      message.value = res.message;
      isSuccess.value = false;
    }
  } catch (err: any) {
    console.error("Login error:", err);
    message.value = err?.data?.message || err?.response?.data?.message || err?.message || "Login failed!";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};


</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
    <form @submit.prevent="handleSubmit" class="w-full max-w-md">
      <div class="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 w-full p-8 rounded-2xl shadow-2xl">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p class="text-purple-200 mt-2">Sign in to continue your journey</p>
        </div>
        
        <div class="space-y-5">
          <div v-if="message" :class="[
            'px-4 py-3 rounded-lg mb-4 text-center backdrop-blur-sm border',
            isSuccess 
              ? 'bg-green-500/20 text-green-200 border-green-500/30' 
              : 'bg-red-500/20 text-red-200 border-red-500/30'
            ]">
            <p>{{ message }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-purple-200 mb-2">
              Email Address
            </label>
            <input 
              v-model="email" 
              type="text" 
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
              placeholder="••••••••" 
              class="w-full py-3 px-4 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              :disabled="isLoading"
            />
          </div>
        </div>
        
        <div class="flex items-center mt-6">
          <input
            v-model="rememberMe"
            id="rememberMe" 
            type="checkbox" 
            class="h-4 w-4 text-purple-500 bg-slate-900/50 border-purple-500/30 rounded focus:ring-purple-500 focus:ring-offset-slate-800"
          />
          <label for="rememberMe" class="ml-3 text-sm font-medium text-purple-200">
            Remember me
          </label>
        </div>

        <div class="mt-8">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
        
        <p class="mt-8 text-center text-sm text-purple-200">
          Don't have an account?
          <NuxtLink to="/RegisterPage" class="font-semibold text-purple-400 hover:text-pink-400 transition-colors ml-1">
            Join COSM
          </NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>