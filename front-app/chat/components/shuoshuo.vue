<template>
    <div class="shuoshuo">



    </div>
</template>
<script>
    import {mapGetters,mapMutations,mapActions} from 'vuex'
    export default {
        name : 'add',
        data(){
            return {
                name : ''
            }
        },
        computed:{
            ...mapGetters(['search_users'])
        },
        methods:{
            ...mapActions(['set_search_users'])
        }

    }
</script>