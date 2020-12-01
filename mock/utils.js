const runtimeDir = process.cwd()
const path = require('path')
const config = require(path.resolve(runtimeDir, 'config/index.js'))
const fs = require('fs')

function getJsonFileName(url, type) {
  if (config.dev && config.dev.baseUrl) {
    url = url.replace(config.dev.baseUrl, '')
  }
  return (
    url.split('/').slice(1).join('.') + `.${type}.json`
  )
}

function formatJsonFilePath(url, type) {
  return path.join(runtimeDir, config.mockServer.template, getJsonFileName(url, type))
}

function checkFileExist(path, callback) {
  fs.stat(path, function (err, stats) {
    if (callback) {
      let result = true
      if (err) {
        result = false
      }
      callback(result)
    }
  })
}

function isLocalApi(url) {
  if (!config.dev || !config.dev.useLocalApi) {
    return false
  }
  if (config.dev && config.dev.localApiList && config.dev.localApiList.length > 0) {
    return config.dev.localApiList.includes(url)
  }
  return true
}

module.exports = {
  formatJsonFilePath,
  checkFileExist,
  isLocalApi,
  getJsonFileName
}
