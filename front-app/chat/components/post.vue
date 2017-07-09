<template>
    <div class="post">
        <el-button>发说说</el-button>
        <div v-for="p in posts">

            <h4>
                <img :src="p.logo" width="30" height="30"><span>{{p.title}}</span></h4>
            <div>{{p.content}}</div>
            <!--<div>{{formatTime(p.createdAt)}}</div>-->
            <h5>{{p.comments.length? '评论':'暂无任何评论'}}</h5>
            <p v-for="c in p.comments">{{c.content}}</p>
            <el-button type="primary"> {{zan(p)}} {{p.stars.length}}</el-button>
            <el-button>评论</el-button>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import moment from 'moment'
    export default {
        name: 'post',
        computed: {
            ...mapGetters([
                'posts',
                'me'
            ]),
            formatTime(time){
                return moment(time).format('YYYY-MM-DD')
            }
        },
        methods: {
            ...mapActions([
                'fetch_post'
            ]),
            zan(p){
                var meZan = p.comments.find((obj)=>{
                    return obj.user_id == this.me.id
                })
                if(meZan){
                    return '取消赞'
                }else {
                    return '赞'
                }
            }
        },
        mounted(){
            this.fetch_post()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
