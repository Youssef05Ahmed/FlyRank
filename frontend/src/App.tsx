import { AccountSettingsForm } from './components/AccountSettingsForm/AccountSettingsForm'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__nav">
        <span className="app-shell__brand">FlyRank</span>
        <span className="app-shell__nav-label">Store · Account</span>
      </header>
      <main>
        <AccountSettingsForm
          initialValues={{
            displayName: 'NovaPilot',
            username: 'nova_pilot',
            email: 'player@example.com',
            bio: 'Indie roguelikes and co-op nights.',
            region: 'US',
            preferredCurrency: 'USD',
          }}
          onSubmit={async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 600))
            console.info('Account settings saved', values)
          }}
        />
      </main>
    </div>
  )
}

export default App
