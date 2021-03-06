import {
  createInterval,
  Subscription,
  createTimeout,
  createEventListener,
  createPromise
} from '../src';
import { JSDOM } from 'jsdom';

describe('test Subscription', () => {
  it ('should export Subscription', () => {
    expect(Subscription).toBeTruthy();
  })

  it ('should Subscription is a constructor', () => {
    const subscription = new Subscription();

    expect(subscription).toBeTruthy();
    expect(subscription.add).toEqual(jasmine.any(Function));
    expect(subscription.remove).toEqual(jasmine.any(Function));
    expect(subscription.unsubscribe).toEqual(jasmine.any(Function));
  })

  it ('shoulw Subscription unsubscribe teardown function correct', () => {
    const teardown = jasmine.createSpy('teardown');
    const subscription = new Subscription(teardown);


    expect(teardown).not.toHaveBeenCalled();
    subscription.unsubscribe();
    expect(teardown).toHaveBeenCalled();
    expect(teardown.calls.count()).toBe(1);

    subscription.unsubscribe();
    expect(teardown.calls.count()).toBe(1);
  })

  it ('should Subscription unsubscribe Subscription correct', () => {
    const teardown = jasmine.createSpy('teardown');
    const sub1 = new Subscription(teardown);
    const subscription = new Subscription(sub1);

    expect(teardown).not.toHaveBeenCalled();
    subscription.unsubscribe();
    expect(teardown).toHaveBeenCalled();
    expect(teardown.calls.count()).toBe(1);

    subscription.unsubscribe();
    expect(teardown.calls.count()).toBe(1);
  })

  it ('should Subscription unsubscribe with no teardown correct', () => {
    const subscription = new Subscription();
    expect(() => subscription.unsubscribe()).not.toThrow();
  })

  it ('should Subscription add correct', () => {
    const teardown1 = jasmine.createSpy('teardown1');
    const teardown2 = jasmine.createSpy('teardown2');

    const subscription = new Subscription();
    const sub1 = new Subscription(teardown1);
    const sub2 = new Subscription(teardown2);

    subscription.add(sub1);
    subscription.add(sub2);

    expect(teardown1).not.toHaveBeenCalled();
    expect(teardown2).not.toHaveBeenCalled();

    subscription.unsubscribe();

    expect(teardown1).toHaveBeenCalled();
    expect(teardown2).toHaveBeenCalled();
  })

  it ('should Subscription remove correct', () => {
    const teardown1 = jasmine.createSpy('teardown1');
    const teardown2 = jasmine.createSpy('teardown2');
    const sub1 = new Subscription(teardown1);
    const sub2 = new Subscription(teardown2);
    const subscription = new Subscription();

    subscription.add(teardown1);
    subscription.add(teardown2);

    subscription.remove(teardown1);

    expect(teardown1).not.toHaveBeenCalled();
    expect(teardown2).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(teardown1).not.toHaveBeenCalled();
    expect(teardown2).toHaveBeenCalled();
  })
})

describe('test createInterval', () => {
  it ('should export createInterval', () => {
    expect(createInterval).toBeTruthy();
  })

  it ('should have two params', () => {
    expect(createInterval.length).toBe(2);
  })

  it ('should return Subscription', () => {
    const cb = jasmine.createSpy('callback');
    const sub = createInterval(cb, 1000);

    expect(sub).toEqual(jasmine.any(Subscription));
  })

  it ('should start interval', () => {
    const cb = jasmine.createSpy('timerCallback');
    jasmine.clock().install();

    const subscription = createInterval(cb, 1500);
    expect(cb).not.toHaveBeenCalled();

    jasmine.clock().tick(1499);
    expect(cb).not.toHaveBeenCalled();

    jasmine.clock().tick(1);
    expect(cb).toHaveBeenCalled();
    expect(cb.calls.count()).toBe(1);

    jasmine.clock().tick(30000);
    expect(cb.calls.count()).toBe(1 + 30000 / 1500);
    subscription.unsubscribe();
    jasmine.clock().uninstall();
  })

  it ('should unsubscribe stopd timer', () => {
    const cb = jasmine.createSpy('timerCallback');
    jasmine.clock().install();

    const subscription = createInterval(cb, 1500);

    jasmine.clock().tick(1500);
    expect(cb).toHaveBeenCalled();
    expect(cb.calls.count()).toBe(1);

    subscription.unsubscribe();
    jasmine.clock().tick(30000);
    expect(cb.calls.count()).toBe(1);
    jasmine.clock().uninstall();
  })
})

