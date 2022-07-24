<!-- html -->
<template>
  <div class='home'>
    <Banner/>

    <!-- 热门推荐 -->
    <div class='hot-recom'>
      <div class="hot-title">
        <h3>热门推荐</h3>
        <span v-for="(item,index) in playlist_tags" :key="item.id"
              :class= "playlist_index==index ? 'active' : ''"
              @click="choosePlayListType(index)"
        >{{item.name}}</span>
        <div class="wrapper">
          <PalyList :playList="playlist_list" :loading="playlist_loading" :num="playlist_count" />
        </div>
      </div>
    </div>

    <!-- 热门MV -->
     <div class='hot-recom'>
      <div class="hot-title">
        <h3>热门MV</h3>
        <span v-for="(item,index) in mv_area" :key="index"
              :class= "mv_index==index ? 'active' : ''"
              @click="chooseMvType(index)"
        >{{item}}</span>
        <div class="wrapper">
          <MvList :mvList="mv_list" :loading="mv_loading" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- script -->
<script>
export default {
  name:'Home'
}
</script>
<script  setup>
import { toRefs} from 'vue'
import Banner from './Banner.vue'
// 热门推荐
import PlayList from '@/components/PalyList.vue'
// 最新mv
import MvList from '@/components/MvList.vue'
/* 获取首页推荐歌单数据 */
import hot_recom from '@assets/js/index/hot_recom'
import new_mv from '@assets/js/index/new_mv'


// -------------- 推荐歌单
const { playlist_info, choosePlayListType } = hot_recom()
const { mv_info, chooseMvType } = new_mv()
// -------------推荐MV
const { playlist_count,playlist_index ,playlist_list,playlist_loading,playlist_params,playlist_tags}  = toRefs(playlist_info)
const {  mv_area, mv_list, mv_index, mv_params,mv_count, mv_loading } = toRefs(mv_info)
</script>

<style lang="less" scoped>
.hot-recom{
  padding: 0px 20px 20px 20px;
  h3{
    font-size: 30px;
    padding: 0 40px 0 0;
    display: inline-block;
  }
  span{
    font-size: 16px;
    position: relative;
    color: var(--color-text);
    margin: 0 30px 0 0;
    cursor: pointer;
    &.active{
      font-weight: 700;
      color: var(--color-text-main);
      z-index: 1;
       &:after{
      content: "";
      position: absolute;
      content: "";
      left: 0;
      bottom: 1px;
      width: 100%;
      height: 6px;
      z-index: -1;
      background: var(--color-text-height);
    }
    }
  }
}
</style>