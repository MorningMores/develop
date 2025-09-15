import { render, fireEvent, screen } from '@testing-library/vue'
import Login from '@/app/components/Login.vue'

vi.mock('~~/server/login/login', () => ({
  login: vi.fn(async ({ usernameOrEmail, password }) => {
    if (usernameOrEmail === 'user' && password === 'pass') {
      return { token: 't', username: 'user', email: 'u@example.com' }
    }
    const err: any = new Error('Login failed!')
    err.response = { data: { message: 'Invalid credentials' } }
    throw err
  })
}))

describe('Login.vue', () => {
  test('validates required fields', async () => {
    render(Login)
    const submit = screen.getByRole('button', { name: /login/i })
    await fireEvent.click(submit)
    expect(await screen.findByText(/Please fill in all fields/i)).toBeTruthy()
  })

  test('successful login shows message and saves token', async () => {
    render(Login)
    await fireEvent.update(screen.getByPlaceholderText(/email or username/i), 'user')
    await fireEvent.update(screen.getByPlaceholderText(/password/i), 'pass')

    const submit = screen.getByRole('button', { name: /login/i })
    await fireEvent.click(submit)

    expect(await screen.findByText(/Login successful!/i)).toBeTruthy()
    expect(localStorage.getItem('jwt_token')).toBe('t')
  })

  test('failed login shows backend message', async () => {
    render(Login)
    await fireEvent.update(screen.getByPlaceholderText(/email or username/i), 'user')
    await fireEvent.update(screen.getByPlaceholderText(/password/i), 'wrong')

    const submit = screen.getByRole('button', { name: /login/i })
    await fireEvent.click(submit)

    expect(await screen.findByText(/Invalid credentials/i)).toBeTruthy()
  })
})
