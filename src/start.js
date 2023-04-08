#!/usr/bin/env node

const { IncomingHandler } = require("./incoming.js");
const { LocalWebServer } = require("./web-server/index.js")
const { initFireBase } = require("./methods.js")

module.exports.startService = (displayManager, outputFile) => {
    const db = initFireBase()
    const localWebServer = new LocalWebServer()
    
    displayManager.displayStartupMsg()
    
    const incomingHandler = new IncomingHandler(
        outputFile,
        db,
        displayManager,
        localWebServer
    )

    incomingHandler.logStart()
    localWebServer.launch()

    return { incomingHandler, localWebServer }
    
}

