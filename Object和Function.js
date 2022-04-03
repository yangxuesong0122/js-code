function Test() {}
let test = new Test()
console.log(Test.__proto === Function.prototype)

console.log(Function.__proto__ === Function.prototype)

console.log(Object.__proto__ === Function.prototype)

// 由上面两条得出：
console.log(Function.__proto__ === Object.__proto__)

// 判断对象本身上是否存在某个属性
test.hasOwnProperty('a')
// 判断对象原型链上是否存在某个属性
console.log('a' in test);