const { red, green, lastCommitsTxt, changedFilesTxt } = require('./methods')
const ProgressBar = require('progress');
const readline = require("readline")

class TFProgressBar{
    bar
    messages = []
    status
    barCreationTimestamp
    barCompletionTimestamp
    completionTime
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
      this.barCompletionTimestamp = this.barCreationTimestamp + (completionEstimate * 1.3 || this.completionTime) * 1000
    }
    get completionPercentage(){
        const now = Date.now()
        return Math.min(
            100 * (now - this.barCreationTimestamp) / (this.barCompletionTimestamp - this.barCreationTimestamp),
            90)
    }
    tick(status, messages, gitLog, changedFiles, completionEstimate){        
        if (!status) status = this.status
        if (status && status.indexOf("null") == -1) this.status = status
        const numChangedFiles = changedFiles && changedFiles.split(/\r\n|\r|\n/).length
        
        const gitLogInfo = (process.stdout.rows > 18) ? `\n\r \n\r  ${lastCommitsTxt}:\n ` + gitLog : ""
        const changedFilesInfo = (process.stdout.rows > 20 + numChangedFiles) ? `\n\r \n\r  ${changedFilesTxt}:\n ` + changedFiles : ""
        const info = messages.join("\n\r  ") + gitLogInfo + changedFilesInfo
        const tickPercentage = this.completionPercentage - this.currentBarCompletionPercentage
        if (this.context){
            if (!this.bar) this.init(completionEstimate) // Can't init without time estimation ( derived = require(context )
            this.bar.tick(tickPercentage, { status: this.status, info, percent: this.completionPercentage })
        } 
        this.currentBarCompletionPercentage = this.completionPercentage
        readline.cursorTo(process.stdout, 1000, 1000);

    }
    terminate() {
        this.bar.terminate()
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