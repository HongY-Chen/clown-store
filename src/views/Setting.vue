<template>
  <div class="setting-box">
    <simple-header :title="'账号管理'"></simple-header>
    <div class="input-item">
      <van-field label="昵称" v-model="nickName" />
      <van-field label="个性签名" v-model="introduceSign" />
      <van-field label="修改密码" v-model="password" type="password" />
    </div>
    <van-button class="save-btn" color="#4286d3" @click="save" type="primary" block>保存</van-button>
    <van-button class="save-btn" color="#4286d3" @click="logout" type="primary" block>退出登录</van-button>
  </div>
</template>

<script>
import { getUserInfo,EditUserInfo,logout } from '@/service/user'
import { setLocal } from '@/common/js/utils'
import SimpleHeader from '@/components/SimpleHeader.vue'
import { Toast } from 'vant'
export default {
  components: { SimpleHeader },
  data() {
    return {
      //昵称
      nickName:'',

      //个性签名
      introduceSign:'',

      //密码
      password:''
    }
  },

  //获取用户信息
  async created() {
    const { data } = await getUserInfo();
    this.nickName = data.nickName;
    this.introduceSign = data.introduceSign;
  },

  methods: {
    //保存用户信息
    async save(){
      //将数据收集
      const params = {
        nickName: this.nickName,
        introduceSign: this.introduceSign,
        passwordMd5: this.md5(this.password)
      }
      //提交给服务器
      const { data } = await EditUserInfo(params);
      Toast.success('保存成功');
    },

    //登出
    async logout(){
      //向服务器请求登出
      const resultCode = await logout();
      //成功登出,token置空
      if(resultCode == 200){
        setLocal('token','');
        window.location.href = '/'
      }
    }

  },
}
</script>

<style lang="less" scoped>
  .setting-box {
    .input-item {
      margin-top: 44px;
    }
    .save-btn {
      width: 80%;
      margin: 20px auto ;
    }
  }
</style>