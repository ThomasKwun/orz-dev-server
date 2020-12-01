const proxy = require('http-proxy-middleware')
const path = require('path')
const runtimeDir = process.cwd()
const config = require(path.resolve(runtimeDir, 'config/index.js'))

module.exports = {
  run() {
    const express = require('express')
    const app = express()
    if (config.dev && config.dev.proxyTable) {
      for (const x in config.dev.proxyTable) {
        const obj = config.dev.proxyTable[x]
        app.use(x, proxy({
          target: obj.target,
          changeOrigin: obj.changeOrigin
        }))
      }
    }
    let sourceDir = config.webServer.publicDir || 'dist'
    let entry = config.webServer.entry || '/index.html'
    app.use(express.static(path.resolve(runtimeDir, sourceDir)))
    app.get('*', function (_req, res) {
      res.sendFile(path.resolve(runtimeDir, sourceDir, entry))
    })
    app.listen(config.webServer.port, function () {
      console.log(`Web Server is running, http://${config.webServer.host}:${config.webServer.port}`)
    })
  }
}
