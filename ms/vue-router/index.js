let Vue
// web全栈架构师 开课吧
class Router {
  static install(_Vue) {
    Vue = _Vue
    Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    this.$options = options
    this.routeMap = {}

    this.app = new Vue({
      data: {
        current: '/'
      }
    })
  }
  init() {
    // 启动路由
    // 1. 监听 hashchange 事件
    this.bindEvents()
    // 2. 处理路由表
    this.createRouteMap()
    console.log(this.routeMap)
    // 3. 初始化组件 router-view 和 router-link
    this.initComponent()
  }
  bindEvents() {
    window.addEventListener('hashchange', this.onHashChange.bind(this), false)
    window.addEventListener('load', this.onHashChange.bind(this), false)
  }
  getFrom(e) {
    let from, to
    if (e.newURL) {
      from = e.oldURL.split('#')[1]
      to = e.newURL.split('#')[1]
    } else {
      from = ''
      to = this.getHash()
    }
    return { from, to }
  }
  onHashChange(e) {
    let hash = this.getHash()
    let router = this.routeMap[hash]
    let { from, to } = this.getFrom(e)
    if (router.beforeEnter) {
      router.beforeEnter(from, to, () => {
        this.app.current = hash
      })
    } else {
      this.app.current = hash
    }
  }
  getHash() {
    return window.location.hash.slice(1) || '/'
  }
  push(url) {
    // hash
    window.location.hash = url
    // history模式使用 pushState
  }
  createRouteMap() {
    this.$options.routes.forEach(item => {
      this.routeMap[item.path] = item
    })
  }
  initComponent() {
    Vue.component('router-view', {
      // 箭头函数，注意
      render: h => {
        // 此处是响应式
        const component = this.routeMap[this.app.current].component
        return h(component)
      }
    })

    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: '#' + this.to
            }
          },
          [this.$slots.default]
        )
      }
    })
  }
}

export default Router
