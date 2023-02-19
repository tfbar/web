
const hasReading = packet => packet.indexOf(module.exports.tfPlanReadingText) > -1
const hasReadingComplete = packet => packet.indexOf(module.exports.tfPlanReadingCompleteText) > -1

module.exports.tfInitUniqueText = "Initializing modules..."
module.exports.tfPlanReadingText = "Reading..."
module.exports.tfPlanReadingCompleteText = "Read complete after"
module.exports.tfPlanRefreshingText = "Refreshing state..."
module.exports.tfPlanUniqueText = module.exports.tfPlanReadingText
module.exports.tfApplyUniqueText = "Do you want to perform these actions"
module.exports.stateIndicator = "..."
module.exports.completionIndicator = "complete after"

module.exports.isTfInit = packet => {
    return packet.indexOf(module.exports.tfInitUniqueText) > -1
}
module.exports.isTfPlan = packet => {
    return packet.indexOf(module.exports.tfPlanUniqueText) > -1
}
module.exports.isTfApply = packet => {
    return packet.indexOf(module.exports.tfApplyUniqueText) > -1
}

module.exports.isReadingStatus = packet => hasReading(packet) || hasReadingComplete(packet)

const hasActiveState = chunk => chunk.indexOf(module.exports.stateIndicator) > -1 && chunk.indexOf("moments...") === -1

const hasCompleteState = chunk => chunk.indexOf(module.exports.completionIndicator) > -1

const hasState = chunk => hasActiveState(chunk) || hasCompleteState(chunk)

module.exports.getState = chunk => {
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