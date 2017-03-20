# Step Test
This framework operates much like cucumber but is class based. 
```
test = new StepTest()
test.name = "My Test"
``` 
Is the same as 
```
StepTest.test("My Test")
```
This means you can use class inheritance, and can change the class prototype. Any shared test data can also be placed on your current instance. Every instance method has access to ```this``` which is how one can attach ```scratch``` like so ```this.scratch```

Tests are broken up into reusable steps that are then stacked up with expectations on the test instantiation.

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
  return this.ok(t.scratch.innerHTML == "<div></div>"); // Chai can be used and it is suggested
})
.play()
```
