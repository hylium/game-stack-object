var _ = require('lodash');

/**
 * Dismismisable container for
 * @param {GSObject} obj
 * @param {String} event
 * @param {Function} event
 * @constructor
 */
function DismisableEvent(obj, event, callback) {
  /**
   * Returns a dismiss function for the event.
   * @returns {Function}
   */
  this.$dismiss = function() {
    obj.$$eventListeners[event].splice(obj.$$eventListeners[event].indexOf(callback), 1);
  };

  /**
   * Allows chaining.
   * @returns {GSObject}
   */
  this.$chain = function() {
    return obj;
  };
}

/**
 * Dummy constructor.
 * @constructor
 */
var GSObject = function() {};

GSObject.prototype = {
  /**
   * Add an event listeners. Multuple listeners can be registered for the same event.
   * @param {String} event
   * @param {Function} callback
   * @returns {DismisableEvent}
   */
  $on: function(event, callback) {
    this.$$eventListeners = this.$$eventListeners || {};
    this.$$eventListeners[event] = this.$$eventListeners[event] || [];
    this.$$eventListeners[event].push(callback);
    return new DismisableEvent(this, event, callback);
  },

  /**
   * Triggers an event.
   * @param {String} event
   * @returns {GSObject}
   */
  $emit: function(event) {
    if (!this.$$eventListeners || !_.isArray(this.$$eventListeners[event])) {return this;}
    var args = arguments, self = this;
    this.$$eventListeners[event].forEach(function(callback) {
      callback.apply(self, Array.prototype.slice.call(args, 1));
    });
    return this;
  },

  /**
   * Unregister all event listeners for a given event.
   * @param {String} event
   * @returns {GSObject}
   */
  $off: function(event) {
    if (!this.$$eventListeners || !_.isArray(this.$$eventListeners[event])) {return this;}
    this.$$eventListeners[event] = [];
    return this;
  },

  /**
   * Sets a property on the object. This property will only be accessible from given getter and setter.
   * @param {String} propertyName
   * @param {Function} [getter]
   * @param {Function} [setter]
   * @returns {GSObject}
   */
  $property: function(propertyName, getter, setter) {
    this.$$properties = this.$$properties || {};
    getter = getter || function(value) {return value;};
    setter = setter || function(value) {return value;};
    var privateVar = null, self = this;
    this.$$properties[propertyName] = {
      get: function() {
        return getter.call(self, privateVar);
      },
      set: function(value) {
        privateVar = setter.call(self, value, privateVar);
        return self;
      }
    };
    return this;
  },

  /**
   * Returns the value of a property.
   * @param {String} propertyName
   * @returns {*}
   */
  $get: function(propertyName) {
    return this.$$properties && this.$$properties[propertyName] && this.$$properties[propertyName].get ?
      this.$$properties[propertyName].get() : null;
  },

  /**
   * Sets the value of a property and fires an event named propertName:changed where propertyNane
   * is the given propertyName.
   * @param {String} propertyName
   * @param {*} value
   * @returns {GSObject}
   */
  $set: function(propertyName, value) {
    if (this.$$properties && this.$$properties[propertyName] && this.$$properties[propertyName].set) {
      return this.$$properties[propertyName].set(value).$emit(propertyName + ':changed', value);
    }
    return this.$property(propertyName).$set(propertyName, value);
  },

  /**
   * Deletes a property.
   * @param propertyName
   * @returns {GSObject}
   */
  $remove: function(propertyName) {
    return this;
  }
};

/**
 * Extends class' prototype with the given object.
 * @param {Object} childProto
 * @returns {Function}
 */
GSObject.extend = function(childProto) {
  if (!childProto) throw new Error('Cannot extend from undefined.');

  // Constructor inheritance
  var parentClass = this, childClass = function() {
    if (_.isFunction(childProto.init)) {
      var self = this;
      this.$super = function() {
        parentClass.apply(self, arguments);
      };
      childProto.init.apply(self, arguments);
      delete this.$super;
    } else {
      parentClass.apply(this, arguments);
    }
  };

  // Method inheritance
  var copyOfParent = _.mapValues(_.merge({}, parentClass.prototype, childProto), function(func, key) {
    return _.isFunction(func) ? function() {
      var self = this;
      self.$super = function() {
        return parentClass.prototype[key].apply(self, arguments);
      };
      var result = func.apply(this, arguments);
      delete self.$super;
      return result;
    } : func;
  });

  // Prototype and constructor assign
  copyOfParent.constructor = childClass;
  childClass.prototype = copyOfParent;

  // Copy class methods
  childClass.extend = parentClass.extend.bind(childClass);
  childClass.create = parentClass.create.bind(childClass);
  childClass.createWithMixins = parentClass.createWithMixins.bind(childClass);

  return childClass;
};

/**
 * Creates an object with given values. If parent/class methods are overidden, they will not be available.
 * @param {Object} obj
 * @returns {Object|*}
 */
GSObject.create = function(obj) {
  return _.merge(new this(), obj);
};

/**
 * Creates an object of a new class extended from the called class.
 * @param {Object} obj
 * @param {Object} mixins
 * @returns {Object}
 */
GSObject.createWithMixins = function(obj, mixins) {
  var NewClass = this.extend(mixins || {});
  return NewClass.create(obj);
};

module.exports = GSObject;
