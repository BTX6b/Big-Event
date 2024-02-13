<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { userUpdatePassService } from '@/api/user'
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const formRef = ref()
const userStore = useUserStore()
const checkNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

const checkConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const pwdRules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkConfirmPassword, trigger: 'blur' }
  ]
}
//修改密码
const router = useRouter()
const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdatePassService(pwdForm.value)
    ElMessage({ type: 'success', message: '修改密码成功！' })
    userStore.setToken('')
    userStore.setUser({})
    router.push('/login')
  }
}
//重置
const onReset = () => {
  formRef.value.resetFields()
}
</script>
<template>
  <page-container title="修改密码">
    <el-form
      :model="pwdForm"
      :rules="pwdRules"
      ref="formRef"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="原密码" prop="old_pwd" style="width: 50%">
        <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd" style="width: 50%">
        <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd" style="width: 50%">
        <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改密码</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
