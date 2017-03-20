const StepTest = require("./src/step-test");

StepTest.addStep("Set Scratch To 1", function(){
  this.scratch = 1;
})

StepTest.addStep("Add 1 to Scratch", function(t){
  this.scratch += 1
})

StepTest.addStep("Remove 1 from Scratch", function(t){
  this.scratch -= 1;
})

StepTest.addStep("Test Deferred", function(t){
  t = this.defer()
  setTimeout(function(){
    this.scratch += 1;
    t.resolve();
  }, 1000)
})

t = StepTest.test("Test Scratch 1");
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
t.step("Build something More!");

t1 = StepTest.test("Test Scratch 2");
t1.step("Set Scratch To 1");
t1.step("Add 1 to Scratch");
t1.step("Remove 1 from Scratch");
t1.expect("Scratch should Equal 1", function(){
  return this.ok(this.scratch == 1);
})

t2 = StepTest.test("Test Scratch 3")
t2.step("Set Scratch To 1");
t2.step("Remove 1 from Scratch");
t2.expect("Scratch should Equal 0", function(){
  return this.ok(this.scratch == 0);
})
t2.expect("This should not error but instead be ... ");
StepTest.play();

t3 = StepTest.test("Test Scratch 3 Defer")
t3.step("Set Scratch To 1");
t3.step("Remove 1 from Scratch");
t3.step("Test Deferred");
t3.expect("Scratch should Equal -1", function(){
  return this.ok(this.scratch == -1);
})
StepTest.play();

StepTest.on("finished", function(){
  if(t1.scratch != 1){
    throw "Failed to Set t1 Scratch properly"
  }

  if(t2.scratch != 0){
    throw "Failed to Set t2 Scratch properly"
  }

  if(t3.scratch == -1){
    throw "Failed to Set t3 Scratch properly"
  }
})