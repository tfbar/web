const {
    onlyYes,
    isTfInit,
    isTfPlan,
    isTfApply,
    isTfError,
    isTfWarning,
    planSuccessul,
    isReadingStatus,
    getResourceStatus,
    releasingStateLock,
    tfPlanRefreshingText
} = require('./methods')

class Packet{

    chunk = null

    get context () {
        const currentContext = isTfInit(this.chunk) && "init" ||
            isTfPlan(this.chunk) && "plan" ||
            isTfApply(this.chunk) && "apply"  ||
            isTfError(this.chunk) && "error"  ||
            isTfWarning(this.chunk) && "warning"  ||
            null
        return currentContext
    } 
    get resourceName (){
        return this.chunk && this.chunk.split(":")[0]
    }
    get resourceId (){
        if (!this.chunk) return
        const idArr1 = this.chunk.split("id=")
        if (idArr1.length < 2) return ""
        return idArr1[1].split("]")[0]
    }
    get isResourceUpdate (){
        return this.chunk && this.chunk.indexOf(":") > -1
    }
    get endProcess (){
        if (!this.chunk) return false
        if (this.chunk.indexOf(releasingStateLock) > -1) return "end"
        if (this.chunk.indexOf(onlyYes) > -1) return "end-plan"
        return false    
    }
    get planSuccessul (){
        if (!this.chunk) return false
        if (this.chunk.indexOf(planSuccessul) > -1) return "plan-successul"
        return false    
    }

    get resourceStatus (){
        return getResourceStatus(this.chunk)
    }
    get status () {
        const isReading = isReadingStatus(this.chunk)
        const isRefreshing = this.chunk && this.chunk.indexOf(tfPlanRefreshingText) > -1
        return isReading && "reading" ||
            isRefreshing && "refreshing" ||
            null
    }
    get command () {
        return isTfInit(this.chunk) && "init" ||
            isTfPlan(this.chunk) && "plan" ||
            isTfApply(this.chunk) && "apply" 
            null
    }
    toString(){
        return this.chunk + "\n\r"
    }
    constructor(chunk){
        this.chunk = chunk
    }
}

module.exports = { Packet }