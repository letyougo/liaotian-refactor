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
        you:0,
        search_users:[],
        requests:{
            send:[],
            receive:{}
        }
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
        },
        search_users:(state)=>state.search_users,
        requests:(state)=>state.requests
    },
    mutations: {
        set_friends: (state, list) => state.friends = list,
        set_posts: (state, list) => state.posts = list,
        set_message:(state,list) =>state.message=list,
        send_message:(state,obj)=>{
            state.message.push(obj)
        },
        add_unread(state,obj){
            state.friends = state.friends.map((f)=>{
                console.log(obj.username,)
                if(f.username == obj.from){

                    f.unread = f.unread +1
                }

                return f
            })
        },
        clear_unread(state,obj){
            state.friends = state.friends.map((f)=>{
                console.log(obj.username,)
                if(f.username == obj.from){

                    f.unread = 0
                }

                return f
            })
        },
        set_you:(state,id)=>{
            state.you=id
        },
        set_me:(state,obj)=>{
            state.me = obj
            state.me.name = obj.username
        },
        set_search_users:(state,list)=>{
            state.search_users =list
        },
        set_request:(state,obj)=>{
            state.requests = obj
        }
    },
    actions: {
        set_search_users({commit},query){

            request
                .get('/user/search')
                .query({username:query})
                .end((err,res)=>{
                    commit('set_search_users',res.body)
                })
        },
        fetch_friends({commit}){
            request
                .get(get_friend)
                .end((err, res) => {
                    res.body = res.body.map((obj)=>{
                        obj.unread = 0
                        return obj
                    })
                    commit('set_friends', res.body)
                })
        },
        fetch_post({commit}){
            request
                .get(get_post)
                .end((err, res) => {
                    var post = res.body
                    var clean_post = []
                    for(var i=0;i<post.length;i++){
                        var p = clean_post.find((obj)=>{
                            return obj.id == post[i].id
                        })
                        var item = post[i]
                        var temp_obj = {}
                        if(!p){
                            temp_obj = {
                                id:item.id,
                                content:item.content,
                                comments:[],
                                stars:[],
                                logo:item.u_logo,
                                name:item.u_name,
                                title:item.titile
                            }
                            clean_post.push(temp_obj)
                        }else {
                            temp_obj = p
                        }

                        if(item.c_u_id){
                            var comment = temp_obj.comments.find((obj)=>{
                                return obj.user_id == item.c_u_id
                            })
                            comment || temp_obj.comments.push({
                                user_id:item.c_u_id,
                                content:item.c_content
                            })

                        }
                        if(item.s_u_id){
                            var star = temp_obj.stars.find((obj)=>{
                                return obj.user_id == item.s_u_id
                            })
                            star || temp_obj.stars.push({
                                user_id: item.s_u_id
                            })
                        }
                    }
                    console.log(clean_post)

                    commit('set_posts', clean_post)
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

            request
                .patch('/user/'+state.me.id)
                .send(query)
                .end((err, res) => {
                    commit('set_me', res.body)
                })
        },
        fetch_requests({commit},id){
            request
                .get(`/user/${id}/request`)
                .end((err,res)=>{
                    commit('set_request',res.body)
                })
        }
    }
})

export default store


