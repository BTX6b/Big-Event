<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article'
import { formatTime } from '@/utils/formate.js'
import EditArticle from './components/EditArticle.vue'
const articleList = ref([])
const total = ref(0)
const params = ref({
  pagenum: 1, //当前页面
  pagesize: 5, //当前页条数
  cate_id: '',
  state: ''
})
const loading = ref(false)
const artEditRef = ref()

const onEditArticle = (row) => {
  artEditRef.value.open(row)
}
const AddArticle = () => {
  artEditRef.value.open({})
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功！' })
  getArticleList()
}

const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

onMounted(() => {
  getArticleList()
})

const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}

const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const onSuccess = (type) => {
  if (type === 'add') {
    //添加文章后渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>
<template>
  <page-container title="文章管理" v-loading="loading">
    <template #extra>
      <el-button type="primary" @click="AddArticle">发布文章</el-button>
    </template>
    <el-form :inline="true">
      <el-form-item label="文章分类：">
        <channel-select v-model="params.cate_id" width="240px"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select style="width: 240px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table style="width: 100%" :data="articleList">
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">{{ formatTime(row.pub_date) }} </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            @click="onEditArticle(row)"
            type="primary"
            plain
            circle
            :icon="Edit"
          ></el-button>
          <el-button
            @click="onDeleteArticle(row)"
            type="danger"
            plain
            circle
            :icon="Delete"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂时没有数据诶！" />
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 7]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <edit-article ref="artEditRef" @success="onSuccess"></edit-article>
  </page-container>
</template>
