# Step Test
This framework operates much like cucumber but is class based. 
```
test = new StepTest()
test.name = "My Test"
``` 
Is the same as 
```
test = StepTest.test("My Test")
```
This means you can use class inheritance, and can change the class prototype. Any shared test data can also be placed on your current instance. Every instance method has access to ```this``` which is how one can attach ```scratch``` like so ```this.scratch```

#### step {Class Level} vrs Step {Instance Level}
* step {Class Level} - Tests are broken up into reusable steps and attached to to the class
* step {Instance Level} - Steps are then stacked up with expectations to create the test.

#### Parallelism and Isolation
All testing is done in parallel so don't write tests that rely on each other, each test must be designed to operate independently.

## WARNING
Shorthand es6 arrow functions may not work correctly with this framework since ```this``` may not actually be ```this```.
It is recomended that you use the es5 ```function(){}``` instead of ```()=>{}```.
If you rely on linting heavily here is a solution to ignore the longhand function usage.
http://stackoverflow.com/questions/27732209/turning-off-eslint-rule-for-a-specific-line
### Setup
```
import StepTest from 'step-test';
```

### Reusable Steps
```
StepTest.step("Mount UserComponent", function(){
  render(UserComponent, this.scratch)
})
.step("Enter Email", function(){
  this.scratch.querySelector("#email").value = "here";
})
.step("Enter Password", function(){
  this.scratch.querySelector("#password").value = "here is password";
})
```

#### Arguments
```
StepTest.addStep("Test Name", function(name){
  console.log(name);
  this.name = name;
})
```

#### Async Steps
The use of Defer and Resolve much like a promise are provided for async tests.
```
StepTest.addStep("Test Async", function(){
  var t = this.defer();
  setTimeout(function(){
    // Do something
    t.resolve();
  }, 1000)
})
```

#### Step Sets
If you find you have a number of steps that you want to test independently but you don't want to refer to them in every test after that just put their names inta an array with a new name and add them as if they are a step.
```
StepTest.addStep("Setup Form", [
  "Mount UserComponent",
  "Enter Email",
  "Enter Password"
])
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

### Test with Inline Step Declaration
```
StepTest.test("Awesome")
        .step("Mount UserComponent")
        .step("Enter Email")
        .step("Enter Password")
         /////////////////////////////////////////
         // Inline Declaration
         /////////////////////////////////////////
        .step("Check Remember Me", function(){
          var rememberMe = this.scratch.querySelector("#remember-me");
          ReactSimulateClick(rememberMe);
        })
        .expect("Should Render UserForm", function(){
          return this.ok(t.scratch.innerHTML == "<div></div>"); // Chai can be used and it is suggested
        })
        .play()
```

#### Arguments
```
StepTest.test("User Test")
        .step("Test Name", "Carson Wright")
        .expect("Name should be Carson Wright", function(){
          this.ok(this.name == "Carson Wright")
        })

```
### Debugging
You may have noticed that ```.play()``` is available, ```.pause()``` is also available, and ```.next()```. These functions can be run in a step and give you control over when each step advances, this strategy can be extremely helpful when trying to find the offending step as you can keep checking your test and then running ```.next()``` until you find where things went wrong.

### Tags Instead of Suites
Tags are provided instead of suites because tests often overlap in functionality and suites don't really provide you with helpful organization as a test generally will land in more than one category.
```
StepTest.test("My Test").tag("Me").tag("test").tag("Development")
```
