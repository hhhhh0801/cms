import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import User from '@/pages/User'
import Chart from '@/pages/Chart'
import Setting from '@/pages/Setting'
import SettingInfo from '@/pages/Setting/Info'
import SettingAuth from '@/pages/Setting/Auth'
import SettingAdv from '@/pages/Setting/Adv'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
    // use
Vue.use(mavonEditor)
Vue.use(Router)

export default new Router({
  routes: [
   {
      path: '/',
      // name: 'HelloWorld',
      component: Chart
    },
   {
      path: '/category',
      // name: 'HelloWorld',
      component: Category
    },
    {
      path: '/article',
      // name: 'HelloWorld',
      component: Article
    },
    {
      path: '/user',
      // name: 'HelloWorld',
      component: User
    },{
      path: '/setting',
      // name: 'HelloWorld',
      component: Setting,
      children:[{
        path:'info',
        component: SettingInfo
      },{
        path:'auth',
        component: SettingAuth
      },{
        path:'adv',
        component: SettingAdv
      }]
    }



  ]
})
