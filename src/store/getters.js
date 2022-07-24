
export default {
  isLogin (state) {
    return JSON.parse(window.localStorage.getItem('isLogin')) || state.isLogin;
  },
  loginDialogVisible (state) {
      return state.loginDialogVisible;
  },
  userInfo (state) {
      return state.userInfo || JSON.parse(window.localStorage.getItem('userInfo'));
  },
  isPlayed (state) {
    return state.isPlayed;
  },
  playList (state) {
    return state.playList.length ? state.playList : JSON.parse(window.localStorage.getItem('playList')) || []
  },
  playIndex (state) {
      return state.playIndex || JSON.parse(window.localStorage.getItem('playIndex')) || 0
  },
  isShowPlayListTips (state) {
      return state.isShowPlayListTips
  }
}