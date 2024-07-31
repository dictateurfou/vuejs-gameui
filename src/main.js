import './assets/main.css'

import {createApp} from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import AppController from './AppController.js'

let controller = new AppController()

//controller.loadApp("App", {})

window.controller = controller
//var app = createApp(App)
//app.mount('#app')
//app.use(Vuex)

