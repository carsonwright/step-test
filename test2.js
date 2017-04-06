const StepTest = require("./teststeps");

t5 = StepTest.test("Check that options can be passed in").tag("One").tag("Two")
t5.step("Set Scratch To 1");
t5.step("Remove from number from Scratch", 3)
t5.expect("Scratch should Equal", function(){
  this.ok(this.scratch == -2);
})

t6 = StepTest.test("Check that options can be passed in").tag("Three").tag("Two")
t6.step("Set Scratch To 1");
t6.step("Remove from number from Scratch", 3)
t6.expect("Scratch should Equal", function(){
  this.ok(this.scratch == -2);
})

console.log("FORCE FINISHED TO RUN in 90000 OR FAIL");
let timeout = setTimeout(function(){
  if(!finished){
    throw "Failed to run finished One"
  }
},90000)

StepTest.on("finished", function(){
  if(t5.scratch != -2 || t6.scratch != undefined){
    throw "t5 didn't run";
  }
  finished = true;
  clearTimeout(timeout);
  console.log("test2.js Done")
})

StepTest.play(function(a){
  return a.tags.indexOf("One") != -1;
});