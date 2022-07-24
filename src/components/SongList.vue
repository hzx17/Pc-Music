<!-- html -->
<template>
  <!--   -->
  <div class='songs-list-main'>
    <div class="list-header flex">
      <div class="columnIndex">序号</div>
    <div class="columnSong">歌曲</div>
    <div class="columnSinger">歌手</div>
    <div class="columnIndex">时长</div>
    </div>
  </div>
  <!-- scolll -->
  <div class="list-scroll" :style="{ height : height + 'px'}" ref="curSongRef">
    <!-- 歌曲item -->
    <div class="list-main" :style="curSongSty" >
      <div  :class="isCurSong(item, index)" v-for="(item,index) in list" :key="item.id">
          <!-- 序号 -->
          <div class="columnIndex">
            <span class="songlist-index">{{indexMethod(index)}}</span>
            <div class="audio-icon">
              <div class="column" style="animation-delay: -1.2s;"></div>
                <div class="column"></div>
                <div class="column" style="animation-delay: -1.5s;"></div>
                <div class="column" style="animation-delay: -0.9s;"></div>
                <div class="column" style="animation-delay: -0.6s;"></div>
            </div>
            <i :class="playIcon(item)" @click="currentSong(item)"></i>
          </div>
          <div class="columnSong songlist-name">
            <span class="normal"></span>
            <router-link :class="typeSize" :to="{ path: '/song', query: { id: item.id }}">
                {{ item.name }}
            </router-link>
            <template v-if="typeSize !== 'mini'">
              <router-link class="mv-name" :to="{ path: '/mvlist/mv', query: { id: item.mvId }}" v-if="item.mvId">
                  <i class="iconfont icon-mv"></i>
              </router-link>
              <i v-if="item.vip" class="iconfont icon-vip"></i>
            </template>
          </div>
          <div class="columnSinger songlist-singer">
            <span class="song_name"></span>
            <!--- 返回的数据里用户的uid有可能为0 --->
            <span class="song_name" v-for="(author, k) in item.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</span>
          </div>
          <div class="columnTime">
            <div class="songlist-time">
                {{item.duration}}
            </div>
          </div>
      </div>
      <!-- 分页 -->
      <div class="pagination" v-if="isShowPagination">
        <el-pagination
            @current-change="currentChange"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="songList.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<!-- script -->
<script>
export default {
  name:'SongList',
}
</script>
<script  setup>
import {computed, onMounted , watch, nextTick,  reactive, ref} from 'vue'
import { useStore } from 'vuex';

const props = defineProps({
  songList : { //歌曲列表
    type: Array ,
    require : true
  },
  typeSize : { // 播放展示类型
    type: String ,
    default :'normal'
  },
  stripe : { // 隔行变色
    type : Boolean,
    default : false
  },
  height : {
    type: [Number ,String] ,
    default : 'auto'
  },

  // 分页加载 || 无限滚动 
  isScroll : {
    type : Boolean ,
    default :false 
  },
  offset :{ // 若是分页偏移量
    type : Number ,
    default:0
  },
  pageSize : { //若是有列表分页，偏移量
    type : Number,
    default: 20 
  }
})

// 获取ref当前组件
const curSongRef = ref (null)
const store = useStore()

// 数据
const info = reactive({
  typeSize :props.typeSize,  //展示类型
  height : props.height,    //高度
  curScroll : -1 || 1 ,  // 滚动距离 
  pageSize: props.pageSize, // 分页数量
  currentPage: 1,       // 当前所在页
  playing: false,       // 当前播放
  timer:null       // 定时器
})

// 获取播放列表
const playList = computed(() =>store.getters.playList)
const isPlayed = computed(() => store.getters.isPlayed)

onMounted(() => {
  scrollCurSong (curSongInfo)
})

// 获取歌曲列表
const list = computed(()=> {
  if(!props.isScroll) { // 不分页加载数据
    return props.songList.slice((info.currentPage -1) * info.pageSize, info.currentPage * info.pageSize)
  } else {
    return props.songList
  }
})

// 滚动样式
const curSongSty = computed(()=>{
  return `transform: translateY(${info.curScroll}px)`
})

// 表格序列化
const indexMethod = (page) =>{
  if(!props.isScroll) { // 分页
    return (info.currentPage - 1) * info.pageSize + page + 1 + props.offset
  } else {
    return page + 1
  }
}

// 列表样式
const isCurSong = computed(()=>{
  return (item,index) =>{
    return ['list-item', props.stripe ? (index % 2 === 0 ? 'stripe' : '') : '', isPlayed.value && (item.id === curSongInfo.value.id) ? 'active' : '']
  }
})

// 序号及播放状态
const playIcon = computed(() => {
  return (item) => {
      return ['iconfont', 'playicon', isPlayed.value && (item.id === curSongInfo.value.id) ? 'icon-pause' : 'icon-play']
  }
})


// 播放当前歌曲
const currentSong = (item) => {
  // 若当前唔歌曲 或者 当前播放歌曲不是本歌单显示的歌曲  立即播放当前歌单
  if (!curSongInfo.value || item.id !== curSongInfo.value.id) {
   store.dispatch('selectPlay', { list: [item] });
  } else {
    store.commit('SET_PLAYSTATUS', !isPlayed.value);
  }
}

// 添加当前歌曲到播放列表
const addSongList = (item) =>{
  store.dispatch('addList' , {list :[item]})
  store.commit('SET_PLAYLISTTIPS', true)
}

// 获取当前播放音乐信息
const curSongInfo = computed(()=>{
  return playList.value[store.getters.playIndex]
})

