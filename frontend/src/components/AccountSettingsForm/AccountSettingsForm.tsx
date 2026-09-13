import { useId, useRef, useState, type FormEvent } from 'react'
import {
  hasValidationErrors,
  validateAccountSettings,
} from '../../lib/validateAccountSettings'
import {
  PLATFORMS,
  USERNAME_MAX_LENGTH,
  defaultAccountSettings,
  type AccountSettings,
  type AccountSettingsErrors,
  type PreferredPlatform,
} from '../../types/accountSettings'
import { FormField } from '../FormField/FormField'
import '../FormField/FormField.css'
import './AccountSettingsForm.css'

type AccountSettingsFormProps = {
  initialValues?: Partial<AccountSettings>
  onSubmit?: (values: AccountSettings) => void | Promise<void>
}

export function AccountSettingsForm({
  initialValues,
  onSubmit,
}: AccountSettingsFormProps) {
  const formTitleId = useId()
  const platformGroupName = useId()
  const [values, setValues] = useState<AccountSettings>({
    ...defaultAccountSettings,
    ...initialValues,
  })
  const [errors, setErrors] = useState<AccountSettingsErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'saved'>('idle')
  const submitInFlight = useRef(false)

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
    if (submitInFlight.current) return

    const nextErrors = validateAccountSettings(values)
    setErrors(nextErrors)
    if (hasValidationErrors(nextErrors)) return

    submitInFlight.current = true
    setStatus('submitting')

    try {
      await onSubmit?.({
        ...values,
        username: values.username.trim(),
        email: values.email.trim(),
        country: values.country.trim(),
      })
      setStatus('saved')
    } catch {
      setStatus('idle')
    } finally {
      submitInFlight.current = false
    }
  }

  const platformErrorId = `${formTitleId}-platform-error`

  return (
    <form
      className="account-settings-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={formTitleId}
    >
      <header className="account-settings-form__header">
        <div>
          <h1 id={formTitleId}>Account settings</h1>
          <p className="account-settings-form__subtitle">
            Update your FlyRank gaming store profile.
          </p>
        </div>
        {status === 'saved' && (
          <p
            className="account-settings-form__status"
            role="status"
            aria-live="polite"
          >
            Your changes were saved successfully.
          </p>
        )}
      </header>

      <div className="account-settings-form__fields">
        <FormField
          label="Username"
          required
          error={errors.username}
        >
          <input
            type="text"
            name="username"
            autoComplete="username"
            maxLength={USERNAME_MAX_LENGTH + 16}
            value={values.username}
            onChange={(e) => updateField('username', e.target.value)}
          />
        </FormField>

        <FormField label="Email" required error={errors.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </FormField>

        <fieldset
          className="account-settings-form__platform"
          aria-invalid={errors.preferredPlatform ? true : undefined}
          aria-describedby={
            errors.preferredPlatform ? platformErrorId : undefined
          }
        >
          <legend>
            Preferred platform
            <span className="form-field__required" aria-hidden="true">
              {' '}
              (required)
            </span>
          </legend>
          <div
            className="account-settings-form__platform-options"
            role="radiogroup"
            aria-label="Preferred platform"
          >
            {PLATFORMS.map((platform) => (
              <label key={platform} className="account-settings-form__radio">
                <input
                  type="radio"
                  name={platformGroupName}
                  value={platform}
                  checked={values.preferredPlatform === platform}
                  onChange={() =>
                    updateField('preferredPlatform', platform as PreferredPlatform)
                  }
                />
                <span>{platform}</span>
              </label>
            ))}
          </div>
          {errors.preferredPlatform && (
            <span
              id={platformErrorId}
              className="form-field__error account-settings-form__platform-error"
              role="alert"
              aria-live="polite"
            >
              <span className="form-field__error-icon" aria-hidden="true">
                Error:
              </span>{' '}
              {errors.preferredPlatform}
            </span>
          )}
        </fieldset>

        <FormField label="Country" required error={errors.country}>
          <input
            type="text"
            name="country"
            autoComplete="country-name"
            value={values.country}
            onChange={(e) => updateField('country', e.target.value)}
          />
        </FormField>

        <div className="account-settings-form__toggle">
          <input
            id={`${formTitleId}-newsletter`}
            type="checkbox"
            checked={values.newsletter}
            onChange={(e) => updateField('newsletter', e.target.checked)}
          />
          <label htmlFor={`${formTitleId}-newsletter`}>
            <span className="account-settings-form__toggle-label">
              Newsletter
            </span>
            <span className="account-settings-form__toggle-desc">
              Receive new releases, sales, and store events (enabled by default).
            </span>
          </label>
        </div>
      </div>

      <div className="account-settings-form__actions">
        <button
          type="submit"
          className="account-settings-form__button account-settings-form__button--primary"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
