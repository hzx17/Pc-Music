<!-- html -->
<template>
  <div class='container'>
    <div class="my-info">我的歌单</div>
    <SongList  :songList="playList" />
  </div>
</template>

<!-- script -->
<script>
import { reactive } from '@vue/reactivity'
export default {
  name:''
}
</script>
<script  setup>
import SongList from '@/components/SongList.vue'
import { useStore } from 'vuex'
import { computed } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
const store = useStore()

const userInfo = computed(()=> store.getters.userInfo)
const playList = computed(() => store.getters.playList)

</script>

<style lang="less" scoped>
.my-info{
  padding: 0 20px 0 10px;
  font-size: 30px;
  color: var(--color-text-main);
  border-left:4px var(--color-text-height) solid ;
}
</style>