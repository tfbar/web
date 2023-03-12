const { Packet } = require("./packet");
const { logOp, displayOutput, errorsFoundTxt } = require("./methods")
const { saveToOutputFile, saveTime } = require("./files")
const newLine = "\n\r"

class IncomingHandler{
    db
    command
    startTS
    uniqueId
    allOutput
    outputFile
    stateManager
    planSuccessul
    browserTabOpen
    localWebServer
    displayManager
    tfPlanCompleted

    async logStart(){
        await logOp(this.db, {
            uId: this.uniqueId,
            ts: this.startTS,
            op: "start"
        })
    }
    flush () {
	    console.log(this.allOutput)
    }
    async logBrowserTabStatus () {        
        await logOp(this.db, {
            uId: this.uniqueId,
            ts: Date.now(),
            op: "browser-" + (this.browserTabOpen ? "open" : " closed"),
            command: this.command
        })
    }
    async handleIncoming (chunk) {

        this.allOutput += chunk + newLine
        saveToOutputFile(chunk, this.outputFile)
        const packet = new Packet(chunk)
        this.state = packet.state || this.state
        this.displayManager.enableDynamicOutput(!this.localWebServer.isBrowserTabOpen)
        const browserStatusChanged = this.browserTabOpen != this.localWebServer.isBrowserTabOpen
        this.browserTabOpen = this.localWebServer.isBrowserTabOpen
        if (browserStatusChanged) await this.logBrowserTabStatus(this.localWebServer.isBrowserTabOpen)

        if (packet.isResourceUpdate)
            this.displayManager.updateResourceStatus(
                packet.resourceName,
                packet.resourceStatus,
                packet.resourceId
            )

        const tfCommandDetected = packet.command && !this.command
        if (tfCommandDetected){
            this.displayManager.setCommand(packet.command)
            this.localWebServer.setCommand(packet.command)
            this.command = packet.command
            console.clear()
        }

        const commandEnded = packet.endProcess && this.command
        this.planSuccessul = (this.planSuccessul != null) || packet.planSuccessul
        if (commandEnded) this.handleEndSignal(packet.endProcess)
    }

    async handleEndSignal(signal) {

        const errorOnStart = this.allOutput == ""
        if (errorOnStart) return process.exit()

        const timeUntilNow = (Date.now() - this.startTS)/1000

        saveTime(
            timeUntilNow,
            this.outputFile,
            this.command
        )
        
        await logOp(db, {
            uId: this.uniqueId,
            ts: Date.now(),
            op: "end",
            command: this.command
        })

        const planUnsuccessfull = !this.planSuccessul && this.command == "plan"
        this.displayManager.terminate(!planUnsuccessfull)
        if (!planUnsuccessfull) this.flush()
        if (planUnsuccessfull) console.log(errorsFoundTxt)
        if (signal != "end-plan") displayOutput(this.outputFile)
        process.exit()
    }

    
    constructor(outputFile, db, displayManager, localWebServer){
        this.db = db
        this.allOutput = ""
        this.browserTabOpen = false
        this.startTS = Date.now()
        this.outputFile = outputFile
        this.uniqueId = new Date().valueOf();
        this.displayManager = displayManager
        this.localWebServer = localWebServer
        this.planSuccessul = null
        
        // Bindings
        this.handleEndSignal = this.handleEndSignal.bind(this)
        this.handleIncoming = this.handleIncoming.bind(this)
        this.logBrowserTabStatus = this.logBrowserTabStatus.bind(this)
        
    }
}

module.exports = { IncomingHandler }
