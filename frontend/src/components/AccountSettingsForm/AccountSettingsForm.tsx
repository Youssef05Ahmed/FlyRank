import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { validateAccountSettings } from '../../lib/validateAccountSettings'
import {
  defaultAccountSettings,
  type AccountSettings,
  type AccountSettingsErrors,
} from '../../types/accountSettings'
import './AccountSettingsForm.css'

type AccountSettingsFormProps = {
  initialValues?: Partial<AccountSettings>
  onSubmit?: (values: AccountSettings) => void | Promise<void>
}

export function AccountSettingsForm({
  initialValues,
  onSubmit,
}: AccountSettingsFormProps) {
  const formId = useId()
  const [values, setValues] = useState<AccountSettings>({
    ...defaultAccountSettings,
    ...initialValues,
  })
  const [errors, setErrors] = useState<AccountSettingsErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'saved'>('idle')

  function updateField<K extends keyof AccountSettings>(
    key: K,
    value: AccountSettings[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
    if (status === 'saved') setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAccountSettings(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    try {
      await onSubmit?.({
        ...values,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setValues((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
      setStatus('saved')
    } catch {
      setStatus('idle')
    }
  }

  function fieldId(name: keyof AccountSettings) {
    return `${formId}-${name}`
  }

  return (
    <form
      className="account-settings-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${formId}-title`}
    >
      <header className="account-settings-form__header">
        <div>
          <h1 id={`${formId}-title`}>Account settings</h1>
          <p className="account-settings-form__subtitle">
            Manage your FlyRank profile, linked platforms, and store preferences.
          </p>
        </div>
        {status === 'saved' && (
          <p className="account-settings-form__status" role="status">
            Settings saved.
          </p>
        )}
      </header>

      <fieldset className="account-settings-form__section">
        <legend>Profile</legend>
        <div className="account-settings-form__grid account-settings-form__grid--2">
          <FormField
            id={fieldId('displayName')}
            label="Display name"
            required
            error={errors.displayName}
          >
            <input
              id={fieldId('displayName')}
              name="displayName"
              type="text"
              autoComplete="name"
              value={values.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              aria-invalid={Boolean(errors.displayName)}
            />
          </FormField>

          <FormField
            id={fieldId('username')}
            label="Username"
            required
            hint="Shown on reviews and leaderboards."
            error={errors.username}
          >
            <input
              id={fieldId('username')}
              name="username"
              type="text"
              autoComplete="username"
              value={values.username}
              onChange={(e) => updateField('username', e.target.value)}
              aria-invalid={Boolean(errors.username)}
            />
          </FormField>
        </div>

        <FormField
          id={fieldId('email')}
          label="Email"
          required
          error={errors.email}
        >
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>

        <FormField
          id={fieldId('bio')}
          label="Bio"
          hint={`${values.bio.length}/280`}
          error={errors.bio}
        >
          <textarea
            id={fieldId('bio')}
            name="bio"
            rows={3}
            maxLength={280}
            value={values.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            aria-invalid={Boolean(errors.bio)}
            placeholder="Favorite genres, platforms, or what you're playing now."
          />
        </FormField>

        <FormField
          id={fieldId('avatarUrl')}
          label="Avatar URL"
          error={errors.avatarUrl}
        >
          <input
            id={fieldId('avatarUrl')}
            name="avatarUrl"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={values.avatarUrl}
            onChange={(e) => updateField('avatarUrl', e.target.value)}
            aria-invalid={Boolean(errors.avatarUrl)}
          />
        </FormField>
      </fieldset>

      <fieldset className="account-settings-form__section">
        <legend>Linked gaming accounts</legend>
        <p className="account-settings-form__section-desc">
          Connect platforms to sync achievements, friends, and cross-store wishlists.
        </p>
        <div className="account-settings-form__grid account-settings-form__grid--2">
          <FormField id={fieldId('steamId')} label="Steam ID">
            <input
              id={fieldId('steamId')}
              name="steamId"
              type="text"
              autoComplete="off"
              placeholder="steamid64 or profile URL"
              value={values.steamId}
              onChange={(e) => updateField('steamId', e.target.value)}
            />
          </FormField>

          <FormField id={fieldId('xboxGamertag')} label="Xbox gamertag">
            <input
              id={fieldId('xboxGamertag')}
              name="xboxGamertag"
              type="text"
              autoComplete="off"
              value={values.xboxGamertag}
              onChange={(e) => updateField('xboxGamertag', e.target.value)}
            />
          </FormField>

          <FormField id={fieldId('psnId')} label="PlayStation Network ID">
            <input
              id={fieldId('psnId')}
              name="psnId"
              type="text"
              autoComplete="off"
              value={values.psnId}
              onChange={(e) => updateField('psnId', e.target.value)}
            />
          </FormField>

          <FormField id={fieldId('nintendoFriendCode')} label="Nintendo friend code">
            <input
              id={fieldId('nintendoFriendCode')}
              name="nintendoFriendCode"
              type="text"
              autoComplete="off"
              placeholder="SW-1234-5678-9012"
              value={values.nintendoFriendCode}
              onChange={(e) =>
                updateField('nintendoFriendCode', e.target.value)
              }
            />
          </FormField>
        </div>
      </fieldset>

      <fieldset className="account-settings-form__section">
        <legend>Store preferences</legend>
        <div className="account-settings-form__grid account-settings-form__grid--3">
          <FormField id={fieldId('region')} label="Region">
            <select
              id={fieldId('region')}
              name="region"
              value={values.region}
              onChange={(e) => updateField('region', e.target.value)}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="JP">Japan</option>
              <option value="AU">Australia</option>
            </select>
          </FormField>

          <FormField id={fieldId('preferredCurrency')} label="Currency">
            <select
              id={fieldId('preferredCurrency')}
              name="preferredCurrency"
              value={values.preferredCurrency}
              onChange={(e) => updateField('preferredCurrency', e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="CAD">CAD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </FormField>

          <FormField id={fieldId('language')} label="Language">
            <select
              id={fieldId('language')}
              name="language"
              value={values.language}
              onChange={(e) => updateField('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="account-settings-form__section">
        <legend>Notifications</legend>
        <ul className="account-settings-form__checks">
          <CheckboxField
            id={fieldId('notifyOrderUpdates')}
            label="Order and download updates"
            description="Receipts, pre-order status, and license keys."
            checked={values.notifyOrderUpdates}
            onChange={(checked) => updateField('notifyOrderUpdates', checked)}
          />
          <CheckboxField
            id={fieldId('notifyWishlistDeals')}
            label="Wishlist price drops"
            description="Alerts when games on your wishlist go on sale."
            checked={values.notifyWishlistDeals}
            onChange={(checked) => updateField('notifyWishlistDeals', checked)}
          />
          <CheckboxField
            id={fieldId('notifyFriendActivity')}
            label="Friends & multiplayer"
            description="Invites, co-op sessions, and party requests."
            checked={values.notifyFriendActivity}
            onChange={(checked) =>
              updateField('notifyFriendActivity', checked)
            }
          />
          <CheckboxField
            id={fieldId('notifyNewsletter')}
            label="Weekly store newsletter"
            description="New releases, events, and curated picks."
            checked={values.notifyNewsletter}
            onChange={(checked) => updateField('notifyNewsletter', checked)}
          />
        </ul>
      </fieldset>

      <fieldset className="account-settings-form__section">
        <legend>Privacy</legend>
        <FormField id={fieldId('profileVisibility')} label="Profile visibility">
          <select
            id={fieldId('profileVisibility')}
            name="profileVisibility"
            value={values.profileVisibility}
            onChange={(e) =>
              updateField(
                'profileVisibility',
                e.target.value as AccountSettings['profileVisibility'],
              )
            }
          >
            <option value="public">Public — anyone can view</option>
            <option value="friends">Friends only</option>
            <option value="private">Private — only you</option>
          </select>
        </FormField>

        <CheckboxField
          id={fieldId('showLibraryPublicly')}
          label="Show game library on profile"
          description="Others can see titles you own (not play time or achievements)."
          checked={values.showLibraryPublicly}
          onChange={(checked) => updateField('showLibraryPublicly', checked)}
        />
      </fieldset>

      <fieldset className="account-settings-form__section">
        <legend>Change password</legend>
        <p className="account-settings-form__section-desc">
          Leave blank to keep your current password.
        </p>
        <div className="account-settings-form__grid account-settings-form__grid--2">
          <FormField
            id={fieldId('currentPassword')}
            label="Current password"
            error={errors.currentPassword}
          >
            <input
              id={fieldId('currentPassword')}
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={values.currentPassword}
              onChange={(e) => updateField('currentPassword', e.target.value)}
              aria-invalid={Boolean(errors.currentPassword)}
            />
          </FormField>

          <span className="account-settings-form__grid-span" aria-hidden="true" />

          <FormField
            id={fieldId('newPassword')}
            label="New password"
            error={errors.newPassword}
          >
            <input
              id={fieldId('newPassword')}
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={values.newPassword}
              onChange={(e) => updateField('newPassword', e.target.value)}
              aria-invalid={Boolean(errors.newPassword)}
            />
          </FormField>

          <FormField
            id={fieldId('confirmPassword')}
            label="Confirm new password"
            error={errors.confirmPassword}
          >
            <input
              id={fieldId('confirmPassword')}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
          </FormField>
        </div>
      </fieldset>

      <div className="account-settings-form__actions">
        <button
          type="button"
          className="account-settings-form__button account-settings-form__button--ghost"
          onClick={() => {
            setValues({ ...defaultAccountSettings, ...initialValues })
            setErrors({})
            setStatus('idle')
          }}
        >
          Reset
        </button>
        <button
          type="submit"
          className="account-settings-form__button account-settings-form__button--primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}

function FormField({
  id,
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="account-settings-form__field">
      <label htmlFor={id}>
        {label}
        {required && <span className="account-settings-form__required">*</span>}
      </label>
      {children}
      {hint && (
        <span id={hintId} className="account-settings-form__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="account-settings-form__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

type CheckboxFieldProps = {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function CheckboxField({
  id,
  label,
  description,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <li className="account-settings-form__check">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id}>
        <span className="account-settings-form__check-label">{label}</span>
        {description && (
          <span className="account-settings-form__check-desc">{description}</span>
        )}
      </label>
    </li>
  )
}
