const ProgressBar = require('progress');
const readline = require("readline")
const { red, green, lastCommitsTxt, changedFilesTxt, gitStatisticsTxt } = require('./methods')

class TFProgressBar{
    // A wrapper around terminal progress bar
    bar
    status
    messages = []
    completionTime
    barCreationTimestamp
    barCompletionTimestamp
    currentBarCompletionPercentage = 0

    init(completionEstimate){
      this.bar = new ProgressBar(`  :status [:bar] :percent :etas \n\r \n\r  :info`, {
            complete: green,
            incomplete: red,
            width: 20,
            total: 100,
            clear: true
          });
      this.barCreationTimestamp = Date.now()
      const estimatedDuration = (completionEstimate * 1.3 || this.completionTime) * 1000
      this.barCompletionTimestamp = this.barCreationTimestamp + estimatedDuration
    }
    get completionPercentage(){
        // Calculate progress bar completion percentage
        const now = Date.now()
        const currentProgress = (now - this.barCreationTimestamp)
        const estimatedDuration = (this.barCompletionTimestamp - this.barCreationTimestamp)
        return Math.min(100 *  currentProgress / estimatedDuration, 90)
    }
    tick(status, messages, gitLog, changedFiles, completionEstimate){        
        if (!status) status = this.status
        if (status && status.indexOf("null") == -1) this.status = status

        // Get misc. info for terminal
        const numChangedFiles = changedFiles && changedFiles.split(/\r\n|\r|\n/).length
        const gitLogInfo = (process.stdout.rows > 18) ? `\n\r \n\r  ${gitStatisticsTxt}:\n\r  ${lastCommitsTxt}:\n  ` + gitLog : ""
        const changedTitle = changedFiles.length <3 ? "" : `\n\r \n\r  ${changedFilesTxt}:\n `
        const changedFilesInfo = (process.stdout.rows > 20 + numChangedFiles) ? changedTitle + changedFiles : ""
        const info = messages.join("\n\r  ") + gitLogInfo + changedFilesInfo

        if (this.context){ // Only start progress bar after getting context ( plan/apply etc)
            const tickPercentage = this.completionPercentage - this.currentBarCompletionPercentage
            if (!this.bar) this.init(completionEstimate)
            const padding = new Array(Math.round((14 - this.status.length)/2)).join(' ')
            const status =  padding + this.status + padding
            this.bar.tick(tickPercentage, { status, info, percent: this.completionPercentage })
        } 
        this.currentBarCompletionPercentage = this.completionPercentage

        // Get blinking cursor off the terminal
        readline.cursorTo(process.stdout, 1000, 1000);

    }
    terminate() {
        this.bar && this.bar.terminate()
    }
    setContext(context){
        this.context = context
    }
    constructor(completionTime = 3, context){
        this.context = context
        this.completionTime = completionTime
    }
}

module.exports = { TFProgressBar }