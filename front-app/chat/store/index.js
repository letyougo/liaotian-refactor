/**
 * Created by Administrator on 2017/7/2.
 */

import Vuex from 'vuex'
import vue from 'vue'

vue.use(Vuex)


var get_friend = '/user/' + window.user.id + '/friend'

var get_post = '/user/' + window.user.id + '/post_detail'

var get_message = '/message'
import request from 'superagent'


var store = new Vuex.Store({
    state: {
        friends: [],
        posts: [],
        me: window.user,

        message:[],
        you:0
    },
    getters: {
        friends: (state) => state.friends,
        posts: (state) => state.posts,
        message:(state)=>state.message,
        me: (state) => state.me,
        you:(state)=>{
            return state.friends.find((obj)=>{
                return obj.id == state.you
            }) || {}
        }
    },
    mutations: {
        set_friends: (state, list) => state.friends = list,
        set_posts: (state, list) => state.posts = list,
        set_message:(state,list) =>state.message=list,
        send_message:(state,obj)=>{
            state.message.push(obj)
        },
        set_you:(state,id)=>{
            state.you=id
        },
        set_me:(state,obj)=>{
            state.me = obj
            state.me.name = obj.username
        }
    },
    actions: {
        fetch_friends({commit}){
            request
                .get(get_friend)
                .end((err, res) => {
                    commit('set_friends', res.body)
                })
        },
        fetch_post({commit}){
            request
                .get(get_post)
                .end((err, res) => {
                    console.log(res.body)
                    commit('set_posts', res.body)
                })
        },
        fetch_message({commit},query){

            request
                .get(get_message)
                .query(query)
                .end((err, res) => {

                    commit('set_message', res.body)
                })
        },
        edit_me({commit},query){
            console.log(query)
            // request
            //     .patch('/user/'+state.me.id)
            //     .send(query)
            //     .end((err, res) => {
            //         // commit('set_me', res.body)
            //     })
        }
    }
})

export default store


