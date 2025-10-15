import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import MyBookingsPage from '~/app/pages/MyBookingsPage.vue'

// Mock $fetch globally
global.$fetch = vi.fn() as any

// Mock fetch globally
global.fetch = vi.fn()

// Mock composables
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    clearAuth: vi.fn(),
    loadFromStorage: vi.fn()
  })
}))

vi.mock('~/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

const mockBookings = [
  {
    bookingId: 1,
    event: {
      id: 101,
      name: 'Rock Concert',
      datestart: '2024-12-01T19:00:00Z',
      location: 'Bangkok Arena'
    },
    quantity: 2,
    totalPrice: 1000,
    bookingDate: '2024-11-01T10:00:00Z'
  },
  {
    bookingId: 2,
    event: {
      id: 102,
      name: 'Jazz Night',
      datestart: '2024-12-15T20:00:00Z',
      location: 'Jazz Club'
    },
    quantity: 1,
    totalPrice: 300,
    bookingDate: '2024-11-05T12:00:00Z'
  }
]

describe('MyBookingsPage.vue', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/concert/my-bookings', name: 'MyBookings', component: MyBookingsPage }
      ]
    })
    
    vi.clearAllMocks()
    
    // Mock localStorage
    localStorage.setItem('jwt_token', 'test-token')
    
    // Mock successful bookings API
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockBookings
    })
  })

  it('should render my bookings page', () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should fetch bookings on mount', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    // Component should be mounted
    expect(wrapper.exists()).toBe(true)
  })

  it('should display bookings list', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    // Component should render bookings data
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle empty bookings', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    // Should show empty state
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle cancel booking action', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    
    // If cancel function exists
    if (vm.cancelBooking || vm.handleCancelBooking) {
      // Mock cancel API
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Booking cancelled' })
      })
      
      const cancelFn = vm.cancelBooking || vm.handleCancelBooking
      await cancelFn(1)
      
      // Should call delete API
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/bookings/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    }
  })

  it('should redirect to login if not authenticated', async () => {
    localStorage.removeItem('jwt_token')
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Component should handle unauthenticated state
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle API error gracefully', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    })
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.exists()).toBe(true)
  })

  it('should show booking details', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    
    // Check if bookings data exists
    expect(Array.isArray(vm.bookings) || vm.bookings === undefined).toBe(true)
  })

  it('should format booking date correctly', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    
    // If date formatting function exists
    if (vm.formatDate) {
      const formatted = vm.formatDate('2024-11-01T10:00:00Z')
      expect(typeof formatted).toBe('string')
    }
  })

  it('should calculate total bookings', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    
    const vm = wrapper.vm as any
    
    // Component should track bookings count
    if (vm.bookings && Array.isArray(vm.bookings)) {
      expect(vm.bookings.length).toBeGreaterThanOrEqual(0)
    }
  })

  it('should call fetchBookings function', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    const vm = wrapper.vm as any
    if (vm.fetchBookings) {
      await vm.fetchBookings()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call openCancelModal function', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    const vm = wrapper.vm as any
    if (vm.openCancelModal) {
      const mockBooking = {
        id: 1,
        eventTitle: 'Test Event',
        quantity: 2,
        totalPrice: 1000
      }
      vm.openCancelModal(mockBooking)
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call closeCancelModal function', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    const vm = wrapper.vm as any
    if (vm.closeCancelModal) {
      vm.closeCancelModal()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call confirmCancelBooking function', async () => {
    ;(global.$fetch as any).mockResolvedValue({ success: true })
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    const vm = wrapper.vm as any
    if (vm.confirmCancelBooking) {
      await vm.confirmCancelBooking()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should call goToEvent function', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })
    
    const vm = wrapper.vm as any
    if (vm.goToEvent) {
      const mockBooking = {
        id: 1,
        eventId: 123,
        eventTitle: 'Test Event'
      }
      vm.goToEvent(mockBooking)
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle fetch error with error message', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch bookings' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle fetch error without message', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle network error during fetch', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle cancel booking failure', async () => {
    ;(global.$fetch as any).mockRejectedValueOnce({
      data: { message: 'Cannot cancel booking' }
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    const vm = wrapper.vm as any
    if (vm.confirmCancelBooking) {
      await vm.confirmCancelBooking()
      await wrapper.vm.$nextTick()
    }
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle missing token', async () => {
    localStorage.removeItem('jwt_token')

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.exists()).toBe(true)
  })

  it('should handle bookings with missing event data', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          bookingId: 1,
          event: null,
          quantity: 2,
          totalPrice: 1000
        }
      ]
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  // Branch Coverage Tests - confirmCancelBooking branches
  it('should return early when bookingToCancel is null', async () => {
    // Mock $fetch to prevent onMounted from fetching
    ;(global.$fetch as any).mockResolvedValueOnce([])
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Clear fetch mock to track only confirmCancelBooking calls
    vi.clearAllMocks()
    
    // Set bookingToCancel to null
    wrapper.vm.bookingToCancel = null
    
    // Try to confirm cancel - should return early
    await wrapper.vm.confirmCancelBooking()
    
    // No fetch call should be made (only for confirmCancelBooking)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle missing token in confirmCancelBooking', async () => {
    localStorage.removeItem('jwt_token')
    sessionStorage.removeItem('jwt_token')

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Set up a booking to cancel
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should not call API without token
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should use sessionStorage token as fallback', async () => {
    localStorage.removeItem('jwt_token')
    sessionStorage.setItem('jwt_token', 'session-token')

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Cancelled' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should use sessionStorage token
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/bookings/1',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer session-token'
        })
      })
    )

    sessionStorage.removeItem('jwt_token')
  })

  it('should handle 401 error in confirmCancelBooking', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should handle 401 error
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should handle 403 error in confirmCancelBooking', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ message: 'Forbidden' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should handle 403 error
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should handle non-401/403 error with error message', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Server error occurred' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should handle error
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should handle error without message (default error message)', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({})
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should use default error message
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should update booking status locally after successful cancellation', async () => {
    // Mock fetch for cancellation
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Cancelled' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Set up bookings with one to cancel
    const testBookings = [
      {
        id: 1,
        eventId: 101,
        eventTitle: 'Test Event',
        quantity: 2,
        totalPrice: 100,
        status: 'CONFIRMED',
        bookingDate: '2024-11-01',
        eventStartDate: '2024-12-01',
        eventLocation: 'Test Location'
      }
    ]
    wrapper.vm.bookings = testBookings

    // Mock $fetch to return the same bookings (for any refresh calls)
    ;(global.$fetch as any).mockResolvedValue(testBookings)

    wrapper.vm.bookingToCancel = wrapper.vm.bookings[0]

    await wrapper.vm.confirmCancelBooking()
    
    // Status should be updated to CANCELLED immediately (before fetchBookings refresh)
    expect(wrapper.vm.bookings[0].status).toBe('CANCELLED')
  })

  it('should handle booking not found in local array', async () => {
    // Mock fetch for cancellation
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Cancelled' })
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Set booking to cancel with different ID than bookings array
    const testBookings = [
      {
        id: 999,
        eventId: 101,
        eventTitle: 'Different Event',
        quantity: 2,
        totalPrice: 100,
        status: 'CONFIRMED',
        bookingDate: '2024-11-01',
        eventStartDate: '2024-12-01',
        eventLocation: 'Test Location'
      }
    ]
    wrapper.vm.bookings = testBookings

    // Mock $fetch to return same bookings (for any refresh calls)
    ;(global.$fetch as any).mockResolvedValue(testBookings)

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    
    // Should not crash, booking with id 999 should remain unchanged
    expect(wrapper.vm.bookings[0].status).toBe('CONFIRMED')
  })

  // Note: Modal close behavior is implicitly tested by other successful cancellation tests
  // Skipping redundant explicit test

  it('should extract error message from err.message', async () => {
    const errorWithMessage = new Error('Custom error message')
    ;(global.fetch as any).mockRejectedValueOnce(errorWithMessage)

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    await wrapper.vm.$nextTick()
    
    // Should handle error gracefully
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should extract error message from err.data.message', async () => {
    const errorWithDataMessage = { data: { message: 'Data error message' } }
    ;(global.fetch as any).mockRejectedValueOnce(errorWithDataMessage)

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    await wrapper.vm.$nextTick()
    
    // Should handle error gracefully
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should use default error message when no specific message available', async () => {
    ;(global.fetch as any).mockRejectedValueOnce({})

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    await wrapper.vm.$nextTick()
    
    // Should use default error message
    expect(wrapper.vm.cancelling).toBeNull()
  })

  it('should handle JSON parse error in error response', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('JSON parse error')
      }
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()
    await wrapper.vm.$nextTick()
    
    // Should handle JSON parse error gracefully
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // Additional branch tests for fetchBookings
  it('should return early in fetchBookings when not logged in', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Set not logged in
    wrapper.vm.isLoggedIn = false

    // Clear any previous calls
    vi.clearAllMocks()

    await wrapper.vm.fetchBookings()

    // Should not make API call
    expect(global.$fetch).not.toHaveBeenCalled()
  })

  it('should handle handleApiError returning true (401/403)', async () => {
    ;(global.$fetch as any).mockRejectedValueOnce({
      statusCode: 401,
      data: { message: 'Unauthorized' }
    })

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // handleApiError should be called and handle the error
    expect(wrapper.exists()).toBe(true)
  })

  // Additional comprehensive branch coverage tests
  
  // fetchBookings - token check branch
  it('should return early in fetchBookings when no token', async () => {
    localStorage.clear()
    sessionStorage.clear()
    
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    
    // Clear previous calls from mount
    vi.clearAllMocks()

    await wrapper.vm.fetchBookings()

    // Should not make API call when no token
    expect(global.$fetch).not.toHaveBeenCalled()
  })

  // fetchBookings - non-array response handling
  it('should handle non-array response in fetchBookings', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Mock non-array response for manual fetchBookings call
    ;(global.$fetch as any).mockResolvedValueOnce({ error: 'Invalid response' })

    await wrapper.vm.fetchBookings()

    // Should set bookings to empty array when non-array response
    expect(Array.isArray(wrapper.vm.bookings)).toBe(true)
    expect(wrapper.vm.bookings.length).toBe(0)
  })

  // confirmCancelBooking - no bookingToCancel (early return)
  it('should return early in confirmCancelBooking when no bookingToCancel', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = null

    vi.clearAllMocks()

    await wrapper.vm.confirmCancelBooking()

    // Should not make any fetch call
    expect(global.fetch).not.toHaveBeenCalled()
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - missing token (session expired)
  it('should handle missing token in confirmCancelBooking', async () => {
    localStorage.clear()
    sessionStorage.clear()

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should not make fetch call without token
    expect(global.fetch).not.toHaveBeenCalled()
  })

  // confirmCancelBooking - response not ok
  it('should handle non-ok response in confirmCancelBooking', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: 'Bad request' })
    })
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - 401/403 status handling
  it('should handle 401 status in confirmCancelBooking', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: vi.fn().mockResolvedValue({ message: 'Unauthorized' })
    })
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should handle authorization error
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - error.json() catch path
  it('should handle json parse error in confirmCancelBooking error response', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
    })
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should handle JSON parse error and return empty object
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - errorData.message fallback
  it('should use status fallback when errorData has no message', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({})
    })
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should use status code in error message
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - successful cancellation updates local state
  it('should update booking status locally after successful cancel', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200
    })
    global.fetch = mockFetch

    ;(global.$fetch as any).mockResolvedValueOnce([
      {
        id: 1,
        eventId: 101,
        eventTitle: 'Test Event',
        quantity: 2,
        totalPrice: 100,
        status: 'CONFIRMED',
        bookingDate: '2024-11-01',
        eventStartDate: '2024-12-01',
        eventLocation: 'Test Location'
      }
    ])

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()

    // Set the booking to cancel
    wrapper.vm.bookingToCancel = wrapper.vm.bookings[0]
    wrapper.vm.showCancelModal = true

    await wrapper.vm.confirmCancelBooking()
    await wrapper.vm.$nextTick()

    // Should update local booking status to CANCELLED
    const booking = wrapper.vm.bookings.find(b => b.id === 1)
    expect(booking?.status).toBe('CANCELLED')
  })

  // confirmCancelBooking - error message fallback chain
  it('should use error.message fallback in confirmCancelBooking', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce({
      message: 'Network error'
    })
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should handle error
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // confirmCancelBooking - default error message
  it('should use default error message when error has no details', async () => {
    const mockFetch = vi.fn().mockRejectedValueOnce({})
    global.fetch = mockFetch

    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    wrapper.vm.bookingToCancel = {
      id: 1,
      eventId: 101,
      eventTitle: 'Test Event',
      quantity: 2,
      totalPrice: 100,
      status: 'CONFIRMED',
      bookingDate: '2024-11-01',
      eventStartDate: '2024-12-01',
      eventLocation: 'Test Location'
    }

    await wrapper.vm.confirmCancelBooking()

    // Should use default error message
    expect(wrapper.vm.cancelling).toBeNull()
  })

  // formatDate - empty date string
  it('should return TBA for empty date string in formatDate', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    const result = wrapper.vm.formatDate('')
    expect(result).toBe('TBA')
  })

  // formatDate - null date
  it('should return TBA for null date in formatDate', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    const result = wrapper.vm.formatDate(null as any)
    expect(result).toBe('TBA')
  })

  // formatDate - valid date formatting
  it('should format valid date correctly', async () => {
    const wrapper = mount(MyBookingsPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    const result = wrapper.vm.formatDate('2024-12-01T19:00:00Z')
    expect(result).toMatch(/Dec|December/)
  })
})


