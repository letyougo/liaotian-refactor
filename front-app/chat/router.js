/**
 * Created by xiaoxiaosu on 17/7/7.
 */

import Vue from 'vue'
import Router from 'vue-router'
import friend from './components/friend.vue'
import post from './components/post.vue'
import self from './components/self.vue'
import dialog from './components/dialog.vue'
import shuoshuo from './components/shuoshuo.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: '好友',
            component: friend,
        },
        {
            path: '/friend',
            name: '好友',
            component: friend,
        },
        {
            path: '/post',
            name: '说说',
            component: post,
            hidden:true
        },
        {
            path: '/self',
            name: '自己',
            component: self
        },
        {
            path: '/dialog',
            name: '对话',
            component: dialog
        },

    ]
})