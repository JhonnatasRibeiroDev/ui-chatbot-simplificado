import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// TypeScript may complain about missing type declarations for CSS imports in some setups.
// Suppress that error here since styles are a side-effect import.
// @ts-ignore: CSS module import without type declarations
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
