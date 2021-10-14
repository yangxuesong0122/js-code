// `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略
let signInfo = [
  {
    fieldId: 539,
    value: undefined,
    // fuc: () => {
    //   console.log('我是函数')
    // },
    name: null
  },
  {
    fieldId: 540,
    value: undefined
  },
  {
    fieldId: 546,
    value: undefined
  },
]
// console.log(JSON.stringify(signInfo))
// 打印结果：[{"fieldId":539,"name":null},{"fieldId":540},{"fieldId":546}]


// 解决方案一：新开一个对象处理
let newSignInfo = signInfo.map(it => {
  const value = typeof it.value === 'undefined' ? '' : it.value
  return {
    ...it,
    value
  }
})
// console.log(JSON.stringify(newSignInfo))

// 解决方案二：利用JSON.stringify第二个参数，直接处理
     // 方案一的缺陷是需要新开一个对象进行一顿操作才能解决，不够优雅
// 判断到value为undefined，返回空字符串即可
let str = JSON.stringify(signInfo, (key, value) => typeof value === 'undefined' ? '' : value)
// console.log(str)



// JSON.stringify几个特性
  // JSON.stringify可以转换对象或者值（平常用的更多的是转换对象）
  // 可以指定replacer为函数选择性的地替换
  // 也可以指定replacer为数组，可转换指定的属性

// 1. 转换对象
// console.log(JSON.stringify({ name: '杨雪松', sex: 'boy' })) // '{"name":"杨雪松","sex":"boy"}'

// 2. 转换普通值
// console.log(JSON.stringify('杨雪松')) // "杨雪松"
// console.log(JSON.stringify(1)) // "1"
// console.log(JSON.stringify(true)) // "true"
// console.log(JSON.stringify(null)) // "null"

// 3. 指定replacer函数
// console.log(JSON.stringify({ name: '杨雪松', sex: 'boy', age: 100 }, (key, value) => {
//   return typeof value === 'number' ? undefined : value
// }))
// '{"name":"杨雪松","sex":"boy"}'  由于age的值是undefined，所以被忽略

// 4. 指定数组
// console.log(JSON.stringify({ name: '杨雪松', sex: 'boy', age: 100 }, [ 'name' ]))
// '{"name":"杨雪松"}'

// 5. 指定space(美化输出)
// console.log(JSON.stringify({ name: '杨雪松', sex: 'boy', age: 100 }))
// '{"name":"杨雪松","sex":"boy","age":100}'
// console.log(JSON.stringify({ name: '杨雪松', sex: 'boy', age: 100 }, null , 2))
/*
{
  "name": "前端胖头鱼",
  "sex": "boy",
  "age": 100
}
*/



// 特性一
//   undefined、任意的函数以及symbol值，出现在非数组对象的属性值中时在序列化过程中会被忽略
//   undefined、任意的函数以及symbol值出现在数组中时会被转换成null
//   undefined、任意的函数以及symbol值被单独转换时，会返回 undefined
// 1. 对象中存在这三种值会被忽略
// console.log(JSON.stringify({
//   name: '杨雪松',
//   sex: 'boy',
//   // 函数会被忽略
//   showName () {
//     console.log('杨雪松')
//   },
//   // undefined会被忽略
//   age: undefined,
//   // Symbol会被忽略
//   symbolName: Symbol('杨雪松')
// }))

// '{"name":"杨雪松","sex":"boy"}'
// 2. 数组中存在着三种值会被转化为null
// console.log(JSON.stringify([
//   '杨雪松',
//   'boy',
//   // 函数会被转化为null
//   function showName () {
//     console.log('杨雪松')
//   },
//   //undefined会被转化为null
//   undefined,
//   //Symbol会被转化为null
//   Symbol('杨雪松')
// ]))
// '["杨雪松","boy",null,null,null]'

// 3.单独转换会返回undefined
// console.log(JSON.stringify(
//   function showName () {
//     console.log('杨雪松')
//   }
// )) // undefined
// console.log(JSON.stringify(undefined)) // undefined
// console.log(JSON.stringify(Symbol('杨雪松'))) // undefined


// 特性二: 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值。
// console.log(JSON.stringify([new Number(1), new String("杨雪松"), new Boolean(false)]))
// '[1,"杨雪松",false]'


// 特性三: 所有以symbol为属性键的属性都会被完全忽略掉，即便 replacer 参数中强制指定包含了它们。
// console.log(JSON.stringify({
//   [Symbol('杨雪松')]: '杨雪松'}
// ))
// // '{}'
// console.log(JSON.stringify({
//   [ Symbol('杨雪松') ]: '杨雪松',
// }, (key, value) => {
//   if (typeof key === 'symbol') {
//     return value
//   }
// }))
// undefined


// 特性四: NaN 和 Infinity 格式的数值及 null 都会被当做 null
// console.log(JSON.stringify({
//   age: NaN,
//   age2: Infinity,
//   name: null
// }))
// '{"age":null,"age2":null,"name":null}'


// 特性五: 转换值如果有 toJSON() 方法，该方法定义什么值将被序列化。
const toJSONObj = {
  name: '杨雪松',
  toJSON () {
    return 'JSON.stringify'
  }
}
// console.log(JSON.stringify(toJSONObj))
// "JSON.stringify"


// 特性六: Date 日期调用了 toJSON() 将其转换为了 string 字符串（同Date.toISOString()），因此会被当做字符串处理。
// const d = new Date()
// console.log(d.toJSON()) // 2021-10-14T04:36:01.503Z
// console.log(JSON.stringify(d)) // "2021-10-14T04:36:01.503Z"


// 特性七: 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。
// let cyclicObj = {
//   name: '杨雪松',
// }
// cyclicObj.obj = cyclicObj
// console.log(JSON.stringify(cyclicObj))
// Converting circular structure to JSON


// 特性八: 其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性
let enumerableObj = {}
Object.defineProperties(enumerableObj, {
  name: {
    value: '杨雪松',
    enumerable: true
  },
  sex: {
    value: 'boy',
    enumerable: false
  },
})

// console.log(JSON.stringify(enumerableObj))
// '{"name":"杨雪松"}'


// 特性九: 当尝试去转换 BigInt 类型的值会抛出错误
// const alsoHuge = BigInt(9007199254740991)
// console.log(JSON.stringify(alsoHuge))
// TypeError: Do not know how to serialize a BigInt




