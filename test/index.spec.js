import {
  createInterval,
  Subscription,
  createTimeout,
  createEventListener
} from '../src';

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

  xit ('should createEventListener add listener success', () => {
    const eventCallback = jasmine.createSpy('eventCallback');

    const subscription = createEventListener(window, 'click', eventCallback);
    expect(subscription).toEqual(jasmine.any(Subscription));

    const event = new Event('click');
    window.triggerHandler(event);

    expect(eventCallback).toHaveBeenCalled();
  })
})
