#!/usr/bin/env node

const { TerraformOutputHandler } = require("./output-handler.js");

const {
    initFileSystem,
    calculateAverageDuration,
    initFireBase,
    fetchFeed
} = require("./methods")

const outputFilePath = initFileSystem()
const db = initFireBase()
const averageDurations = calculateAverageDuration()

const handler = new TerraformOutputHandler(
    outputFilePath,
    averageDurations,
    db
)

handler.init().
    then(fetchFeed).
    then(
    async feed => await handler.listen.apply(handler, feed)
)