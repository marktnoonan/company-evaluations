// from: http://speakingjs.com/es5/ch17.html#code_copyOwnPropertiesFrom
// for where I would use spread operator.

function spreadObject(orig) {
    // 1. copy has same prototype as orig
    var copy = Object.create(Object.getPrototypeOf(orig));

    // 2. copy has all of orig’s properties
    copyOwnPropertiesFrom(copy, orig);

    return copy;
}

function copyOwnPropertiesFrom(target, source) {
    Object.getOwnPropertyNames(source)  // (1)
    .forEach(function(propKey) {  // (2)
        var desc = Object.getOwnPropertyDescriptor(source, propKey); // (3)
        Object.defineProperty(target, propKey, desc);  // (4)
    });
    return target;
};


// my own helpers:

function arrayFromCollection(collection) {
  return [].slice.call(collection);
}

function prettifyNumbers(targetObject) {
  Object.keys(targetObject).forEach(function(key) {
    var value = targetObject[key];
    if (typeof value === "number" && key !== "uid") {
      targetObject["pretty-" + key] = numeral(value).format('(0,0)');
    } else if (value === "0" && key !== "foundedYear") {
          targetObject["pretty-" + key] = "0";
    }
  });
  return targetObject;
}

function setHash(newHash) {
return new Promise(function(resolve, reject) {
  window.location.hash = newHash;
  resolve();
    });
}
