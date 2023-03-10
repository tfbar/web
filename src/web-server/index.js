const fs = require("fs")
const express = require('express')
const ansiToHtml = require("ansi-to-html")
const convert = new ansiToHtml();
const { html } = require("./page.js");


class LocalWebServer{
    app
    port
    output
    command
    browserTabOpen

    addChunk (chunk) {
        let packet = chunk.indexOf("│") > -1 ? chunk.replace("│", "<br>│") :  chunk + "<br>" 
        this.output += packet
    }
    
    setBrowserTabClosed () {
        this.browserTabOpen = false
    }
    setCommand(command) {
        this.command = command
    }

    get isBrowserTabOpen() {
        return this.browserTabOpen
    }

    launch() {
        const self = this

        this.app.get('/', (req, res) => {
            res.send(html)
          })

        this.app.get('/output', (req, res) => {
            res.send(convert.toHtml(self.output))
            clearTimeout(self.browserTabOpen)
            self.browserTabOpen = setTimeout(
                self.setBrowserTabClosed, 1000)
          })
        this.app.get('/command', (req, res) => {
            res.send(self.command || "")
        })
        this.app.listen(this.port)
    }

    get serverUrl () {
        return `http://localhost:${this.port}`
    }
    constructor(){
        this.port = 3500
        this.output = ""
        this.app = express()
        this.browserOpen = false
        this.addChunk = this.addChunk.bind(this)
        this.setBrowserTabClosed = this.setBrowserTabClosed.bind(this)
    }

}

module.exports = { LocalWebServer }