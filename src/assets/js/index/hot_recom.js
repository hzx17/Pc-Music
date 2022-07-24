import { getCurrentInstance, reactive, onMounted } from 'vue';

export default function hot_recom() {
    const { proxy } = getCurrentInstance();

    // -------------- 推荐歌单
    // 热门推荐歌单
    const playlist_info = reactive({
        playlist_tags: [],  // 歌曲分类
        playlist_list: [],  // 推荐歌曲列表
        playlist_index: 0,  // 当前激活样式
        playlist_params: { limit: 6, offset: 0 }, //获取数据限制在六条,分页为0
        playlist_count: 6, //数据推荐总量
        playlist_loading: true // 是否加载中
    });

    // 获取热门推荐歌单标签
    const getHotTags = async() => {
        const { data: res } = await proxy.$http.hotList()

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        res.tags.unshift({ name: '为您推荐' })
        playlist_info['playlist_tags'] = res.tags.splice(0, 6);
    }
    // 切换歌单类别
    const choosePlayListType = (index) => {
        playlist_info['playlist_index'] = index; 
        playlist_info['playlist_params']['cat'] = index !== 0 ? playlist_info['playlist_tags'][index].name : ''; //将分类名传入params的cat参数
        playlist_info['playlist_loading'] = true;
        getPlayList(playlist_info['playlist_params']);
    }

    // 分类歌单列表
    const getPlayList = async(params) => {
        const { data: res } = await proxy.$http.playList(params)

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        playlist_info['playlist_list'] = res.playlists;
        playlist_info['playlist_loading'] = false;
    }
    // 挂载时请求热门歌单分类与歌单列表，limit限制在六条
    onMounted(() => {
      getHotTags();
      getPlayList(playlist_info['playlist_params']);
    });

    return {
        playlist_info,
        getHotTags,
        choosePlayListType
    }
}