
const { fromPlanToApply } = require("./methods")

class StateManager{
    currentContext = null
    displayState = "progress-bar"

    updateState(dataPacket) {
        const isPlanToApply = fromPlanToApply(this.currentContext, dataPacket.context) 
        if (dataPacket.context) this.currentContext = dataPacket.context
        this.displayState = isPlanToApply ? 'flush-apply' : 'progress-bar'
    }
    getDisplayState() {
        return this.displayState
    }
    constructor(){

    }
}

module.exports = { StateManager }