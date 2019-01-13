[![Build Status](https://travis-ci.org/Qquanwei/tiny-event-manager.svg?branch=master)](https://travis-ci.org/Qquanwei/tiny-event-manager)

# tiny event manager

Javascript 轻量资源管理器


博客介绍: https://juejin.im/post/5bfe3d3be51d454cc05cca00

## demo

```javascript
import { createInterval, createTimeout, createEventListener } from 'tiny-event-manager';

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
