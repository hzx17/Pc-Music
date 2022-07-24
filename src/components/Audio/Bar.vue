<!-- 底部播放 -->
<template>
  <div :class="info.lockName =='active' ? 'play-bar  active' : 'play-bar'"
   v-if="curSongInfo"  @mouseenter="enterBar($event)" @mouseleave="leaveBar($event)">
    <!-- 固定播放条按钮 -->
    <div class="fold">
      <div class="fold-btn" @click="lockBar">
       <i class="iconfont icon-lock" :class="info.isLock ? 'active' : ''" > </i></div>
    </div>
    <!-- 播放进度条 -->
    <ProgressLineBar :progressWidth="audioProgressWidth" @setProgressLine="setAudioProgress" />
   <!-- 播放容器 -->
   <div class="wrapper">
     <div class="play-bar-inside">
      <!-- 左侧描述 -->
      <div class="bar-left">
        <router-link :to="{ path: '/song', query: { id: curSongInfo.id }}">
          <div class="img-song">
            <el-image :src="curSongInfo.album.picUrl" class="bar-cover-img">
            </el-image>
          </div>
        </router-link>
        <router-link :to="{ path: '/song', query: { id: curSongInfo.id }}">
          <div class="bar-name">
            <p class="song-name">{{curSongInfo.name}}</p>
            <p >
                <span 
                  v-for="(author, k) in curSongInfo.singer" 
                  :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</span>
            </p>
          </div>
        </router-link>
        <div class="song-time">
          <span>{{$utils.formatSongTime(info.currentTime * 1000)}}&nbsp;/&nbsp; {{curSongInfo.duration}}</span>
        </div>
      </div>
      <!-- 中间播放 -->
      <div class="bar-center">
        <div class="bar-control">
          <i class="iconfont icon-audio-prev" title="上一首" @click.stop="audioHandler('prev')"></i>
          <i :class="['iconfont' , playIcon ]" @click.stop="audioHandler('play')" ></i>
          <i class="iconfont icon-audio-next" title="下一首" @click.stop="audioHandler('next')"></i>
        </div>
      </div>
      <!-- 右侧工具栏 -->
      <div class="bar-right">
        <div class="bar-oper">
          <!-- 音量 -->
          <div class="volume-main">
            <i :class="['iconfont', mutedIcon]" title="音量" @click.stop="volumeHandler"></i>
            <ProgressLineBar 
                :progressWidth="volumeProgressWidth"
               @setProgressLine="setvolumeProgress"
               class="volumeLine">
            </ProgressLineBar>
          </div>
          <!-- 切换播放模式按钮 -->
          <i :class="modeIcon.className" 
          :title="modeIcon.title"
           @click.stop="changePlayMode"></i>
          <!-- 工具栏 -->
          <div class="popver" >
            <!-- 气泡卡片 -->
            <el-popover placement="top" :width="400" trigger="click" v-if="lockName =='active'">
                <template #reference>
                    <div class="lyric">
                        <span class="lyric-btn" title="歌词">词</span>
                    </div>
                </template>
                <div class="lyrics-container">
                    <h3 class="lyrics-header">
                        <span>歌词</span>
                        <i class="iconfont icon-closed" @click="popverClose"></i>
                    </h3>
                    <lyrics :sId="curSongInfo.id" :currentTime="currentTime"></lyrics>
                </div>
            </el-popover>

            <el-popover placement="top" :width="550" trigger="click" @hide="popverClose"  v-if="lockName =='active'">
                <template #reference>
                    <div class="playlist">
                        <!-- <span class="tips" >已添加到播放列表</span> -->
                        <i class="iconfont icon-playsong" title="播放列表"></i>
                        <div class="playlist-num">{{playList.length}}</div>
                    </div>
                </template>
                <div class="playlist-container" >
                  <h3 class="playlist-header">
                      <span>播放列表<em>(共{{playList.length}}首)</em></span>
                      <div class="delSonglist" @click="delSonglist" ><i class="iconfont icon-del" title="清空列表"></i>清空列表</div>
                  </h3>
                   <SongList :isScroll="true" :height="300"  :songList="playList" />
                </div>
            </el-popover>

            <i class="iconfont icon-pip"></i>
            <i class="iconfont icon-m"></i>
          </div>
        </div>
      </div>
     </div>
   </div>
  </div>
</template>


<script>
export default {
  name:'Bar'
}
</script>

<script  setup>
import {computed, getCurrentInstance, getCurrentScope, toRefs , inject, onBeforeMount, onMounted, reactive, ref} from 'vue'
import ProgressLineBar from '@/components/ProgressLineBar.vue';
import SongList from '../SongList.vue'
import { useStore } from 'vuex';

const store = useStore() 
const {proxy} = getCurrentInstance() 

