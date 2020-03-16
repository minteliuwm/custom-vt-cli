#!/usr/bin/env node

process.env.NODE_PATH = __dirname + '/../node_modules/';

const { resolve } = require('path');
const program = require('commander');

const res = command => resolve(__dirname, '../commands/', command);

program.version(require('../package').version );

program.usage('<command>');

program.command('init')
  .option('-f, --foo', 'enable some foo')
  .description('Generate a new project')
  .alias('i')
  .action(() => {
    require(res('init'))
  });
