const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process");
const findRemoveSync = require('find-remove');
const gitLogFileName = "gitlog.txt"
const changedFileName = "changed-files.txt"

module.exports.initFileSystem = () => {
    
    process.stdin.setEncoding('utf8');

    // Create cache folder
    const currentWorkingFolderName = path.basename(process.cwd())
    const npmCacheDirectory = execSync('npm config get cache').toString().trimEnd();
    const npxCacheDirectory = path.join(npmCacheDirectory, '_npx');

    const tfhFolder = path.resolve(
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
    const outputFile = path.join(tfhFolder, outputFileName)

    return {
        outputFile,
        tfhFolder
    }
}

module.exports.saveToOutputFile = (chunk, outputFile) => chunk && fs.appendFileSync(
    outputFile,
    chunk.
        replaceAll("[0m","").
        replaceAll("[4m","").
        replaceAll("[1m","").
        replaceAll("[33m","") + "\n",
    function(err) {     
        if (err) throw err;
    });

module.exports.saveTime = (seconds, outputFile, command) =>
    fs.writeFileSync(`${outputFile}.${command}`, `${seconds}`, 'utf8',
        function(err) {     
            if (err) throw err;
        });

module.exports.readGitLog = tfhFolder => {
    const data = fs.readFileSync(tfhFolder + "/" + gitLogFileName, 'utf8', err => console.log(err))
    return data
}
module.exports.readChangedFiles = tfhFolder => {
    return fs.readFileSync(tfhFolder + "/" + changedFileName, 'utf8')
}