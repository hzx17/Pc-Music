<!-- html -->
<template>
  <div class='banner'>
   <el-skeleton
      :loading="loading"
      animated
      :throttle="500"
    >
      <template #template>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
      </template>
      <template #default>
        <swiper
          :slides-per-view="3"
          :autoplay="autoplay"
          :initialSlide="2"
          :loop="true"
          :modules="[EffectCoverflow, Autoplay,Pagination]" effect="coverflow"
          :pagination="{ clickable: true }"
          :coverflowEffect="coverflowEffect"
          :centeredSlides="true"
          class="banner_wrap"  
        >
          <swiper-slide v-for="(item,index) in lists" :key="index">
            <img class="banner_img" @click="pathHandler(item)" :src="item.imageUrl" :alt="item.typeTitle" />
          </swiper-slide>
        </swiper>
      </template>
   </el-skeleton>
  </div>
</template>

<!-- script -->
<script setup>
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay ,EffectCoverflow } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ref , getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// swiper自动轮播配置
const  autoplay= {
  autoplay:true,
  // 自动切换的时间间隔
  delay: 3000,
  // 如果设置为true，当切换到最后一个slide时停止自动切换
  stopOnLastSlide: false,
  // 用户操作swiper之后，是否禁止autoplay。默认为true：停止
  disableOnInteraction: false,
  observer:true, // 修改swiper自己或子元素时，自动初始化swiper
  observeParents:true, // 修改swiper的父元素时，自动初始化swiper
}
// 卡片化轮播图配置
const coverflowEffect= {
  // slide做3d旋转时Y轴的旋转角度
  rotate: 0,
  // 每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
  stretch: -30,
  // slide的位置深度。值越大z轴距离越远，看起来越小。
  depth: 500,
  // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
  modifier: 1,
  // 是否开启slide阴影
  slideShadows: true,
}
// 获取组件实例
const { proxy } = getCurrentInstance();
const router = useRouter()
let loading = ref(true);
// 轮播数据
let lists = ref([]);
// 获取数据
const getBanner = async() => {
  try {
    const { data: res } = await proxy.$http.getBanner()
    if (res.code !== 200) {
      return proxy.$msg.error('数据请求失败')
    }
    lists.value = res.banners
    loading.value = false;
  } catch (error) {
    console.log(error)
  }
}
/* 用户点击轮播图 */
const pathHandler = (params) =>{ 
   switch (params.targetType) {
    case 1: // 单曲
      router.push({ path: '/song', query: { id: params.targetId } })
      break
    case 10: // 专辑
      router.push({ path: '/index', query: { id: params.targetId } })
      break
    case 1000: // 歌单
      router.push({ path: '/index', query: { id: params.targetId } })
      break
    case 1004: // MV
      router.push({ path: '/index', query: { id: params.targetId } })
      break
    case 3000: // 外链
      window.open(params.url, '_blank')
      break
  }
}
onMounted(()=>{
  getBanner()
})
</script>

<style lang="less" scoped>
// 轮播图的宽度
@w: calc((@mainWidth) / 3);
.banner {
  padding-bottom: 30px;
  // background-color: aqua;
  .el-skeleton {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .skeleton-img {
        flex: 1;
        .calcHeight(@w, 1080, 400);
        &:last-child {
            margin: 0;
        }
    }
}
}
.banner_wrap {
  position: relative;
  padding: 20px 0;
  .calcHeight(@w, 1080, 400);  //.clacHeight是计算轮播图的高度，在main.less中设置的
  font-size: 0;
  .banner_img {
      width: 100%;
      height: 100%;
      cursor: pointer;
  }
}
.swiper {
    // opacity: .1;
  .swiper-slide {
    border-radius: 1px;
    box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
    overflow: hidden;
  }
  :deep(.swiper-pagination-bullet-active) {
    width: 15px;
    border-radius: 4px;
    background: var(--color-text-height);
  }
}
</style>