#! /usr/bin/env node

const program = require('commander');
const { exec } = require('child_process');

program.version('1.2.0', '-v, --version').command('init <name>').action((name) => {
  console.log('clone template ...');
  exec('git clone https://github.com/minteliuwm/vue-ts-template.git ' + name, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
      return;
    }
    console.log(stdout);
    console.log('clone success');
  });
});

program.parse(process.argv);