

export default {
  /* 设置登录弹出层是否弹出 */
  SETLOGINDIALOG (state ,val ) {
    state.loginDialogVisible = val
  },
  /* 设置登录用户信息 */
  SETUSERINFO ( state , val) {
    state.userInfo = val
  },
  /* 是否登录 */
  SET_LOGIN (state ,val) {
    state.islogin = val
  },
  SET_PLAYLIST(state , val = null){
    state.playList = val
    window.localStorage.setItem('playList',JSON.stringify(val))
  },
  SET_PLAYSTATUS(state , val =false){
    state.isPlayed = val
  },
  SET_PLAYINDEX( state ,val = 0) {
    state.playIndex = val
    window.localStorage.setItem('playIndex',val)
  },
  SET_PLAYLISTTIPS( state ,val) {
    state.isShowPlayListTips =val
  }
}