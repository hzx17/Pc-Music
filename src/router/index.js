import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    { path: '/', redirect: '/index'},
    { path: '/index', name: 'index', component: () => import('@views/index/Index.vue')},
    { path: '/song', name: 'song', component: () => import('@views/song/Index.vue')},
    { path: '/playlist', name: 'playlist', component: () => import('@views/playlist/Index.vue')},
    { path: '/playlist/detail', name: 'playlistdetail', component: () => import('@views/playlist/Detail.vue')},
    { path: '/mvlist', name: 'mvlist', component: () => import('@views/mvlist/Index.vue')},
    { path: '/mvlist/mv', name: 'mvlistdetail', component: () => import('@views/mvlist/Detail.vue')},
    { path: '/my', name: 'my', meta:{isAuth:true,title:'我的'}, component: () => import('@views/my/Index.vue')},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//指定每一次路由切换调用函数，在初始化的时候被调用、每次路由切换之前被调用（全局前置路由守卫）
router.beforeEach((to,from,next)=>{
  //放行
  if(to.meta.isAuth){  //控制是否需要权限
    if(localStorage.getItem('isLogin')){
      next()
    }else{
      confirm('你还未登录，请登录')
    }
  }else{
    next()
  }
})


export default router