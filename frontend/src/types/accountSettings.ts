export const PLATFORMS = ['PC', 'PlayStation', 'Xbox'] as const

export type PreferredPlatform = (typeof PLATFORMS)[number]

export type AccountSettings = {
  username: string
  email: string
  preferredPlatform: PreferredPlatform | ''
  country: string
  newsletter: boolean
}

export type AccountSettingsField = keyof AccountSettings

export type AccountSettingsErrors = Partial<
  Record<AccountSettingsField, string>
>

export const USERNAME_MAX_LENGTH = 32

export const defaultAccountSettings: AccountSettings = {
  username: '',
  email: '',
  preferredPlatform: '',
  country: '',
  newsletter: true,
}
