const ProgressBar = require('progress');
const readline = require("readline");

const dots = "..."
const newLine = "\n\r"
const colorEnd = '\u001b[0m';
const blueStart = '\u001b[1;34m' 
const yellowStart = '\u001b[1;33m' 
const red = '\u001b[41m \u001b[0m';
const magentaStart = '\u001b[1;35m' 
const green = '\u001b[42m \u001b[0m';
const newSection = newLine + newLine

const getBorder = () => {
	let border = ""
	while(border.length < process.stdout.columns){
		border += "="
	}
	return magentaStart + border + colorEnd
}

const wrapWithSpaces = str => {
	while(str.length < process.stdout.columns * 5){
		str = str + " "
	}
	return str.substr(0, process.stdout.columns + (blueStart + colorEnd).length)
}

module.exports.createProgressBar = () => new ProgressBar(`:title${newSection}[:bar] :percent ${newSection}:dynamicText ${newLine}:staticText`, {
	complete: green,
	incomplete: red,
	width: 20,
	total: 100,
	clear: true
});


module.exports.getCompletionPercentage = (barCreationTimestamp, barCompletionTimestamp) => {
	const now = Date.now()
	const currentProgress = (now - barCreationTimestamp)
	const estimatedDuration = barCompletionTimestamp - barCreationTimestamp
	return Math.min(100 *  currentProgress / estimatedDuration, 95)
}

module.exports.getDynamicLine = (accumulator, resource) => {
	const status = resource.status ? resource.status + ": " : ""
	const createLine = resourceName => blueStart + status + colorEnd + resourceName
 	let newLine  = createLine(resource.name)
	const overflow = createLine(resource.name).length - process.stdout.columns
	const maxLengthResourceName = overflow > 0 ? resource.name.length - overflow - 3 : resource.name.length 
	const resourceName = resource.name.slice(-maxLengthResourceName)
	newLine = createLine(overflow > 0 ? dots + resourceName : resource.name)
	const previous = accumulator.length ? accumulator  : ""
	return previous + wrapWithSpaces(newLine) + "\n\r"
}

module.exports.getDuration = (command, averageDurations) =>
    command == "plan" && averageDurations.plans ||
    command == "apply" && averageDurations.applies ||
    command == "init" && averageDurations.inits

module.exports.getTitle = command => wrapWithSpaces(yellowStart + "Terraform " + command.charAt(0).toUpperCase() + command.slice(1) + colorEnd)

module.exports.startupMsg = " Acquiring state lock. This may take a few moments..."

module.exports.defaultDuration = 30

module.exports.clearCursor = () => {
	readline.cursorTo(process.stdout, 1000, 1000);
}

module.exports.border = getBorder() + "\n\r"

module.exports.browserTabOpenTxt = "Close browser tab to enable output in terminal\n\r"