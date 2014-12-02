'use strict';

var assert = require('assert'), GSObject = require('./../lib/object');

describe('GSObject', function() {
  describe('#extend', function() {
    it('should return an extend object', function() {
      var NewClass = GSObject.extend({
        test: function() {}
      });

      assert(typeof NewClass.prototype.test === 'function');
    });

    it('should call init when present', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new NewClass();
      assert(called);
    });

    it('should call parent constructor if init not present', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new (NewClass.extend({}))();
      assert(called);
    });

    it('should allow call of parent cownstructor', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      new (NewClass.extend({
        init: function() {
          this.__super();
        }
      }))();

      assert(called);
    });

    it('should allow call of parent method', function() {
      var called = false, NewClass = GSObject.extend({
        test: function() {
          called = true;
        }
      });

      (new (NewClass.extend({
        test: function() {
          this.__super();
        }
      }))()).test();

      assert(called);
    });
  });

  describe('#create', function() {
    it('should return an object set with given values', function() {
      assert(GSObject.create({test: 123}), 123);
    });

    it('should call init', function() {
      var called = false, NewClass = GSObject.extend({
        init: function() {
          called = true;
        }
      });

      NewClass.create({});
      assert(called);
    });
  });
});
