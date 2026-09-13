import { describe, expect, it } from 'vitest'
import {
  hasValidationErrors,
  validateAccountSettings,
} from './validateAccountSettings'
import { defaultAccountSettings } from '../types/accountSettings'

describe('validateAccountSettings', () => {
  it('accepts valid input', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'Joey',
      email: 'joey@example.com',
      preferredPlatform: 'PC',
      country: 'Egypt',
      newsletter: true,
    })
    expect(hasValidationErrors(errors)).toBe(false)
  })

  it('requires username', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: '   ',
      email: 'joey@example.com',
      preferredPlatform: 'PC',
      country: 'Egypt',
    })
    expect(errors.username).toMatch(/required/i)
  })

  it('rejects very long username', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'a'.repeat(33),
      email: 'joey@example.com',
      preferredPlatform: 'PC',
      country: 'Egypt',
    })
    expect(errors.username).toMatch(/32 characters/)
  })

  it('requires email', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'Joey',
      email: '',
      preferredPlatform: 'PC',
      country: 'Egypt',
    })
    expect(errors.email).toMatch(/required/i)
  })

  it('rejects invalid email', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'Joey',
      email: 'not-an-email',
      preferredPlatform: 'PC',
      country: 'Egypt',
    })
    expect(errors.email).toMatch(/valid email/i)
  })

  it('requires preferred platform', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'Joey',
      email: 'joey@example.com',
      preferredPlatform: '',
      country: 'Egypt',
    })
    expect(errors.preferredPlatform).toMatch(/platform/i)
  })

  it('requires country', () => {
    const errors = validateAccountSettings({
      ...defaultAccountSettings,
      username: 'Joey',
      email: 'joey@example.com',
      preferredPlatform: 'Xbox',
      country: '  ',
    })
    expect(errors.country).toMatch(/required/i)
  })
})
