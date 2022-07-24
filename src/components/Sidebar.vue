<!-- html -->
<template>
  <div class='side-main'>
    <a class="logo"><img src="../assets/img/logo.jpg" alt="logo"></a>
    <ul class="nav">
      <li :class="{'is-active':menuActive.indexOf(item.path)>=0}" v-for="item in menuList" :key="item.path" @click="selectMenu(item)">
        <i :class="['iconfont' , `icon-${item.path}`]"></i><span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<!-- script -->
<script>
import { reactive } from '@vue/reactivity';
import {useRoute , useRouter} from 'vue-router';
import { computed } from '@vue/runtime-core';
export default {
  name:'musicSidebar'
}
</script>
<script  setup>
const route = useRoute();
const router = useRouter();
// 菜单数据项
const menuList = reactive([
  {
    name:'首页',
    path:'index'
  },
  {
    name:'歌单',
    path:'playlist'
  },
  {
    name:'mv',
    path:'mvlist' 
  },
  {
    name:'我的音乐',
    path:'my'
  }]);
  // 当前所在路由（即当前激活的菜单）
const menuActive = computed(()=>route.path)
/* 用户路由选择 */
const selectMenu = (item)=> {
  router.push({
    path: '/' + item.path
  })
}
</script>

<style lang="less" scoped>
.side-main{
  // background: #fdf;
  padding: 0 35px;
  text-align: center;
}
.logo{
  display: inline-block;
  width: 145px;
  margin: 25px auto 10px;
}
.nav{
  padding-top:30px ;
  border-top: 1px solid #f5f5f5 ;
  li{
    display: block;
    // background: #fdf;
    padding: 10px 16px;
    color:var(--color-text-main);
    border-radius:8px;
    text-align: left;
    font-weight: 300;
    cursor: pointer;
    &.is-active{
      font-weight: 400;
      background-color: #fff;
      box-shadow: 0 20px 20px rgb(0 0 0 /5%);
      .iconfont{
        color: #fff;
        background-color: var(--color-text-height) ;
      }
    }
    span {
      display: inline-block;
      line-height: 32px;
    }
    .iconfont {
      display: inline-flex;
      width: 32px;
      height: 32px;
      background-color: #fff;
      box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      font-size: 18px;
      color: var(--color-text);
      vertical-align: top;
    }
  }
}

</style>