const StepTestBase = require("./teststeps");
const StepTest3 = StepTestBase();

(function(){
  let finished = false;
  let t5 = StepTest3.test("Check that options can be passed in").tags(["One", "Two"])
  t5.step("Set Scratch To 1");
  t5.step("Remove from number from Scratch", 3)
  t5.expect("Scratch should Equal", function(){
    this.ok(this.scratch == -2);
  })

  StepTest3.reset();

  let t6 = StepTest3.test("Check that options can be passed in").tag("Three").tag("Two")
  t6.step("Set Scratch To 1", function(){
    this.scratch = 1;
  });
  t6.step("Remove from number from Scratch", function(){
    this.scratch -= 3;
  })
  t6.expect("Scratch should Equal", function(){
    this.ok(this.scratch == -2);
  })

  console.log("FORCE FINISHED TO RUN in 90000 OR FAIL");
  let timeout = setTimeout(function(){
    if(!finished){
      throw "Failed to run finished One"
    }
  },90000)

  StepTest3.on("finished", function(){
    if(t6.scratch != -2){
      throw "t6 didn't run";
    }
    finished = true;
    clearTimeout(timeout);
    console.log("test2.js Done")
  })
})()
module.exports = StepTest3;