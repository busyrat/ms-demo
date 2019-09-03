const fs = require('fs')
const path = require('path')

// babylon  主要把源码转成ast Babylon 是 Babel 中使用的 JavaScript 解析器。
// @babel/traverse 对ast解析遍历语法树 负责替换，删除和添加节点
// @babel/types 用于AST节点的Lodash-esque实用程序库
// @babel/generator 结果生成

const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const type = require('@babel/types')
const generator = require('@babel/generator').default

const ejs = require('ejs')

module.exports = class Compiler {
  constructor (config) {
    this.config = config

    this.entryId = ''

    this.modules = {}

    this.entry = config.entry
    this.root = process.cwd()
  }

  getSource (modulePath) {
    let ret = fs.readFileSync(modulePath, 'utf8')
    return ret
  }

  parse (source, parentPath) {
    // AST解析语法树
    let ast = babylon.parse(source)
    let dependencies = [] // 依赖的数组
    // https://astexplorer.net/
    traverse(ast, {
      // 调用表达式
      CallExpression (p) {
        let node = p.node // 对应的节点
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduledName = node.arguments[0].value // 取到模块的引用名字
          moduledName = moduledName + (path.extname(moduledName) ? '' : '.js') // ./a.js
          moduledName = './' + path.join(parentPath, moduledName) // './src/a.js'
          dependencies.push(moduledName)
          node.arguments = [type.stringLiteral(moduledName)] // 改掉源码
        }
      }
    })
    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }

  buildModule (modulePath, isEntry) {
    let source = this.getSource(modulePath)

    let moduleName = './' + path.relative(this.root, modulePath)

    if (isEntry) {
      this.entryId = moduleName
    }
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))

    this.modules[moduleName] = sourceCode

    dependencies.forEach(dep => { // 附模块的加载 递归加载
      this.buildModule(path.join(this.root, dep), false)
    })
  }

  emitFile () {
    // 用数据 渲染想要的
    // 输出到那个目录下
    let main = path.join(this.config.output.path, this.config.output.filename)
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
    this.assets = {}
    // 路径对应的代码
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }

  run () {
    this.buildModule(path.resolve(this.root, this.entry), true)
    console.log(this.modules, this.entryId)
    this.emitFile()
  }
}
