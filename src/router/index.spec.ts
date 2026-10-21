import { describe, expect, it } from 'vitest'
import router from './index'

describe('employee details route', () => {
  it('resolves employee-details by name and ID', () => {
    const route = router.resolve({
      name: 'employee-details',
      params: { id: '5' },
    })

    expect(route.path).toBe('/employees/5')
    expect(route.params.id).toBe('5')
  })
})
