<template>
    <div class="search">
        <el-select
            v-model="keyVal"
            class="keyVal"
            clearable
            filterable
            remote
            placeholder="请输入歌名、歌词、歌单名"
            :remote-method="remoteMethod"
            :fit-input-width="true"
            :loading="loading"
            loading-text="搜索中..."
            @focus="handleFocus"
        >
            <div class="hot-search" v-if="!keyVal">
                <h5>热门搜索</h5>
                <el-option
                    v-for="(item, index) in serachHot"
                    :key="index"
                    :label="item.first"
                    :value="item.first"
                    @click="jumpSearch(item)"
                >
                    <span :class="[ index < 3 ? 'top-' + index : '']">{{(index + 1) + '.'}}</span>
                    {{item.first}}
                </el-option>
            </div>
            <el-option-group v-else
              v-for="list in suggestInfo"
              :key="listType[list.label]"
              :label="listType[list.label]"
            >
                <el-option v-for="(item,index) in list.info"
                         :key="list.label +index"
                         :label="item.name"
                         :value="list.label + item.name"
                         @click="toSongPage(list.label,item)"
                >
                {{item.name}}
                    <template v-if="list.label === 'songs'">
                        -  <span class="artists" v-for="(a, i) in item.artists" :key="i">{{(i !== 0 ? ' / ' : '') + a.name}}</span>
                    </template>
                    <template v-else-if="list.label === 'albums'">
                        -  <span class="artists">{{item.artist.name}}</span>
                    </template>
                </el-option>
            </el-option-group>
        </el-select>
    </div>
</template>
<script setup>
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const info = reactive({
    keyVal: '',   // 输入关键词
    serachHot: [],
    suggestInfo: [],
    loading: false,
    listType: {
        songs: '单曲',
        artists: '歌手',
        albums: '专辑',
        playlists: '歌单'
    },
});

// 远程搜索的方法
const remoteMethod = (query) => {
    info['keyVal'] = query;

    if (info['keyVal']) {
        info['loading'] = true
        info['suggestInfo'] = []
        
        getSearchSuggest()
    }
}

//搜索框，获取焦点时，请求搜索列表接口
const handleFocus = () => {
  if(info.keyVal) {
    info.loading = true
    info.suggestInfo = [] 

    getSearchSuggest() // 调用请求搜索结果
  }
}

// 热门搜索 在apis文件中封装了一个名为searchHot的接口
const getSearchHot = async() => {
    const { data: res } = await proxy.$http.searchHot()

    if (res.code !== 200) {
        return proxy.$msg.error('数据请求失败')
    }

    info.serachHot = res.result.hots
}
// 点击热门搜索列表，将值赋值给keyVal
const jumpSearch = (item) =>{
  info.keyVal = item.first
}

// 搜索结果 在apis文件中封装了一个名为searchSuggest的请求接口，需要传入keywords（关键词的参数）
const getSearchSuggest = async() => {
  const {data:res} = await proxy.$http.searchSuggest({keywords:info.keyVal})
  info.loading = false 
  if(res.code !==200) {
    return proxy.$http.error('数据请求失败')
  }
  // 结果不为空
  if(res.result.order) {
    info.suggestInfo = res.result.order.map(item =>{
      return {
        label:item ,
        info:res.result[item]
      }
    })
  }
}

// 搜索跳转
const toSongPage = (label,item)=>{
  console.log(11)
  if(label =='songs'){
    router.push({name:'song' ,query:{id:item.id}})
  }
  else if(label == 'playlists'){
    router.push({name:'playlistdetail' ,query:{id:item.id}})
  }
}

// 挂载时请求热门搜索 getSearchHot
onMounted(() => {
  getSearchHot()
})

const {keyVal,
      serachHot,
      suggestInfo,
      loading,
      listType} =   toRefs(info)
</script>
<style>
.el-select-dropdown__wrap {
    max-height: 400px;
}
</style>
<style lang="less" scoped>
.search {
    position: relative;
    display: flex;
    text-align: right;
    align-items: center;
    border-bottom: 1px solid #999;
    background: #fff;

    .keyVal {
        width: 250px;
        border: 0;

        :deep(input) {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            border: none;
        }
    }
}
.hot-search {
    h5 {
        padding: 5px 0 5px 20px;
        font-size: 18px;
    }

    .top-0 {
        font-weight: bold;
        color: rgba(255, 0, 0, 1);
    }

    .top-1 {
        font-weight: bold;
        color: rgba(255, 0, 0, .6);
    }

    .top-2 {
        font-weight: bold;
        color: rgba(255, 0, 0, .4);
    }
}

.item {
    padding-right: 20px;

    &.selected {
        color: var(--color-text-height);

        .artists {
            color: var(--color-text-height);
        }
    }
}
</style>