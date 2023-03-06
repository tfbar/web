#!/usr/bin/env node
const path = require("path")

const { dirname } = require('path');
const appDir = dirname(require.main.filename);
process.stdin = require('mock-stdin').stdin();

require(`${appDir}/../src/index.js`)

setTimeout(async () => {

  const input = require('fs').readFileSync(`${appDir}/std.in/tfplan-error.txt`, 'utf-8').split(/\r?\n/)
  for (i=0; i<input.length; i++){
      await new Promise(r => setTimeout(r, 50));
      process.stdin.send(input[i])
    }
    
  }, 1000)

  