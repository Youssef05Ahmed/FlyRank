import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AccountSettingsForm } from './AccountSettingsForm'

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^username/i), 'Joey')
  await user.type(screen.getByLabelText(/^email/i), 'joey@example.com')
  await user.click(screen.getByRole('radio', { name: 'PC' }))
  await user.type(screen.getByLabelText(/^country/i), 'Egypt')
}

describe('AccountSettingsForm', () => {
  it('defaults newsletter to enabled', () => {
    render(<AccountSettingsForm />)
    expect(screen.getByLabelText(/^newsletter/i)).toBeChecked()
  })

  it('submits valid data and shows success state', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<AccountSettingsForm onSubmit={onSubmit} />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      username: 'Joey',
      email: 'joey@example.com',
      preferredPlatform: 'PC',
      country: 'Egypt',
      newsletter: true,
    })

    expect(
      screen.getByText(/your changes were saved successfully/i),
    ).toBeInTheDocument()
  })

  it('shows required-field errors when empty', async () => {
    const user = userEvent.setup()
    render(<AccountSettingsForm />)

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/select your preferred gaming platform/i)).toBeInTheDocument()
    expect(screen.getByText(/country is required/i)).toBeInTheDocument()
  })

  it('shows invalid email error', async () => {
    const user = userEvent.setup()
    render(<AccountSettingsForm />)

    await user.type(screen.getByLabelText(/^username/i), 'Joey')
    await user.type(screen.getByLabelText(/^email/i), 'bad-email')
    await user.click(screen.getByRole('radio', { name: 'PlayStation' }))
    await user.type(screen.getByLabelText(/^country/i), 'Egypt')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument()
  })

  it('requires platform selection', async () => {
    const user = userEvent.setup()
    render(<AccountSettingsForm />)

    await user.type(screen.getByLabelText(/^username/i), 'Joey')
    await user.type(screen.getByLabelText(/^email/i), 'joey@example.com')
    await user.type(screen.getByLabelText(/^country/i), 'Egypt')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(
      await screen.findByText(/select your preferred gaming platform/i),
    ).toBeInTheDocument()
  })

  it('persists newsletter toggle state on submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<AccountSettingsForm onSubmit={onSubmit} />)
    await fillValidForm(user)
    await user.click(screen.getByLabelText(/^newsletter/i))
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit.mock.calls[0][0].newsletter).toBe(false)
  })

  it('associates username error with the input for accessibility', async () => {
    const user = userEvent.setup()
    render(<AccountSettingsForm />)

    await user.click(screen.getByRole('button', { name: /save changes/i }))

    const usernameInput = screen.getByLabelText(/^username/i)
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true')
    expect(usernameInput.getAttribute('aria-describedby')).toMatch(/error/)
  })

  it('rejects very long username', async () => {
    const user = userEvent.setup()
    render(<AccountSettingsForm />)

    await user.type(screen.getByLabelText(/^username/i), 'x'.repeat(33))
    await user.type(screen.getByLabelText(/^email/i), 'joey@example.com')
    await user.click(screen.getByRole('radio', { name: 'Xbox' }))
    await user.type(screen.getByLabelText(/^country/i), 'Egypt')
    await user.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/32 characters or fewer/i)).toBeInTheDocument()
  })

  it('calls onSubmit only once on repeated clicks while saving', async () => {
    const user = userEvent.setup()
    let resolveSubmit!: () => void
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )

    render(<AccountSettingsForm onSubmit={onSubmit} />)
    await fillValidForm(user)

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveButton)
    await user.click(saveButton)

    expect(onSubmit).toHaveBeenCalledTimes(1)
    resolveSubmit()
    await waitFor(() =>
      expect(screen.getByText(/saved successfully/i)).toBeInTheDocument(),
    )
  })
})
