const fs = require("fs")
const path = require("path")
const readline = require("readline")
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { readChangedFiles, readGitLog }  = require("./files")
const { collection: fsCollection , addDoc } = require("firebase/firestore");

const appRoot = path.resolve(__dirname);
const lineCount = str => str.split(/\r\n|\r|\n/).length
const minLinesForCommitsInfo = 28;
const minLinesForChangedFilesInfo = 31
const newSection = "\n\r \n\r"
const newLine = "\n\r"
const magentaStart = '\u001b[1;35m' 
const blueStart = '\u001b[1;34m' 
const colorEnd = '\u001b[0m';
const redStart = '\u001b[1;31m' 
const lastCommitsTxt = blueStart + "Last commits to branch" + colorEnd
const gitStatisticsTxt = magentaStart + "Git Statistics" + colorEnd
const changedFilesTxt = blueStart + "Files changed since last commit" + colorEnd
const fullOutputText = outputFile => `\u001b${newLine}${newLine}${blueStart}Output file:\n\r${colorEnd}*  ${outputFile} `
const fullOutputWeb = `\u001b${blueStart}Tree View log - Cmd + Click link to open:\n\r${colorEnd}* http://localhost:3500 `

module.exports.errorsFoundTxt = redStart + "│" + newLine + "│ Errors found in above logs." + colorEnd 

module.exports.calculateAverageDuration = (tfhFolder) => {
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
      const decimalOnly = /\d/ . test(file)

      if (isPlan && decimalOnly) plans.push(parseFloat(file))
      if (isApply && decimalOnly) applies.push(parseFloat(file))
    });

    return {
        plans: plans.reduce((a, b) => a + b, 0) / plans.length,
        applies: applies.reduce((a, b) => a + b, 0) / applies.length,
        inits: inits.reduce((a, b) => a + b, 0) / inits.length
    }
}
module.exports.mostRecentFile = (tfhFolder, plan) => {
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


      if (isPlan && decimalOnly) plans.push(parseFloat(file))
      if (isApply && decimalOnly) applies.push(parseFloat(file))
    });

    return {
        plans: plans.reduce((a, b) => a + b, 0) / plans.length,
        applies: applies.reduce((a, b) => a + b, 0) / applies.length,
        inits: inits.reduce((a, b) => a + b, 0) / inits.length
    }
}

module.exports.initFireBase = async () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBbqdFYxRvKPRkjoAaQjOCNc00_6f2o3Xc",
        authDomain: "terraform-progress-bar.firebaseapp.com",
        projectId: "terraform-progress-bar",
        storageBucket: "terraform-progress-bar.appspot.com",
        messagingSenderId: "664142118300",
        appId: "1:664142118300:web:7ed9790fdd1d201bed5c59",
        measurementId: "G-B74CDMSJMH"
      };
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      return db
}

module.exports.logOp = async (db, rec) => {
    var pjson = require(appRoot + '/../package.json');
    rec.version = pjson.version;    
    const collection = fsCollection(await db, "tfh")
    try {
        await addDoc(collection, rec);
    } catch (e) { }
    return true
}

module.exports.clearCursor = () => {
    readline.cursorTo(process.stdout, 1000, 1000);
}

module.exports.getStateId = (tfPlanCompleted, context) => tfPlanCompleted && "apply" ||
    context == "init" && "init" ||
    context == "plan" && "plan" || "other"

module.exports.getStaticText = (tfhFolder, outputFile) => {
    const changedFiles = readChangedFiles(tfhFolder),
        gitLog = readGitLog(tfhFolder) ,
        numChangedFiles = changedFiles && lineCount(changedFiles),
        shouldAddCommits = process.stdout.rows > minLinesForCommitsInfo,
        shouldAddChangedFiles = process.stdout.rows > minLinesForChangedFilesInfo + numChangedFiles,
        gitLogTxt = `${newSection}${gitStatisticsTxt}:${newLine}${newLine}${lastCommitsTxt}:\n` + gitLog,
        gitLogInfo = shouldAddCommits ? gitLogTxt : "",
        changedTitle = changedFiles.length < 3 ? "" : `${newSection}${changedFilesTxt}:\n`,
        changedFilesInfo = shouldAddChangedFiles ? changedTitle + changedFiles : "",
        info = fullOutputWeb + fullOutputText(outputFile) + gitLogInfo + changedFilesInfo
    return info
}

module.exports.displayOutput = outputFile => console.log(fullOutputText(outputFile))