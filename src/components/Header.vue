<!-- html -->
<template>
  <div class='header'>
    <div class="menu">
    </div>
     <search/>
    <div>
      <!-- 这里不知道为啥isLogin不是响应式，用userInfo代替 -->
      <div class="userinfo" v-if="userInfo" >
          <el-image :src='userInfo.avatarUrl' lazy> 
          </el-image>
        <span>{{userInfo.nickname}}</span>
        <span class="quit"  @click="logout"><i class="iconfont icon-quit"></i></span>
      </div>
      <div class="login" v-else>
        <div class="login-btn" @click="loginHandler" >登录</div>
      </div>
    </div>
  </div>
</template>

<!-- script -->
<script>
import { computed, onBeforeUpdate, ref,watch, watchEffect } from '@vue/runtime-core'
export default {
  name:'Header'
}
</script>
<script  setup>
import Search from './Search.vue'
import {useStore} from 'vuex'
import { useRoute , useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const store = useStore()
const loginHandler = ()=>{
   store.commit('SETLOGINDIALOG', true)
}
/* 是否登录 */
const isLogin = computed(()=>{
  return store.getters.isLogin

})
/* 获取存储在本地的用户信息 */
const userInfo = computed(()=>{
  return store.getters.userInfo
})
const logout = ()=>{
  window.localStorage.removeItem('token')  //清除token
  window.localStorage.removeItem('cookie')  // 清除cookie
  window.localStorage.removeItem('userInfo') // 清除userinfo
  window.localStorage.removeItem('isLogin')  // 清除
  store.commit('SETUSERINFO' ,'') // 将存储在store的用户信息清空
  store.commit('SET_LOGIN', false) // 将存储在store的是否登录设置为false
  ElMessage.success('退出成功')
  if (route.path.indexOf('/my') >= 0) {  // 如果在我的音乐界面，跳转到首页
    router.push({ path: '/' })
  }
}
</script>

<style lang="less" scoped>
.header{
  display: flex;
  height: 80px;
  // background-color: aqua;
  justify-content: space-between;
  align-items: center;
}
.menu{
  flex: 1;
}
.login{
  padding: 5px 0 5px  20px;
  text-align: center;
  .login-btn{
    font-size: 16px;
    color: var(--color-text-height);
    cursor: pointer;
  }
}
.userinfo{
  padding: 5px 0 5px  20px;
  height: 30px;
  line-height: 0px;
  display: flex;
  .el-image{
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  span {
      display: inline-block;
      color: var(--color-text-height);
      height: 30px;
      line-height: 35px;
      font-weight: 300;
      padding: 0 10px;
      cursor: pointer;
  }
  .icon-quit{
    color: var(--color-text-main);
  }
}
</style>