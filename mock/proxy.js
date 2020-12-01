const request = require('request')
const path = require('path')
const runtimeDir = process.cwd()
const config = require(path.resolve(runtimeDir, 'config/index.js'))

function proxyPostApi(req, res, url) {
  let body = ''
  req.on('data', function (data) {
    body += data
  })
  req.on('end', function () {
    const options = {
      url: `${config.mockServer.server}${url}`,
      form: req.form,
      headers: req.headers,
      qs: req.query,
      body: body
    }
    request.post(options, function (err, response) {
      if (err) {
        res.send(err)
      } else {
        if (response.headers['set-cookie']) {
          res.setHeader('set-cookie', response.headers['set-cookie'])
        }
        res.send(response.body)
      }
    })
  })
}

function proxyGetApi(_req, res, url) {
  const options = {
    headers: _req.headers
  }
  request.get(`${config.mockServer.server}${url}`, options, function (err, response) {
    if (err) {
      // console.log(err)
      res.send(err)
    } else {
      res.send(response.body)
    }
  })
}

module.exports = {
  proxyPostApi,
  proxyGetApi
}
