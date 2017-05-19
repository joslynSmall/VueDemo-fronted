import Vue from 'vue'
import Router from 'vue-router'
import Store from '../vuex/store'
import Login from '@/page/Login'
import Home from '@/page/Home'
import Role from '@/page/Role'
import Register from '@/page/register'
import UpdatePassword from '@/page/updatePassword'
import AccountManatement from '@/page/AccountManagement'
import Permission from '@/page/Permission'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登陆',
      component: Login,
      hidden: true
    },
    {
      path: '/register',
      name: '注册',
      component: Register,
      hidden: true
    },
    {
      path: '/home',
      name: '权限设置',
      component: Home,
      iconCls:'el-icon-message',//图标样式class
      hidden:false,
      children: [
            { path: '/account', component: AccountManatement,name:'账号管理'},
            { path: '/role', component: Role,name:'角色列表'},
            { path: '/permission', component: Permission,name:'权限管理'}
        ]
    },
    {
      path: '/',
      name: '账户安全',
      component: Home,
      iconCls:'el-icon-message',//图标样式class
      hidden:false,
      children: [
            { path: '/password', component: UpdatePassword,name:'修改密码'}
        ]
    }
  ]
})
