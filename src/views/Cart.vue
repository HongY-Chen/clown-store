<template>
  <div class="cart-box">
    <simple-header :title="'购物车'"></simple-header>

    <!-- 上方商品数据 -->
    <div class="cart-body">
      <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result" >
        <!-- 商品信息 -->
        <van-swipe-cell :right-width="50" v-for="(item,index) in list" :key="index" >
          <div class="good-item">
            <van-checkbox :name="item.cartItemId"></van-checkbox>
            <div class="good-img">
              <img :src="prefix(item.goodsCoverImg)" alt="">
            </div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
              </div>
              <div class="good-btn">
                <div class="price">￥{{ item.sellingPrice }}</div>
                <van-stepper integer :min="1" async-change :value='item.goodsCount' :name="item.cartItemId" @change="onChange"/>
              </div>
            </div>
          </div>
          <van-button slot="right" square icon="delete" type="danger" class="delete-button" @click="deleteGood(item.cartItemId)" />
        </van-swipe-cell>
      </van-checkbox-group>
    </div>

    <!-- 底部结算 -->
    <van-submit-bar class="submit-all" button-text="结算" v-if="list.length > 0" :price="total * 100" @submit="onSubmit">
      <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!list.length">
      <van-icon name="smile-o"></van-icon>
      <div class="title">购物车空空如也</div>
      <van-button color="#4286d3" type="primary" block @click="goTo">前往首页</van-button>
    </div>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import SimpleHeader from '@/components/SimpleHeader.vue'
import NavBar from '@/components/NavBar.vue'
import { Toast } from 'vant'
import { getCart,deleteCartItem,modifyCart } from '@/service/cart'
export default {
  components: { 
    SimpleHeader, 
    NavBar
  },

  data() {
    return {
      //购物车商品列表
      list:[],

      //选中的商品的ID
      result:[],

      //底部全选按钮
      checkAll:true
    }
  },

  computed: {
    //结算总价
    total(){
      let sum = 0;
      //这边使用list计算是因为result里面只存的是ID
      let _list = this.list.filter(item => this.result.includes(item.cartItemId));
      _list.forEach((item) => {
        sum += item.goodsCount * item.sellingPrice;
      })
      return sum;
    }
  },

  created () {
    this.init();
  },

  methods: {
    //初始化购物车
    async init(){
      Toast.loading({
        message:'加载中...',
        forbidClick:true
      })
      //向服务器获取购物车数据
      const { data } = await getCart({ pageNumber:1 });
      this.list = data;
      this.result = data.map((item) => item.cartItemId)
      Toast.clear();
    },

    //当上方商品是checkbox变更发生的回调
    //这个参数是checkgroup组件自带的,存的是选中的商品的Id
    groupChange(result){
      //如果数组中的长度和所有商品长度都一直,设置为全选状态
      if(result.length == this.list.length){
        this.checkAll = true;
      }else{
        this.checkAll = false;
      }
      //更新一下当前本地的选中数组
      this.result = result;
    },

    //底部的全选按钮
    allCheck(){
      //当前为全选状态,把选中数组设置为全部选中
      if(this.checkAll){
        this.result = this.list.map(item => item.cartItemId);
      }else{
        //取消全选即置空选中数组
        this.result = [];
      }
    },

    //回退按钮
    goBack(){
      this.$router.go(-1);
    },

    //返回首页
    goTo(){
      this.$router.push({ path:'/home' });
    },

    //步进器的异步回调
    async onChange(value,detail){
      //如果步进器当前的值和数组里的值一样,返回
      if(this.list.filter(item => item.cartItemId == detail.name )[0].goodsCount == value){
        return;
      }

      //否则进行修改
      Toast.loading({
        message:"修改中...",
        forbidClick:true
      })
      //拿到步进器的值和ID
      const params = {
        cartItemId:detail.name,
        goodsCount:value
      };
      //提交到服务器更改
      const { data } = await modifyCart(params);
      //再更新本地的数组的值
      this.list.forEach((item) => {
        if(item.cartItemId == detail.name){
          item.goodsCount = value;
        }
      })
      Toast.clear();
    },

    //提交结算按钮
    async onSubmit(){
      //没有被选中的商品,返回
      if(this.result.length == 0){
        Toast.fail('请选择商品进行结算');
        return;
      }

      //否则进行结算,将选中数组里的内容传给创建订单页面
      const params = JSON.stringify(this.result);
      this.$router.push({ path:`create-order?cartItemIds=${params}` });
    },

    //删除购物车内的商品
    async deleteGood(id){
      //提交到服务器进行删除
      const { data } = await deleteCartItem(id);
      //更改购物车整体商品数量
      this.$store.dispatch('updateCart');
      //重新初始化一下购物车
      this.init();
    }
  },
  

}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .cart-box {
    .cart-header {
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
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
      margin: 60px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 50px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>