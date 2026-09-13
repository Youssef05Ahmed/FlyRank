export type ProfileVisibility = 'public' | 'friends' | 'private'

export type AccountSettings = {
  displayName: string
  username: string
  email: string
  bio: string
  avatarUrl: string
  steamId: string
  xboxGamertag: string
  psnId: string
  nintendoFriendCode: string
  region: string
  preferredCurrency: string
  language: string
  notifyOrderUpdates: boolean
  notifyWishlistDeals: boolean
  notifyNewsletter: boolean
  notifyFriendActivity: boolean
  profileVisibility: ProfileVisibility
  showLibraryPublicly: boolean
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type AccountSettingsErrors = Partial<
  Record<keyof AccountSettings, string>
>

export const defaultAccountSettings: AccountSettings = {
  displayName: '',
  username: '',
  email: '',
  bio: '',
  avatarUrl: '',
  steamId: '',
  xboxGamertag: '',
  psnId: '',
  nintendoFriendCode: '',
  region: 'US',
  preferredCurrency: 'USD',
  language: 'en',
  notifyOrderUpdates: true,
  notifyWishlistDeals: true,
  notifyNewsletter: false,
  notifyFriendActivity: true,
  profileVisibility: 'friends',
  showLibraryPublicly: false,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}
