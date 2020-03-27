import Vue from 'vue'
import App from './App.vue'
import Router from '../../../ms/vue-router'
import Home from './components/Home'

Vue.config.productionTip = false

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter(from, to, next) {
        console.log(from, to)
        setTimeout(() => {
          next()
        }, 1000)
      }
    },
    {
      path: '/about',
      component: () => import(/* webpackChunkName: 'about' */ './components/About.vue')
    }
  ]
})

new Vue({
  router,
  render: function(h) {
    return h(App)
  }
}).$mount('#app')
