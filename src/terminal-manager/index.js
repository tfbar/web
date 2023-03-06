const readline = require("readline")

const {
    border,
    getTitle,
    startupMsg,
    clearCursor,
    getDuration,
    getDynamicLine,
    defaultDuration,
    browserTabOpenTxt,
    createProgressBar,
    getCompletionPercentage
} = require("./methods")

const dynamicLines = 3

class TerminalManager{
    count
    command
    duration
    _progressBar
    dynamicResources
    averageDurations
    startMsgDisplayed
    dynamicOutputEnabled
    barCreationTimestamp
    barCompletionTimestamp
    currentBarCompletionPercentage

    setCommand (command) {
        this.command = command
        const pastDuration = getDuration(command, this.averageDurations)
        const durationSec = pastDuration || defaultDuration
        this.duration = durationSec * 1000
        this.barCompletionTimestamp = this.barCreationTimestamp + this.duration
        this.render()
    }
    displayStartupMsg () {
        console.clear()
	    console.log(startupMsg)
    }
    initProgressBar () {
        return createProgressBar()
    }
    get progressBar () {
        const shouldInitBar = !this._progressBar && this.duration && this.command
        if (shouldInitBar) this._progressBar = this.initProgressBar()
        return this._progressBar
    }
    get completionPercentage () {
        return getCompletionPercentage(this.barCreationTimestamp, this.barCompletionTimestamp) 
    }
    terminate() {
        this.progressBar &&  this.progressBar.terminate()
        console.clear()
    }
    updateResourceStatus(name, status, id) {
        this.dynamicResources.push({ name, status, id })
        this.render()
    }
    get dynamicText(){
        const hasInput = this.dynamicResources.length > dynamicLines
        const terminalBorder = hasInput ? border : ""
        const dynamic = this.dynamicResources.slice(-dynamicLines)
        const dText = dynamic.reduce(getDynamicLine, "")
        return terminalBorder + dText + terminalBorder
    }
    enableDynamicOutput(enable){
        if (this.dynamicOutputEnabled != enable) console.clear()
        this.dynamicOutputEnabled = enable
    }
    render() {
        if (!this.progressBar) return this.displayStartupMsg()
        const tickPercentage = this.completionPercentage  - this.currentBarCompletionPercentage

        readline.cursorTo(process.stdout, 0, 0);
        this.progressBar.tick(tickPercentage,{
            title: getTitle(this.command), 
            dynamicText: this.dynamicOutputEnabled ? this.dynamicText : browserTabOpenTxt,
            staticText: this.staticText,
            percent: this.completionPercentage
        })

        this.currentBarCompletionPercentage = this.completionPercentage
        clearCursor()
    }
    constructor(staticText, averageDurations) {
        this.staticText = staticText
        this.averageDurations = averageDurations
        this.barCreationTimestamp = Date.now()
        this.currentBarCompletionPercentage = 0
        this.dynamicResources = []
        for(let i=0; i++; i<dynamicLines){
            dynamicResources.push("")
        };
        this._progressBar = null
    }
}

module.exports = { TerminalManager }