import type {
  AccountSettings,
  AccountSettingsErrors,
} from '../types/accountSettings'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAccountSettings(
  values: AccountSettings,
): AccountSettingsErrors {
  const errors: AccountSettingsErrors = {}

  if (!values.displayName.trim()) {
    errors.displayName = 'Display name is required.'
  } else if (values.displayName.trim().length < 2) {
    errors.displayName = 'Display name must be at least 2 characters.'
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required.'
  } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(values.username.trim())) {
    errors.username =
      'Username must be 3–20 characters (letters, numbers, underscore).'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.bio.length > 280) {
    errors.bio = 'Bio must be 280 characters or fewer.'
  }

  if (values.avatarUrl.trim() && !isLikelyUrl(values.avatarUrl.trim())) {
    errors.avatarUrl = 'Enter a valid image URL.'
  }

  const changingPassword =
    values.currentPassword || values.newPassword || values.confirmPassword

  if (changingPassword) {
    if (!values.currentPassword) {
      errors.currentPassword = 'Current password is required to change password.'
    }
    if (!values.newPassword) {
      errors.newPassword = 'Enter a new password.'
    } else if (values.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.'
    }
    if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
    }
  }

  return errors
}

function isLikelyUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
