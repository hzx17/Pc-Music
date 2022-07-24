<!-- html -->
<template>
  <div class='palylist-detail'>
     <div class="center-content">
      <!-- 歌单简介 -->
        <div class="songlists-synopsis">
          <div class="cover_img">
            <el-image :src="details.coverImgUrl" lazy>
            </el-image>
          </div>
          <div class="synopsis">
            <h5>{{details.name}}</h5>

            <div class="cover-digital">
                <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{$utils.formartNum(details.playCount)}}次</span>
                <span class="cover-collect"><i class="iconfont icon-collect"></i> {{$utils.formartNum(details.subscribedCount)}}</span>
                <span class="cover-comment"><i class="iconfont icon-comment"></i> {{$utils.formartNum(details.shareCount)}}</span>
            </div>
              <div class="cover-desc">
                  <h5>歌单简介</h5>
              
                  <p class="cover-desc-all" >
                    {{details.description}}
                  </p>
              </div>
          </div>
        </div>
        <!-- 歌单 -->
        <div class="song-main">
            <div class="song-header">
              <h4>歌曲列表 <em>{{songList.length}}首歌</em></h4>
              <span class="play-all" @click="playAllSongs"><i class="iconfont icon-audio-play"></i> 播放全部</span>
              <span>收藏</span>
            </div>
            <!-- 歌单 -->
            <template v-if="isLoading">
              <Loading/>
            </template>
            <template v-else>
              <SongList :songList="songList"  :stripe="true" />
              <div class="showAllSongsTips" v-if="!isLogin">
                <span @click="logingDialog">登录后查看全部歌曲</span>
              </div>
            </template>
        </div>
     </div>
     <el-aside>
       相似歌单，开发中
     </el-aside>
  </div>
</template>

<!-- script -->
<script>
export default {
  name:''
}
</script>
<script  setup>
import SongList from '@/components/SongList.vue'
import Loading from '@/components/Loading.vue'
import { computed, onMounted , ref ,reactive } from '@vue/runtime-core'
import { useStore } from 'vuex';
import { getCurrentInstance ,toRefs } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useStore()
const { proxy } = getCurrentInstance()

// 是否登录
const isLogin = computed(()=> store.getters.isLogin)

// 数据
const info = reactive({
  id: '',    // 歌单id
  details: {},   // 歌单详细数据
  isShowDesc: false,  // 是否展示简介
  songList: [],     // 歌曲
  // collects: [],    // 收藏
  playlists: [],      // 播放数据
  // comments: [],       // 评论
  total: 0,             // 总数居条数
  isLoading: true,      // 是否加载完成
})
// 登录及未登录下获取歌曲的列表
const getDetail = async (params) => {
  info['isLoading'] = true
  const { data : res } =await proxy.$http.playlistdetail(params) 

  if(res.code !==200) {
    return proxy.$msg.error('数据请求失败')
  }
  info['details'] = res.playlist
  if(isLogin.value) { // 如果登录获取全部歌曲
    const ids = res.playlist.trackIds

    getAllSongs(ids)
  } else { // 否则只获取部分
    info['songList'] = proxy.$utils.formatSongs(res.playlist.tracks, res.privileges)
    
    info['total'] = info['songList'].length
    info['isLoading'] = false
  }
}
// 登录后根据ids获取所有歌曲列表
const getAllSongs = async(ids) => {
  const sliceArr = []
  const num = 500
  let idsArr = []

  // 数组过长 每500份一组
  for (let index = 0; index < ids.length; index += num) {
      sliceArr.push(ids.slice(index, index + num))
  }

  for (let i = 0; i < sliceArr.length; i++) {
      const arrs = []
      sliceArr[i].map(d => {
          arrs.push(d.id)
      });
      info['isLoading'] = true;
      const { data: res } = await proxy.$http.songDetail({ ids: arrs.join(','), timestamp: new Date().valueOf() + i })

      idsArr = idsArr.concat(proxy.$utils.formatSongs(res.songs, res.privileges))
  }

  info['songList'] = idsArr;
  info['total'] = idsArr.length;
  info['isLoading'] = false;
}


// 播放列表为当前歌单的全部歌曲
const playAllSongs = () => {
  store.dispatch('playAll', {
      list: info.songList
  });
  store.commit('SET_PLAYLISTTIPS', true);
}

const logingDialog = ()=>{
  console.log(1)
  store.commit('SETLOGINDIALOG' ,true) 
}
onMounted (()=>{
  info.id = route.query.id
  _initialize(info.id)   //初始化请求数据
})

const _initialize = (id) =>{
  getDetail( { id :id , s:8} )  //s为最近收藏者
}

// 解构
const {id,    
       details,
       isShowDesc,
       songList,
       playlists,
       total,
       isLoading} = toRefs(info)
</script>

<style lang="less" scoped>
.palylist-detail{
  display: flex;
}
.center-content{
  min-width: 560px;
}
.songlists-synopsis{
  display: flex;
  .cover_img{
    display: flex;
    align-items: center;
    width: 250px;
    height: 250px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    flex-shrink: 0;
  }
   
   /* 歌单信息 */
  .synopsis{
    flex: 1;
    margin-left: 20px;
    padding: 20px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    h5{
      flex: 1;
      font-size: 24px;
      font-weight: bold;
      height: 34px;
      line-height: 34px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
    .cover-digital {
      padding:  20px 0px;
    }
    .cover-playCount, .cover-collect, .cover-comment {
      display: inline-block;
      padding: 0 20px 5px 0;
      line-height: 16px;
      font-size: 14px;
      color: var(--color-text);

      i {
          vertical-align: top;
      }
    }




    .cover-desc {
    position: relative;

    h5 {
        padding: 30px 0 5px;
        line-height: 20px;
        font-size: 14px;
        color: #333;
    }

  .cover-desc-all {
    line-height: 22px;
    font-size: 14px;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
    word-break: break-all;
    cursor: pointer;
  }
}
  }
}

/* 歌曲列表 */
.song-header {
    display: flex;
    padding: 30px 0 10px;

    h4 {
        flex: 1;
        font-size: 20px;
        line-height: 40px;

        em {
            display: inline-block;
            padding-left: 10px;
            font-size: 12px;
            line-height: 14px;
            font-style: normal;
            font-weight: normal;
            color: #666;
            vertical-align: baseline;
        }
    }

    span {
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        cursor: pointer;
        margin: 5px 0 5px 15px;
        transition: all .4s;
        background: #f0f0f0;
        color: #333;

        i {
            margin-right: 3px;
        }
    }

    .play-all {
        color: #fff;
        background: var(--color-text-height);

        i {
            color: #fff;
        }
    }

    .collect.active, .collect.active i {
        color: var(--color-text-height);
    }
}

.showAllSongsTips {
    text-align: center;
    padding: 40px 0;

    span {
        display: inline-block;
        display: flex;
        line-height: 16px;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        padding: 7px 20px;
        color: #fff;
        background: var(--color-text-height);
        cursor: pointer;
    }
}

.song-main{
  padding: 20px 20px 30px 20px;
}

.el-aside{
  widows: 350px;
  background-color: aqua;
}

</style>