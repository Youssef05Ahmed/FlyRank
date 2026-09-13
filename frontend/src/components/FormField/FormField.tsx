import { cloneElement, isValidElement, useId, type ReactElement } from 'react'
import './FormField.css'

type FormFieldProps = {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }>
}

export function FormField({
  label,
  required,
  hint,
  error,
  children,
}: FormFieldProps) {
  const baseId = useId()
  const controlId = children.props.id ?? `${baseId}-control`
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy =
    [hintId, errorId].filter(Boolean).join(' ') || undefined

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children

  return (
    <div className="form-field">
      <label htmlFor={controlId}>
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {' '}
            (required)
          </span>
        )}
      </label>
      {control}
      {hint && (
        <span id={hintId} className="form-field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span
          id={errorId}
          className="form-field__error"
          role="alert"
          aria-live="polite"
        >
          <span className="form-field__error-icon" aria-hidden="true">
            Error:
          </span>{' '}
          {error}
        </span>
      )}
    </div>
  )
}
