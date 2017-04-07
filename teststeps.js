const StepTest = require("./src/step-test");

class StepTestBase extends StepTest {}

StepTestBase.addStep("Set Scratch To 1", function(){
  this.scratch = 1;
});

StepTestBase.step("Add 1 to Scratch", function(){
  this.scratch += 1
});

StepTestBase.addStep("Remove 1 from Scratch", function(){
  this.scratch -= 1;
});

StepTestBase.addStep("Remove from number from Scratch", function(x){
  this.scratch -= x;
});

StepTestBase.addStep("Test Deferred + 1", function(){
  t = this.defer();
  setTimeout(function(){
    t.scratch += 1;
    t.resolve();
  }, 1000);
});

module.exports = StepTestBase;