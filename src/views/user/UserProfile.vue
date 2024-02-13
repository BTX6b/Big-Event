<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
const formRef = ref()
const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()
const userInfo = ref({ username, nickname, email, id })
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      pattern: /^[\s\S]{2,10}$/,
      message: '昵称必须为2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const submitForm = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(userInfo.value)
  await getUser()
  ElMessage.success('修改成功！')
}
</script>
<template>
  <page-container title="基本资料">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="登录名称" style="width: 50%">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname" style="width: 50%">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email" style="width: 50%">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
<style lang="scss" scoped></style>
