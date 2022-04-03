/* 
模块化解决的问题：
  1.加载顺序
  2.污染全局

ES5模块化方案：
  立即执行函数
    ;(function(moduleA){
      // 模块的独立作用域
      moduleA.a
    })(moduleA)
    不能解决加载顺序问题，解决了污染全局问题

AMD---Asynchronous Module Definition  异步模块定义
    define(moduleName, [module], factory) 定义模块
    require([module], callback) 引入模块
    基于commonJS，
*/

// nodejs 模块化 commonjs
// require('....') 引入模块
// module.exports 导出模块
// commonjs 是一种模块化规范，来源于 nodejs， 用同步的方法，通过模块的导入导出，可以相互之间进行依赖
let moduleB = require('./module_b')
let c = (function(){
  return moduleB.b.join('-')
})()
module.exports = {c}

// AMD写法
//  必须要引入一个 require.js
// 引入模块
require.config({
  paths: {
    moduleA: 'js/module_a',
    moduleB: 'js/module_b',
    moduleC: 'js/module_c'
  }
})
// 所有模块加载完毕之后，才会去执行后面的回调
// 依赖前置
require(['moduleA', 'moduleB', 'moduleC'], function(moduleA, moduleB, moduleC) {
  console.log(moduleA.a)
})
// 定义模块
define('moduleC', ['moduleB'], function(moduleB) {
  return {
    c: moduleB.b.join('-')
  }
});


// -------------------------------------------------


// CMD common modulede finition 通用模块定义
//    define(function(require, exports, module){})  定义模块
//                    require: 加载   define: 定义  exports:导出  module： 操作模块
//    seajs.use([module路径], function(moduleA, moduleB, moduleC) {})  使用模块
// 定义模块
// module_a.js
define(function(require, exports, module) {
  let a = [1, 2]
  return {
    a: a.reverse()
  }
})
// module_b.js
define(function(require, exports, module) {
  // 需要的时候再加载，也就是 依赖就近，按需加载
  let moduleA = require('module_a')
  b = [3, 4]
  return {
    b: moduleA.a.concat(b)
  }
})

// 使用模块（需要配置模块的url）
seajs.use(['module_a.js', 'module_b.js'], function(moduleA, moduleB) {
  console.log(moduleA.a)
  console.log(moduleB.b)
})


/* 
commonjs 模块输出的是一个值得拷贝
ES6 模块输出的是值的引用

commonjs 模块是在运行时加载
es6 模块是在编译时加载
*/