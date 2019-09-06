function New(f) {
  // 创建一个新的对象，新对象的__proto__指向构造函数的原型
  var n = { __proto__: f.prototype }
  return function() {
    // 使用新对象的作用域，执行构造函数
    f.apply(n, arguments)
    return n
  }
}

module.exports = New
