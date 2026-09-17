import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:5000'
} else {
  axios.defaults.baseURL =
    process.env.REACT_APP_API_URL ||
    'https://cartnova-5dvn.onrender.com'
}

const root = ReactDOM.createRoot(
  document.getElementById('root')
)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

reportWebVitals()
