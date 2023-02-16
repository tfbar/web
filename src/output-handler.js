
const { DataPacket } = require("./data-packet");
const { DisplayManager } = require("./display-manager");
const { StateManager } = require("./state-manager");
const { saveTime, readChangedFiles, readGitLog, getChangedFiles, saveToOutputFile} = require("./methods")

class TerraformOutputHandler{
    startTS
    planSaved
    contextInit
    contextPlan
    stateManager
    applyStarted
    outputFilePath
    averageDurations

    init(){
        process.stdin.setEncoding('utf8');
        this.stateManager = new StateManager()
        this.displayManager = new DisplayManager(this.outputFilePath)
        this.displayManager.init()
        this.startTS = Date.now()
    }
    listen(){
        const self = this
        process.stdin.on('data', function (chunk) {

            // User has entered input in tf apply frompt 
            const userEnteredYesNo = self.planSaved && !self.applyStarted
            if ( userEnteredYesNo ) {
                self.startTS = Date.now()
                self.applyStarted = true    
            }
            
            // Save incoming data in file
            saveToOutputFile(chunk, self.outputFilePath)
            
            // Handle incomming data chunks
            const dataPacket = new DataPacket(chunk)
            self.stateManager.updateState(dataPacket)
            const context = self.displayManager.append(dataPacket)

            // Detect tf command
            if (self.displayManager.context == "init") this.contextInit = true
            if (self.displayManager.context == "plan") this.contextPlan = true

            // In case system has prompted the user for apply yes/no
            const displayState = self.stateManager.getDisplayState()
            if (displayState == 'flush-apply'){
                saveTime((Date.now() - self.startTS)/1000, outputFilePath, "plan")
                self.planSaved = true
            }

            // Estimate task completion time
            const completionEstimate = context == "plan" && self.averageDurations.plans ||
                context == "apply" && self.averageDurations.applies ||
                context == "init" && self.averageDurations.inits
            
            // Render data in terminal
            if (dataPacket.state) self.displayManager.render(
                displayState,
                readGitLog(),
                readChangedFiles(),
                completionEstimate
            )
          });
        process.stdin.on('end', function () {
            // Flush all data
            self.displayManager.flush(false)

            // Save duration for future estimates
            saveTime((Date.now() - self.startTS)/1000, this.outputFilePath,
                self.planSaved && "apply" ||
                self.contextInit && "init" ||
                self.contextPlan && "plan" || "other")
        });
        process.stdin.on('error', console.error);
    }

    constructor(outputFilePath, averageDurations){
        this.outputFilePath = outputFilePath
        this.averageDurations = averageDurations
    }
}

module.exports = { TerraformOutputHandler }
