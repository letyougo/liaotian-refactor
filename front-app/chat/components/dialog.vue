<template>
    <div class="dialag">

        <div>
            <div v-for="item in message" >
                <p v-if="item.type=='send'" :class="item.type">
                    <!--<span>{{item.from}}</span>-->
                    <span>{{item.text}}</span>
                    <img :src="me.logo" width="30" height="30"/>
                </p>
                <p v-else :class="item.type">
                    <img :src="you.logo" width="30" height="30"/>
                    <!--<span>{{item.from}}</span>-->
                    <span>{{item.text}}</span>
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

            socket.on('receive-message',(obj)=>{

                that.send_message({to:that.me.name,text:obj.text,from:this.you.username,type:'receive'})
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
    p * {
        vertical-align: middle;
        font-size: 14px;
    }
</style>
