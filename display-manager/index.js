const { doYouWantPrompt, getOutputRef, yellowStart, colorEnd } = require('./methods')
const { TFProgressBar } = require('./progress-bar')
const readline = require("readline")

class DisplayManager{
    output = null
    progressBar = null
    promptAdded = false
    currentDataPacket = null
    count = {}
    context
    outputFilePath
    lastDisplayState
    oldCountLength

    resetOutput() {
        this.output = ""
    }
    flush() {
        console.log("\n\t" + this.output)
        this.progressBar.terminate()
        this.progressBar.init()
        this.resetOutput()
    }
    init(clear = false) {
        this.prepareConsole(clear)
        this.progressBar = new TFProgressBar()
    }
    append(dataPacket) {
        this.currentDataPacket = dataPacket
        this.output += dataPacket.toString()        
        this.status = dataPacket.status || this.status
        const state = this.currentDataPacket.state
        if (state) this.count[state.trim()] = (this.count[state.trim()] || 0) + 1
        if (this.currentDataPacket.context && this.context != this.currentDataPacket.context) {
            this.context = this.currentDataPacket.context
            this.prepareConsole()
            console.clear()
        }
        return this.context 
    }
    prepareConsole(clear = false) {
        if (clear) console.clear()
        readline.cursorTo(process.stdout, 0, 0);
        if (!this.context || this.context.length < 2) return
        this.progressBar.setContext(this.context)
        console.log("  " + yellowStart + "Terraform " + this.context.charAt(0).toUpperCase() + this.context.slice(1)  + "\n\r"+ colorEnd)
        if (!clear) return
    }
    tickProgressBar (gitLog, changedFiles, completionEstimate) {
        let messages = []
        Object.keys(this.count).forEach(stateName => messages.push(`${stateName}: ${this.count[stateName]} resources`))
        messages = messages.concat(getOutputRef(this.outputFilePath))
        const state = this.currentDataPacket.state + "..."
        const countLength = Object.keys(this.count).length
        const shouldClear = countLength > this.oldCountLength
        this.prepareConsole(shouldClear)
        this.oldCountLength = countLength
        this.progressBar.tick(state, messages, gitLog, changedFiles, completionEstimate)
    }
    render (displayState, gitLog, changedFiles, completionEstimate) {
        if (displayState === 'flush-apply' && !this.promptAdded) {
            this.output = this.output + doYouWantPrompt;
            this.promptAdded = true
            this.count = {}
        }
        if (displayState === 'progress-bar') {
            if (this.lastDisplayState == "flush-apply") this.init(true)
            this.tickProgressBar(gitLog, changedFiles, completionEstimate)
        }
        
        if (displayState.indexOf('flush') > -1) this.flush()
        this.lastDisplayState = displayState
    }
    constructor(outputFilePath){
        this.outputFilePath = outputFilePath
        this.resetOutput()
    }
}

module.exports = { DisplayManager }