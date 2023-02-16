
const { fromPlanToApply } = require("./methods")

class StateManager{
    currentContext = null
    displayState = "progress-bar"

    updateState(dataPacket) {
        // Either show the progress bar or flush all outputs
        const isPlanToApply = fromPlanToApply(this.currentContext, dataPacket.context) 
        if (dataPacket.context) this.currentContext = dataPacket.context
        this.displayState = isPlanToApply ? 'flush-apply' : 'progress-bar'
    }
    getDisplayState() {
        return this.displayState
    }
}

module.exports = { StateManager }