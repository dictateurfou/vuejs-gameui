import * as Vue from 'vue'
import Router from './router/index.js'
import store from './store/index.js'
import App from './App.vue'
import EventManager from './EventManager.js'
/* Fin liste des apps */
const AppList = {
    //"App": () => import('./app/Login.vue'),
}
//tablette App (provient de l'ancienne version a refacto)
const tabletteApp = []

//lazy load for store
const storeList = {
    //'gangManagement': () => import('./store/gangManagementStore.js'),
}

export default class AppController {
    app = {};
    params = {};
    eventManager = new EventManager();
    async loadApp(appName,params){

        if(this.app[appName] !== undefined) return;
        this.params[appName] = params;
        await this.loadStore(appName);
        const instance = Vue.createApp(App)
        instance.config.globalProperties = {
            controller: this,
            params: this.params[appName],
            appName
        }
        console.log("o")
        let div = document.createElement("DIV");
        div.id = appName
        div.classList = ["body-simul"]
        document.body.appendChild(div);
        instance.provide("dynamicComponent", Vue.shallowRef(Router[`${appName}/index`]))
        instance.mount("#" + appName)
        this.app[appName] = instance;
    }

    async loadStore(appName){
        if(storeList[appName] !== undefined){
            let module = await storeList[appName]();
            store.registerModule(appName,module.default,{ preserveState: false });
        }
    }

    setStore(appName,object){
        for(const [k,v] of Object.entries(object)){
            store.state[appName][k] = v
        }
    }

    unloadStore(appName){
        if(storeList[appName] !== undefined){
            store.unregisterModule(appName);
        }
    }

    async changePage(appName,pageName,params = {}){
        if(Router[`${appName}/${pageName}`] !== undefined){
            this.params[appName] = params;
            this.app[appName]._instance.data.dynamicComponent = Vue.shallowRef(await Router[`${appName}/${pageName}`])
        }
    }

    destroyApp(appName){
        if(this.app[appName] === undefined) return;
        this.app[appName].unmount()
        delete this.app[appName]
        document.querySelector("#" + appName).remove();
        delete this.params[appName];
        this.unloadStore(appName);
    }

}