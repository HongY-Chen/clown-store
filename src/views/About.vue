<template>
  <div class="about">
    <s-header :title="'关于我们'"></s-header>
    <div class="about-body">
      <van-divider class="divider">简介</van-divider>
      <div class="word">
        <p>小丑商城包含:首页、商品分类</p>
        <p>新品上线、首页轮播、商品推荐、商品搜索</p>
        <p>商品展示、购物车、订单结算、订单流程</p>
        <p>个人订单管理、会员中心、帮助中心等模块</p>
      </div>
      <div class="address">
        项目地址：
        <a target="_blank" href="https://github.com">https://github.com</a>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader.vue'
export default {
  components:{
    sHeader
  }
}
</script>

<style lang='less' scoped>
  .about {
    box-sizing: border-box;
    padding: 20px;
    .about-body {
      margin-top: 44px;
      font-size: 16px;
      .divider{
        color: #4286d3;
        border-color: #4286d3;
        font-size: 20px;
      }
      .word{
        text-align: center;
        p{
          margin-top: 10px;
        }
      }
      .address{
        margin-top: 20px;
        text-align: center;
      }
      a {
        color: #007fff;
      }
    }
  }
</style>