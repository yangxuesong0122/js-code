// ES6 的类，完全可以看作构造函数的另一种写法，类的数据类型就是函数，类本身就指向构造函数
class Point {
}
typeof Point // "function"
Point === Point.prototype.constructor // true

// 事实上，类的所有方法都定义在类的prototype属性上面。
class Point {
    constructor() {
    }
    toString() {
    }
    toValue() {
    }
}

// 等同于
Point.prototype = {
    constructor() {},
    toString() {},
    toValue() {},
};
// 因此，在类的实例上面调用方法，其实就是调用原型上的方法。
class B {}
const b = new B();
b.constructor === B.prototype.constructor // true

// 类的内部所有定义的方法，都是不可枚举的
class Point {
    constructor(x, y) {
    }

    toString() {
    }
}
Object.keys(Point.prototype) // []
Object.getOwnPropertyNames(Point.prototype) // ["constructor","toString"]

// 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加,默认返回实例对象（即this）
class Point {
}

// 等同于
class Point {
    constructor() {}
}


// 实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

var point = new Point(2, 3);
point.toString() // (2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true


// 类的所有实例共享一个原型对象。
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__ //true


// 在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
class MyClass {
    constructor() {
    }
    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: '+value);
    }
}

let inst = new MyClass();
inst.prop = 123; // setter: 123
inst.prop // 'getter'


// 类也可以使用表达式的形式定义,需要注意的是，这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
};
let inst = new MyClass();
inst.getClassName() // Me

// 如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
const MyClass = class { /* ... */ };

// 采用 Class 表达式，可以写出立即执行的 Class。
let person = new class {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        console.log(this.name);
    }
}('张三');
person.sayName(); // "张三"


// 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
class Logger {
    printName(name = 'there') {
        this.print(`Hello ${name}`);
    }
    print(text) {
        console.log(text);
    }
}
const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
// 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。
class Logger {
    constructor() {
        this.printName = this.printName.bind(this);
    }
}
另一种解决方法是使用箭头函数
class Obj {
    constructor() {
        this.getThis = () => this;
    }
}
const myObj = new Obj();
myObj.getThis() === myObj // true


// 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
class Foo {
    static classMethod() {
        return 'hello';
    }
}
Foo.classMethod() // 'hello'
var foo = new Foo();
foo.classMethod() // TypeError: foo.classMethod is not a function

// 如果静态方法包含this关键字，这个this指的是类，而不是实例。 从这个例子还可以看出，静态方法可以与非静态方法重名。
class Foo {
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}
Foo.bar() // hello