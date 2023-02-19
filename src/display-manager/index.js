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
        // Output everything
        console.log("\n\t" + this.output)
        this.progressBar.terminate()
        init && this.progressBar.init()
        this.resetOutput()
    }
    init(clear = false) {
        this.prepareConsole(clear)
        this.progressBar = new TFProgressBar()
    }
    append(dataPacket) {
        // Add incoming data to memory
        this.currentDataPacket = dataPacket
        this.output += dataPacket.toString()        
        this.status = dataPacket.status || this.status
        const state = this.currentDataPacket.state
        if (state) this.count[state.trim()] = (this.count[state.trim()] || 0) + 1

        // On context (e.g plan => apply), reset terminal
        const contextExists = this.currentDataPacket.context,
            contextChanged = this.context != this.currentDataPacket.context,
            contextHasChanged = contextExists && contextChanged

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
        const contextMissing = (!this.context || this.context.length < 2)
        if (contextMissing) return

        this.progressBar.setContext(this.context)
        showTitle(this.context)
    }

    tickProgressBar (gitLog, changedFiles, completionEstimate, feed) {
        let messages = []
        Object.keys(this.count).forEach(
            stateName => messages.push(`${stateName}: ${this.count[stateName]} resources`)
        )
        // Add output file path
        const outputArray = getOutputRef(this.outputFilePath)
        messages = messages.concat(outputArray)

        const state = this.currentDataPacket.state + "..."
        const countLength = Object.keys(this.count).length
        const shouldClear = countLength > this.oldCountLength
        this.prepareConsole(shouldClear)
        this.oldCountLength = countLength

        // Render progress bar and metadata
        this.progressBar.tick(state, messages, gitLog, changedFiles, completionEstimate, feed)
    }
    
    render (displayState, gitLog, changedFiles, completionEstimate, feed) {

        if (displayState === 'flush-apply' && !this.userPrompt) {
            this.output = stripFinalNewline(stripFinalNewline(this.output))
            this.userPrompt = true
            this.count = {}
        }
        if (displayState === 'progress-bar') {
            if (this.lastDisplayState == "flush-apply") this.init(true)
            this.tickProgressBar(gitLog, changedFiles, completionEstimate, feed)
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