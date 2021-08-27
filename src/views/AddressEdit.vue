<template>
  <div class="address-edit-box">
    <simple-header :title="`${type == 'add' ? '新增地址' : '编辑地址'}`"></simple-header>
    <van-address-edit 
      class="edit"
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      :area-columns-placeholder="['请选择','请选择','请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { areaList } from '@vant/area-data'
import SimpleHeader from '@/components/SimpleHeader.vue'
import { addAddress, DeleteAddress, EditAddress, getAddressDetail } from '@/service/address'
import { Toast } from 'vant'
export default {
  components: { SimpleHeader },
  data() {
    return {
      //vant的全国地址数据
      areaList,

      //编辑地址还是添加地址
      type:'add',

      //vant组件中渲染的地址信息
      addressInfo:{},

      //其他页面传过来的地址ID
      addressId:'',

      //从什么页面传过来的
      from:'',
    }
  },

  //初始化操作
  async created () {
    //拿到其他页面传过来的地址ID,编辑或是添加,以及从什么页面传过来
    const { addressId,type,from } = this.$route.query;
    this.addressId = addressId;
    this.type = type;
    this.from = from || '';

    //如果此时是编辑地址页面,要渲染需要编辑的地址
    //首先向服务器请求地址详情
    if(this.type == 'edit'){
      const { data:addressDetail } = await getAddressDetail(addressId);
      //渲染地址必须给vant组件传入区域的ID号
      //所以我们要根据向服务器请求的信息来向数据从搜索ID号
      let _areaCode = '';
      //地址由ID,地址名组成
      Object.entries(this.areaList.county_list).forEach(([id,text]) => {
        //从区开始找比较快,并且区会同名
        if(text == addressDetail.regionName){
          //我们找出区对应的几个省份
          const provinceItem = Object.entries(this.areaList.province_list).filter(([proId,proName]) => {
            return proId.substr(0,2) == id.substr(0,2);
          })[0]

          //找出区对应的几个市区
          const cityItem = Object.entries(this.areaList.city_list).filter(([cityId,cityName]) => {
            return cityId.substr(0,4) == id.substr(0,4);
          })[0]
          //然后与服务器请求来的详细地址比对找出的省份与市区就能拿到区号了
          if(provinceItem[1] == addressDetail.provinceName && cityItem[1] == addressDetail.cityName){
            _areaCode = id;
          }
        }
      })

      //拿到ID后就可以渲染信息了
      this.addressInfo = {
        id:addressDetail.addressId,
        name: addressDetail.userName,
        tel: addressDetail.userPhone,
        province: addressDetail.provinceName,
        city: addressDetail.cityName,
        country: addressDetail.regionName,
        addressDetail: addressDetail.detailAddress,
        areaCode: _areaCode,
        isDefault: !!addressDetail.defaultFlag
      }

    }
  },
  methods: {

    //vant组件点击保存后的回调
    async onSave(content){
      //保存的时候把表单的值全取出来
      const params = {
        userName: content.name,
        userPhone: content.tel,
        provinceName: content.province,
        cityName: content.city,
        regionName: content.country,
        detailAddress: content.addressDetail,
        defaultFlag: content.isDefault ? 1 : 0
      }
      if(this.type == 'edit'){
        params['addressId'] = this.addressId;
      }

      //然后提交到服务器
      const { message } = await this.type == 'add' ? addAddress(params) : EditAddress(params);
      Toast('保存成功');
      
      //提交结束跳转回去
      setTimeout(() => {
        this.$router.push({ path:`address?from=${this.from}` });
      },500)
    },


    //vant组件点击删除后的回调
    async onDelete(){

      //提交到服务器去删除
      const { message } = await DeleteAddress(this.addressId);
      Toast('删除成功');

      //删除结束跳转到地址页面
      setTimeout(() => {
        this.$router.push({ path:'/address' })
      },500)
    }

  },
}
</script>

<style lang="less" >
  @import '../common/style/mixin';
  .address-edit-box {
    margin-top: 44px;
    .van-address-edit {
      .van-button--danger {
        background: @primary;
        border-color: @primary;
      }
      .van-switch--on {
        background: @primary;
      }
    }
  }
</style>