<template>
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <div class="header-search">
          <i class="iconfont icon-sousuo"></i>
          <input type="text" class="search-title" v-model="keyword" />
        </div>
        <span class="search-btn" @click="getSearch">搜索</span>
      </header>
      <van-tabs type="card" color="#4286d3" @click="changeTab">
        <van-tab title="推荐" name=""></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="热门" name="hot"></van-tab>
      </van-tabs>
    </div>
    <!-- 商品列表 -->
    <van-pull-refresh class="product-list-refresh"  @refresh="onRefresh" v-model="refreshing"> 
      <van-list :finished="finished" finished-text="没有更多了" @load="onLoad" @offset="300">
        <div class="product-item" v-for="(item,index) in productList" :key="index" @click="productDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" >
          <div class="product-info">
            <p class="name">{{ item.goodsName }}</p>
            <p class="subtitle">{{ item.goodsIntro }}</p>
            <span class="price">￥{{ item.sellingPrice }}</span>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { search } from '@/service/good'
export default {
  data() {
    return {
      //搜索词
      keyword: this.$route.query.keyword || '',

      //商品列表
      productList:[],

      //vant下拉刷新组件,是否正在刷新中
      refreshing:false,

      //vant列表组件,是否正在加载数据
      loading:false,

      //没有数据可以加载了吗
      finished:false,

      // 商品总共的页数及当前页数
      totalPage:0,
      page:1,

      // 按照什么来对商品排序(推荐?新品?)
      orderBy:''
    }
  },
  methods: {
    //数据的初始化操作
    async init() {
      //拿到分类页面传过来的ID
      const { categoryId, from } = this.$route.query;
      //如果ID和搜索词都是空，直接返回就好
      if(!categoryId && !this.keyword){
        this.finished = true,
        this.loading = false;
        return;
      }

      //否则按照搜索词及当前页码请求数据
      const { data, data: { list } } = await search({ 
        pageNumber: this.page, 
        goodsCategoryId: categoryId,
        keyword: this.keyword,
        orderBy: this.orderBy 
      });

      //将请求回来的数据更新,并计算页数
      this.productList = this.productList.concat(list);
      this.totalPage = data.totalPage;
      this.loading = false;
      if(this.page >= this.totalPage){
        this.finished = true;
      }
    },

    //左上角返回按钮
    goBack(){
      this.$router.go(-1);
    },

    //跳转到商品详情页面
    productDetail(item){
      this.$router.push({ path:`product/${item.goodsId}` })
    },

    //加载数据时的回调
    onLoad(){
      //还有数据才能加载
      if(!this.refreshing && this.page < this.totalPage){
        this.page = this.page + 1;
      }
      //如果是当前是重新刷新引起的回调,那我们要清空当前的数据
      if(this.refreshing){
        this.productList = [];
        this.refreshing = false;
      }
      //重新请求一遍数据
      this.init();
    },

    // 页面下拉刷新的回调
    onRefresh(){
      this.refreshing = true;
      this.finished = false;
      this.loading = true;
      this.page = 1;
      this.onLoad();
    },

    //点击搜索按钮的回调
    getSearch(){
      this.onRefresh();
    },

    //vant组件tab栏被点击的回调,参数为标识符及该tab的title
    changeTab(name,title){
      //主要是设置商品按什么排序,然后重新刷新一下列表
      this.orderBy = name;
      this.onRefresh();
    }
  },
}
</script>

<style lang='less' scoped>
  @import '../common/style/mixin';
  .product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    .category-header {
      .fj();
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-fanhui {
        font-size: 18px;
        font-weight: 600;
      }
      .header-search {
        display: flex;
        width: 76%;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #F7F7F7;
        .borderRadius(20px);
        .icon-sousuo {
          padding: 0 5px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
          background: #F7F7F7;
        }
    }
    .search-btn {
      height: 28px;
      margin: 8px 0;
      line-height: 28px;
      padding: 0 5px;
      color: #fff;
      background: @primary;
      .borderRadius(5px);
      margin-top: 10px;
    }
  }
}
  .product-list-refresh {
    margin-top: 78px;
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
          width: 56%;
          height: 120px;
          padding: 5px;
          text-align: left;
          .boxSizing();
          p {
            margin: 0
          }
          .name {
            width: 100%;
            max-height: 40px;
            line-height: 20px;
            font-size: 15px;
            color: #333;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .subtitle {
            width: 100%;
            max-height: 20px;
            padding: 10px 0;
            line-height: 25px;
            font-size: 13px;
            color: #999;
            overflow: hidden;
          }
          .price {
            color: @primary;
            font-size: 16px;
          }
      }
  }
}
</style>