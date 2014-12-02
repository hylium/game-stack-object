var _ = require('lodash');

/**
 * Dummy constructor.
 * @constructor
 */
var GSObject = function() {};

/**
 * Extends class' prototype with the given object.
 * @param {Object} childClass
 * @returns {Function}
 */
GSObject.extend = function(childClass) {
  var parentObject = this, childObject = function() {
    if (_.isFunction(childClass.init)) {
      var self = this;
      this.__super = function() {
        parentObject.apply(self, arguments);
      };
      childClass.init.apply(self, arguments);
      delete this.__super;
    } else {
      parentObject.apply(this, arguments);
    }
  }
  var copyOfParent = Object.create(_.mapValues(_.merge({}, parentObject.prototype, childClass), function(func, key) {
    return !_.isFunction(func) ? func : function() {
      var self = this;
      this.__super = function() {
        return parentObject.prototype[key].apply(self, arguments);
      };
      var result = func.apply(this, arguments);
      delete this.__super;
      return result;
    }
  }));
  copyOfParent.constructor = childObject;
  childObject.prototype = copyOfParent;
  childObject.extend = parentObject.extend;
  childObject.create = parentObject.create;
  return childObject;
};

/**
 * Creates an object with given values.
 * @param obj
 * @returns {Object|*}
 */
GSObject.create = function(obj) {
  return _.merge(new this(), obj);
};

module.exports = GSObject;
