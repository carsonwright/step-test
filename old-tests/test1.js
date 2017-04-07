
var StepTest = require("./teststeps");

var t = StepTest.test("Test Scratch 1");
t.step("Set Scratch To 1");
t.step("Add 1 to Scratch");
t.step("Add 1 to Scratch");
t.step("Remove 1 from Scratch");
t.expect("Scratch should Equal 2", function(){
  this.ok(this.scratch == 2);
});
t.wait(1000)
t.step("Remove 1 from Scratch");
t.expect("Scratch Should Equal 1", function(){
  this.ok(this.scratch == 1);
});
t.step("Build something More!");

var t1 = StepTest.test("Test Scratch 2");
t1.step("Set Scratch To 1");
t1.step("Add 1 to Scratch");
t1.step("Remove 1 from Scratch");
t1.expect("Scratch should Equal 1", function(){
  this.ok(this.scratch == 1);
});

var t2 = StepTest.test("Test Scratch 3")
t2.step("Set Scratch To 1");
t2.step("Remove 1 from Scratch");
t2.expect("Scratch should Equal 0", function(){
  this.ok(this.scratch == 0);
});
t2.expect("This should not error but instead be ... ");

var t3 = StepTest.test("Test Scratch 3 Defer");
t3.step("Set Scratch To 1");
t3.step("Remove 1 from Scratch");
t3.step("Test Deferred + 1");
t3.expect("Scratch should Equal -1", function(){
  this.ok(this.scratch == 1);
});

var t4 = StepTest.test("Check that options can be passed in")
t4.step("Set Scratch To 1");
t4.step("Remove from number from Scratch", 3)
t4.expect("Scratch should Equal", function(){
  this.ok(this.scratch == -2);
})
var finishedOne = false;

console.log("FORCE FINISHED TO RUN in 90000 OR FAIL");
let timeout = setTimeout(function(){
  if(!finished){
    throw "Failed to run finished One"
  }
},90000)

StepTest.on("finished", function(){
  finished = true;

  if(t1.scratch != 1){
    throw "Failed to Set t1 Scratch properly"
  }

  if(t2.scratch != 0){
    throw "Failed to Set t2 Scratch properly"
  }

  if(t3.scratch != 1){
    throw "Failed to Set t3 Scratch properly"
  }

  if(t4.scratch != -2){
    throw "Failed to Set t4 Scratch properly"
  }
  clearTimeout(timeout);
  console.log("test1.js Done")
})

StepTest.play();