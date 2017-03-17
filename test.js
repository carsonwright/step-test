const StepTest = require("./src/step-test");

StepTest.addStep("Set Scratch To 1", function(){
  return this.scratch = 1;
})

StepTest.addStep("Add 1 to Scratch", function(t){
  return this.scratch += 1
})

StepTest.addStep("Remove 1 from Scratch", function(t){
  return this.scratch -= 1;
})

t = StepTest.test("Test Scratch");
t.step("Set Scratch To 1");
t.step("Add 1 to Scratch");
t.step("Add 1 to Scratch");
t.step("Remove 1 from Scratch");
t.expect("Scratch should Equal 2", function(){
  return this.ok(this.scratch == 2);
})
t.wait(1000)
t.step("Remove 1 from Scratch");
t.expect("Scratch Should Equal 1", function(){
  return this.ok(this.scratch == 1);
})
t.step("Build something More!")
t.play()
t.on("finished", function(){
  console.log("DONE");
})