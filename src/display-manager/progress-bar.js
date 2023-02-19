const ProgressBar = require('progress');
const readline = require("readline")
const { red, green, magentaStart, colorEnd,
    newLine,
    lineCount,
    newSection,
    lastCommitsTxt,
    changedFilesTxt, 
    getStatusPadding,
    gitStatisticsTxt
} = require('./methods')

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
      const estimatedDuration = (completionEstimate * 1.3 || this.completionTime) * 1000
      
      this.bar = new ProgressBar(`  :status [:bar] :percent :etas ${newSection}:info`, {
            complete: green,
            incomplete: red,
            width: 20,
            total: 100,
            clear: true
          });

      this.barCreationTimestamp = Date.now()
      this.barCompletionTimestamp = this.barCreationTimestamp + estimatedDuration
    }

    get completionPercentage(){
        const now = Date.now()
        const currentProgress = (now - this.barCreationTimestamp)
        const estimatedDuration = (this.barCompletionTimestamp - this.barCreationTimestamp)
        return Math.min(100 *  currentProgress / estimatedDuration, 90)
    }

    tick(status, messages, gitLog, changedFiles, completionEstimate, feed){        
        if (!status) status = this.status
        if (status && status.indexOf("null") == -1) this.status = status

        // Create misc. info for terminal
        const numChangedFiles = changedFiles && lineCount(changedFiles),
            shouldAddCommits = process.stdout.rows > 18,
            shouldAddChangedFiles = process.stdout.rows > 20 + numChangedFiles,
            shouldAddFeed = process.stdout.rows > 25 + numChangedFiles,
            gitLogTxt = `${newSection}${gitStatisticsTxt}:${newLine}  ${lastCommitsTxt}:\n  ` + gitLog,
            gitLogInfo = shouldAddCommits ? gitLogTxt : "",
            changedTitle = changedFiles.length < 3 ? "" : `${newSection} ${changedFilesTxt}:\n `,
            changedFilesInfo = shouldAddChangedFiles ? changedTitle + changedFiles : ""

            const feedTxt = feed ? `${newLine}  ` + magentaStart + feed.title + ":" +
                `${newLine}  ` +magentaStart + feed.text + colorEnd : ""

            const feedInfo = shouldAddFeed ? feedTxt : ""
            const info = messages.join(`${newLine}  `) + gitLogInfo + changedFilesInfo + feedInfo

        if (this.context){ // Only start progress bar after getting context ( plan/apply etc)

            const tickPercentage = this.completionPercentage - this.currentBarCompletionPercentage
            if (!this.bar) this.init(completionEstimate)
            const status = this.status + getStatusPadding(this.status)

            this.bar.tick(tickPercentage,{
                    status,
                    info,
                    percent: this.completionPercentage
                })
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