const { stripFinalNewline, getOutputRef, showTitle } = require('./methods')
const { TFProgressBar } = require('./progress-bar')
const readline = require("readline")

class DisplayManager{
    context
    count = {}
    output = null
    oldCountLength
    outputFilePath
    lastDisplayState
    progressBar = null
    userPrompt = false
    currentDataPacket = null

    resetOutput() {
        this.output = ""
    }
    flush(init = true) {
        console.log("\n\t" + this.output)
        this.progressBar.terminate()
        init && this.progressBar.init()
        this.resetOutput()
    }
    init(clear = false) {
        this.prepareConsole(clear)
        this.progressBar = new TFProgressBar()
    }
    append(dataPacket) { // Add incoming data to memory
        this.currentDataPacket = dataPacket
        this.output += dataPacket.toString()        
        this.status = dataPacket.status || this.status
        const state = this.currentDataPacket.state
        if (state) this.count[state.trim()] = (this.count[state.trim()] || 0) + 1
        // Handle context change
        const contextHasChanged = this.currentDataPacket.context && this.context != this.currentDataPacket.context
        if (contextHasChanged) {
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
        showTitle(this.context)
        if (!clear) return
    }
    tickProgressBar (gitLog, changedFiles, completionEstimate) {
        let messages = []
        Object.keys(this.count).forEach(
            stateName => messages.push(`${stateName}: ${this.count[stateName]} resources`)
        )
        // Prepare terminal dynamic info
        messages = messages.concat(getOutputRef(this.outputFilePath))
        const state = this.currentDataPacket.state + "..."
        const countLength = Object.keys(this.count).length
        const shouldClear = countLength > this.oldCountLength
        this.prepareConsole(shouldClear)
        this.oldCountLength = countLength
        // Render progress bar and metadata
        this.progressBar.tick(state, messages, gitLog, changedFiles, completionEstimate)
    }
    render (displayState, gitLog, changedFiles, completionEstimate) {
        if (displayState === 'flush-apply' && !this.userPrompt) {
            this.output = stripFinalNewline(stripFinalNewline(this.output))
            this.userPrompt = true
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