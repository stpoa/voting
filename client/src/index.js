import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import * as serviceWorker from './serviceWorker'
import './index.css'

ReactDOM.render(React.createElement(App), document.getElementById('root'))

serviceWorker.register()
