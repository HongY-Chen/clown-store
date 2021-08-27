<template>
  <van-swipe class="my-swipe" :autoplay="5000" indicator-color="#4286d3">
    <van-swipe-item v-for="(item,index) in list" :key="index">
      <img :src="item.carouselUrl" @click="goTo(item.carouselUrl)">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default:null 
    },
  },
  methods: {
    goTo(url) {
      window.open(url)
    }
  },
}
</script>

<style lang='less' scoped>
  .my-swipe .van-swipe-item {
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>