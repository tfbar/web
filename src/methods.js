const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process");
const findRemoveSync = require('find-remove');
const npmCacheDirectory = execSync('npm config get cache').toString().trimEnd();
const npxCacheDirectory = path.join(npmCacheDirectory, '_npx');
const currentWorkingFolderName = path.basename(process.cwd())
const tfhFolder = path.resolve(npxCacheDirectory, "terraform-interactive-logs", currentWorkingFolderName)

module.exports.initFileSystem = () => {
    if (!fs.existsSync(tfhFolder)){
        fs.mkdirSync(tfhFolder, { recursive: true });
    }
    // Provide commit logs
    execSync("git log --oneline -n 3 > " + tfhFolder + "/gitlog.txt", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });
    
    // Provide change log
    execSync("git --no-pager diff --name-only HEAD~0 > " + tfhFolder + "/changed-files.txt", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        module.exports.readChangedFiles()
    });
    
    // Remove old file and prepare log files
    const folder = tfhFolder

    if (!fs.existsSync(folder)) fs.mkdirSync(folder)

    const outputFileName = new Date().toISOString().replaceAll(":","-") + ".txt"
    const outputFilePath = path.join(folder, outputFileName)
    // Remove old files
    findRemoveSync(folder,  {age: { seconds: 180 * 60 }, extensions: ".txt"});
    findRemoveSync(folder,  {age: { seconds: 60 * 24 * 30 * 60 }, extensions: ".plan"});
    findRemoveSync(folder,  {age: { seconds: 60 * 24 * 30 * 60 }, extensions: ".apply"});
    
    return outputFilePath
}

module.exports.saveToOutputFile = (chunk, outputFilePath) => fs.writeFileSync(outputFilePath, chunk + "\n", 'utf8',
    function(err) {     
        if (err) throw err;
    });

module.exports.saveTime = (seconds, outputFilePath, context) => fs.writeFileSync(`${outputFilePath}.${context}`, `${seconds}`, 'utf8',
    function(err) {     
        if (err) throw err;
    });

module.exports.readGitLog = () => {
    const data = fs.readFileSync(tfhFolder + "/gitlog.txt", 'utf8', err => console.log(err))
    return data.replaceAll("\n", "\n  ");
}
module.exports.readChangedFiles = () => {
    const data = fs.readFileSync(tfhFolder + "/changed-files.txt", 'utf8')
    return " " + data.replaceAll("\n", "\n  ");
}

module.exports.calculateAverageDuration = () => {
    const plans = []
    const applies = []
    const inits = []
    const filenames = fs.readdirSync(tfhFolder + "/");

    // Read average durations
    filenames.forEach((name) => {
      const isPlan = name.indexOf(".plan") > -1
      const isApply = name.indexOf(".apply") > -1
      const isInit = name.indexOf(".init") > -1
      if (!(isPlan || isApply || isInit)) return

      const fullPath = path.join(tfhFolder, name);
      const file = fs.readFileSync(fullPath, "utf-8");
      if (isPlan && /\d/ . test(file)) plans.push(parseFloat(file))
      if (isApply && /\d/ . test(file)) applies.push(parseFloat(file))
    });

    return {
        plans: plans.reduce((a, b) => a + b, 0) / plans.length,
        applies: applies.reduce((a, b) => a + b, 0) / applies.length,
        inits: inits.reduce((a, b) => a + b, 0) / inits.length
    }
}

module.exports.fetchFeed = async () => {
    const Headers = (await import('node-fetch')).Headers
    const fetch = require('node-fetch')
    const RequestHeaders = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json"
    })
    const paramFeedTitle = process.argv[2] || "Chuck Norris Quotes"
    const paramFeedUrl = process.argv[3] || "https://api.chucknorris.io/jokes/random"
    if (paramFeedTitle === "disableFeed") return null
    const res = await fetch(paramFeedUrl)
    const response = await res.json()
    return {
        title: paramFeedTitle,
        text: response.value
    }
}
