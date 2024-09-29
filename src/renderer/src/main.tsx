import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

// Import the main CSS file
import './assets/main.css'

// Import the App component
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  // Strict mode is a development tool that helps catch potential issues in the code.
  // It is not necessary for production, but it is recommended to use it during development.
  <React.StrictMode>

    <App />

  </React.StrictMode>

)
