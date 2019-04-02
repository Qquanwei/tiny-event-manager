function wrapperCallback(intp, callback, self) {
  return function (fulfilled, rejected) {
    const r = callback.call(self, function () {
      if (!intp.interrupted && fulfilled) {
        return fulfilled.apply(this, arguments);
      }
    }, function () {
      if (!intp.interrupted && rejected) {
        return rejected.apply(this, arguments)
      }
    });
    return wrapperPromise(intp, r);
  }
}

function wrapperPromise(intp, p) {
  p.then = wrapperCallback(intp, p.then, p);
  p.catch = wrapperCallback(intp, p.catch, p);
  return p;
}
export default function createInterruptable() {
  const internalFlags =  {};

  function resolve (value) {
    if (!value || !value.then || typeof value.then !== 'function') {
      throw new Error('value is not promise');
    }
    return wrapperPromise(internalFlags, value);
  }

  internalFlags.interrupted = false;

  return {
    internalFlags,
    resolve
  };
}
