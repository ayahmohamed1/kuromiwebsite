import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Hello Kitty Pink & White design tokens
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red:        #ff4d79;          /* Hello Kitty vibrant pink */
    --red-dark:   #d81b60;          /* deeper pink for titles */
    --red-pale:   #ffb6c1;          /* soft pastel pink */
    --pink-soft:  #ffe4ec;          /* baby pink cards / badges */
    --paper:      #fff5f8;          /* Hello Kitty blush white background */
    --bg:         #fff5f8;
    --card:       #ffffff;          /* crisp clean white surfaces */
    --text:       #3c1e28;          /* dark berry brown text */
    --text-light: #8e556b;          /* muted mauve-pink text */
    --font-hand:  'Caveat', cursive;
    --font-body:  'Nunito', sans-serif;
  }

  body {
    background: var(--paper);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* Shared return button used across all pages - Hello Kitty Pink & White */
  .btn-return {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.6rem 1.6rem;
    border-radius: 100px;
    border: 2px solid var(--red);
    background: #ffffff;
    color: var(--red);
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(255, 77, 121, 0.16);
    transition: all 0.25s ease;
  }
  .btn-return:hover {
    background: var(--red);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 77, 121, 0.32);
  }
`

const style = document.createElement('style')
style.textContent = globalStyles
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
