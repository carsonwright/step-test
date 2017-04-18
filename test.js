const StepTest1 = require("./test1");
const StepTest2 = require("./test2");
const StepTest3 = require("./test3");
StepTest1.parallel = true;
StepTest1.play()
StepTest2.play(function(a){
  console.log(a.tagged.indexOf("One") != -1)
  return a.tagged.indexOf("One") != -1;
});

StepTest3.play()
