import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import './bootstrap.min.css'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios'

if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL
}

// axios.defaults.baseURL = 'http://35.154.127.106:5000/'

const root = ReactDOM.createRoot(
  document.getElementById('root')
)

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)

reportWebVitals()