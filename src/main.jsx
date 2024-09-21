// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import firebaseConfig from './db/firebaseConfig.js'
import { Provider } from 'react-redux'
import store from './features/Store.js'


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </StrictMode>,
)
