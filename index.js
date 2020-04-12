var electron = require('electron');
var spawn = require('child_process').spawn;


const args=process.argv.slice(2)

console.log('args',args)

var child = spawn(electron, ['cli.js'].concat(args), {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  // if you pass some value, even an empty object, 
  // the electron process will always exit immediately on linux, works fine in OSX
  env: {} 
});

child.on('exit', function() {
  console.log('child process exit..');
});

child.on('message', function (m) {
  console.log('yes it works');
});