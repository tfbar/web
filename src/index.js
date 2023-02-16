#!/usr/bin/env node
const fs = require("fs")
const { TerraformOutputHandler } = require("./output-handler.js");
const { initFileSystem, calculateAverageDureation} = require("./methods")

const outputFilePath = initFileSystem()
const averageDurations = calculateAverageDureation()
const handler = new TerraformOutputHandler(
    outputFilePath,
    averageDurations
)
handler.init()
handler.listen()
