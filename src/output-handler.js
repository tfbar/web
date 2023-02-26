const { DataPacket } = require("./data-packet");
const { DisplayManager } = require("./display-manager");
const { StateManager } = require("./state-manager");
const { saveTime, readChangedFiles, readGitLog, saveToOutputFile, startupMsg, logOp, clearCursor } = require("./methods")
class TerraformOutputHandler{
    db
    startTS
    context
    uniqueId
    planSaved
    contextInit
    contextPlan
    stateManager
    applyStarted
    outputFilePath
    averageDurations

    async init(){
        this.stateManager = new StateManager()
        this.displayManager = new DisplayManager(this.outputFilePath)
        this.displayManager.init()
        this.startTS = Date.now()
        
        await logOp(this.db, {
            uId: this.uniqueId,
            ts: this.startTS,
            op: "init"
        })
    }

    listen(feed){

        const handleIncoming = async (chunk, endOfInput = false) => {
            if (this.context == "end") {
                saveToOutputFile(chunk, this.outputFilePath)
                return this.displayManager.flush(false, false)
            }
            // User has entered input in tf apply frompt 
            const userEnteredYesNo = this.planSaved && !this.applyStarted
            if ( userEnteredYesNo ) {
                this.startTS = Date.now()
                this.applyStarted = true
            }
            
            // Save incoming data in file
            saveToOutputFile(chunk, this.outputFilePath)
            
            // Handle incomming data chunks
            const dataPacket = new DataPacket(chunk)
            this.stateManager.updateState(dataPacket)
            const context = this.displayManager.append(dataPacket)
           
            if (context && (context != this.context)){
                this.context = context

                await logOp(this.db, {
                    uId: this.uniqueId,
                    ts: this.startTS,
                    op: context
                })
                if (endOfInput) {
                    this.context = "end"
                    saveToOutputFile(chunk + this.output, this.outputFilePath)
                    this.displayManager.flush(false, false)
                }
            }
            
            // Detect tf command
            if (this.displayManager.context == "init") this.contextInit = true
            if (this.displayManager.context == "plan") this.contextPlan = true

            // In case system has prompted the user for apply yes/no
            let displayState = this.stateManager.getDisplayState()
            if (displayState == 'flush-apply'){
                const timeUntilNow = ( Date.now() - this.startTS ) / 1000
                saveTime(timeUntilNow, outputFilePath, "plan")
                this.planSaved = true
            }

            // Estimate task completion time
            const completionEstimate = context == "plan" && this.averageDurations.plans ||
                context == "apply" && this.averageDurations.applies ||
                context == "init" && this.averageDurations.inits
            
            if (endOfInput || displayState=="warning" ) { displayState = "flush" }
            // Render data in terminal
            if (dataPacket.state && !endOfInput) this.displayManager.render(
                displayState,
                readGitLog(),
                readChangedFiles(),
                completionEstimate,
                feed
            )
          }
        process.stdin.on('data', handleIncoming);
          
        process.stdin.on('end', async (chunk) => {
          
            handleIncoming(chunk, true)
            
            // Save duration for future estimates
            saveTime((Date.now() - this.startTS)/1000, this.outputFilePath,
                this.planSaved && "apply" ||
                this.contextInit && "init" ||
                this.contextPlan && "plan" || "other")
            
            await logOp(this.db, {
                uId: this.uniqueId,
                ts: Date.now(),
                op: "end"
            })
        });

        process.stdin.on('error', console.error);
    }

    

    constructor(outputFilePath, averageDurations, db){
        console.clear()
        console.log(startupMsg)
        clearCursor()
        this.db = db
        this.outputFilePath = outputFilePath
        this.averageDurations = averageDurations
        this.uniqueId = new Date().valueOf();
    }
}

module.exports = { TerraformOutputHandler }
