export default class EventManager{
    eventList = {}

    registerEvent(event,fn){
        this.eventList[event] = fn
    }

    callEvent(event,...args){
        this.eventList[event](...args)
    }

    removeEvent(event){
        delete this.eventList[event]
    }

    callGameEvent(event,...args){
        //Not implemented
    }

}