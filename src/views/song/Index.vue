<!-- html -->
<template>
  <div v-if="songInfo" class='song-container'>
    <div class="song-main">
      <div class="song-header">
        <div class="song-l">
          <!-- 歌曲信息 -->
          <div class="song-info">
            <h3 class="music-title">{{songInfo.name}}</h3>
            <div class="artist-info" >
              <span v-for="(author, k) in songInfo.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</span>
            </div>
            <p class="album-info">
              <span class="ablum-span">专辑:&nbsp;<em>{{songInfo.album.name }}</em></span>
              <span>发行时间:&nbsp;<em>{{songInfo.publishTime}}</em></span>
            </p>
            <div class="cover-desc" v-if="coverDesc" >
               <h5>专辑简介</h5>
               <p>{{coverDesc}}</p>
            </div>
            <!-- 播放按钮,收藏按钮,评论按钮 -->
            <div class="info-bottom">
              <div class="song-oper">
                <span class="play-btn"  @click="playing(songInfo)"><i :class="['iconfont', playFontIcon]"></i> {{songInfo.vip ? 'VIP尊享' : '立即播放'}}</span>
                <span class=" play-collect"><i class="iconfont icon-collect"></i>收藏</span>
                <span class=" play-comment"><i class="iconfont icon-comment"></i> 评论</span>
              </div>
            </div>
          </div>
          <!-- 相似歌曲 -->
          <div class="song-similarity">
            <div class="title"><span>相似歌曲</span></div>
            <div class="similarity-content">
              <li v-for="item in similarityInfo" :key="item.id">
                <router-link :to="{ path: '/song', query: { id: item.id }}">
                  <div class="li-name">{{item.name}}</div>
                  <div class="li-singer" >
                     <span 
                        v-for="(author, k) in item.singer" 
                        :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</span>
                  </div>
                </router-link>
                <div class="simi-song-status">
        
                    <i  @click="playing(item)" :class="['iconfont', playSimiIcon(item)]"></i>
                    <i class="iconfont icon-add" title="添加到列表"></i>
                </div>
              </li>
            </div>
          </div>
        </div>
        <!-- 歌曲词 -->
        <div class="song-lyric">
          <h5>歌词</h5>
          <Lyrics :sId="sId"  maxH='600' />
        </div>
      </div>
      <!-- 评论 -->
      <div class="song-comments">
        评论组件，开发中
      </div>
    </div>
    <el-aside>
      <div class="cover">
        <em class="lt"></em>
        <em class="rt"></em>
        <em class="rb"></em>
        <em class="lb"></em>
        <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="playing(songInfo)">
            <img src="../../../src/assets/img/stylus.png" class="cover-stylus" />
            <el-image :src="songInfo.album.picUrl">
            </el-image>
        </div>
      </div>
      <!-- 相似歌单 -->
      <div class="seim_box"></div>
    </el-aside>
  </div>
</template>

<!-- script -->
<script>
import Lyrics from '@/components/Lyrics.vue'
export default {
  name:'Song-Index'
}
</script>
<script  setup>
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { getCurrentInstance, ref, reactive, onMounted , computed , toRefs,  onUpdated} from 'vue';
const { proxy } = getCurrentInstance();   // 获取当前组件实例         
const route = useRoute()
const store = useStore()                 
const info = reactive({
  songInfo: null,  //歌曲详细信息
  similarityInfo:null , //相似歌曲
  coverDesc: '', //专辑简介
  sId:0, // 歌曲的ID
  commentType: 0, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
})
const isLogin = computed(() => store.getters.isLogin);
const isPlayed = computed(() => store.getters.isPlayed);
const playList = computed(() => store.getters.playList);
const playIndex = computed(() => store.getters.playIndex);
const curSongInfo = computed(() => playList.value[playIndex.value]);

// 是否为当前歌曲
const isCurSong = computed(() => isPlayed.value && curSongInfo.value && curSongInfo.value.id === info.sId);
// 返回当前播放状态样式
const playFontIcon = computed(() => isCurSong.value ? 'icon-audio-pause' : 'icon-audio-play');
// 获取歌曲详情
const getSongDetail = async () => {
  const { data: res } = await proxy.$http.songDetail({ ids: info.sId, timestamp: new Date().valueOf() })
  if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
  }
  info['songInfo'] = proxy.$utils.formatSongs(res.songs, res.privileges)[0]
  info['coverDesc'] = info['songInfo'].alia.join(' / ')
}
// 获取相似歌曲
const getSongSimilarity = async ()=> {
  const { data: res } = await proxy.$http.songSimilarity({ id: info.sId})
  if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
  }
  info['similarityInfo'] = res.songs.map(item => {
          return {
              id: String(item.id),
              name: item.name,
              mvId: item.mvid,
              singer: item.artists,
              album: item.album,
              alia: item.alias,
              duration: proxy.$utils.formatSongTime(item.duration),
              url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
              vip: item.fee === 1,
              license: item.license,
              publishTime: item.publishTime
          }
      })
}

