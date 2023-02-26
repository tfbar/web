const {
    isTfInit,
    isTfPlan,
    getState,
    isTfApply,
    isTfError,
    isReadingStatus,
    tfPlanRefreshingText
} = require('./methods')

class DataPacket{

    chunk = null

    get context () {
        const currentContext = isTfInit(this.chunk) && "init" ||
            isTfPlan(this.chunk) && "plan" ||
            isTfApply(this.chunk) && "apply"  ||
            isTfError(this.chunk) && "error"  ||
            null
        return currentContext
    } 
    get resourceId (){
        return this.chunk && this.chunk.split(":")[0]
    }
    get state (){
        return getState(this.chunk)
    }
    get status () {
        const isReading = isReadingStatus(this.chunk)
        const isRefreshing = this.chunk && this.chunk.indexOf(tfPlanRefreshingText) > -1
        return isReading && "reading" ||
            isRefreshing && "refreshing" ||
            null
    }
    toString(){
        return this.chunk + "\n\r"
    }
    constructor(chunk){
        this.chunk = chunk
    }
}

module.exports = { DataPacket }