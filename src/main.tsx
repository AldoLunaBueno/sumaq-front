import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

// TODO: Reemplaza con tus credenciales de Auth0
const domain = 'YOUR_AUTH0_DOMAIN'
const clientId = 'YOUR_AUTH0_CLIENT_ID'

const onRedirectCallback = (appState?: any) => {
  const target = appState?.returnTo || window.location.pathname
  window.history.replaceState({}, document.title, target)
}

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
)
