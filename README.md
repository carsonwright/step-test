### Setup
```
import StepTest from 'step-test';
```

### Steps
```
StepTest.addStep("Mount UserComponent", function(){
  render(UserComponent, this.scratch)
})
.addStep("Enter Email", function(){
  this.scratch.querySelector("#email").value = "here";
})
.addStep("Enter Password", function(t){
  this.scratch.querySelector("#password").value = "here is password";
})
```
### Async Steps
```
StepTest.addStep("Test Async", function(){
  var t = this.defer()
  setTimeout(function(){
    // Do something
    t.resolve();
  }, 1000)
})
```

### Tests
```
StepTest.test("Awesome")
.step("Mount UserComponent")
.step("Enter Email")
.step("Enter Password")
.step("Test Async")
.expect("Should Render UserForm", function(){
  return expect(t.scratch.innerHTML).to.be("<div></div>");
})
.play()
```