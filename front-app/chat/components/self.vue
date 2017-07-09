<template>
    <div class="self">
        <div v-if="!edit">
            <p>
                {{me.name}}
            </p>
            <p>
                <img :src="temp_logo" width="50" height="50">
            </p>
            <el-button @click="edit=true">编辑</el-button>
        </div>
        <div v-else>
            <p>
                <el-input v-model="temp_name" @change="change"></el-input>
            </p>
            <p>
                <el-upload
                        name="file"
                        action="/upload"
                        :on-success="onSuccess"
                        list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>


            </p>
            <el-button @click="save">保存</el-button>
        </div>

        <h4>搜索用户添加</h4>
        <el-form>
            <el-form-item label="输入名字" label-width="100px">
                <el-input v-model="name"></el-input><el-button @click="set_search_users(name)">搜索</el-button>
            </el-form-item>
        </el-form>
        <p v-for="u in search_users">
            <img :src="u.logo" width="50" height="50"><span>{{u.username}}</span>
            <el-button>发送请求</el-button>
        </p>
        <h4>收到的请求</h4>
        <p v-for="u in requests.receive">
            <img :src="u.logo" width="50" height="50">
            <span>{{u.username}}</span>
            <span>说:{{u.content}}</span>
            <el-button>接受</el-button>
            <el-button>拒绝</el-button>
        </p>
        <h4>发出的请求</h4>
        <p v-for="u in requests.send">
            <img :src="u.logo" width="50" height="50">

            <span>{{u.username}}</span>
            <span>我说:{{u.content}}</span>
        </p>

    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    export default {
        name: 'self',
        data:()=>{
            return {
                edit:false,
                temp_name:'',
                temp_logo:''
            }
        },
        methods:{
            change(){
                console.log(this.me.name,this.$store.state.me.name)
            },
            onSuccess(response){
                this.temp_logo = response.url
            },
            save(){
                this.edit_me({logo:this.temp_logo,username:this.temp_logo})
            },
            ...mapActions([
                'edit_me',
                'fetch_requests',
                'set_search_users'
            ])
        },
        computed: {
            ...mapGetters([
                'me',
                'requests',
                'search_users'
            ])
        },
        mounted(){
            this.temp_name = this.me.name
            this.temp_logo = this.me.logo

            this.fetch_requests(this.me.id)
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