// 在播放列表删除当前歌曲
const delList = (index) => {
  if (playList.value.length > 1) {
    playList.value.splice(index, 1);
    store.commit('SET_PLAYLIST', playList.value);
  } else {
    store.commit('SET_PLAYSTATUS', false);
    store.commit('SET_PLAYLIST', []);
  }
}

// 滚动到当前播放音乐的位置
const scrollCurSong = (cur) => {
  if (props.isScroll) {
      
      const curIndex = props.songList.findIndex(item => {
          return item.id === cur.id
      })
      if (curIndex > 7 && curIndex < props.songList.length - 6) {
          info.curScroll = -(curIndex - 4) * 50
      } else if (curIndex >= (props.songList.length - 6) && props.songList.length - 6 > 0) {
          info.curScroll = -(props.songList.length - 6) * 50
      } else {
          info.curScroll = 0
      }
      const $curSongRef = curSongRef.value;
      $curSongRef.addEventListener('wheel', (event) => {
          if (event.wheelDelta > 0 || event.detail < 0) {
              info.curScroll = Math.abs(info.curScroll) > 0 ? info.curScroll + 50 : 0
          } else {
              info.curScroll = Math.abs(info.curScroll) < (props.songList.length - 6) / 2 * 100 ? info.curScroll - 50 : info.curScroll
          }
      }, {passive: true});
  }
}


const isShowPagination = computed(() => {
  return props.songList.length > info.pageSize && !props.isScroll
})

// 歌曲列表分页功能
const currentChange = (page) => {
  info.currentPage = page
}

watch(curSongInfo,val => {
      // 添加歌曲的时候，props的歌曲列表没有更新
      nextTick(() => {
          val && scrollCurSong(val);
      })
  }, { deep:true })

watch(() => {
  return props.songList
}, () => {
  info.currentPage = 1
})
</script>

<style lang="less" scoped>
.list-header {
  display: flex;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  color: #999;
}
.columnIndex {
  width: 80px;
  line-height: 50px;
  padding-left: 10px;
}
.columnSong {
  display: flex;
  flex: 2;
  width: 0;
  padding-right: 10px;
  overflow: hidden;
  align-items: center;
}
.columnSinger {
  flex: 1.5;
  width: 0;
  padding-right: 10px;
  overflow: hidden;
}
.columnTime {
  width: 100px;
  padding-right: 10px ;
  text-align: right;
}


.audio-icon {
    display: none;
    width: 20px;
    height: 18px;
    margin: 16px 2px;
    overflow: hidden;

    .column {
        width: 2px;
        height: 100%;
        margin-left: 2px;
        background-color: var(--color-text-height);
        -webkit-animation: play .9s linear infinite alternate;
        animation: play .9s linear infinite alternate
    }
}
.list-scroll {
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
    overflow-y: hidden;
}
.list-item {
  display: flex;
  line-height: 0;

  .iconfont {
    margin-left: 10px;
    font-size: 22px;
    cursor: pointer;
    vertical-align: middle;

    &:hover {
      color:var(--color-text-height)
    }
  }

  .icon-mv {
    font-size: 14px;
  }
  /* 歌曲序号 */
  .songlist-index {
    display: inline-block;
    width: 24px;
    text-align: center;
  }

  .playicon {
    display: none;
    margin-left: 0 ;
  }
 .songlist-name {
        a {
            display: inline-block;
            max-width: 80%;
            line-height: 50px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: top;
        }

        .mini {
            max-width: 100%;
        }

        i:hover {
            color: var(--color-text-height);
            cursor: pointer;
        }
    }

    .songlist-singer, .songlist-album {
        display: inline-block;
        max-width: 100%;
        line-height: 50px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-time {
        line-height: 50px;
        text-align: center;
    }

    .songlist-oper {
        display: none;
        line-height: 50px;
    }

    &.stripe {
        background: #FAFAFA;
    }

    &.active {
        background: #f0f0f0;

        .songlist-index, .playicon {
            display: none;
        }

        .audio-icon {
            display: flex;
        }

        &:hover {
            .playicon {
                display: block;
                color: var(--color-text-height);
            }
            .audio-icon {
                display: none;
            }
        }
    }

    &:hover {
        background: #f0f0f0;

        .songlist-time, .songlist-index {
            display: none;
        }

        .songlist-oper {
            display: flex;
            justify-content: flex-end;
        }

        .playicon {
            display: block;
        }
    }

    .icon-vip {
        font-size: 30px;
        color: var(--color-text-height);
    }

    &.disable {
        color: #ccc;

        a {
            color: #ccc;
        }

        .playicon, .songlist-oper {
            display: none;
        }

        .songlist-index, .songlist-time {
            display: block;
        }
    }

    &.vip {
        color: var(--color-text-height);

        a {
            color: var(--color-text-height);
        }
    }
}

.song-list {

    .songlist-singer {
        display: inline-block;
        width: 100px;
        height: 23px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-name {
        width: 210px;

        a {
            display: inline-block;
            max-width: 185px;
            height: 23px;
            margin-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        i:hover {
            color: var(--color-text-height);
            cursor: pointer;
        }
    }

    .songlist-album {
        display: inline-block;
        width: 95%;
        height: 23px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .songlist-oper {
        display: none;

        .iconfont {
            margin-left: 15px;
            font-size: 22px;
            cursor: pointer;

            &:hover {
                color: var(--color-text-height);
            }
        }
    }
}
.pagination {
    padding: 30px 0;
    text-align: center;
}

@-webkit-keyframes play {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0)
    }

    to {
        -webkit-transform: translateY(75%);
        transform: translateY(75%)
    }
}

@keyframes play {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0)
    }

    to {
        -webkit-transform: translateY(75%);
        transform: translateY(75%)
    }
}
</style>