// 函数在被调用时，都会创建一个执行上下文,这个上下文中记录着函数的调用栈、函数的调用方式、传入的参数信息等,this也是其中的一个属性
// this的绑定和调用方式以及调用的位置有关系,this是在运行时被绑定的
// this绑定规则：
//     默认绑定：独立的函数调用我们可以理解成函数没有被绑定到某个对象上进行调用，通常默认绑定时，函数中的this指向全局对象（window）
//     隐式绑定：调用方式是通过某个对象进行调用的，
//     显示绑定：JavaScript所有的函数都可以使用call和apply方法
//         内置函数：setTimeout中会传入一个函数，这个函数中的this通常是window
//                 在forEach中传入的函数打印的也是Window对象，这是因为默认情况下传入的函数是自动调用函数（默认绑定），但是也可以改变
//                     var names = ["abc", "cba", "nba"];
//                     var obj = {name: "why"};
//                     names.forEach(function(item) {
//                         console.log(this); // 三次obj对象
//                     }, obj);
//     new绑定:
//         1.创建一个全新的对象；
//         2.这个新对象会被执行Prototype连接；
//         3.这个新对象会绑定到函数调用的this上（this的绑定在这个步骤完成）；
//         4.如果函数没有返回其他对象，表达式会返回这个新对象；
//
//
// 规则优先级:
//     默认规则的优先级最低
//     显示绑定优先级高于隐式绑定
//     new绑定优先级高于隐式绑定
//     new绑定优先级高于bind(new绑定和call、apply是不允许同时使用的，所以不存在谁的优先级更高)
//     优先级总结：
//         new绑定 > 显示绑定（bind）> 隐式绑定 > 默认绑定
//     如果在显示绑定中，我们传入一个null或者undefined，那么这个显示绑定会被忽略，使用默认规则：
//         function foo() {
//             console.log(this);
//         }
//         var obj = {
//             name: "why"
//         }
//         foo.call(obj); // obj对象
//         foo.call(null); // window
//         foo.call(undefined); // window
//         var bar = foo.bind(null);
//         bar(); // window
//
// ES6箭头函数:
//     箭头函数不使用this的四种标准规则（也就是不绑定this），而是根据外层作用域来决定this。
//     在setTimeout的回调函数中使用_this就代表了obj对象
//     var obj = {
//         data: [],
//         getData: function() {
//             var _this = this;
//             setTimeout(function() {
//                 // 模拟获取到的数据
//                 var res = ["abc", "cba", "nba"];
//                 _this.data.push(...res);
//             }, 1000);
//         }
//     }
//
//     obj.getData();

// 如果getData也是一个箭头函数，那么setTimeout中的回调函数中的this指向谁呢？
//     答案是window；
//     依然是不断的从上层作用域找，那么找到了全局作用域；
//     在全局作用域内，this代表的就是window
//
// var obj = {
//     data: [],
//     getData: () => {
//         setTimeout(() => {
//             console.log(this); // window
//         }, 1000);
//     }
// }
//
// obj.getData();
