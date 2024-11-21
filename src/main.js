import './assets/main.css'

import {createApp} from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import AppController from './AppController.js'
import { useItemsListStore } from '@/store/itemsList';
let controller = new AppController()

//controller.loadApp("Login", {})

controller.eventManager.registerEvent("initItemsList", function(itemsList){
    useItemsListStore.setItemsList(itemsList);
    //Vue.prototype.$itemsList = itemsList;
})

window.controller = controller
//var app = createApp(App)
//app.mount('#app')
//app.use(Vuex)

