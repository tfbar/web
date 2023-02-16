module.exports.green = '\u001b[42m \u001b[0m';

module.exports.red = '\u001b[41m \u001b[0m';

module.exports.blueStart = '\u001b[1;34m' 

module.exports.magentaStart = '\u001b[1;35m' 

module.exports.yellowStart = '\u001b[1;33m' 

module.exports.colorEnd = '\u001b[0m';

module.exports.getOutputRef = outputFilePath => [`\n\u001b${module.exports.blueStart}  Full output is available at (cmd + click):\n\r ${module.exports.colorEnd} ${outputFilePath} `]

module.exports.lastCommitsTxt = module.exports.blueStart + "Last commits to branch" + module.exports.colorEnd

module.exports.gitStatisticsTxt = module.exports.magentaStart + "Git Statistics" + module.exports.colorEnd

module.exports.changedFilesTxt = module.exports.blueStart + "Files changed since last commit" + module.exports.colorEnd

module.exports.showTitle = context => console.log("  " + module.exports.yellowStart + "Terraform " + context.charAt(0).toUpperCase() + context.slice(1)  + "\n\r"+ module.exports.colorEnd)

module.exports.stripFinalNewline = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, -1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, -1);
	}

	return input;
}