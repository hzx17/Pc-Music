<template>
    <div>
        <div class="lyrics-main" :style="{maxHeight: maxH + 'px'}">
            <div class="lyrics" ref="lyrics" v-if="lyricObj.length" :style="transform">
                <p :class="[isCurLyric(index)]" v-for="(item, index) in lyricObj" :key="index">{{item.txt}}</p>
            </div>
            <div v-else class="lyric-empty">
                <p v-if="lyric">纯音乐，无歌词</p>
                <p v-else>歌词加载中......</p>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from '@vue/reactivity'
import { computed, getCurrentInstance, onMounted, watch } from '@vue/runtime-core';
export default {
    name:'lyrics',
    props: {
        sId: {
            type: [Number, String],
            default: 0
        },
        currentTime: {
            type: Number,
            default: 0
        },
        maxH: {
            type: [Number, String],
            default: 390
        }
    },
    setup(props) {
        const { proxy } = getCurrentInstance();
        const info = reactive({
            lyric: null, // 是否为纯音乐
            lyricObj: [],  // 歌词对象
            curIndex: 0,   // 当前行数
            isFull: false  // 
        });
        // d
        const isCurLyric = computed(() => {
            return (index) => {
                return index === info['curIndex'] && props['currentTime'] ? 'active' : '';
            }
        });

        // 歌词实时滚动
        const transform = computed(() => {
            if (info['curIndex'] > 6) {
                return `transform: translateY(-${30 * (info['curIndex'] - 6)}px)`;
            } else {
                return 'transform: translateY(0)';
            }
        });
        // 获取歌词
        const  getLyrics = async (id) => {
            const { data: res } = await proxy.$http.lyrics({ id: id })

            if (res.code !== 200) {
                return proxy.$msg.error('数据请求失败')
            }
            // 数据格式例（"[00:00.000] 作词 : 齐飞\n[00:00.233] 作曲 : 齐飞\n[00:00.466] 编曲 : 齐飞\n[00:00.700]（开始了冇？）\n“)
            formartLyric(res.lrc) 
        }
        // 格式化歌词，正则判断
        const formartLyric = (lrc) => {
            const lrcReg = /^\[(\d{2}):(\d{2}.\d{2,})\]\s*(.+)$/   // 匹配格式例如[00:02.000] d{2}代表两个字符，.\代表空格

            if (!lrc.lyric) {
                info['lyric'] = true
                return
            }
            const lyricLis = lrc.lyric.split('\n')

            info['lyric'] = lrc.lyric
            lyricLis.forEach(item => {
                const arr = lrcReg.exec(item)  // 把符合我们规则的字符串取出来,还要把子字符串一并提取出来
                if (!arr) {
                    return
                }

                info['lyricObj'].push({ t: arr[1] * 60 * 1 + arr[2] * 1, txt: arr[3] }) // 
            })

            // 根据时间轴重排顺序
            info['lyricObj'].sort((a, b) => {
                return a.t - b.t
            })
        };
        // 计算当前播放时间的行数
        const findCurIndex = (t) => {
            for (let i = 0; i < info['lyricObj'].length; i++) {
                if (t <= info['lyricObj'][i].t) {
                    return i
                }
            }
            return info['lyricObj'].length
        };

        // 页面歌词可以展开查看更多
        const fullLyric = () => {
            info['isFull'] = !info['isFull'];
        };

        onMounted(() => {
            getLyrics(props.sId);
        })
        // 检测id的变化
        watch(() => props.sId, (newVal, oldVal) => {
            info['lyric'] = null
            info['lyricObj'] = []
            info['curIndex'] = 0
            getLyrics(newVal);
        });
        // 监听事件检测currentIndex的变化
        watch(() => props.currentTime, (newVal, oldVal) => {
            // 无歌词的时候 不做动画滚动
            if (!info['lyricObj'].length) {
                return
            }
            info['curIndex'] = findCurIndex(newVal) - 1
        });

        return {
            ...toRefs(info),
            isCurLyric,
            transform,
            getLyrics,
            formartLyric,
            findCurIndex,
            fullLyric
        }
    },
}
</script>
<style scoped lang="less">
.lyrics-main {
    height: 100%;
    overflow-y: auto;
    transition: all 1.5s ease-in-out;
}

.lyrics {
    font-size: 0;
    transform: translateY(0);
    transition: transform 1.5s ease-in-out;

    :deep(p) {
        margin: 0;
        line-height: 30px;
        font-size: 14px;
        font-weight: 300;

        &.active {
            color: var(--color-text-height);
        }
    }
}
.lyric-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 100px;
    font-size: 14px;
    color: var(--color-text-height);

    ~ .more-lyric {
        display: none;
    }
}
.page-lyrics {
    color: #666;
    overflow: hidden;

    .lyric-empty {
        justify-content: left;
    }

    &.fullLyrics {
        max-height: none;
    }
}

.lyric-more span {
    display: inline-block;
    line-height: 30px;
    cursor: pointer;
    color: var(--color-text-height);
}
</style>
