import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user.js'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})
    const getUser = async () => {
      //获取用户基本信息
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUser = (newUser) => {
      user.value = newUser
    }
    return {
      token,
      setToken,
      removeToken,
      getUser,
      user,
      setUser
    }
  },
  {
    //持久化
    persist: true
  }
)
