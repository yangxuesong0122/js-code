// 举一个使用call方法的例子：
/*let foo = {
  value: 1
}
function bar() {
  console.log(this.value);
}
bar.call(foo) // 1*/


/*
* 注意两点：
*   call 改变了 this 的指向，指向到 foo
*   bar 函数执行了
*
* 模拟实现这两个效果: 当调用 call 的时候，把 foo 对象改造成如下
* */
// 这个时候 this 就指向了 foo，但是这样却给 foo 对象本身添加了一个属性，用 delete 再删除它不就好
/*let foo = {
  value: 1,
  bar: function() {
    console.log(this.value)
  }
}
foo.bar() // 1*/
/*
* 模拟的步骤可以分为：
*   将函数设为对象的属性  foo.fn = bar
*   执行该函数 foo.fn()
*   删除该函数 delete foo.fn
* */

/*第一版call函数实现*/
/*Function.prototype.myCall = function(context) {
  console.log(context) // foo 对象
  console.log(this.toString()) // this 是 bar 函数
  // 首先要获取调用call的函数，用this可以获取
  context.fn = this // this指向的是使用call方法的函数(Function的实例，即下面测试例子中的bar方法)
  context.fn()
  delete context.fn
}
let foo = {
  value: 1
}
function bar() {
  console.log(this.value)
}
bar.myCall(foo) // 1*/


/*
* 第二版call函数实现 可传参
*   传入的参数并不确定，可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里
*   把 Arguments 对象解构到数组里，再用slice方法取第二个到最后一个参数
* */
/*Function.prototype.myCall2 = function(context) {
  context.fn = this
  let rest = [...arguments].slice(1) // 用slice方法取第二个到最后一个参数（获取除了this指向对象以外的参数）, 空数组slice后返回的仍然是空数组
  context.fn(...rest) // 隐式绑定,当前函数的this指向了context.
  delete context.fn
}
let foo = {
  value: 1
}
function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)
}
bar.myCall2(foo, 'kevin', 18)*/


/*
* 第三版call函数实现（最终版）
*   this传null或undefined时，将是JS执行环境的全局变量。浏览器中是window，其它环境（如node）则是global。
*   函数是可以有返回值的
* */
/*Function.prototype.call2 = function (context) {
  // 判断传入的this，为null或者是undefined时要赋值为window或global
  if (!context) {
    context = typeof window === 'undefined' ? global : window
  }
  context.fn = this
  let rest = [...arguments].slice(1)
  let result = context.fn(...rest)
  delete context.fn
  return result
}
let foo = {
  name: 'Selina'
}
var str = 'Chirs'
function bar(job, age) {
  console.log(this)
  console.log(this.str)
  console.log(job, age)
}
bar.call2(foo, 'programmer', 20)
// Selina
// programmer 20
bar.call2(null, 'teacher', 25)
// undefined
// teacher 25*/


/*----------------------------apply-----------------------------*/
/*Function.prototype.myApply = function (context, rest) {
  if (!context) {
    context = typeof window === 'undefined' ? global : window;
  }
  context.fn = this
  let result
  if(rest === undefined || rest === null) {
    result = context.fn(rest)
  } else if (typeof rest === 'object') {
    result = context.fn(...rest)
  }
  delete context.fn
  return result
}
let foo = {
  name: 'Selina'
}
var name = 'Chirs'
function bar(job, age) {
  console.log(this.name)
  console.log(job, age)
}
bar.myApply(foo, ['programmer', 20])
// Selina programmer 20
bar.myApply(null, ['teacher', 25])
// 浏览器环境: Chirs programmer 20; node 环境: undefined teacher 25*/


/*----------------------------------bind----------------------------------*/
/*
* 实现bind需要注意的两个特点：
*   bind 会创建一个新函数，不会立即执行
*   bind 后面传入的这个参数列表可以分多次传入，call和apply则必须一次性传入所有参数
*   因为bind转换后的函数可以作为构造函数使用，此时this应该指向构造出的实例，而不是bind绑定的第一个参数
* */
Function.prototype.myBind = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("not a function");
  }
  let self = this
  // 获取除了第一个参数外的所有参数
  // Array.prototype.slice.call(arguments, 1)
  let args = [...arguments].slice(1)

  let bound = function () {
    // bind方法返回一个函数，并且这个函数可以继续传参，此时定义的bound方法就是最后bind返回的方法，
    // 所以bound里的arguments就是新方法执行时传的参数列表
    let res = [...args, ...arguments] // bind传递的参数和函数调用时传递的参数拼接
    /*
      对三目运算符两种情况的解释：
      1.当作为构造函数时，this 指向实例
        注意: 这里的this是bind返回的新方法里执行时的this，和上面的this不是一个
      2.当作为普通函数时，this 指向 window，Fn 为绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
    */
    return self.apply(this instanceof bound ? this : context, res)
  }

  /*
  * 构造函数上的属性和方法，每个实例上都有。 此处通过一个中间函数Fn，来连接原型链。Fn的prototype等于this的prototype。
  * Fn和this指向同一个原型对象。bindFn的prototype又等于Fn的实例。Fn的实例的__proto__又指向Fn的prototype。
  * 即bindFn的prototype指向和this的prototype一样，指向同一个原型对象。至此，就实现了自己的bind方法。
  * */
  function Fn() {}
  Fn.prototype = this.prototype
  bound.prototype = new Fn()
  // bound.prototype.constructor = bound
  // bound.prototype = this.prototype
  return bound
}

let obj = {
  name: 'tiger'
}

function fn(name, age) {
  console.log(this.name + '养了一只' + name + ',' + age + '岁了 ')
}
let bindFn = fn.myBind(obj, '旺财')
// bindFn('10')
let instance = new bindFn('20')
bindFn.prototype.type = '哺乳类'
console.log(instance.type)


/*
Function.prototype.bind1 = function(context) {
  // 获取所有的参数
  const args = Array.prototype.slice.call(arguments)
  // 获取this，数组的第一项
  const t = args.shift()
  const self = this
  console.log(t, context, self.toString())
  return function() {
    return self.apply(t, args)
  }
}
let obj = {
  name: 'yxs'
}
function aa() {
  // console.log('-----', this)
}
aa.bind1(obj)()*/