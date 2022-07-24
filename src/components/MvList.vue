<!-- html -->
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
        <div class="mv-list">
          <div class="item" v-for="item in mvList" :key="item.id" >
            <router-link :to="{path :'mvlist/mv' , query : {id: item.id}}"  class="faceImg">
              <i class="iconfont icon-video-play"></i>
              <el-image :src="item.cover" lazy> 
              </el-image>
            </router-link>
            <div class="info">
              <router-link class="mv-name" :to="{path :'mvlist/mv' , query :item.id}" >{{item.name}}</router-link>
              <router-link class="mv-singer-name" :to="{path :'mvlist/mv' , query :{id:item.id}}">{{item.artistName}}</router-link>
              <li class="mv-palyCount"><i class="iconfont icon-mvlist"></i>{{$utils.formartNum(item.playCount)}}</li>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
</template>

<!-- script -->
<script>
export default {
  name:'MvLsit'
}
</script>
<script  setup>
const props = defineProps({
  mvList:Array,
  loading:Boolean
})
</script>

<style lang="less" scoped>
.mv-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    font-size: 0;
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
        .icon-video-play {
          position: absolute;
          top: 50%;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 4;
          margin-top: -30px;
          opacity: 0;
          text-align: center;
          transform: scale(.5);
          font-size: 60px;
          color: #fff;
          transition: all .4s linear;
          text-shadow: 2px 2px 10px #000;
        }
        &:hover {
          .el-image {
              transform: scale(1.1);
          }
          .icon-video-play {
              opacity: 1;
              transform: scale(1);
          }
        }
    }
    .el-image {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 3;
        border-radius: 4px;
        transition: all .4s linear;
    }
    .info{
      padding: 10px;
      .mv-name{
        display: block;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mv-singer-name{
        display: block;
        font-size: 16px;
        line-height: 24px;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mv-palyCount{
        list-style: none;
        line-height: 24px;
        font-size: 16px;
        color: var(--color-text);
        i{
          font-size: 16px;
          padding-right: 10px;
        }
      }
    }
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
</style>