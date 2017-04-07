const fork1 = require('child_process').fork;
const child1 = fork1('./test1');
const fork2 = require('child_process').fork;
const child2 = fork2('./test2');

child1.on('exit', function (code, signal) {
  if(code == 1){
    child2.kill("SIGHUP")
    throw "TEST SET 1 FAILED"
  }
});

child2.on('exit', function (code, signal) {
  if(code == 1){
    child1.kill("SIGHUP")
    throw "TEST SET 2 FAILED"
  }
});

