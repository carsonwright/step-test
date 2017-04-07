const StepTest1 = require("./test1");
const StepTest2 = require("./test2");

StepTest1.play()
StepTest2.play(function(a){
  return a.tags.indexOf("One") != -1;
});