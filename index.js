#!/usr/bin/env node

var electron = require('electron');
var spawn = require('child_process').spawn;

const args=process.argv.slice(2)

var child = spawn(electron, [__dirname+'/cli.js'].concat(args), {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  env:process.env,
  cwd: process.cwd(),
  detached: false,
  stdio: "inherit"
});

child.on('exit',(c)=>{
    process.exit(c)
})
