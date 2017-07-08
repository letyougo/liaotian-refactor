<template>
    <div class="dialag">

        <div>
            <div v-for="item in message" >
                <p v-if="item.type=='send'" :class="item.type">
                    <img :src="me.logo" width="50" height="50"/>
                    <span>{{item.from}}</span>
                    <span>{{item.text}}</span>
                </p>
                <p v-else :class="item.type">
                    <span>{{item.from}}</span>
                    <span>{{item.text}}</span>
                    <img :src="you.logo" width="50" height="50"/>
                </p>
            </div>
        </div>

        <el-input type="textarea" v-model="text"></el-input>
        <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
</template>

<script>
    import socket from '../socket'
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    export default {
        name: 'dialog',
        data:()=>{
            return{
                text:''
            }
        },
        computed:{
            ...mapGetters([
                'message',
                'friends',
                'me',
                'you'
            ])
        },
        methods:{
            sendMessage(){
                var that = this
                this.send_message({to:that.you.username,text:that.text,from:that.me.name,type:'send'})
                socket.emit('send-message',{to:that.you.username,text:that.text,from:that.me.name,type:'send'})
            },
            ...mapMutations([
                'send_message'
            ]),
            ...mapActions([
                'fetch_message',
            ]),
        },
        mounted(){
            var that = this
            socket.on('receive-message',(text)=>{
                that.send_message({to:that.me.name,text:that.text,from:this.you.username,type:'receive'})
            })

            this.fetch_message({from:that.me.name,to:that.you.username})
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .send{
        text-align: right;
    }
    .receive{
        text-align: left;
    }
</style>
