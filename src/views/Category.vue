<template>
  <div class="category">
    <header class="category-header">
      <i class="iconfont icon-fanhui" @click="goHome"></i>
      <div class="header-search">
        <i class="iconfont icon-sousuo"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=category">全场打骨折甩卖</router-link>
      </div>
      <i class="noMore"></i>
    </header>
    <nav-bar></nav-bar>
    <div class="search-wrap" ref="searchWrap">
      <!-- 一级列表(侧边栏) -->
      <list-scroll class="nav-side-wrapper" :data="categoryData">
        <ul class="nav-side" >
          <li
            v-for="item in categoryData"
            :key="item.categoryId"
            v-text="item.categoryName" 
            :class="{'active': currentIndex == item.categoryId}"
            @click="selectMenu(item.categoryId)"
          ></li>
        </ul>
      </list-scroll>
      <!-- 一级列表对应的二级列表和内容 -->
      <div class="search-content">
        <list-scroll :data="categoryData">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <!-- 生成所有的分类,然后按照当前选中的分类ID显示 -->
              <template v-for="(category,index) in categoryData">
                <div class="swiper-slide" :key="index" v-if="currentIndex == category.categoryId">
                  <div class="category-list" v-for="(products,index) in category.secondLevelCategoryVOS" :key="index">
                    <p class="category-title">{{ products.categoryName }}</p>
                    <div class="product-item" v-for="(product,index) in products.thirdLevelCategoryVOS" :key="index" @click="selectProduct(product)">
                      <img class="product-img" src="//s.weituibao.com/1583591077131/%E5%88%86%E7%B1%BB.png" >
                      <p class="product-title" v-text="product.categoryName"></p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </list-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import ListScroll from '@/components/ListScroll.vue'
import { getCategory } from '@/service/good'

export default {
  name:'Category',
  components: {
    NavBar,
    ListScroll
  },

  data() {
    return {
      // 分类列表数据
      categoryData:[],

      //当前点击的分类索引
      currentIndex:15
    }
  },

  //初始化数据
  async created () {
    const { data } = await getCategory();
    this.categoryData = data;
  },

  //初始化内容区域的高度
  mounted() {
    this.setWrapHeight();
  },

  methods: {
    //当前选中的分类
    selectMenu(index) {
      this.currentIndex = index;
      console.log(index);
    },

    //选中该商品分类则跳到搜索栏
    selectProduct(item){
      this.$router.push({ path:`product-list?categoryId=${item.categoryId}` })
    },

    //设置列表区域的高度,即减去头以及导航栏,否则刚好为内容的高度
    setWrapHeight() {
      let $screenHeight = document.documentElement.clientHeight
      this.$refs.searchWrap.style.height = $screenHeight - 100 + 'px'
    },

    //返回主页
    goHome(){
      this.$router.push({ path:"/home" })
    }
  },
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .category {
    .category-header {
      background: #fff;
      position: fixed;
      left: 0;
      top: 0;
      .fj();
      .wh(100%, 50px);
      line-height: 50px;
      padding: 0 15px;
      box-sizing: border-box;
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-fanhui{
        font-size: 16px;
      }
      .header-search {
        display: flex;
        width: 80%;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #F7F7F7;
        border-radius: 20px;
        .icon-sousuo {
          padding: 0 10px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
        }
      }
      .noMore {
        font-size: 20px;
      }
    }
  }
  .search-wrap {
    .fj();
    width: 100%;
    margin-top: 50px;
    background: #F8F8F8;
    border-top: 1px solid #999;
    .nav-side-wrapper {
      width: 28%;
      height: 100%;
      overflow: hidden;
      .nav-side {
        width: 100%;
        .boxSizing();
        background: #F8F8F8;
        li {
          width: 100%;
          height: 56px;
          text-align: center;
          line-height: 56px;
          font-size: 14px;
          &.active {
            color: @primary;
            background: #fff;
          }
        }
      }
    }
    .search-content {
      width: 72%;
      height: 100%;
      padding: 0 10px;
      background: #fff;
      .boxSizing();
      .swiper-container {
        width: 100%;
        .swiper-slide {
          width: 100%;
          .category-main-img {
            width: 100%;
          }
          .category-list {
            display: flex;
            flex-wrap: wrap;
            flex-shrink: 0;
            width: 100%;
            .category-title {
              width: 100%;
              font-size: 17px;
              font-weight: 500;
              padding: 20px 0;
            }
            .product-item {
              width: 33.3333%;
              margin-bottom: 10px;
              text-align: center;
              font-size: 15px;
              .product-img {
                .wh(30px, 30px);
              }
            }
          }
        }
      }
    }
  }
</style>