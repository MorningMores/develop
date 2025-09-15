import { render, screen } from '@testing-library/vue'
import NavBar from '@/app/components/NavBar.vue'

// Stub NuxtLink so we don't need a router
const nuxtLinkStub = {
  template: '<a :href="typeof to === \'string\' ? to : (to && to.path)" data-testid="nuxt-link"><slot /></a>',
  props: ['to']
}

describe('NavBar.vue', () => {
  test('renders brand and page links', () => {
    render(NavBar, {
      global: {
        stubs: { NuxtLink: nuxtLinkStub }
      }
    })

    expect(screen.getByText('MM concerts')).toBeInTheDocument()

    const mapping = screen.getByText('Mapping')
    const home = screen.getByText('Homepage')
    const about = screen.getByText('About us')

    expect(mapping.closest('a')?.getAttribute('href')).toBe('MapTestingPage')
    expect(home.closest('a')?.getAttribute('href')).toBe('/')
    expect(about.closest('a')?.getAttribute('href')).toBe('AboutUS')
  })
})
