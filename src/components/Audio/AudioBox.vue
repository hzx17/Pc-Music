<!-- html -->
<template>
  <div>
    <audio 
      v-if="curSongInfo"
      preload="auto" 
      ref="myAudio"
      @canplay="canplaySong"
      @playing="playSong"
      @ended="endedSong"
      @error="errorSong"
      @timeupdate="updateSongTime"
      :src="curSongInfo.url">
    </audio>
  </div>
</template>

<!-- script -->
<script>
import { reactive } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
import { watch , ref ,  nextTick} from 'vue';
export default {
  name:'AudioBox'
}
</script>
<script  setup>
const store = useStore()
const info = reactive({
  initAudioReady :false , // 初始化音频准备
  playMode: 0,   // 播放模式
})
const emit =defineEmits(['setCurrentTime',])
// 获取播放列表
const playIndex = computed(() => store.getters.playIndex)
const playList = computed(()=> store.getters.playList)
const isPlayed = computed(()=> store.getters.isPlayed)

// 获取当前播放歌曲信息
const curSongInfo = computed (()=> playList.value[playIndex.value])
const myAudio = ref(null)

// 音乐播放，上一首、下一首、播放、暂停
const playAudioType = (type) => {
  if(type === 'play') {
    store.commit('SET_PLAYSTATUS' , !isPlayed.value)
    store.commit('SET_PLAYINDEX' ,playIndex.value)
  } else {
    changeSong(type)
  }
}

// 播放模式： 随机播放、循环、单曲
const playAudioMode = (type) =>{
  info['playMode'] = type
}

// 音量静音及取消操作
const setVolumeHandler = (Volume) =>{
  const $myAudio = myAudio.value
  $myAudio.muted = Volume
}


const setvolumeProgress = (val) =>{
  const $myAudio = myAudio.value
  $myAudio.volume = val 
  $myAudio.muted = val ? 0 : 1
}

// 点击拖拽进度条，设置当前事件
const setAudioProgress = (t) =>{
  const $myAudio = myAudio.value
  $myAudio.currentTime = t
}

//  解决刷新页面时，音频准备就绪
const canplaySong = (e) =>{
  info['initAudioReady'] = true
}

// 音频播放的时候 初始化状态 获取音频总时长
const playSong = (e)=>{
  info['initAudioReady'] = true
  store.commit('SET_PLAYSTATUS' , true)
}

// 音频结束后自动播放下一首
const endedSong = (e) => {
  if(info['playMode'] ===1 ){
    loopSong()
  } else {
    changeSong('next')
  }
}

// 手动切换歌曲
const changeSong = (type)=>{ // type :prev/next
  if(playList.value.length !==1) {  // 播放列表中不只有一首歌
    let index =playIndex.value
    if(info['play12Mode'] ===2) { //随机模式
      index = Math.floor(Math.random() * playList.value.length -1) + 1 
    } else {
      if (type = 'prev') {
        index = index === 0 ? playList.value.length -1 : --index
      } else {
        index = index >=playList.value.length -1 ? 0 : ++index
      }
    }
    info['initAudioReady'] = false
    // emit('setCurrentTime', 0)
    store.commit('SET_PLAYSTATUS', isPlayed.value)
    store.commit('SET_PLAYINDEX', index)
  } else {  // 只有一首歌
    loopSong()
  }
}

// 单曲循环
const loopSong = () => {
  const $myAudio = myAudio.value

  $myAudio.currentTime = 0
  $myAudio.play()  // 重新播放
  store.commit('SET_PLAYSTATUS', true)
}

// 监听音频时间，实时更新当前播放时间
const updateSongTime = (e) =>{
  if(!info.initAudioReady) {
    return
  }
  emit('setCurrentTime', e.target.currentTime)
}

// 公开方法
defineExpose({
  playAudioType,
  playAudioMode,
  setVolumeHandler,
  setvolumeProgress,
  setAudioProgress,
  canplaySong,
  playSong,
  endedSong,
  updateSongTime
})
// 监视当前音乐的改变
watch(curSongInfo ,(newSong,oldSong) => {
  if(!newSong){
    return
  }
  info['initAudioReady'] = false 
  info['currentTime'] = 0
  emit('setCurrentTime', 0)
  nextTick(() => {
    const $myAudio = myAudio.value;

    if ($myAudio) {
      isPlayed.value ? $myAudio.play() : $myAudio.pause()
    }
  })
})

watch(() => isPlayed.value, (playing) => {
  // 等待音频加载成功完成后播放
  if (!info.initAudioReady) {
      return
  }
  nextTick(() => {
      const $myAudio = myAudio.value;

      if ($myAudio) {
          playing ? $myAudio.play() : $myAudio.pause()
      }
  })
})
</script>

<style lang="less" scoped>
</style>