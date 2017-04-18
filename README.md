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

#### Demo
See Step Test in Action and use the playground to experiment
https://step-test.github.io

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
For Webpack
```
import StepTest from 'step-test';
```

For Node
```
const StepTest from 'step-test';
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
StepTest.step("Test Name", function(name){
  console.log(name);
  this.name = name;
})
```

#### Async Steps
The use of Defer and Resolve much like a promise are provided for async tests.
```
StepTest.step("Test Async", function(){
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
StepTest.step("Setup Form", [
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
You can use an inline step declaration if you have not previously declared a step at the class level with the same name.
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
Tags are provided instead of suites because tests often overlap in functionality and suites don't really provide you with helpful organization since a test often will land in more than one category.
#### Tag
```
StepTest.test("My Test").tag("My").tag("test").tag("Development")
```
#### Tags
```
StepTest.test("My Test").tags(["My", "Test", "Development"])

Suggested Structuring could be

var testTags = {}
testTags.groupFolder = ["src", "./src/groups"];
testTags.File1 = ["File1", "My Test"].concat(testTags.groupFolder)

StepTest.test("Accepts Proper Values").tags(testTags.File1)
```

#### Playing Tests with specific tags or steps

In this example it would play all tests that have a tag with "File1" or an event with the name "Accepts". 

()=> is an es6 standard if you find it confusing just replace it when you read with function(){} instead.

```
StepTest.play(function(test){
  return test.tags.indexOf("File1") != -1 || test.events.map((e)=> e.name ).indexOf("Accepts") != -1
})
```

### The Suite
Step Test comes with your suite already initialized, however if you wish to split your test suite for some reason it is possible. It is recommended that you place it inside a new context and still refer to it as StepTest since technically you should not be separating and organizing your code by suites. Key reasons would be the ability to completely start fresh as if no other tests have been run, this is done on the Step Test website for each example.
```
function(){
  var StepTest = StepTest.Suite();
}
```
