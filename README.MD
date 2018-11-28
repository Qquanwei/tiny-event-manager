[![Build Status](https://travis-ci.org/Qquanwei/tiny-event.svg?branch=master)](https://travis-ci.org/Qquanwei/tiny-event)

# tiny event manager

Javascript 统一所有的事件资源


## demo

```javascript
import { createInterval, createTimeout, createEventListener } from 'tiny-event';

const sub1 = createInterval(() => {}, 1000);
const sub2 = createTimeout(() => {}, 1000);
const sub3 = createEventListener(window, 'scroll', () => {});

const subscription = new Subscription();

subscription.add(sub1);
subscription.add(sub2);
subscription.add(sub3);

// subscription.unsubscribe will dispose all event resource

subscription.unsubscribe();
```


## API

### createInterval :: (callback, timeout) => Subscription

### createTimeout :: (callback, timeout) => Subscription

### createEventListener :: (element, eventName, callback) => Subscription

### Subscription :: constructor(teardownOrSubscription)
