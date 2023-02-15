const fs = require("fs")
const path = require("path")
const { exec } = require("child_process");

let gitLog = null
let changedFiles = null

module.exports.getLog = () => gitLog
module.exports.getChangedFiles = () => changedFiles

exec("git log --oneline -n 3 > .terraform/tfh/gitlog.txt", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    module.exports.readGitLog()
});

exec("git --no-pager diff --name-only HEAD~0 > .terraform/tfh/changed-files.txt", (error, stdout, stderr) => {
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

module.exports.initFileSystem = () => {
    const folder = path.resolve(process.cwd(), ".terraform/tfh")
    const tfFolder = path.resolve(process.cwd(), ".terraform")
    if (!fs.existsSync(tfFolder)) console.log("* Please run terraform init") || process.exit()
    if (!fs.existsSync(folder)) fs.mkdirSync(folder)
    const outputFileName = new Date().toISOString() + ".txt"
    const outputFilePath = `${folder}/${outputFileName}`
    var findRemoveSync = require('find-remove');
    findRemoveSync(folder,  {age: { seconds: 180 * 60 }, extensions: ".txt"});
    findRemoveSync(folder,  {age: { seconds: 60 * 24 * 30 * 60 }, extensions: ".plan"});
    findRemoveSync(folder,  {age: { seconds: 60 * 24 * 30 * 60 }, extensions: ".apply"});
    return outputFilePath
}

module.exports.saveData = (chunk, outputFilePath) => fs.appendFile(outputFilePath, chunk + "\n", 'utf8',
    function(err) {     
        if (err) throw err;
    });
module.exports.saveTime = (seconds, outputFilePath, context) => fs.appendFile(`${outputFilePath}.${context}`, `${seconds}`, 'utf8',
    function(err) {     
        if (err) throw err;
    });

module.exports.readGitLog = () => {
    fs.readFile('.terraform/tfh/gitlog.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        gitLog = " " + data.replaceAll("\n", "\n  ");
      });
}
module.exports.readChangedFiles = () => {
    fs.readFile('.terraform/tfh/changed-files.txt', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        changedFiles = " " + data.replaceAll("\n", "\n  ");
      });
}

const filenames = fs.readdirSync('.terraform/tfh/');
const plans = []
const applies = []
const inits = []
const filePosts = filenames.map((name) => {
  const isPlan = name.indexOf(".plan") > -1
  const isApply = name.indexOf(".apply") > -1
  const isInit = name.indexOf(".init") > -1
  if (!(isPlan || isApply || isInit)) return
  const fullPath = path.join(process.cwd(), ".terraform/tfh/", name);
  const file = fs.readFileSync(fullPath, "utf-8");
  if (isPlan && /\d/ . test(file)) plans.push(parseFloat(file))
  if (isApply && /\d/ . test(file)) applies.push(parseFloat(file))
});

module.exports.averagePlans = plans.reduce((a, b) => a + b, 0) / plans.length;
module.exports.averageApplies = applies.reduce((a, b) => a + b, 0) / applies.length;
module.exports.averageInits = inits.reduce((a, b) => a + b, 0) / inits.length;
