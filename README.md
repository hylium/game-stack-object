# GameStack Object

The GSObject class allows you to extend existing classes, creates new ones with helping methods inside or create objects 
with a given set of values. Since the GameStack requires `lodash`, GSObject use it too.

## Usage

GSObject has two methods, `extend` and `create`. These two methods will be pasted on each extended classes. The usage is
pretty simple, here's an example for `extend`:

```javascript
var GSObject = require('game-stack-object');

// Create a brand new class
var MyClass = GSObject.extend({
  init: function() {
    // Some constructor stuff
  },
  
  aUselessFunc = function(pointless) {
    return pointless;
  }
});
```

By default when you will `new` your class, the parent constructor will be called if no `init` method is provided. So
if the parent class is `GSObject`, the constructor will do nothing. You can also access to the parent class method by calling `this.__super` inside the function like this :

```javascript
var MyUbberClass = MyClass.extend({
  aUselessFunc = function(pointless) {
    return this.__super(pointless); // This will call aUselessFunc of the parent class, in this case MyClass.aUselessFunc
  }
});
```
 
The `create` method allows you to create a new object of your class initialized with given values. Here's an example :

```javascript
var myObject = MyClass.create({ myVar: 123 })

console.log(myObject.myVar); // Will display 123
```

*Warning* : when you're using the create method, the `init` method, if present, will be called WITHOUT arguments and
given values will be applied AFTER `ìnit` call.

