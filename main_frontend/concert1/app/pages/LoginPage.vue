<script setup lang="ts">
import { ref } from 'vue'

const showSignup = ref(false)
</script>

<template>
  <div class="auth-container">
    <div v-if="!showSignup" id="login-form" class="auth-form">
      <p class="pre-header">Welcome Back</p>
      <h1>Log In to your Account</h1>
      <!-- Use existing Login component for functional logic -->
      <Login />
    </div>

    <div v-else id="signup-form" class="auth-form">
      <p class="pre-header">Start for free</p>
      <h1>Create an Account</h1>
      <!-- Use existing Register component for functional logic -->
      <Register />
      <p class="toggle-link">
        Already have an account? <a @click.prevent="showSignup = false">LOG IN</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-color: #0D69FF;
  --dark-color: #1A1A1A;
  --text-color: #333333;
  --text-secondary-color: #666666;
  --border-color: #D9D9D9;
  --bg-color: #F7F7F7;
}

.auth-container {
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 680px;
  margin: 40px auto;
}

.auth-form h1 {
  color: var(--dark-color);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.auth-form .pre-header {
  color: var(--text-secondary-color);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-secondary-color);
  margin: 24px 0;
  font-size: 0.9rem;
}

.separator::before,
.separator::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-color); }
.separator:not(:empty)::before { margin-right: .25em; }
.separator:not(:empty)::after { margin-left: .25em; }

.social-login-btn {
  width: 100%;
  padding: 12px;
  background-color: #fff;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.toggle-link { text-align: center; margin-top: 16px; font-size: 1rem; }
.toggle-link a { color: var(--primary-color); font-weight: 600; text-decoration: none; cursor: pointer; }
</style>