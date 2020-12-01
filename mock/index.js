const utils = require('./utils')
const localProxy = require('./proxy')
const express = require('express')
const path = require('path')
const proxyGetApi = localProxy.proxyGetApi
const proxyPostApi = localProxy.proxyPostApi
const formatJsonFilePath = utils.formatJsonFilePath
const checkFileExist = utils.checkFileExist
const runtimeDir = process.cwd()
const config = require(path.resolve(runtimeDir, 'config/index.js'))

const log = (method, type, url) => {
  let date = new Date()
  const time = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  console.log(method, type, url, time)
}

module.exports = {
  run() {
    const app = express()
    // app.use(express.static(path.resolve(runtimeDir, 'dist')))
    app.get('*', function (req, res) {
      const type = 'get'
      const url = req._parsedUrl.pathname
      const jsonFileName = utils.getJsonFileName(url, type)
      const fileName = formatJsonFilePath(url, type)
      if (utils.isLocalApi(jsonFileName)) {
        checkFileExist(fileName, isExist => {
          if (!isExist) {
            log('get', 'proxyApi', url)
            proxyGetApi(req, res, url)
          } else {
            log('get', 'localApi', url)
            res.sendFile(fileName)
          }
        })
      } else {
        log('get', 'proxyApi', url)
        proxyGetApi(req, res, url)
      }
    })

    app.post('*', function (req, res) {
      const type = 'post'
      const url = req._parsedUrl.pathname
      const jsonFileName = utils.getJsonFileName(url, type)
      const fileName = formatJsonFilePath(url, type)
      console.log(jsonFileName,fileName)
      if (utils.isLocalApi(jsonFileName)) {
        checkFileExist(fileName, isExist => {
          if (!isExist) {
            log('post', 'proxyApi', url)
            proxyPostApi(req, res, url)
          } else {
            log('post', 'localApi', url)
            res.sendFile(fileName)
          }
        })
      } else {
        log('post', 'proxyApi', url)
        proxyPostApi(req, res, url)
      }
    })

    app.listen(config.mockServer.port, function () {
      console.log(`Mock Server is running, http://${config.mockServer.host}:${config.mockServer.port}`)
    })
  }
}
