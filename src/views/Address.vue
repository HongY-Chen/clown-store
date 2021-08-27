<template>
  <div class="address-box">
    <simple-header :title="'地址管理'" :back="'/user'"></simple-header>
    <div class="address-item">
      <van-address-list
        v-if="from != 'mine'"
        default-tag-text="默认"
        :list="list"
        @add='onAdd'
        @edit='onEdit'
        @select='select'
      />
      <!-- 从我的地址进来的页面不需要有选择功能 -->
      <van-address-list
        v-else
        default-tag-text="默认"
        :list="list"
        @add='onAdd'
        @edit='onEdit'
      />
    </div>
  </div>
</template>

<script>
import SimpleHeader from '@/components/SimpleHeader.vue'
import { getAddressList } from '@/service/address'
export default {
  components: { SimpleHeader },
  data() {
    return {
      //格式化后的地址详情
      list:[],

      //从哪个路由来的
      from:this.$route.query.from
    }
  },

  //获取地址清单
  async mounted () {
    const { data } = await getAddressList();

    //对获取来的数据进行格式化,按照vant组件的格式
    this.list = data.map((item) => {
      return {
        id: item.addressId,
        name: item.userName,
        tel: item.userPhone,
        address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
        //vant组件中的isDefault需要转换为布尔值
        isDefault: !!item.defaultFlag
      }
    })

  },

  methods: {
    //vant组件点击添加的回调
    onAdd(){
      //跳转到编辑页面时要携带从哪跳转过去的
      this.$router.push({ path:`address-edit?type=add&from=${this.from}` });
    },

    //vant组件点击编辑的回调
    onEdit(item,index){
      //跳转到编辑页面时携带该地址的ID,以及从哪边跳转过去的
      this.$router.push({ path:`address-edit?type=edit&addressId=${item.id}&from=${this.from}` })
    },

    //vant组件选择地址后的回调
    select(item,index){
      this.$router.push({ path:`create-order?addressId=${item.id}&from=${this.from}` })
    }

  },
}
</script>

<style lang="less" >
  @import '../common/style/mixin';
  .address-box {
    .van-radio__icon {
      display: none;
    }
    .address-item {
      margin-top: 44px;
      .van-button {
        background: @primary;
        border-color: @primary;
      }
    }
  }
</style>