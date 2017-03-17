### Setup
```
import StepTest from 'step-test';
```

### Steps
```
StepTest.addStep("Mount UserComponent", function(){
  return render(UserComponent, this.scratch)
})
.addStep("Enter Email", function(){
  return this.scratch.querySelector("#email").value = "here";
})
.addStep("Enter Password", function(t){
  return this.scratch.querySelector("#password").value = "here is password";
})
```

### Tests
```
StepTest.test("Awesome")
.step("Mount UserComponent")
.step("Enter Email")
.step("Enter Password")
.expect("Should Render UserForm", function(){
  return expect(t.scratch.innerHTML).to.be("<div></div>");
})
.play()
```