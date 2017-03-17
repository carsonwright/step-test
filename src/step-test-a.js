class StepTest{
  constructor(name, description){
    this.name = name;
    this.description = description;
    return this.PromiseWrapper(function(){
      
    })
  }
  PromiseWrapper(cb){
    let t = this;
    return new Promise(function(resolve, reject){
      try{
        let cbReturn = cb.apply(null, [t]);
        if(cbReturn && cbReturn.then){
          cbReturn.then(function(result){
            resolve(t);
          }).catch(function(error){
            reject(error);
          })
        }else{
          resolve(t);
        }
        
      }catch(error){
        reject(t);
      }
    })
  }
  static addStep(name, cb){
    this.steps[name] = cb;
  }
  step(name, options){
    return this.PromiseWrapper(this.constructor.steps[name].bind(this, options));
  }
  static test(name, description){
    console.log(`Starting ${name}`);
    return new this({name, description});
  }
}
StepTest.steps = [];
StepTest.expectations = [];
StepTest.suites = [];
module.exports = {default: StepTest};