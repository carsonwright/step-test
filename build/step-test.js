"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StepTestSuite() {
  var StepTest = function () {
    function StepTest(name) {
      _classCallCheck(this, StepTest);

      this.id = this.constructor.length - 1;
      this.name = name;
      this.events = [];
      this.interval = 0;
      this.callbacks = {};
      this.logs = [];
      this.assertions = [];
      this.tagged = [];
      var t = this;
      this.on("finished", function (data) {
        if (this.constructor.parallel) {
          this.constructor.log(this.logs.join("\n"));
        }
        this.constructor.trigger("test.finished", this);
      });
      this.on("assertion.passed", function (message) {
        this.constructor.trigger("test.assertion.passed", { name: name, message: message });
      });
      this.on("assertion.failed", function (message) {
        this.constructor.trigger("test.assertion.failed", { name: name, message: message });
      });
      this.on("error", function (message) {
        this.constructor.trigger("error", { name: name, message: message });
      });
      this.trigger("initialized");
      return this;
    }

    _createClass(StepTest, [{
      key: "defer",
      value: function defer() {
        this.deferred = true;
        return this;
      }
    }, {
      key: "tag",
      value: function tag(_tag) {
        this.tagged.push(_tag);
        return this;
      }
    }, {
      key: "tags",
      value: function tags(_tags) {
        this.tagged = this.tagged.concat(_tags);
        return this;
      }
    }, {
      key: "step",
      value: function step(name, options) {
        var cb = this.constructor.steps[name];
        if (!cb) {
          if (typeof options === "function") {
            cb = options;
          } else {
            name = name + " - PENDING";
            cb = function cb() {};
          }
        }
        if (Array.isArray(cb)) {
          var s = this;
          cb.forEach(function (_s) {
            s.step(_s);
          });
        } else {
          this.events.push({ name: name, cb: cb, options: options });
        }
        return this;
      }
    }, {
      key: "expect",
      value: function expect(name, cb) {
        var t = this;
        if (!cb) {
          cb = function cb() {};
          name += " - PENDING";
        }
        this.events.push({ name: name, cb: cb });
        return this;
      }
    }, {
      key: "ok",
      value: function ok(assertion) {
        var e = this.events[this.position - 1];
        if (assertion) {
          this.log("Passed: " + e.name);
          this.trigger('assertion.passed', "Passed: " + e.name);
        } else {
          this.log("Failed: " + e.name);
          this.trigger('assertion.failed', "Failed: " + e.name);
          this.trigger("error", e.name);
        }
        this.assertions.push(assertion);
        return this;
      }
    }, {
      key: "isSuccess",
      value: function isSuccess() {
        var assertions = this.assertions.filter(function (assert) {
          return assert != true;
        });
        return assertions.length === 0;
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

        var log = this.constructor.showPosition ? [index + 1, "-"] : [];
        log.push(event.name);
        this.log(log.join(" "));
        this.deferred = false;
        try {
          event.cb.apply(this, [event.options]);
        } catch (error) {
          this.log("Failed: " + event.name);
          this.trigger("error", event.name);
        }
        if (!this.deferred) {
          this.resolve();
          this.deferred = false;
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
        if (!this.events[this.position] && this.status !== "finished") {
          this.status = "finished";
          this.trigger("finished");
          return null;
        }
        if (this.mode === "play") {
          if (typeof this.interval === "number") {
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
        this.status = "playing";
        this.nextEvent();
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.mode = "pause";
        this.status = "paused";
        return this;
      }
    }, {
      key: "log",
      value: function log(content) {
        if (this.constructor.parallel) {
          this.logs.push(content);
        } else {
          this.constructor.log(content);
        }
        return this;
      }
    }, {
      key: "start",
      value: function start() {
        this.log("Started Test " + this.name);
        this.status = "started";
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
      key: "resolve",
      value: function resolve() {
        this.end();
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
      key: "step",
      value: function step(name, cb) {
        var t = this;
        if (this.steps[name] == undefined) {
          this.steps[name] = cb;
        } else {
          throw "Step " + name + " already exists!";
        }
        return this;
      }
    }, {
      key: "log",
      value: function log(content) {
        console.log(content);
        return this;
      }
    }, {
      key: "shuffle",
      value: function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
        }
      }
    }, {
      key: "play",
      value: function play(filter) {
        var st = this;
        this.status = "playing";
        this.position = 0;
        this.currentPlay = filter ? this.tests.filter(filter) : this.tests;
        this.start({ length: this.currentPlay.length });
        this.shuffle(this.currentPlay);

        if (this.parallel) {
          this.currentPlay.forEach(function (test) {
            setTimeout(function () {
              // Detach into thread;
              test.play();
            }, 0);
          });
        } else {
          this.nextTest();
        }
        return this;
      }
    }, {
      key: "pause",
      value: function pause() {
        this.status = "paused";
        return this;
      }
    }, {
      key: "next",
      value: function next() {
        this.nextTest();
        return this;
      }
    }, {
      key: "nextTest",
      value: function nextTest() {
        var st = this;
        if (st.currentPlay[st.position]) {
          this.currentPlay[st.position].on("finished", function () {
            st.position += 1;
            setTimeout(function () {
              if (st.currentPlay[st.position] && st.status === "playing") {
                st.nextTest();
              }
            }, st.interval);
          });
          this.currentPlay[st.position].play();
        }
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
    }, {
      key: "start",
      value: function start() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var st = this;
        this.on("test.finished", function () {
          var finished = this.tests.filter(function (test) {
            return test.status === "finished";
          });

          var length = void 0;
          if (typeof options.length === "number") {
            length = options.length;
          } else {
            length = this.tests.length;
          }

          if (finished.length === length) {
            st.trigger("finished");
          }
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        this.tests = [];
        this.position = 0;
        this.callbacks = {};
        this.steps = [];
        return this;
      }
    }]);

    return StepTest;
  }();

  StepTest.showPosition = true;
  StepTest.callbacks = {};
  StepTest.steps = [];
  StepTest.tests = [];
  StepTest.interval = 0;
  StepTest.parallel = false;

  StepTest.Suite = StepTestSuite;
  return StepTest;
}
var StepTest = StepTestSuite();
StepTest.Suite = StepTestSuite;

if (typeof module !== "undefined") {
  module.exports = StepTest;
}
