<template>
  <el-dialog v-model="centerDialogVisible"  :before-close="handleClose" title="登录" width="30%"  center>
    <el-form :model="from" ref="loginFromRef" :rules="rules" label-width="">
      <el-form-item prop="phone" label="账号：">
        <el-input v-model="from.phone" placeholder="请输入网易云账号" />
      </el-form-item>
      <el-form-item prop="password" label="密码：">
        <el-input v-model="from.password"  placeholder="请输入网易云密码"   type="password"  />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="warning"  @click="onSubmit(from)"
          >登录</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import {  getCurrentInstance, reactive, ref } from 'vue'
import { useStore } from 'vuex';
const store =useStore()
const { proxy } = getCurrentInstance()
const handleClose = () => store.commit('SETLOGINDIALOG', false) // 关闭后将弹出层展示设置为false
const centerDialogVisible = ref(true)
/* 表单数据 */
const from = reactive({
  phone:'',
  password:''
})
const timer = ref('')
/* 账号验证规则 */
const validatePass = (rule, value, callback) => {
  if (!from.phone) {
    callback(new Error('请输入网易云账号'))
  } 
  else if(from.phone.length !== 11) {
    callback('你输入的不符合电话号码规则')
  }else{
    callback()
  }
}
/* 密码验证规则 */
const validatePass2 = (rule, value, callback) => {
  if (!from.phone) {
    callback(new Error('请输入网易云密码'))
  } else{
    callback()
  }
}
/* 表单验证规则 */
const rules = reactive({
    phone: [{ required: true, validator: validatePass , trigger: 'blur' }],
    password: [{ required: true, validator: validatePass2, trigger: 'blur' }]
})
/* 表单提交 */
const onSubmit = ()=>{
  /* 是否符合规则 */
  proxy.$refs.loginFromRef.validate((valid) => {
      if (valid) {
          clearTimeout(timer)
          timer.value = setTimeout( async () => {
            const { data: res } = await proxy.$http.login(from);
            if (res.code !== 200) {
              proxy.$msg.error(res.message)
            } else {
              getUserInfo(res.profile.userId) // 通过用户的id来查找.用户信息
              window.localStorage.setItem('token', res.token)  // 将token保存
              //window.localStorage.setItem('cookie', res.cookie)  // 将cookie保存
              store.commit('SETLOGINDIALOG', false)   // 将store中登录弹出层的值设置为false
            } 
          }, 1000)
      } else {
        return false
      } 
  })
}
/* 查找用户信息 */
const getUserInfo = async (uid)=> {
    const { data: res } = await proxy.$http.getUserInfo({uid : uid})
    if (res.code !== 200) {
      proxy.$msg.error(res.msg)
    } else {
      window.localStorage.setItem('isLogin', true) // 是否登录设置为true
      window.localStorage.setItem('userInfo', JSON.stringify(res.profile)) // 将用户信息存入
      store.commit('SET_LOGIN', true) // 登录成功存入
      store.commit('SETUSERINFO', res.profile) // 将用户信息存入store
      ElMessage.success('登录成功')
    } 
}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
  width: 50%;
}
.el-dialog{
  min-width: 300px;
}
</style>