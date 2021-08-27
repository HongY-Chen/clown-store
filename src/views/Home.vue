<template>
  <div class="home">
    <header class="home-header wrap" :class="{'active' : headerFlow}">
      <router-link tag="i" to="./category"><i class="iconfont icon-fenlei"></i></router-link>
      <div class="header-search">
        <span class="app-name">小丑商城</span>
        <i class="iconfont icon-sousuo"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=home">好好学习,天天向上</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin">登录</router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o"></van-icon>
      </router-link>
    </header>
    <nav-bar></nav-bar>

    <!-- 轮播图 -->
    <swiper :list="swiperList"></swiper>
    <!-- 中间的小图标 -->
    <div class="category-list">
      <div v-for="item in categoryList" :key="item.categoryId">
        <img :src="item.imgUrl" >
        <span> {{item.name}} </span>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="good">
      <header class="good-header">新品上线</header>
      <div class="good-box">
        <div class="good-item" v-for="item in newGoods" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" >
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">￥{{ item.sellingPrice }} </div>
          </div>
        </div>
      </div>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <div class="good-box">
        <div class="good-item" v-for="item in hots" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" >
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">￥{{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 这里设置Bottom是为了离底部bar有距离 -->
    <div class="good" :style="{ paddingBottom: '100px' }">
      <header class="good-header">最新推荐</header>
      <div class="good-box">
        <div class="good-item" v-for="item in recommends" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="prefix(item.goodsCoverImg)" >
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">￥{{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getLocal } from '@/common/js/utils'
  import swiper from '@/components/Swiper.vue'
  import NavBar from '@/components/NavBar.vue'
  import { Toast } from 'vant'
  import { getHome } from '@/service/home'
export default {
  name: 'Home',
  components: {
    swiper,
    NavBar
  },
  data() {
    return {
      // 是否已经登录
      isLogin:false,

      // 头部是否滚动超出了，是则设置背景
      headerFlow:false,

      //轮播图
      swiperList:[],

      //小图片
      categoryList: [
          {
            name: '小丑超市',
            imgUrl: '//s.weituibao.com/1583585285461/cs.png',
            categoryId: 100001
          }, {
            name: '小丑服饰',
            imgUrl: '//s.weituibao.com/1583585285468/fs.png',
            categoryId: 100003
          }, {
            name: '全球购',
            imgUrl: '//s.weituibao.com/1583585285470/qq.png',
            categoryId: 100002
          }, {
            name: '小丑生鲜',
            imgUrl: '//s.weituibao.com/1583585285472/sx.png',
            categoryId: 100004
          }, {
            name: '小丑到家',
            imgUrl: '//s.weituibao.com/1583585285467/dj.png',
            categoryId: 100005
          }, {
            name: '充值缴费',
            imgUrl: '//s.weituibao.com/1583585285465/cz.png',
            categoryId: 100006
          }, {
            name: '9.9元拼',
            imgUrl: '//s.weituibao.com/1583585285469/pt.png',
            categoryId: 100007
          }, {
            name: '领劵',
            imgUrl: '//s.weituibao.com/1583585285468/juan.png',
            categoryId: 100008
          }, {
            name: '省钱',
            imgUrl: '//s.weituibao.com/1583585285471/sq.png',
            categoryId: 100009
          }, {
            name: '全部',
            imgUrl: '//s.weituibao.com/1583585285470/qb.png',
            categoryId: 100010
          }
      ],

      //推荐商品，热商品，新商品
      hots:[],
      newGoods:[],
      recommends:[],
    }
  },

  //初始化数据
  async created(){
    //有token就是登录状态
    const token = getLocal('token');
    if(token){
      this.isLogin = true;
    }
    Toast.loading({
      message:"加载中...",
      forbidClick:true
    });

    //向服务器获取商品，轮播图数据
    const { data } = await getHome();
    this.swiperList = data.carousels;
    this.newGoods = data.newGoodses;
    this.hots = data.hotGoodses;
    this.recommends = data.recommendGoodses;
    Toast.clear();
  },

  //添加滚动事件，头部滚动出一段距离设置背景
  mounted () {
    window.addEventListener('scroll',this.headerScroll);
  },

  methods: {
    //跳转到商品详情页面
    goToDetail(item) {
      this.$router.push({ path:`product/${item.goodsId}` })
    },

    // 判断滚动距离，滚动超出100让头部有个背景，否则透明，主要是为了能看到轮播图
    headerScroll(){
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      scrollTop > 100 ? this.headerFlow = true : this.headerFlow = false;
    }
    
  },
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .home-header {
      position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      .icon-fenlei {
        color: @primary;
      }
      // 头部超出背景
      &.active {
        background: @primary;
        .icon-fenlei {
          color: #fff;
        }
        .login {
          color: #fff;
        }
      }

      .header-search {
          display: flex;
          .wh(74%, 20px);
          line-height: 20px;
          margin: 10px 0;
          padding: 5px 0;
          color: #232326;
          background: rgba(255, 255, 255, .7);
          border-radius: 20px;
          .app-name {
              padding: 0 10px;
              color: @primary;
              font-size: 20px;
              font-weight: bold;
              border-right: 1px solid #666;
          }
          .icon-sousuo {
              padding: 0 10px;
              font-size: 17px;
          }
          .search-title {
              font-size: 12px;
              color: #666;
              line-height: 21px;
          }
      }
      .login {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
  }
  .category-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;
    div {
      display: flex;
      flex-direction: column;
      width: 20%;
      text-align: center;
      img {
        .wh(40px, 40px);
        margin: 13px auto 8px auto;
      }
    }
  }
  .good {
    .good-header {
      background: #f9f9f9;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @primary;
      font-size: 16px;
      font-weight: 500;
    }
    .good-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .good-item {
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1PX solid #e9e9e9;
        padding: 10px 10px;
        img {
          display: block;
          width: 120px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          font-size: 14px;
          padding: 10px 0;
          .title {
            color: #222333;
          }
          .price {
            color: @primary;
          }
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
    }
  }
</style>
