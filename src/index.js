#!/usr/bin/env node

const { startService } = require("./start")
const { initFileSystem } = require("./files.js")
const { TerminalManager } = require("./terminal-manager/index.js")
const {
    calculateAverageDuration,
    getStaticText
} = require("./methods.js")

const { outputFile, tfhFolder } = initFileSystem()

const displayManager = new TerminalManager(
    getStaticText(tfhFolder, outputFile),
    calculateAverageDuration(tfhFolder)
)

const {
    incomingHandler,
    localWebServer
} = startService( displayManager, outputFile )

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('end', incomingHandler.handleEndSignal)
process.stdin.on('data', incomingHandler.handleIncoming);
process.stdin.on('data', localWebServer.addChunk);
process.stdin.on('error', console.error);
    
    
    

