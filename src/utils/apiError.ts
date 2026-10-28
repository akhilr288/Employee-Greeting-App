export function getApiErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error.response
    if (typeof response === 'object' && response !== null && 'data' in response) {
      const data = response.data
      if (typeof data === 'object' && data !== null && 'message' in data) {
        const message = data.message
        if (typeof message === 'string' && message.length > 0) {
          return message
        }
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
