import api from './instance'
// 首页轮播图
const getBanner = () => { return api.get('/banner', {}) }

/*********** 搜索 ***************/
// 热门搜索
const searchHot = () => { return api.get('/search/hot', {}) }
const searchSuggest = ({ keywords = '' }) => { return api.get(`/search/suggest?keywords=${keywords}`, {}) }
/* ********* 登录 ********* */
const login =({ phone = '', password = '' }) => { return api.post(`/login/cellphone`, {phone, password :password}) }
/* ********* 查找用户信息 ********* */
const getUserInfo = ({ uid = '' }) => { return api.get(`/user/detail?uid=${uid}`, {}) }
/* ********* 歌单 ********* */
// 热门歌单分类
const hotList = () => { return api.get('/playlist/hot', {}) }
// 歌单分类
const catlist = () => { return api.get('/playlist/catlist', {}) }
// 歌单列表(order:最新or最热,cat(分类,默认全部取出),limit(限制条数),offset(分页))
const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => { 
  return api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {}) 
}
// 歌单详情
const playlistdetail = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }

/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
const songDetail = ({ ids = '', timestamp = 0 }) => { return api.post(`/song/detail?timestamp=${timestamp}`, { ids: ids }) }
// 获取相似音乐
const songSimilarity =  ({ id = '' }) => { return api.get(`/simi/song?id=${id}`, {}) }
// 获取歌词
const lyrics = ({ id = '' }) => { return api.get(`/lyric?id=${id}`, {}) }
// 获取音乐URL
const songUrl = ({ id = '' }) => { return api.get(`/song/url?id=${id}`, {}) }

/* ********* MV ********* */
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => { return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {}) }
//获取mv
const mvDetail = ({ id = '' }) => { return api.get(`/mv/detail?mvid=${id}`, {}) }
// 获取 地址
const mvUrl = ({ id = '', r = 1080 }) => { return api.get(`/mv/url?id=${id}&r=${r}`, {}) }
// 相似mv
const simiMv = ({ id = '' }) => { return api.get(`/simi/mv?mvid=${id}`, {}) }

export {
  getBanner, //获取轮播图
  hotList,   // 最热推荐分类
  playList,  // 歌单列表
  mv,        // 获取mv
  songDetail,  //歌曲详细信息
  songSimilarity, //相似歌曲
  lyrics,         // 获取歌词
  login,          // 登录
  getUserInfo,    // 查找用户详细信息
  playlistdetail ,  //查找歌单详情信息
  catlist,          //全部歌单分类
  mvDetail,         //获取mv信息
  mvUrl,            //获取mv地址
  simiMv,           // 获取相似mv
  searchHot,        // 搜索热搜
  searchSuggest,
}

