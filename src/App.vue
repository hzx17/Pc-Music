<template>
  <play-box/>
  <el-container>
    <el-aside>
        <Sidebar />
    </el-aside>
    <el-main>
        <Header />
        <router-view></router-view>
    </el-main>
  </el-container>
  <Login v-if="loginDialogVisible" />
</template>
<script setup>
import Sidebar from '@components/Sidebar.vue';
import Header from '@components/Header.vue';
import Login from '@components/Login.vue'
import PlayBox from '@components/Audio/PlayBox.vue'
import { computed, onMounted, ref } from 'vue';
import {useStore} from 'vuex'

const store =useStore()

const loginDialogVisible = computed(() =>  store.getters.loginDialogVisible) // 是否展示弹窗


</script>
<style>
</style>