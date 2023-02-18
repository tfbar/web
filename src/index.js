#!/usr/bin/env node
const fs = require("fs")
const { TerraformOutputHandler } = require("./output-handler.js");
const { initFileSystem, calculateAverageDuration, fetchFeed } = require("./methods")

const outputFilePath = initFileSystem()
const averageDurations = calculateAverageDuration()
const handler = new TerraformOutputHandler(
    outputFilePath,
    averageDurations
)
handler.init()
fetchFeed().then(feed => handler.listen(handler, feed))