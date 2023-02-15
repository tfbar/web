module.exports.doYouWantPrompt = "Do you want to perform these actions? "
module.exports.green = '\u001b[42m \u001b[0m';
module.exports.red = '\u001b[41m \u001b[0m';
module.exports.blueStart = '\u001b[1;34m' 
module.exports.yellowStart = '\u001b[1;33m' 
module.exports.colorEnd = '\u001b[0m';
module.exports.getOutputRef = outputFilePath => [`\n\u001b${module.exports.blueStart}  Full output is available at (cmd + click):\n\r ${module.exports.colorEnd} ${outputFilePath} `]
module.exports.lastCommitsTxt = module.exports.blueStart + "Last commits to branch" + module.exports.colorEnd
module.exports.changedFilesTxt = module.exports.blueStart + "Files changed since last commit" + module.exports.colorEnd