export function Subscription(teardownOrSubscription) {
  this.teardownOrSubscription = teardownOrSubscription;
  this.unsubscribed = false;
  this.teardowns = [teardownOrSubscription];
}

Subscription.prototype.add = function(teardownOrSubscription) {
  this.teardowns.push(teardownOrSubscription);
}

Subscription.prototype.remove = function(tOrs) {
  this.teardowns = this.teardowns.filter(item => item !== tOrs);
}

Subscription.prototype.unsubscribe = function() {
  if (!this.unsubscribed) {
    this.unsubscribed = true;
    this.teardowns.forEach(this._unsubscribe);
    this.teardowns = [];
  }
}

Subscription.prototype._unsubscribe = function(teardownOrSubscription) {
  if (teardownOrSubscription) {
    if (teardownOrSubscription instanceof Subscription) {
      teardownOrSubscription.unsubscribe();
    } else {
      teardownOrSubscription();
    }
  }
}


export function createInterval(callback, timeout) {
  const timer = setInterval(callback, timeout);
  return new Subscription(() => clearInterval(timer));
}

export function createTimeout(callback, timeout) {
  setTimeout(callback, timeout);
}
