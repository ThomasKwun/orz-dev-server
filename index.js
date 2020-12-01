#!/usr/bin/env node

const program = require('commander')
const clear = require('clear')
const clui = require('clui')
const printBrand = require('./lib/brand')
const config = require('./config')
const Spinner = clui.Spinner
const process = require('process')
const mockServer = require('./mock')
const webServer = require('./server')

const mock = () => {
  clear()
  printBrand(config.brand)
  const status = new Spinner('mock server is starting')
  status.start()
  mockServer.run()
  status.stop()
}
const web = () => {
  clear()
  printBrand(config.brand)
  const status = new Spinner('web server is starting')
  status.start()
  webServer.run()
  status.stop()
}

program.version(require('./package.json').version)
program.command('mock').alias('m').description('start mock server').action(mock)
program.command('web').alias('w').description('start web server').action(web)
program.parse(process.argv)
