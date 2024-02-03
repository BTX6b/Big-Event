<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
const route = useRoute()
const router = useRouter()
const goHome = () => {
  router.push('/home')
  console.log(route, router)
}
const userStore = useUserStore()
</script>

<template>
  <div>
    <router-view></router-view>
    我是App
    <button @click="$router.push('/list')">跳转</button>
    <button @click="goHome">跳转home</button>
    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('888nb')">登录</el-button>
    <el-button @click="userStore.removeToken">退出</el-button>
  </div>
</template>

<style scoped></style>
