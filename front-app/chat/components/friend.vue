<template>
  <div class="friend">

    <div v-for="f in friends" @click="openDialog(f)" class="friend-item">
      <img :src="f.logo" width="50" height="50">{{f.username}}
    </div>

  </div>
</template>

<script>
  import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  name: 'friend',

  computed:{
    ...mapGetters([
        'friends',
        'posts',
        'self',

    ])
  },

  methods:{
    ...mapActions([
        'fetch_friends',

    ]),
      ...mapMutations([
          'set_you'
      ]),
    openDialog(obj){
        this.set_you(obj.id)
        this.$router.push('/dialog')
    }
  },
  mounted(){
    this.fetch_friends()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.friend-item:hover{
  background: #dddddd;
}
</style>
