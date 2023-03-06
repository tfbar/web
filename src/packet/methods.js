
const hasReading = packet => packet && packet.indexOf(module.exports.tfPlanReadingText) > -1
const hasReadingComplete = packet => packet && packet.indexOf(module.exports.tfPlanReadingCompleteText) > -1
const hasActiveState = chunk => chunk && chunk.indexOf(module.exports.stateIndicator) > -1 && chunk.indexOf("moments...") === -1
const hasCompleteState = chunk => chunk && chunk.indexOf(module.exports.completionIndicator) > -1
const hasState = chunk => hasActiveState(chunk) || hasCompleteState(chunk)

module.exports.onlyYes = "Only 'yes'"
module.exports.stateIndicator = "..."
module.exports.tfErrorUniqueText = "Error: "
module.exports.tfPlanReadingText = "Reading..."
module.exports.tfWarningUniqueText = "Warning: "
module.exports.tfApplyUniqueText3 = "creating..."
module.exports.tfApplyUniqueText2 = "modifying..."
module.exports.completionIndicator = "complete after"
module.exports.releasingStateLock = "Releasing state lock"
module.exports.tfPlanRefreshingText = "Refreshing state..."
module.exports.tfInitUniqueText = "Initializing modules..."
module.exports.tfPlanReadingCompleteText = "Read complete after"
module.exports.tfPlanUniqueText = module.exports.tfPlanReadingText
module.exports.tfApplyUniqueText1 = "Do you want to perform these actions"
module.exports.isReadingStatus = packet => hasReading(packet) || hasReadingComplete(packet)

module.exports.isTfInit = packet => {
    return packet && packet.indexOf(module.exports.tfInitUniqueText) > -1
}
module.exports.isTfPlan = packet => {
    return packet && packet.indexOf(module.exports.tfPlanUniqueText) > -1
}

module.exports.isTfError = packet => {
    return packet && packet.indexOf(module.exports.tfErrorUniqueText) > -1
}
module.exports.isTfWarning = packet => {
    return packet && packet.indexOf(module.exports.tfWarningUniqueText) > -1
}

module.exports.isTfApply = packet => {
    return packet && (
        packet.indexOf(module.exports.tfApplyUniqueText1) > -1 ||
        packet.indexOf(module.exports.tfApplyUniqueText2) > -1 ||
        packet.indexOf(module.exports.tfApplyUniqueText3) > -1
    )
}

module.exports.getResourceStatus = chunk => {
    if (!hasState(chunk)) return null

    // Determine current state - reading, refreshing etc...
    const indicator = hasCompleteState(chunk) ? module.exports.completionIndicator : module.exports.stateIndicator,
        fullChunk = chunk.split(indicator)[0],
        wordsArr = fullChunk.split(" "),
        lastWord = wordsArr[wordsArr.length - 1],
        wordBeforeLast = wordsArr[wordsArr.length - 2],
        state = lastWord === "state" ? wordBeforeLast : lastWord

    return state
}
