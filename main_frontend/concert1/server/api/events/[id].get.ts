import type { H3Event } from 'h3'
import { getRequestHeader, getRouterParam } from 'h3'

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const id = getRouterParam(event, 'id')
  const config = useRuntimeConfig()
  const backend = (config.public as any)?.backendBaseUrl || process.env.BACKEND_BASE_URL || 'http://localhost:8080'

  try {
    const res: any = await $fetch(`${backend}/api/events/${id}`, {
      headers: buildAuthHeaders(event)
    })
    return res
  } catch (err: any) {
    const status = err?.response?.status || err?.status || 500
    setResponseStatus(event, status)
    return err?.data || err?.response?._data || { message: err?.message || 'Failed to load event' }
  }
})

function buildAuthHeaders(event: H3Event) {
  const auth = getRequestHeader(event, 'authorization')
  return auth ? { Authorization: auth } : undefined
}
