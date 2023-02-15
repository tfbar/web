#!/usr/bin/env node
const fs = require("fs")
const { initFileSystem, saveData, saveTime, getLog, getChangedFiles, averageApplies, averageInits, averagePlans } = require("./methods")
const { DataPacket } = require("./data-packet");
const { DisplayManager } = require("./display-manager");
const { StateManager } = require("./state-manager");
const outputFilePath = initFileSystem()
class TerraformOutputHandler{

    stateManager = null
    startTS
    planSaved
    contextInit
    contextPlan
    applyStarted = false

    init(){
        process.stdin.setEncoding('utf8');
        this.stateManager = new StateManager()
        this.displayManager = new DisplayManager(outputFilePath)
        this.displayManager.init()
        this.startTS = Date.now()
    }
    listen(){
        const self = this
        process.stdin.on('data', function (chunk) {
            if (self.planSaved && !self.applyStarted ) {
                self.startTS = Date.now()
                self.applyStarted = true
            }
            saveData(chunk, outputFilePath)
            const dataPacket = new DataPacket(chunk)
            self.stateManager.updateState(dataPacket)
            const context = self.displayManager.append(dataPacket)
            if (self.displayManager.context == "init") this.contextInit = true
            if (self.displayManager.context == "plan") this.contextPlan = true
            const displayState = self.stateManager.getDisplayState()
            if (displayState == 'flush-apply'){
                saveTime((Date.now() - self.startTS)/1000, outputFilePath, "plan")
                self.planSaved = true
            }
            const completionEstimate = context == "plan" && averagePlans ||
                context == "apply" && averageApplies ||
                context == "init" && averageInits
            self.displayManager.render(displayState, getLog(), getChangedFiles(), completionEstimate)
          
          });
        process.stdin.on('end', function () {
            self.displayManager.flush()
            saveTime((Date.now() - self.startTS)/1000, outputFilePath,
                self.planSaved && "apply" ||
                self.contextInit && "init" ||
                self.contextPlan && "plan" || "other")
        });
        
        process.stdin.on('error', console.error);
    }
    constructor(){
        
    }
}

const handler = new TerraformOutputHandler()
handler.init()
handler.listen()
