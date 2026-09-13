import {
  PLATFORMS,
  USERNAME_MAX_LENGTH,
  type AccountSettings,
  type AccountSettingsErrors,
} from '../types/accountSettings'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAccountSettings(
  values: AccountSettings,
): AccountSettingsErrors {
  const errors: AccountSettingsErrors = {}

  const username = values.username.trim()
  if (!username) {
    errors.username = 'Username is required.'
  } else if (username.length > USERNAME_MAX_LENGTH) {
    errors.username = `Username must be ${USERNAME_MAX_LENGTH} characters or fewer.`
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address (for example, name@example.com).'
  }

  if (!values.preferredPlatform) {
    errors.preferredPlatform = 'Select your preferred gaming platform.'
  } else if (!PLATFORMS.includes(values.preferredPlatform)) {
    errors.preferredPlatform = 'Select a valid platform: PC, PlayStation, or Xbox.'
  }

  if (!values.country.trim()) {
    errors.country = 'Country is required.'
  }

  return errors
}

export function hasValidationErrors(errors: AccountSettingsErrors): boolean {
  return Object.keys(errors).length > 0
}