const emit = defineEmits(['setVolumeHandler','setvolumeProgress','audioHandler','setAudioProgress','playAudioMode'])
// 歌曲信息
const info = reactive({
  // 歌词弹窗时固定播放条
  isLock : false ,
  locked : false,
  lockName: 'active' ,
  manual :true ,

  currentTime :inject('currentTime') , //音频时长
  isMuted :false , // 是否静音
  playMode: 0, // 播放模式 ，0循环播放，1单曲循环，2随机播放
  volumeNum: 1, //音量值
  oldVloume: 0 ,  //取消静音时保存上一次的音量值
  isPip :false ,
  timer : null ,
  tipsTimer: null
})


onMounted(() => {
  leaveBar()
  store.commit('SET_PLAYLIST', playList.value) // 将歌曲存入仓库列表
})

onBeforeMount(() => {
  clearTimeout(info.timer)
  clearTimeout(info.tipsTimer)
})

// 获取播放列表
const playIndex = computed (() => store.getters.playIndex)
const playList = computed(() => store.getters.playList)
const isPlayed = computed (() => store.getters.isPlayed)

// 添加到播放列表后，弹窗tips提示
const isShowPlayListTips = computed(()=> {
  let val = store.getters,isShowPlayListTips  // 是否弹窗提示

  if(val) {
    clearTimeout(info.tipsTimer)

    info.tipsTimer = setTimeout(() => {
      store.commit('SET_PLAYLISTTIPS',false)  
    }, 3000);
  }

  return val
})

// 获取当前歌曲信息
const curSongInfo = computed(() => playList.value[playIndex.value])

// 播放暂停按钮
const playIcon = computed(() => {
  return !isPlayed.value ? 'icon-audio-play' : 'icon-audio-pause'
})
        
// 返回播放模式图标
const modeIcon = computed(() => {
  const params = [
    {
      className:'iconfont icon-loop',
      title:'循环模式'
    },
    {
      className:'iconfont icon-single-cycle',
      title:'单曲循环'
    },
    {
      className: 'iconfont icon-shuffle',
      title:'随机播放'
    }
  ]
  return params[info.playMode] //根据info。palyMode下标来返回样式
})

// 切换播放模式
const changePlayMode = () => {
  info['playMode'] = info['playMode'] >= 2 ? 0 : info['playMode'] + 1

  emit('playAudioMode', info['playMode'])
}

// 返回进度条，长度比例
const audioProgressWidth = computed(() =>{
  return info['currentTime'] / proxy.$utils.formatSongSecond(curSongInfo.value.duration) * 100 + '%'
})

// 设置音频音量进度条
const volumeProgressWidth = computed(()=> {
  return info['volumeNum'] * 100 +'%'
})

// 音量静音与取消操作
const volumeHandler = () =>{
  info['isMuted'] = info['isMuted'] ? 0 : 1 // isMuted为是否静音，false，返回音量0
  info['isMuted'] && (info['oldVloume'] = info['volumeNum'])
  info['volumeNum'] = info['isMuted' ] ? 0 :info['oldVloume']

  emit('setVolumeHandler' ,info['isMuted'])
}

// 清空歌单
const delSonglist = ()=>{
  store.commit('SET_PLAYSTATUS', false);
  store.commit('SET_PLAYLIST', []);
  store.commit('SET_PLAYINDEX', 0);
}

// 拖拽音量条，设置当前音量
const setvolumeProgress = (params) => {
  info['volumeNum'] = params.val
  info['oldVloume'] = params.val
  info['isMuted'] = params.val ? 0 : 1

  emit('setvolumeProgress', params.val)
}

// 播放音量按钮
const mutedIcon = computed(()=>{
  return info['isMuted'] ? 'icon-volume-active' : 'icon-volume'
})

// 音频播放、暂停、上一首、下一首
const audioHandler = (type) =>{
  emit('audioHandler',type)

  if(info['ispip']) {
    changePipSong()
  }
}


// 点击拖拽进度条，设置当前时间
const setAudioProgress = (params)=> {
  info['initAudioReady'] = false
  info['currentTime'] = params.val *  proxy.$utils.formatSongSecond(curSongInfo.value.duration)

  // 拖拽的时候，不实时更改音频的时间
  if(params.flag) {
    emit('setAudioProgress',info['currentTime'])
  }
}

const changeMini = () => {
    emit('changeMini', 'MiniBar');
}

const popverHandle = () => {
    info['isLock'] = true;
}

const popverClose = () => {
    info['isLock'] = false;
    leaveBar()
}

