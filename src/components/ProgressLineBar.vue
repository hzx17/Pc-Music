<!-- 进度条线 -->
<template>
  <div class='progress' @click.stop="point" ref="progress">
     <!-- 进度线 -->
     <div class="progress-line"></div>
     <!-- 进度位置 -->
     <div class="progress-bg" :style="{width : progressWidth}" >
        <!-- 鼠标按住自身触发 -->
        <div class="progress-btn" @mousedown.self.stop="move()" v-if="isShowBtn">
        </div>
     </div>
  </div>
</template>

<!-- script -->
<script>
export default {
  name:''
}
</script>
<script  setup>
import { ref ,onMounted} from 'vue'

/* 接收传递过来的参数 */
const props = defineProps({
  progressWidth :{  //进度条的宽度
    type:String,
    default:'0'
  },
  isShowBtn: { // 是否显示进度条
    type:Boolean,
    default:true
  }
})
// 声明触发事件
const emit = defineEmits(['setProgressLine'])

// 当前鼠标位置
const progress = ref(null);
/* 拖拽进度条 */
const move = ()=> {
  document.onmousemove = (e)=> {
    setProgressLine( e, false)
  }

  // 拖动进度条的时，禁止页面文字选中
  document.body.onselectstart = function() {return false}

  // 拖拽结束时，设置当前音频时间
  document.onmouseup = function (e) {
    setProgressLine(e)
    document.onmousemove = document.onmouseup = document.body.onselectstart = null
  }
}
// 点击进度条
const point = (e)=>{
 setProgressLine(e)
}
// 设置进度条
const setProgressLine = (e , flag =true) => {
  const $progress = progress.value
  // 实时获取鼠标横坐标，若是超过进度条最大宽度，则值为进度条的宽度
  const currentProgress = e.clientX - getOffsetLeft($progress) >= $progress.offsetWidth ? $progress.offsetWidth :  (e.clientX - getOffsetLeft($progress) <= 0 ? 0 : e.clientX-getOffsetLeft($progress))
  // 触发修改进度条的事件，返回数据为音乐时间占比，flag为true
  emit('setProgressLine',{val :currentProgress / $progress.offsetWidth , flag : flag})
}
// 获取元素到浏览器左侧的距离
const getOffsetLeft = (obj) =>{
  let oLeft = obj.offsetLeft  // obj.offsetLeft 进度条左侧位置
  let oParent = obj.offsetParent // 进度条

  while (oParent !==null) {
    oLeft +=oParent.offsetLeft
    oParent = oParent.offsetParent
  }
  return oLeft  // 返回左侧位置进度条
}
</script>

<style lang="less" scoped>
.progress{
  position: relative;
  width: 100%;
  height: 4px;
  padding: 4px 0;
  border-radius: 2px;
  cursor: pointer;
  
  .progress-line {
    position: absolute; 
    top: 4px;
    left: 0;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #ddd;
    box-shadow: 0 0 4px #efefef inset; //内部阴影
  }
  
  .progress-bg {
    position: absolute;
    top: 4px;
    width: 0;
    height: 4px;
    border-radius: 2px;
    /* 不同位置线条颜色渐变 兼容 */
    background: -moz-linear-gradient(left, #ff641e 0%, rgba(255, 150, 0, 0.77) 10%, rgba(255, 100, 30, 0.8) 50%, #ff641e 70%, #ff7832 100%);
    /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #ff641e 0%, rgba(255, 150, 0, 0.77) 10%, rgba(255, 100, 30, 0.8) 50%, #ff641e 70%, #ff7832 100%);
     /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #ff641e 0%, rgba(255, 150, 0, 0.77) 10%, rgba(255, 100, 30, 0.8) 50%, #ff641e 70%, #ff7832 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#ff7832', GradientType=1);
        /* IE6-9 */
  }
  .progress-btn { 
    position: absolute;
    right: -6px;
    width: 4px;
    height: 4px;
    border: 4px solid var(--color-text-height);
    top: -4.5px;
    background: #fff;
    box-shadow: 0 0 15px 0 rgba(0,0,0,.15);
    transition: all .3s;
    border-radius: 50%;
    cursor: grab;
}
}
</style>