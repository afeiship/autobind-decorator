import autobind from '../index';

describe('autobind method decorator: @autobind', () => {
  class A {
    constructor() {
      this.value = 42;
    }

    @autobind
    getValue() {
      return this.value;
    }
  }

  test('binds methods to an instance', () => {
    const a = new A();
    const { getValue } = a;
    expect(getValue() === 42).toBe(true);
  });

  test('binds method only once', () => {
    const a = new A();
    expect(a.getValue === a.getValue).toBe(true);
  });

  test('throws if applied on a method of more than zero arguments', () => {
    expect(() => {
      class A {
        // eslint-disable-line no-unused-vars
        @autobind
        get value() {
          return 1;
        }
      }
    }).toThrow(/decorator can only be applied to methods/);
  });

  test('should not override bound instance method, while calling super method with the same name', () => {
    // eslint-disable-line max-len
    class B extends A {
      @autobind
      getValue() {
        return super.getValue() + 8;
      }
    }

    const b = new B();
    let value = b.getValue();
    value = b.getValue();

    expect(value === 50).toBe(true);
  });

  describe('set new value', () => {
    class A {
      constructor() {
        this.data = 'A';
        this.foo = 'foo';
        this.bar = 'bar';
      }

      @autobind
      noop() {
        return this.data;
      }
    }

    const a = new A();

    test.only('should not throw when reassigning to an object', () => {
      a.noop = {
        foo: 'bar'
      };

      // console.log(a);
      console.log(a.noop);

      expect(true).toBe(true);
      // expect(a.noop).toEqual({ foo: 'bar' });
    });

    test('should not throw when reassigning to a function', () => {
      a.noop = function noop() {
        return this.foo;
      };
      assert.strictEqual(a.noop(), 'foo');
      const { noop } = a;
      assert.strictEqual(noop(), 'foo');
      assert.strictEqual(a.noop, a.noop);
    });

    test('should not throw when reassigning to a function again', () => {
      a.noop = function noop2() {
        return this.bar;
      };
      assert(a.noop(), 'bar');
      const noop2 = a.noop;
      assert.strictEqual(noop2(), 'bar');
      assert.strictEqual(a.noop, a.noop);
    });

    test('should not throw when reassigning to an object after bound a function', () => {
      a.noop = {};
      assert.deepStrictEqual(a.noop, {});
      assert.strictEqual(a.noop, a.noop);
    });
  });
});

describe('magical autobind decorator: @autobind', () => {
  describe('method decorator', () => {
    class A {
      constructor() {
        this.value = 42;
      }

      @autobind
      getValue() {
        return this.value;
      }
    }

    test('binds methods to an instance', () => {
      const a = new A();
      const { getValue } = a;
      assert(getValue() === 42);
    });
  });

  describe('class decorator', () => {
    const symbol = Symbol('getValue');

    @autobind
    class A {
      constructor() {
        this.value = 42;
      }

      getValue() {
        return this.value;
      }

      [symbol]() {
        return this.value;
      }
    }

    test('binds methods to an instance', () => {
      const a = new A();
      const { getValue } = a;
      assert(getValue() === 42);
    });
  });
});
