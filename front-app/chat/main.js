// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import moment from 'moment'
Vue.config.productionTip = false
import store from './store/index'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)
/* eslint-disable no-new */
Vue.use(moment)
new Vue({
  el: '#app',
    router,
  store,
  template: '<App/>',
  components: { App }
})

import socket from './socket'



socket.on('connect',()=>{

    socket.emit('login',window.user.name)

})

