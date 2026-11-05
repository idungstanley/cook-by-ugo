import { describe, expect, it } from 'vitest'
import { arrivalLabel } from './arrival'

describe('arrival time', () => {
  it('shows the chosen slot exactly, not the slot plus a few minutes', () => {
    const noon = Date.UTC(2026, 10, 5, 12, 0)
    const label = arrivalLabel({ createdAt: noon - 3_600_000, etaMinutes: 50, scheduledFor: noon })
    expect(label).toMatch(/12:00pm$/)
  })

  it('adds the wait to the order time for orders wanted now', () => {
    const placed = Date.UTC(2026, 10, 5, 12, 26)
    expect(arrivalLabel({ createdAt: placed, etaMinutes: 50 })).toMatch(/1:16pm$/)
  })
})
