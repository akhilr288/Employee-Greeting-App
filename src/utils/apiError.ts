import axios from 'axios'

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 422) {
      return 'Please check the submitted fields.'
    }

    if (error.response?.status === 401) {
      return 'Your session has expired. Please log in again.'
    }

    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.'
    }

    if (error.response?.status === 404) {
      return 'The requested employee was not found.'
    }

    if (!error.response) {
      return 'Unable to connect to the server. Check your connection.'
    }

    return error.response.data?.message ?? 'The request failed.'
  }

  return 'An unexpected error occurred.'
}
