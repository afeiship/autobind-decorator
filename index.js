// @thanks to: https://github.com/andreypopp/autobind-decorator/blob/master/src/index.js
module.exports = function(inTarget, inKey, inDescriptor) {
  var fn = inDescriptor.value;

  console.log('typeof fn', typeof fn);

  if (typeof fn !== 'function') {
    throw new TypeError('@autobind decorator can only be applied to methods');
  }

  return {
    configurable: true,
    get: function() {
      if (this.hasOwnProperty(inKey)) return fn;
      var boundFn = fn.bind(this);
      // redefine the key for the target:
      Object.defineProperty(this, inKey, {
        configurable: true,
        get: function() {
          return boundFn;
        },
        set: function(inValue) {
          fn = inValue;
          delete this[inKey];
        }
      });
      return boundFn;
    },
    set: function(inValue) {
      fn = inValue;
    }
  };
};
