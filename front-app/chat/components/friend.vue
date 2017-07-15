<template>
    <div class="friend">

        <div v-for="f in friends" @click="openDialog(f)" class="friend-item">
            <el-badge :value="f.unread" class="item">
                <img :src="f.logo" width="50" height="50">
            </el-badge>
            {{f.username}}
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import Avatar from 'vue-avatar/dist/Avatar'
    import socket from '../socket'
    export default {
        name: 'friend',

        computed: {
            ...mapGetters([
                'friends',
                'posts',
                'me',
                'you'
            ])
        },

        methods: {
            ...mapActions([
                'fetch_friends',

            ]),
            ...mapMutations([
                'set_you',
                'add_unread',
                'clear_unread'
            ]),
            openDialog(obj){
                this.set_you(obj.id)
                console.log(this.me,this.you)
                this.clear_unread({to:this.me.name,from:this.you.username})
                this.$router.push('/dialog')
            }
        },
        mounted(){
            this.fetch_friends()
            var that = this
            socket.on('receive-message', (obj) => {
                console.log(obj)
                that.add_unread(obj)
            })
        },
        components:[
            Avatar
        ]
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .friend-item:hover {
        background: #dddddd;
    }
</style>
