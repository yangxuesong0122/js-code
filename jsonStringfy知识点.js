// `undefined`、`任意的函数`以及`symbol值`，出现在`非数组对象`的属性值中时在序列化过程中会被忽略
let signInfo = [
  {
    fieldId: 539,
    value: undefined,
    fuc: () => {
      console.log('我是函数')
    },
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
console.log(JSON.stringify(signInfo))
// 打印结果：[{"fieldId":539,"name":null},{"fieldId":540},{"fieldId":546}]