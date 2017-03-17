class StepTest{
  constructor(name){
    this.id = this.constructor.length - 1;
    this.name = name;
    this.events = [];
    this.interval = 0;
    this.callbacks = {};
    this.logs = [];
    this.assertions = [];
    let t = this;
    this.on("finished", function(data){
      this.constructor.trigger("test.finished", this);
      this.constructor.log(this.logs.join("\n"))
    })
    this.on("assertion.passed", function(message){
      this.constructor.trigger("test.assertion.passed", {name, message});
    })
    this.on("assertion.failed", function(data){
      this.constructor.trigger("test.assertion.failed", {name, message});
    })
    return this;
  }
  static test(name){
    let stepTestInstance = new this(name);
    this.tests.push(stepTestInstance);
    return stepTestInstance;
  }
  static addStep(name, cb){
    let t = this;
    if(this.steps[name] == undefined){
      this.steps[name] = cb;
    }else{
      throw `Step ${name} already exists!`;
    }
    return this;
  }
  async(cb){
    this.async = true;
  }
  step(name, options){
    let cb = this.constructor.steps[name];
    if(!cb){
      name = `${name} - PENDING`
      cb = function(){}
    }
    this.events.push({name, cb, options})
    return this;
  }
  expect(name, cb){
    let t = this;
    if(!cb){
      cb = function(){};
      name += " - PENDING"
    }
    this.events.push({name, cb})
    return this;
  }
  ok(assertion){
    let e = this.events[this.position - 1];
    if(assertion){
      this.log(`Passed: ${e.name}`);
      this.trigger('assertion.passed', `Passed: ${e.name}`);
    }else{
      this.trigger('assertion.failed', `Failed: ${e.name}`);
    }
    this.assertions.push(assertion);
    return this;
  }
  isSuccess(){
    let assertions = this.assertions.filter(function(assert){
      return assert != true;
    })
    return assertions.length == 0;
  }
  nextEvent(){
    if(!this.started){
      return this;
    }

    let index = this.position;
    this.position += 1;

    let event = this.events[index];

    if(!event){
      return this;
    }

    let log = this.constructor.showPosition ? [index + 1, "-" ]: []
    log.push(event.name)
    this.log(log.join(" "))
    this.async = false;
    event.cb.apply(this);
    if(!this.async){
      this.end();
      this.async = false;
    }

    return this;
  }
  wait(time){
    let t = this;
    let cb = function(){
      setTimeout(function(){
        t.end()
      }, time)
    }
    this.events.push({name: `Waiting ${time}`, cb});
    return this;
  }
  next(){
    this.nextEvent();
    return this;
  }
  end(){
    let t = this;
    if(!this.events[this.position] && this.status != "finished"){
      this.status = "finished";
      this.trigger("finished");
      return null;
    }
    if(this.mode == "play"){
      if(typeof this.interval == "number"){
        setTimeout(function(){
          t.nextEvent();
        }, this.interval)
      }else{
        this.nextEvent();
      }
    }
    return this;
  }
  play(){
    this.start()
    this.mode = "play";
    this.status = "playing";
    this.nextEvent();
    return this;
  }
  pause(){
    this.mode = "pause";
    this.status = "paused";
    return this;
  }
  log(content){
    this.logs.push(content);
    return this;
  }
  start(){
    this.log(`Started Test ${this.name}`);
    this.status = "started";
    this.position = 0;
    this.started = true;
    return this;
  }
  on(key, callback){
    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);
    return this;
  }
  trigger(key, options){
    let t = this;
    (this.callbacks[key] || []).forEach(function(cb){
      cb.apply(t, [options]);
    })
    return this;
  }
  static log(content){
    let c;
    c += "\n";
    c  = "=======================================================\n";
    c += content;
    c += "\n-------------------------------------------------------"
    c += "\n";
    console.log(c);
    return this;
  }
  static play(){
    this.start();
    this.tests.forEach(function(test){
      test.play();
    })
    return this;
  }
  static on(key, callback){
    this.callbacks[key] = this.callbacks[key] || []
    this.callbacks[key].push(callback);
    return this; 
  }
  static trigger(key, options){
    let t = this;
    (this.callbacks[key] || []).forEach(function(cb){
      cb.apply(t, [options])
    })
    return this;
  }
  static start(){
    this.on("test.finished", function(){
      let finished = this.tests.filter(function(test){
        return test.status == "finished";
      })
      if(finished.length == this.tests.length){
        this.trigger("finished")
      }
    })
  }
  static reset(){
    this.tests = [];
  }
}

StepTest.showPosition = true;
StepTest.callbacks = {};
StepTest.steps = [];
StepTest.tests = [];
module.exports = StepTest;