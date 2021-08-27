import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible'
import md5 from 'js-md5'
import { prefix } from '@/common/js/utils'
import { Button,Toast,Field,Form,Icon,Swipe,SwipeItem,SwipeCell,Tab,Tabs,PullRefresh, 
         List,GoodsAction, GoodsActionIcon,GoodsActionButton,CheckboxGroup,Checkbox,
         SubmitBar,Stepper,Popup,Divider,AddressEdit,AddressList,Card } from 'vant'

Vue.use(Button).use(Toast).use(Field).use(Form).use(Icon).use(Swipe).use(SwipeItem).use(SwipeCell)
   .use(Tabs).use(Tab).use(PullRefresh).use(List).use(GoodsAction).use(GoodsActionIcon).use(Popup)
   .use(GoodsActionButton).use(Checkbox).use(CheckboxGroup).use(SubmitBar).use(Stepper).use(Divider)
   .use(AddressEdit).use(AddressList).use(Card)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.md5 = md5;
Vue.prototype.prefix = prefix;