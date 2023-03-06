#!/usr/bin/env node

const { IncomingHandler } = require("./incoming.js");
const { initFileSystem } = require("./files")
const { TerminalManager } = require("./terminal-manager")
const { LocalWebServer } = require("./web-server")
const {
    calculateAverageDuration,
    initFireBase,
    getStaticText
} = require("./methods")

const db = initFireBase()
const { outputFile, tfhFolder } = initFileSystem()
const localWebServer = new LocalWebServer()

const displayManager = new TerminalManager(
    getStaticText(tfhFolder, outputFile),
    calculateAverageDuration(tfhFolder)
)

const incomingHandler = new IncomingHandler(
    outputFile,
    db,
    displayManager,
    localWebServer
)

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', incomingHandler.handleIncoming);
process.stdin.on('data', localWebServer.addChunk);
process.stdin.on('end', incomingHandler.handleEndSignal)
process.stdin.on('error', console.error);

incomingHandler.logStart()
localWebServer.launch()


