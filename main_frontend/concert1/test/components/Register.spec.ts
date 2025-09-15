import { render, fireEvent, screen } from '@testing-library/vue'
import Register from '@/app/components/Register.vue'

vi.mock('~~/server/register/register', () => ({
  register: vi.fn(async ({ username, email, password }) => {
    if (username === 'taken') {
      const err: any = new Error('Registration failed!')
      err.response = { data: { message: 'Email already registered' } }
      throw err
    }
    return { token: 'regToken', username, email }
  })
}))

describe('Register.vue', () => {
  test('validates required fields', async () => {
    render(Register)
    const submit = screen.getByRole('button', { name: /register/i })
    await fireEvent.click(submit)
    expect(await screen.findByText(/Please fill in all fields/i)).toBeTruthy()
  })

  test('successful register shows message and saves token', async () => {
    render(Register)
    await fireEvent.update(screen.getByPlaceholderText(/enter your username/i), 'newuser')
    await fireEvent.update(screen.getByPlaceholderText(/enter your email/i), 'new@ex.com')
    await fireEvent.update(screen.getByPlaceholderText(/enter your password/i), 'pass')

    const submit = screen.getByRole('button', { name: /register/i })
    await fireEvent.click(submit)

    expect(await screen.findByText(/Registration successful!/i)).toBeTruthy()
    expect(localStorage.getItem('jwt_token')).toBe('regToken')
  })

  test('failed register shows backend message', async () => {
    render(Register)
    await fireEvent.update(screen.getByPlaceholderText(/enter your username/i), 'taken')
    await fireEvent.update(screen.getByPlaceholderText(/enter your email/i), 'dup@ex.com')
    await fireEvent.update(screen.getByPlaceholderText(/enter your password/i), 'pass')

    const submit = screen.getByRole('button', { name: /register/i })
    await fireEvent.click(submit)

    expect(await screen.findByText(/Email already registered/i)).toBeTruthy()
  })
})
