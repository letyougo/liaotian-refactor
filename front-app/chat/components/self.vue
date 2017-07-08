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
        },
        computed: {
            ...mapGetters([
                'me',
            ]),
            ...mapActions([
                'edit_me'
            ])
        },
        mounted(){
            this.temp_name = this.me.name
            this.temp_logo = this.me.logo
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
