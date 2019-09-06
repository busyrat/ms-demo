const New = require('../../ms/polyfill/new')

function Person(name) {
  this.message = 'hello '
  this.name = name
  this.say = function() {
    return this.message + this.name
  }
}

var p = New(Person)('haha')

var pp = new Person('hoho')

console.log(p, pp)
