import Vue from 'vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import Popup from '@/Popup.vue'
import store from '@/store'
import { OctoClientPlugin } from '@/plugins/octoclient';

Vue.use(Buefy)
Vue.use(VueRouter)
Vue.use(OctoClientPlugin)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      name: '',
      path: '/',
      component: Popup,
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('@/pages/PopupIndexPage.vue')
        },
        {
          path: 'start',
          name: 'start',
          component: () => import('@/pages/PopupStartPage.vue')
        }
      ]
    },
  ]
})
// window.userInfo = {
//   'login': 'wd0517',
//   'avatarUrl': 'https://avatars1.githubusercontent.com/u/10102304?v=4'
// }
// window.accessToken = '11'
// new Vue({ router, store, render: h => h(Popup) }).$mount('#app')

chrome.storage.sync.get(['accessToken', 'userInfo'], (result) => {
  window.accessToken = result.accessToken
  window.userInfo = result.userInfo
  new Vue({ router, store, render: h => h(Popup) }).$mount('#app');
})
