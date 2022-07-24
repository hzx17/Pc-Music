<template>
   <el-skeleton
      :loading="loading"
      animated
      :throttle="500"
    >
      <template #template>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
        <el-skeleton-item variant="image" class="skeleton-img"/>
      </template>
      <template #default>
        <div class="playlist">
            <div class="item" v-for="item in playList" :key="item.id">
              <router-link :to="{path:'/playlist/detail' , query:{id:item.id}}" class="faceImg">
                <el-image :src="item.coverImgUrl" lazy> 
                </el-image>
                <span class="span-hint"><i class="iconfont icon-playnum"></i><em>{{$utils.formartNum(item.playCount)}}</em>&nbsp;/&nbsp;{{item.trackCount + '首'}}</span>
              </router-link>
              <div class="info">
                <router-link to="/" class="info_name">{{item.name}}</router-link>
                <div class="tags">
                  <router-link to="/"  class="tags-span" v-for="(v,i) in item.tags" :key="i">{{v}}</router-link>
                </div>
              </div>
            </div>
          </div>
      </template>
  </el-skeleton>
</template>
<script setup>
const props=defineProps({
  playList: Array,
  num: Number,
  loading: Boolean
})
</script>
<style lang="less" scoped>

.playlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 0;
}
.el-skeleton {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
    .skeleton-img {
        flex: 1;
        .calcHeight(@mainWidth, 5, 1) ;
        &:last-child {
            margin: 0;
        }
    }
}
.item {
    width: calc(100% / 6);
    padding: 20px 40px 20px 0;
    box-sizing: border-box;
    font-size: 12px;
    /* 图片样式 */
    .faceImg {
        display: block;
        position: relative;
        padding-top: 100%;
       &::after, &::before {
            content: "";
            width: 100%;
            height: 100%;
            background-color: #d9d9d9;
            position: absolute;
            top: 0;
        }

        &::before {
            border: 1px solid #d6d6d6;
            right: -6px;
            transform: scale(.85);     // 缩放比例,这里不兼容其他浏览器     
            transform-origin: 100% 50%;  // 动画原点 
            z-index: 2;
            border-radius: 2px;
            transition: all .4s linear;
        }

        &::after {
            border: 1px solid #c4c4c4;
            right: -11px;
            transform: scale(.73);
            transform-origin: 100% 50%;
            z-index: 1;
            border-radius: 2px;
            opacity: .5;
            transition: all .4s linear;
        }
    }
     &:hover {
        .faceImg {
            position: relative;

            &::after, &::before {
                background: #ff960080
            }

            &::before {
                right: -8px;
            }

            &::after {
                right: -15px;
            }
        }
     }
    .el-image {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        border-radius: 4px;
    }
    /* 图片上方遮罩层 */
    .span-hint{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 4;
      color: #fff;
      display: block;
      line-height: 30px;
      text-align: center;
      padding-right: 10px;
      background: linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 97%,rgba(0,0,0,.5) 100%);
      i{
        color:#fff;
        font-size: 14px;
      }
      em{
        display: inline-block;
        padding-left: 5px;
        font-size: 12px;
        font-style: normal;
      }

    }
    /* 歌单路由与图片路由一致 */
    .info_name{
      display: block;
      margin-top: 15px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
      -webkit-line-clamp: 2; // 这个属性不是css的规范属性，需要组合上面两个属性，表示显示的行数。
      -webkit-box-orient: vertical;  // 从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
    }
    .tags{
      padding: 5px 0;
      .tags-span{
        color: var(--color-text-height);
        padding: 0 4px 0 0;
      }
    }
}
</style>