describe('test createTimeout', () => {
  beforeEach(() => {
    jasmine.clock().install();
  })

  afterEach(() => {
    jasmine.clock().uninstall();
  })

  it ('should export createTimeout', () => {
    expect(createTimeout).toBeTruthy();
  })

  it ('should createTimeout have two params', () => {
    expect(createTimeout.length).toBe(2);
  })

  it ('should createTimeout work well', () => {
    const cb = jasmine.createSpy();
    const subscription = createTimeout(cb, 1500);

    expect(subscription).toEqual(jasmine.any(Subscription));

    jasmine.clock().tick(1499);
    expect(cb).not.toHaveBeenCalled();
    jasmine.clock().tick(1);
    expect(cb).toHaveBeenCalled();
    expect(cb.calls.count()).toBe(1);

    jasmine.clock().tick(300000);
    expect(cb.calls.count()).toBe(1);

    subscription.unsubscribe();
  })

  it ('should unsubscribe cancel createTimeout', () => {
    const cb = jasmine.createSpy();
    const subscription = createTimeout(cb, 1500);

    subscription.unsubscribe();
    jasmine.clock().tick(30000);

    expect(cb).not.toHaveBeenCalled();
  })
})

describe('test createEventListener', () => {
  it ('should export createEventListener', () => {
    expect(createEventListener).toBeTruthy();
  })

  it ('should createEventListener has three params', () => {
    expect(createEventListener.length).toBe(3);
  })

  it ('should createEventListener add listener success', () => {
    const eventCallback = jasmine.createSpy('eventCallback');
    const window = (new JSDOM('')).window;
    const subscription = createEventListener(window, 'click', eventCallback);
    expect(subscription).toEqual(jasmine.any(Subscription));

    const event = window.document.createEvent('HTMLEvents');
    event.initEvent('click', false, true);

    window.dispatchEvent(event);
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    window.dispatchEvent(event);

    expect(eventCallback).toHaveBeenCalled();
    expect(eventCallback.calls.count()).toBe(4);
  })

  it ('should unsubscribe cancel eventListener', () => {
    const eventCallback = jasmine.createSpy('eventCallback');
    const window = (new JSDOM('')).window;
    const subscription = createEventListener(window, 'click', eventCallback);

    subscription.unsubscribe();
    const event = window.document.createEvent('HTMLEvents');
    event.initEvent('click', false, true);
    window.dispatchEvent(event);

    expect(eventCallback).not.toHaveBeenCalled();
  })

  it ('should add once option work correct', () => {
    const eventCallback = jasmine.createSpy('eventCallback');
    const window = (new JSDOM('')).window;
    const subscription = createEventListener(window, 'click', eventCallback, { once: true });
    expect(subscription).toEqual(jasmine.any(Subscription));

    const event = window.document.createEvent('HTMLEvents');
    event.initEvent('click', false, true);

    window.dispatchEvent(event);
    window.dispatchEvent(event);
    window.dispatchEvent(event);
    window.dispatchEvent(event);

    expect(eventCallback).toHaveBeenCalled();
    expect(eventCallback.calls.count()).toBe(1);
  })


})

describe('test createPromise', () => {
  it ('should createPromise is a function', () => {
    expect(createPromise).toEqual(jasmine.any(Function));
  })

  it ('shoud createPromise create a promise return subscription', (done) => {
    const subscription = createPromise(resolve => {
      const p = resolve(new Promise((r, e) => {
        setTimeout(() => r('magic'), 100);
      })).then((value) => {
        return value;
      }).then((v) => {
        expect(v).toEqual('magic');
        done();
      });

      expect(p).toEqual(jasmine.any(Promise));
    })
    expect(subscription).toEqual(jasmine.any(Subscription));
  })

  it ('shoud createPromise then can resolve promise', (done) => {
    const subscription = createPromise(resolve => {
      const p = resolve(new Promise((r, e) => {
        setTimeout(() => r(10), 100);
      })).then((value) => {
        return new Promise((r) => {
          setTimeout(() => r(value + 10), 100);
        })
      }).then((v) => {
        expect(v).toEqual(20);
        done();
      });
    });
  })

  it ('shoud createPromise interrupted', (done) => {
    let count = 0;
    const subscription = createPromise(resolve => {
      console.log(resolve(new Promise((r, e) => {
        count = 1;

        setTimeout(() => r(10), 100);
      })).then((value) => {
        count = 2;
        return new Promise((r) => {
          setTimeout(() => r(value + 10), 100);
        });
      }));

      const p = resolve(new Promise((r, e) => {
        count = 1;

        setTimeout(() => r(10), 100);
      })).then((value) => {
        count = 2;
        return new Promise((r) => {
          setTimeout(() => r(value + 10), 100);
        });
      }).then((v) => {
        count = 3;
        console.log('execute');
        expect(v).toEqual(20);
      });
    });

    setTimeout(() => {
      subscription.unsubscribe();
      expect(count).toEqual(2);
    }, 101);

    setTimeout(() => {
      expect(count).toEqual(2);
      done();
    }, 500);
  })
})
