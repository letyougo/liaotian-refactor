<template>

    <div id="app">
        <router-link to="friend">好友</router-link>
        <router-link to="post">说说</router-link>
        <router-link to="self">我</router-link>



      <router-view></router-view>
    </div>
</template>

<script>



    import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  name: 'app',

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
  margin: 0;
  padding: 20px;
}
  li{
    list-style: none;
  }
</style>
