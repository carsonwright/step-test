class StepTest{
  constructor(name){
    this.name = name;
    this.events = [];
    this.interval = 0;
    this.callbacks = [];
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
  step(name, options){
    let cb = this.constructor.steps[name];
    if(!cb){
      name = `${name} - PENDING`
      cb = function(){
        
      }
    }
    this.events.push({name, cb, options})
    return this;
  }
  expect(name, cb){
    let t = this;
    this.events.push({name, cb})
    return this;
  }
  ok(assertion){
    let e = this.events[this.position - 1];
    if(assertion){
      console.log(`Passed: ${e.name}`)
    }else{
      throw `Failed: ${e.name}`;
    }
    return this;
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

    console.log(`${index + 1} - ${event.name}`)
    if(typeof event.cb.apply(this) != "undefined"){
      this.end();
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
    if(!this.events[this.position]){
      this.trigger("finished");
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
    this.nextEvent();
    return this;
  }
  pause(){
    this.mode = "pause";
    return this;
  }
  start(){
    this.position = 0;
    this.started = true;
    return this;
  }
  on(key, callback){
    this.callbacks[key] = this.callbacks[key] || []
    this.callbacks[key].push(callback);
    return this;
  }
  trigger(key, options){
    let t = this;
    (this.callbacks[key] || []).forEach(function(cb){
      cb.apply(t, [options])
    })
    return this;
  }
}
StepTest.steps = [];
StepTest.tests = [];
module.exports = StepTest;