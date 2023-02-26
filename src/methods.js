const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process");
const findRemoveSync = require('find-remove');
const fetch = require('node-fetch')
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { collection: fsCollection , addDoc } = require("firebase/firestore");
const readline = require("readline")

const gitLogFileName = "gitlog.txt"
const changedFileName = "changed-files.txt"
const argFeedTitle = process.argv[2]
const argFeedUrl = process.argv[3]
const feedTitle =  "Chuck Norris Quotes"
const feedUrl =  "https://api.chucknorris.io/jokes/random"
const appRoot = path.resolve(__dirname);

let tfhFolder

const indentNewline = str => str.replaceAll("\n", "\n  ");
module.exports.startupMsg = " Acquiring state lock. This may take a few moments..."

module.exports.initFileSystem = () => {
    
    process.stdin.setEncoding('utf8');

    // Create cache folder
    const currentWorkingFolderName = path.basename(process.cwd())
    const npmCacheDirectory = execSync('npm config get cache').toString().trimEnd();
    const npxCacheDirectory = path.join(npmCacheDirectory, '_npx');

    tfhFolder = path.resolve(
        npxCacheDirectory,
        "terraform-interactive-logs",
        currentWorkingFolderName
    )
    if (!fs.existsSync(tfhFolder)){
        fs.mkdirSync(tfhFolder, { recursive: true });
    }

    // Create commit logs provider
    execSync("git log --oneline -n 3 > " + tfhFolder + "/" + gitLogFileName, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });
    
    // Create change logs provider
    execSync("git --no-pager diff --name-only HEAD~0 > " + tfhFolder + "/" + changedFileName, (error, stdout, stderr) => {
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
    
    // Remove old files
    const secondsInDay = 86400
    const secondsInMonth = 2592000
    findRemoveSync(tfhFolder,  {age: { seconds: secondsInDay }, extensions: ".txt"});
    findRemoveSync(tfhFolder,  {age: { seconds: secondsInMonth }, extensions: ".plan"});
    findRemoveSync(tfhFolder,  {age: { seconds: secondsInMonth }, extensions: ".apply"});
    
    // Create output path + name
    const outputFileName = new Date().toISOString().replaceAll(":","-") + ".txt"
    const outputFilePath = path.join(tfhFolder, outputFileName)

    return outputFilePath
}

module.exports.saveToOutputFile = (chunk, outputFilePath) => chunk && fs.appendFileSync(
    outputFilePath,
    chunk.
        replaceAll("[0m","").
        replaceAll("[4m","").
        replaceAll("[1m","").
        replaceAll("[33m","") + "\n", 'utf8',
    function(err) {     
        if (err) throw err;
    });

module.exports.saveTime = (seconds, outputFilePath, context) => fs.writeFileSync(`${outputFilePath}.${context}`, `${seconds}`, 'utf8',
    function(err) {     
        if (err) throw err;
    });

module.exports.readGitLog = () => {
    const data = fs.readFileSync(tfhFolder + "/" + gitLogFileName, 'utf8', err => console.log(err))
    return indentNewline(data)
}
module.exports.readChangedFiles = () => {
    const data = fs.readFileSync(tfhFolder + "/" + changedFileName, 'utf8')
    return " " + indentNewline(data)
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

module.exports.fetchFeed = async () => {    
    const paramFeedTitle = argFeedTitle || feedTitle
    const paramFeedUrl = argFeedUrl || feedUrl
    if (paramFeedTitle === "disableFeed") return null

    const res = await fetch(paramFeedUrl)
   
    
    const response = await res.json()
    let result = null
    try{
        result = {
            title: paramFeedTitle,
            text: response.value
        }
    }
    catch (e) {}
    
    return result
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