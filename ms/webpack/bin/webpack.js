#!/usr/bin/env node
const path = require('path')
const argv = require('yargs').argv

const config = require(path.resolve(argv.config || 'webpack.config.js'))

const Compiler = require('../lib/Compiler')
let compiler = new Compiler(config)

compiler.run()
