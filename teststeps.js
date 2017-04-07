module.exports = function(){
  const StepTest = require("./src/step-test").Suite();

  StepTest.addStep("Set Scratch To 1", function(){
    this.scratch = 1;
  });

  StepTest.step("Add 1 to Scratch", function(){
    this.scratch += 1
  });

  StepTest.addStep("Remove 1 from Scratch", function(){
    this.scratch -= 1;
  });

  StepTest.addStep("Remove from number from Scratch", function(x){
    this.scratch -= x;
  });

  StepTest.addStep("Test Deferred + 1", function(){
    t = this.defer();
    setTimeout(function(){
      t.scratch += 1;
      t.resolve();
    }, 1000);
  });

  return StepTest;
}