import { AccountSettingsForm } from './components/AccountSettingsForm/AccountSettingsForm'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-shell__nav">
        <span className="app-shell__brand">FlyRank</span>
        <span className="app-shell__nav-label">Gaming store · Account</span>
      </header>
      <main>
        <AccountSettingsForm
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 400))
          }}
        />
      </main>
    </div>
  )
}

export default App
