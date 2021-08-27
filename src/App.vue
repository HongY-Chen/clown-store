<template>
  <div id="app">
    <router-view class="router-view" />
    <navBar v-if="isShowNav"></navBar>
  </div>
</template>

<script>
  import navBar from './components/NavBar.vue'
  export default {
    data(){
      return {
        isShowNav:true,
        showMenuList:['/','/home','/category','/cart','/user']
      }
    },
    components:{
      navBar
    },
    watch:{
      $route(to,from){
        if(this.showMenuList.includes(to.path)){
          this.isShowNav = true;
        }else{
          this.isShowNav = false;
        }
      }
    }
  }
</script>

<style lang="less">
  @import './common/style/mixin';
  .router-view{
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
