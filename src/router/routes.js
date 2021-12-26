import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'NoAuthLogin',
    component: () => import(/* webpackChunkName: "login" */ '../views/member/Login.vue')
  },
  {
    path: '/join',
    name: 'NoAuthJoin',
    component: () => import(/* webpackChunkName: "join" */ '../views/member/Join.vue')
  },
  {
    path: '/modifyPassword/:hash',
    name: 'NoAuthModifyPassword',
    component: () => import(/* webpackChunkName: "modifyPassword" */ '../views/member/ModifyPassword.vue')
  },
  {
    path: '/adm/config',
    name: 'AdmConfig',
    component: () => import(/* webpackChunkName: "admConfig" */ '../views/admin/Config.vue')
  },
  //웹팩(js, css, image) 코드  /* webpackChunkName: "admMember" */
  //ChunkName을 정의 했을 경우 그 name에 해당되는 javasciprt를 가져옴..
  {
    path: '/adm/member',
    name: 'AdmMember',
    component: () => import(/* webpackChunkName: "admMember" */ '../views/admin/Member.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue')
  },
]

export default routes;