import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {chatReducer} from './redux/ChatReducer.jsx'
import{ legacy_createStore as createStore} from "redux"
import { Provider} from 'react-redux'

const store = createStore(chatReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
   </Provider>,
)
