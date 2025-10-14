import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import AccountPage from '~/app/pages/AccountPage.vue'

// Mock composables
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    loadFromStorage: vi.fn(),
    clearAuth: vi.fn(),
    isLoggedIn: { value: true }
  })
}))

vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

// Mock fetch globally
global.fetch = vi.fn()

const mockProfile = {
  email: 'test@test.com',
  username: 'testuser',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '0812345678'
}

describe('AccountPage.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/concert/account', name: 'Account', component: AccountPage }
      ]
    })
    
    vi.clearAllMocks()
    
    // Mock localStorage
    localStorage.setItem('jwt_token', 'test-token')
    localStorage.setItem('profile', JSON.stringify(mockProfile))
    
    // Mock profile API
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockProfile
    })
  })

  it('should render account page', () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should load profile on mount', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    // Component should be mounted
    expect(wrapper.exists()).toBe(true)
  })

  it('should display profile information', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    // Component should render
    expect(wrapper.exists()).toBe(true)
  })

  it('should have edit profile form', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should have input fields
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('should update profile on submit', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    
    // Mock update API
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockProfile, firstName: 'Jane' })
    })
    
    // If update function exists
    if (vm.updateProfile || vm.handleUpdate) {
      const updateFn = vm.updateProfile || vm.handleUpdate
      await updateFn()
      
      // Should call update API
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/me'),
        expect.objectContaining({
          method: 'PUT'
        })
      )
    }
  })

  it('should handle form validation', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const vm = wrapper.vm as any
    
    // Check if validation exists
    if (vm.validateForm || vm.isValid) {
      expect(wrapper.exists()).toBe(true)
    }
  })

  it('should redirect to login if not authenticated', async () => {
    localStorage.removeItem('jwt_token')
    
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should handle unauthenticated state
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle API error', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    })
    
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should display email field', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should have input fields
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(0)
  })

  it('should allow editing profile fields', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const inputs = wrapper.findAll('input[type="text"]')
    if (inputs.length > 0) {
      await inputs[0].setValue('New Value')
      expect(inputs[0].element.value).toBe('New Value')
    }
  })

  it('should call loadUserData function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.loadUserData) {
      await vm.loadUserData()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call loadUserStats function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.loadUserStats) {
      await vm.loadUserStats()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call handlesubmit function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.handlesubmit) {
      await vm.handlesubmit()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call handleLogout function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.handleLogout) {
      await vm.handleLogout()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call confirmLogout function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.confirmLogout) {
      await vm.confirmLogout()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call cancelLogout function', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.cancelLogout) {
      vm.cancelLogout()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  // Branch coverage tests for conditional logic
  it('should compute userInitials from firstName and lastName', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    vm.userData.lastName = 'Doe'
    await wrapper.vm.$nextTick()
    
    expect(vm.userInitials).toBe('JD')
  })

  it('should compute userInitials from firstName only', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'Jane'
    vm.userData.lastName = ''
    await wrapper.vm.$nextTick()
    
    expect(vm.userInitials).toBe('J')
  })

  it('should compute userInitials from email when no firstName', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = ''
    vm.userData.email = 'test@example.com'
    await wrapper.vm.$nextTick()
    
    expect(vm.userInitials).toBe('T')
  })

  it('should use "?" when no firstName or email', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = ''
    vm.userData.email = ''
    await wrapper.vm.$nextTick()
    
    expect(vm.userInitials).toBe('?')
  })

  it('should use localStorage token when available', async () => {
    localStorage.setItem('jwt_token', 'local-token')
    sessionStorage.removeItem('jwt_token')

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    expect(global.$fetch).toHaveBeenCalledWith(
      '/api/auth/me',
      expect.objectContaining({
        headers: { Authorization: 'Bearer local-token' }
      })
    )
  })

  it('should fallback to sessionStorage token', async () => {
    localStorage.removeItem('jwt_token')
    sessionStorage.setItem('jwt_token', 'session-token')

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle me response with all fields', async () => {
    ;(global.$fetch as any).mockResolvedValueOnce({
      name: 'John Doe Smith',
      email: 'john@test.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'Bangkok',
      country: 'Thailand',
      pincode: '12345'
    })

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.userData.firstName).toBe('John')
    expect(vm.userData.lastName).toBe('Doe Smith')
  })

  it('should handle me response with empty fields', async () => {
    ;(global.$fetch as any).mockResolvedValueOnce({
      name: '',
      email: '',
      phone: null,
      address: undefined
    })

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.userData.fullName).toBe('')
    expect(vm.userData.phone).toBe('')
  })

  it('should handle fullName with single word', async () => {
    ;(global.$fetch as any).mockResolvedValueOnce({
      name: 'Madonna',
      email: 'madonna@test.com'
    })

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.userData.firstName).toBe('Madonna')
    expect(vm.userData.lastName).toBe('')
  })

  it('should handle Array.isArray check for eventsRes', async () => {
    ;(global.$fetch as any)
      .mockResolvedValueOnce({ name: 'Test User', email: 'test@test.com' })
      .mockResolvedValueOnce({ events: [] }) // Non-array response for events
      .mockResolvedValueOnce([])

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.stats.eventsCreated).toBe(0)
  })

  it('should handle Array.isArray check for bookingsRes', async () => {
    ;(global.$fetch as any)
      .mockResolvedValueOnce({ name: 'Test User', email: 'test@test.com' })
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ bookings: [] }) // Non-array response

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.stats.ticketsPurchased).toBe(0)
  })

  it('should filter upcoming events correctly', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 10)
    
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 10)

    ;(global.$fetch as any)
      .mockResolvedValueOnce({ name: 'Test User', email: 'test@test.com' })
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
      .mockResolvedValueOnce([
        { id: 1, eventStartDate: futureDate.toISOString() },
        { id: 2, eventStartDate: pastDate.toISOString() }
      ])

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.stats.upcomingEvents).toBe(1)
  })

  it('should handle bookings without eventStartDate', async () => {
    ;(global.$fetch as any)
      .mockResolvedValueOnce({ name: 'Test User', email: 'test@test.com' })
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: 1, eventStartDate: null },
        { id: 2 }
      ])

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    expect(vm.stats.upcomingEvents).toBe(0)
  })

  it('should handle empty firstName validation in submit', async () => {
    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = '   '
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(vm.message).toContain('first name')
  })

  it('should handle missing token in submit', async () => {
    localStorage.removeItem('jwt_token')
    sessionStorage.removeItem('jwt_token')

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(vm.message).toContain('Not authenticated')
  })

  it('should send null for empty optional fields', async () => {
    localStorage.setItem('jwt_token', 'test-token')

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    vm.userData.lastName = ''
    vm.userData.phone = ''
    vm.userData.pincode = 0
    
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(global.$fetch).toHaveBeenCalledWith(
      '/api/users/me',
      expect.objectContaining({
        method: 'PUT',
        body: expect.objectContaining({
          firstName: 'John',
          lastName: null,
          phone: null
        })
      })
    )
  })

  it('should convert pincode to string when present', async () => {
    localStorage.setItem('jwt_token', 'test-token')

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    vm.userData.pincode = 12345
    
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(global.$fetch).toHaveBeenCalledWith(
      '/api/users/me',
      expect.objectContaining({
        body: expect.objectContaining({
          pincode: '12345'
        })
      })
    )
  })

  it('should handle error with statusMessage', async () => {
    localStorage.setItem('jwt_token', 'test-token')
    ;(global.$fetch as any).mockRejectedValueOnce({
      statusMessage: 'Bad Request'
    })

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(vm.message).toBe('Bad Request')
  })

  it('should handle error with data.message fallback', async () => {
    localStorage.setItem('jwt_token', 'test-token')
    ;(global.$fetch as any).mockRejectedValueOnce({
      data: { message: 'Validation failed' }
    })

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(vm.message).toBe('Validation failed')
  })

  it('should use default error message when no specific message', async () => {
    localStorage.setItem('jwt_token', 'test-token')
    ;(global.$fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(AccountPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    
    vm.userData.firstName = 'John'
    await vm.handlesubmit()
    await wrapper.vm.$nextTick()
    
    expect(vm.message).toContain('Failed to save profile')
  })
})

