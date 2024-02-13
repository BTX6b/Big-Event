<script setup>
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import { ref, onMounted } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { ElMessage } from 'element-plus'
const loading = ref(false)
const channelList = ref([])
const dialog = ref()
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
onMounted(() => {
  getChannelList()
})
const onEdit = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open({})
}
const onDelete = async (row) => {
  await ElMessageBox.confirm('你确认要删除该条分类吗？', '温馨提示！', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage({ type: 'success', message: '删除成功!' })
  getChannelList() //刷新
}
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100"
        ><template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click="onEdit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="onDelete(scope.row)"
          ></el-button> </template
      ></el-table-column>
      <template #empty>
        <el-empty description="咦ε=(´ο｀*)！数据空空如也？" />
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
