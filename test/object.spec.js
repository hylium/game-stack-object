'use strict';

var GSObject = require('./../lib/object'), should = require('should');

describe('GSObject', function() {
  describe('#extend', function() {
    it('should return an extended object', function() {
      var NewClass = GSObject.extend({
        test: function() {}
      });

      NewClass.prototype.test.should.be.a.Function;
      NewClass.extend.should.be.a.Function;
      NewClass.create.should.be.a.Function;
      NewClass.createWithMixins.should.be.a.Function;
    });

    it('should call init when present', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new NewClass();
      called.should.be.true;
    });

    it('should call parent constructor if init not present', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new (NewClass.extend({}))();
      called.should.be.true;
    });

    it('should allow call of parent cownstructor', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new (NewClass.extend({
        init: function() {
          this.$super();
        }
      }))();

      called.should.be.true;
    });

    it('should allow call of parent method', function() {
      var called = false, NewClass = GSObject.extend({
        test: function() {
          called = true;
        }
      });

      (new (NewClass.extend({
        test: function() {
          this.$super();
        }
      }))()).test();

      called.should.be.true;
    });

    it('should throw with no parameters', function() {
      GSObject.extend.should.throw();
    });
  });

  describe('#create', function() {
    it('should return an object set with given values', function() {
      GSObject.create({test: 123}).test.should.be.exactly(123);
    });

    it('should call init', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      NewClass.create({});
      called.should.be.true;
    });
  });

  describe('#createWithMixins', function() {
    it('should return an object with given values', function() {
      GSObject.createWithMixins({test: 123}).test.should.be.exactly(123);
    });

    it('should return an extended object with given mixins', function() {
      GSObject.createWithMixins({}, {test: function() {}}).test.should.be.a.Function;
    });
  });

  describe('prototype', function() {
    describe('#$on', function() {
      it('should register an event listener', function() {
        var obj = new GSObject(), called = false;
        obj.$on('test', function() {
          called = true;
        });
        obj.$$eventListeners.test[0]();
        called.should.be.true;
      });

      it('should return a dismiss event function', function() {
        var obj = new GSObject();
        obj.$on('test', function() {}).$dismiss();
        obj.$$eventListeners.test.should.have.length(0);
      });
    });

    describe('#$emit', function() {
      it('should call all event listeners for a given event with given arguments', function() {
        var obj = new GSObject(), called = 0;
        obj.$$eventListeners = {
          test: [
            function() {
              called += 1;
            },
            function(arg) {
              called += arg;
            }
          ]
        }
        obj.$emit('test', 123);
        called.should.be.exactly(124);
      });
    });

    describe('#$off', function() {
      it('should unregister all event listeners for a given event', function() {
        var obj = new GSObject(), called = 0;
        obj.$$eventListeners = {
          test: [function() {}]
        }
        obj.$off('test');
        obj.$$eventListeners.test.should.have.length(0);
      });
    });

    describe('#$property', function() {
      it('should register a new property with given setter and setter', function() {
        (new GSObject()).$property('test', function(value) {
          return value + 1;
        }, function(newValue) {
          return newValue + 3;
        }).$set('test', 1).$get('test').should.be.exactly(5);
      });

      it('should register a new property with default getter/setter if not given', function() {
        (new GSObject()).$property('test').$set('test', 123).$get('test').should.be.exactly(123);
      });

      it('should return null value when accessing a undefined property', function() {
        ((new GSObject()).$get('test') === null).should.be.true;
      });
    });

    describe('#$set', function() {
      it('should fire an event when setting a property', function() {
        var result;
        (new GSObject()).$on('test:changed', function(value) {result = value}).$chain().$property('test').$set('test', 123);
        result.should.be.exactly(123);
      });
    })
  });
});
