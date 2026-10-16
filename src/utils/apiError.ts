import axios from 'axios'

interface LaravelErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<LaravelErrorResponse>(error)) {
    return 'An unexpected error occurred.'
  }

  const status = error.response?.status
  const data = error.response?.data

  if (status === 401) return 'Your session has expired. Please sign in.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested resource was not found.'
  if (status === 422) {
    return (
      Object.values(data?.errors ?? {})[0]?.[0] ??
      data?.message ??
      'Please check the submitted data.'
    )
  }

  if (!error.response) {
    return 'Unable to reach the API. Check your connection and try again.'
  }

  return data?.message ?? 'The server could not complete the request.'
}
