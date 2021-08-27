<template>
  <div class="create-order">
    <simple-header :title="'生成订单'"></simple-header>
    <div class="address-wrap" @click="goTo">
      <div class="name">
        <span>{{ address.userName }}</span>
        <span> {{ address.userPhone }}</span>
      </div>
      <div class="address">
        {{ address.provinceName }} {{ address.cityName }} {{ address.regionName }} {{ address.detailAddress }}
      </div>
      <van-icon class="arrow" name="arrow" />
    </div>
    <div class="good">
      <div class="good-item" v-for="(item,index) in cartList" :key="index">
        <div class="good-img">
          <img :src="prefix(item.goodsCoverImg)">
        </div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.goodsName }}</span>
            <span>{{ item.goodsCount }}</span>
          </div>
          <div class="good-btn">
            <div class="price">￥{{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span>￥{{ total }}</span>
      </div>
      <van-button @click="createOrder" class="pay-btn" color="#4286d3" type="primary" block>生成订单</van-button>
    </div>
    <!-- 点击生成订单弹出支付 -->
    <van-popup @close='close' :close-on-click-overlay='false' v-model="showPay" position="bottom" :style="{ height:'30%' }" closeable>
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button @click="payOrder(1)" :style="{ marginBottom:'10px' }" color="#1989fa" block>支付宝支付</van-button>
        <van-button @click="payOrder(2)" color="#4fc08d" block>微信支付</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import SimpleHeader from '@/components/SimpleHeader.vue'
import { getByCartItemIds } from '@/service/cart'
import { createOrder,payOrder } from '@/service/order'
import { getLocal,setLocal } from '@/common/js/utils'
import { getAddressDetail,getDefaultAddress } from '@/service/address'
import { getUserInfo } from '@/service/user'
import { Toast } from 'vant'
export default {

  components: { 
    SimpleHeader,
  },

  data() {
    return {
      //商品信息
      cartList:[],

      //地址
      address:{},

      //弹出支付按钮
      showPay:false,

      //服务器返回的订单号
      orderNo:'',
    }
  },

  computed: {
    total(){
      let sum = 0;
      this.cartList.forEach(item => {
        sum += item.goodsCount * item.sellingPrice;
      })
      return sum;
    }
  },

  created() {
    this.init();
  },

  methods: {
    //初始化订单
    async init(){
      Toast.loading({
        message:'加载中...',
        forbidClick:true
      })
      
      //我们在购物车那边点击结算时会将商品ID以一个数组形式传过来
      const { addressId, cartItemIds } = this.$route.query;
      //如果query里没有ID,我们从本地获取
      const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(getLocal('cartItemIds'));
      //将ID存储到本地
      setLocal('cartItemIds',JSON.stringify(_cartItemIds));
      //向服务器请求ID对应的商品信息
      const { data:list } = await getByCartItemIds({ cartItemIds: _cartItemIds.join(',') });
      //向服务器获取地址,如果没有传地址则请求默认地址
      const { data:address } = addressId ? await getAddressDetail(addressId) : await getDefaultAddress();
      //没有任何地址,则跳转到添加地址页面
      if(!address){
        this.$router.push({ path:'/address' });
        return;
      }
      this.address = address;
      this.cartList = list;
      Toast.clear();
    },

    //通往编辑地址页面
    goTo(){
      this.$router.push({ path:`address?cartItemIds=${JSON.stringify(this.cartItemIds)}` })
    },

    //创建订单
    async createOrder(){
      //服务器那边必须要带上地址
      const params = {
        addressId: this.address.addressId,
        cartItemIds: this.cartList.map(item => item.cartItemId)
      }
      //向服务器提交订单
      const { data, resultCode } = await createOrder(params);
      //提交订单后要把本地存储的商品ID清空
      setLocal('cartItemIds','');
      this.orderNo = data;
      this.showPay = true;
    },

    //支付订单
    async payOrder(type){
      Toast.loading({
        message:"支付中...",
        forbidClick:true
      })
      //提交支付到服务器
      await payOrder({ orderNo: this.orderNo, payType:type });
      Toast.clear();
      Toast('支付成功');

      //跳转到订单页面
      setTimeout(() => {
        this.$router.push({ path:'order' })
      },1000)
    },

    //弹出层关闭的回调,跳转到我的订单页面
    close(){
      this.$router.push({ path:'order'});
    }

  },
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .create-order {
    background: #f9f9f9;
    .address-wrap {
      margin-bottom: 20px;
      background: #fff;
      position: relative;
      margin-top: 44px;
      font-size: 14px;
      padding: 15px;
      color: #222333;
      .name, .address {
        margin: 10px 0;
      }
      .arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
      }
      &::before {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: #4286d3;
        background-size: 80px;
        content: '';
      }
    }
    .good {
      margin-bottom: 120px;
    }
    .good-item {
      padding: 10px;
      background: #fff;
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
    .pay-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
      padding: 10px 0;
      padding-bottom: 50px;
      border-top: 1px solid #e9e9e9;
      >div {
        display: flex;
        justify-content: space-between;
        padding: 0 5%;
        margin: 10px 0;
        font-size: 14px;
        span:nth-child(2) {
          color: red;
          font-size: 18px;
        }
      }
      .pay-btn {
        position: fixed;
        bottom: 7px;
        right: 0;
        left: 0;
        width: 90%;
        margin: 0 auto;
      }
    }
  }
</style>