const playSimiIcon = computed(() => {
  return function (item) {
    return curSongInfo.value && (String(item.id) === curSongInfo.value.id) && isPlayed.value ? 'icon-audio-pause' : 'icon-audio-play'
  }
})
// 播放按钮
const playing = (params) =>{
  // 若当前唔歌曲 或者 当前播放歌曲不是本页显示的歌曲  立即播放当前页面歌曲
  if (!curSongInfo.value || curSongInfo.value.id !== params.id) {
      // 无版权及vip不可播放
      if (params.license) {
          proxy.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
          return
      }
      if (params.vip) {
          proxy.$msg.error('付费歌曲，请在网易云音乐播放')
          return
      }
      store.dispatch('selectPlay',{ list : [params]})
      store.commit('SET_PLAYLISTTIPS',true)
  }else{
    // 将播放状态改变
    store.commit('SET_PLAYSTATUS' ,!isPlayed.value)
  }
}
// 将传来的query参数设置给sId
onMounted(() => {
  info['sId'] = route.query.id;
  init()
})
// 路由更新时，重新加载
onBeforeRouteUpdate((to) => {
  info['sId'] = to.query.id;
  init()
})
/* 初始化请求数据 */
const init = () => {
  if (info['sId']) {
    getSongDetail()
    getSongSimilarity()
  }
}
// 解构
const {coverDesc,songInfo,similarityInfo,sId} = toRefs(info)
</script>

<style lang="less" scoped>
.song-container{
  display: flex;
  padding: 30px;
}
.song-main {
    flex: 1;
}
.song-header {
    display: flex;
    min-width: 640px;
}
.song-l {
  flex: 1;
  // background: #bfd;
  box-sizing: border-box;
  .song-info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    height: 270px;
    margin: 0 20px 20px 0;
    background-color: #fff;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    border-radius: 6px;
    .music-title{
      font-size: 30px;
      line-height: 40px;
      padding-bottom: 20px ;
    }
    .artist-info{
      font-size: 16px;
      color: var(--color-text);
      padding-bottom: 10px;
    }
    .album-info{
      padding: 10px  0 20px 0;
      .ablum-span{
        padding-right: 20px ;
      }
      span{
        font-size: 14px;
        color: var(--color-text);
      }
      em{
        font-size: 14px;
        color: var(--color-text-main);
      }
    }
    .cover-desc{
      h5{
       font-size: 14px;
       font-weight: 200;
       line-height: 20px;
       color: var(--color-text);
      }
      p{
        line-height: 20px;
        font-size: 14px;
        color: var(--color-text-main);
      }
    }
  }
}
/* 播放，收藏，评论按钮 */
.info-bottom{
  font-size: 14px;
  padding: 30px 0 0 0;
  color: var(--color-text-main);
  .play-btn{
    font-size: 14px;
    border-radius: 15px;
    margin-right: 10px;
    box-sizing: border-box;
    line-height: 30px;
    cursor: pointer;
    i{
      color: #fff;
      margin-right: 5px;
    }
    background-color: var(--color-text-height);
    padding: 8px 12px;
    margin-right: 10px;
    color: #fff;
  }
  .play-collect{
     padding: 8px 5px;
     cursor: pointer;
    i{
      margin-right: 5px;
    }
  }
  .play-comment{
    padding: 8px 5px;
    cursor: pointer;
    i{
      margin-right: 5px;
    }
  }
}
/* 相似歌曲 */
.song-similarity{
  height: 270px;
  padding: 20px;
  margin:  0 20px 20px 0;
  .title{
    border-left: 4px solid var(--color-text-height);
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    span{
      margin-left: 5px;
      color: var(--color-text-main);
    }
  }
  li{
    padding-top: 8px;
    list-style: none;
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .li-name{
       line-height: 23px;
       cursor: pointer;
    }
    .li-singer{
      cursor: pointer;
      line-height: 23px;
      color: var(--color-text);
    }
    i{
      line-height: 54px;
      cursor: pointer;
      font-size: 18px;
    }
    .icon-add{
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
.song-lyric {
    flex: 1;
    padding: 20px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    border-radius: 6px;
    text-align: center;
    h5 {
        font-size: 16px;
        padding: 15px 0;
    }
}


.el-aside{
  width: 360px;
}

.cover {
    position: relative;
    display: inline-block;
    padding: 20px 40px;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    border-radius: 6px;

    em {
        position: absolute;
        display: inline-block;
        padding: 10px;
        border-radius: 100%;
        border: 1px solid #fff;
        background: #fafafa;
        box-shadow: 0 2px 7px rgb(0 0 0 / 10%) inset;

        &::before {
            position: absolute;
            top: 6px;
            left: 6px;
            display: inline-block;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 100%;
            background: #ddd;
            box-shadow: 0 2px 7px rgb(0 0 0 / 10%);
        }
    }

    .lt, .lb {
        left: 10px;
    }

    .rt, .rb {
        right: 10px;
    }

    .lt, .rt {
        top: 10px;
    }

    .lb, .rb {
        bottom: 10px;
    }

}
.cover-img {
    position: relative;
    width: 190px;
    padding: 40px;
    font-size: 0;
    background: url('@/assets/img/disc.png') no-repeat;
    background-size: contain;
    cursor: pointer;

    .cover-stylus {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        display: inline-block;
        width: 30px;
        height: 120px;
        transition: all .3s;
        transform-origin: 23px 5px;
        transform: rotateZ(-25deg);
    }

    .el-image {
        width: 190px;
        height: 190px;
        border-radius: 100%;
        animation: soundPaying 15s linear infinite;
        animation-play-state: paused;
    }

    &.active {
        .cover-stylus {
            transform: rotateZ(0);
        }

        .el-image {
            animation-play-state: running;
        }
    }
    .iconfont {
        position: absolute;
        z-index: 3;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
    }
}
@keyframes soundPaying {
    from {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg)
    }

    to {
        -webkit-transform: rotate(370deg);
        transform: rotate(370deg)
    }
}

/* 评论组件 */
.song-comments{
  background-color: var(--color-text-height);
  height: 400px;
}
</style>