// 鼠标移入
const enterBar = () => {
    clearTimeout(info.timer)
    info.lockName = 'active'
}
// 鼠标移出
const leaveBar = (e) => {
    // 点击锁住按钮，会触发mouseleave 事件 此时的e的值是 undefined  而正常通过鼠标移出的时候 e是个对象
    if (!info['isLock'] && !info['locked']) {
        clearTimeout(info.timer)
        info.timer = setTimeout(() => {
            info.lockName = info.isLock ? 'active' : ''
        }, 3000)
    }
}

//
const lockBar = () => {
    info.locked = !info.locked;
    info.isLock = info.locked;
    leaveBar();
}

// 清空播放列表
const clearSonglist = () => {
    store.commit('SET_PLAYSTATUS', false);
    store.commit('SET_PLAYLIST', []);
    store.commit('SET_PLAYINDEX', 0);
}


const actionHandlers = [['play', 'play'], ['pause', 'play'], ['previoustrack', 'prev'], ['nexttrack', 'next']];


// 解构
const {     
  isLock,
  locked,
  lockName,
  manual,
  currentTime, 
  isMuted, 
  playMode, 
  volumeNum, 
  oldVolume, 
  isPip,
  timer,
  tipsTimer } = toRefs(info)
</script>

<style lang="less" scoped>
.play-bar{
  position: fixed; // 粘滞定位
  bottom:82px;
  left: 0;
  z-index: 10;
  width: 100%;
  background: #fff;
  box-shadow: 0 -10px 20px -1px rgba(2,10,18,0.1);
  transition: all .4s ease-out; //出现与消失动画
  transform: translateY(100%);
  &.active {
     transform: translateY(200px);
  }
}

.fold {
  position: absolute; 
  top: -30px; // 相对于底部bar向上30px
  left: 0;
  z-index: 5;
  width: 100%;
  height: 30px;
  .fold-btn {
    position: absolute;
    right: 200px;
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #fff;
    border-radius: 50px 50px 0 0;
    box-shadow: 0 5px 40px -1px rgba(2,10,18,0.1);
    cursor: pointer;
    
    .active {
      color: var(--color-text-height);
    }
  }
}
.wrapper{
  min-width: 1100px;
  margin: 0 auto;
  height: 70px;
}
.play-bar-inside{
  display: flex;
  height: 70px;
  justify-content: space-around;
  align-items: center;
  /* 底部按钮左侧布局 */
  .bar-left{
    display: flex;
    width: 350px;
    align-items: center;
    justify-content: space-between;
  .bar-cover-img{
     width: 50px;
     height: 50px;
     cursor: pointer;
     border-radius: 4px;
   }
    .bar-name{
      width: 135px;
      padding: 0px 10px;
      cursor: pointer;
      box-sizing: padding-content;
    }
    p{
      line-height: 15px;
      font-size: 10px;
      color: var(--color-text);
    }
    .song-name{
      font-size: 12px;
      color: var(--color-text-main);
    }
    .song-time{
      width: 125px;
      color: var(--color-text);
      font-size: 14px;
    }
  }
   /* 中间控制 */
  .bar-control{
    display: flex;
    padding: 10px 0;
    line-height: 1;
    align-items: center;
    justify-content: center;
      .iconfont {
          margin: 0 20px;
          font-size: 30px;
          cursor: pointer;
          color: #666;
        }

    .icon-audio-play, .icon-audio-pause {
          font-size: 50px;
          font-weight: bold;
          color: var(--color-text-height);
        }
  }
  /* 右侧 */
  .bar-right{
    .bar-oper {
        position: relative;
        display: flex;
        // font-size: 0;
        line-height: 50px;
        padding-left: 30px;
        align-items: center;
        justify-content: center;
          .volume-main{
            display: flex;
            align-items: center;
          }
        .iconfont { 
            margin-left: 20px;
            font-size: 20px;
            cursor: pointer;
        }
    }
    .volumeLine {
        width: 150px;
        margin: 0 10px;
    }


    .popver {
      position: relative;
    }

    .lyric{
      display: inline-block;
      padding: 26px 0;
      margin-left: 15px;
      font-size: 18px;
      line-height: 18px;
      vertical-align: top;
      color: #999;
      cursor: pointer;
    }
    .playlist{
      position: relative;
      display: inline-block;
      margin-left: 15px;
      line-height: 70px;
      color: #999;
      cursor: pointer;
      .playlist-num{
        position: absolute;
        font-size: 10px;
        top: -15px;
        right: -5px;
      }
    }

    .icon-pip {
      cursor: pointer;
        &.active {
            color: var(--color-text-height)
        }
      }
  }

}

.lyrics-container  {
  text-align: center;
  // background-color: aqua;
  .lyrics-header{
    margin: 0 auto;
    
  }
}

.playlist-container{
  padding: 10px;
}
.playlist-header{
  padding:  0 20px;
  display: flex;
  justify-content: space-between;
  .delSonglist {
    cursor: pointer;
  }
}
</style>