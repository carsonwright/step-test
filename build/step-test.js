"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StepTest = function () {
  function StepTest(name) {
    _classCallCheck(this, StepTest);

    this.name = name;
    this.events = [];
    this.interval = 0;
    this.callbacks = [];
    return this;
  }

  _createClass(StepTest, [{
    key: "step",
    value: function step(name, options) {
      var cb = this.constructor.steps[name];
      if (!cb) {
        name = name + " - PENDING";
        cb = function cb() {};
      }
      this.events.push({ name: name, cb: cb, options: options });
      return this;
    }
  }, {
    key: "expect",
    value: function expect(name, cb) {
      var t = this;
      this.events.push({ name: name, cb: cb });
      return this;
    }
  }, {
    key: "ok",
    value: function ok(assertion) {
      var e = this.events[this.position - 1];
      if (assertion) {
        console.log("Passed: " + e.name);
      } else {
        throw "Failed: " + e.name;
      }
      return this;
    }
  }, {
    key: "nextEvent",
    value: function nextEvent() {
      if (!this.started) {
        return this;
      }

      var index = this.position;
      this.position += 1;

      var event = this.events[index];

      if (!event) {
        return this;
      }

      console.log(index + 1 + " - " + event.name);
      if (typeof event.cb.apply(this) != "undefined") {
        this.end();
      }

      return this;
    }
  }, {
    key: "wait",
    value: function wait(time) {
      var t = this;
      var cb = function cb() {
        setTimeout(function () {
          t.end();
        }, time);
      };
      this.events.push({ name: "Waiting " + time, cb: cb });
      return this;
    }
  }, {
    key: "next",
    value: function next() {
      this.nextEvent();
      return this;
    }
  }, {
    key: "end",
    value: function end() {
      var t = this;
      if (!this.events[this.position]) {
        this.trigger("finished");
      }
      if (this.mode == "play") {
        if (typeof this.interval == "number") {
          setTimeout(function () {
            t.nextEvent();
          }, this.interval);
        } else {
          this.nextEvent();
        }
      }
      return this;
    }
  }, {
    key: "play",
    value: function play() {
      this.start();
      this.mode = "play";
      this.nextEvent();
      return this;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.mode = "pause";
      return this;
    }
  }, {
    key: "start",
    value: function start() {
      this.position = 0;
      this.started = true;
      return this;
    }
  }, {
    key: "on",
    value: function on(key, callback) {
      this.callbacks[key] = this.callbacks[key] || [];
      this.callbacks[key].push(callback);
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(key, options) {
      var t = this;
      (this.callbacks[key] || []).forEach(function (cb) {
        cb.apply(t, [options]);
      });
      return this;
    }
  }], [{
    key: "test",
    value: function test(name) {
      var stepTestInstance = new this(name);
      this.tests.push(stepTestInstance);
      return stepTestInstance;
    }
  }, {
    key: "addStep",
    value: function addStep(name, cb) {
      var t = this;
      if (this.steps[name] == undefined) {
        this.steps[name] = cb;
      } else {
        throw "Step " + name + " already exists!";
      }
      return this;
    }
  }]);

  return StepTest;
}();

StepTest.steps = [];
StepTest.tests = [];
module.exports = StepTest;
