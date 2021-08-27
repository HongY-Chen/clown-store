<template>
  <div class="order-box">
    <simple-header :title="'我的订单'" :back="'/user'"></simple-header>

    <!-- 上方tab -->
    <van-tabs class="order-tab" v-model="status" @change="onChangeTab" :color="'#4286d3'" :title-active-color="'#4286d3'">
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待付款" name="0"></van-tab>
      <van-tab title="待确认" name="1"></van-tab>
      <van-tab title="代发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>

    <!-- 下边的订单可以刷新 -->
    <van-pull-refresh class="order-list-refresh" v-model="refreshing" @refresh='onRefresh'>
      <van-list 
        v-model="loading" 
        :finished='finished'  
        @load="onLoad"
        finished-text="没有更多了" 
        @offset="300"
      >
        <div class="order-item-box" v-for="(item,index) in list " :key="index" >
          <div class="order-item-header">
            <span>订单时间: {{item.createTime}} </span>
            <span>{{ item.orderStatusString }}</span>
          </div>
          <van-card 
            v-for="one in item.newBeeMallOrderItemVOS" 
            :key="one.orderId"
            :num="one.goodsCount"
            :price="one.sellingPrice"
            :title="one.goodsName"
            :thumb="prefix(one.goodsCoverImg)"
            desc="全场包邮" 
          />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import SimpleHeader from '@/components/SimpleHeader.vue'
import {  getOrderList } from '@/service/order'
export default {
  components: { SimpleHeader },
  data() {
    return {
      
      list:[],

      //vant列表组件,标志是否在加载中
      loading:false,

      //vant列表组件,标志是否加载完成
      finished:false,

      //vant下拉刷新组件,标志是否在加载中
      refreshing:false,

      //当前选中的tab
      status:'',

      //
      totalPage:"",

      page:1
    }
  },
  methods: {
    //初始化,向服务器请求数据
    async loadData(){
      const { data, data: { list } } = await getOrderList(
        {
          pageNumber: this.page,
          status: this.status
        }
      )
      //拼接
      this.list = this.list.concat(list);
      this.totalPage = data.totalPage;
      this.loading = false;
      if(this.page >= data.totalPage){
        this.finished = true;
      }
    },

    //列表触发加载时的回调
    onLoad(){
      //未下拉刷新,请求页数加一
      if(!this.refreshing && this.page < this.totalPage){
        this.page = this.page + 1;
      }

      //下拉刷新重置列表
      if(this.refreshing){
        this.list = [];
        this.refreshing = false;
      }

      //请求数据
      this.loadData();
    },

    //vant组件下拉刷新后的回调
    onRefresh(){
      this.refreshing = true;
      this.finished = false;
      this.loading = true;
      this.page = 1;
      this.onLoad();
    },

    //tab改变后的回调
    onChangeTab(name, title){
      this.status = name;
      this.onRefresh();
    },

    //回退一页
    goBack(){
      this.$router.go(-1);
    }

  },

}
</script>

<style lang='less' scoped>
@import '../common/style/mixin';
  .order-box {
    .order-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      margin-top: 44px;
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
    }
    .order-list-refresh {
      margin-top: 68px;
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .van-list {
        min-height: calc(100vh - 88px);
        background: #f9f9f9;
        margin-top: 20px;
      }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>