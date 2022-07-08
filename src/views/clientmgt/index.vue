<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryCondition.name" placeholder="客户端名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-tooltip class="item" effect="dark" content="搜索" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate" />
      </el-tooltip>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="客户端名称" width="180" align="left">
        <template slot-scope="{ row }">{{ row.Name }}</template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="{ row }">{{ row.Description }}</template>
      </el-table-column>
      <el-table-column label="排序号" width="80" align="left">
        <template slot-scope="{ row }">{{ row.SortNo }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryCondition.pageIndex" :limit.sync="queryCondition.pageSize" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form ref="dataForm" :rules="formRules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left: 20px">
        <el-form-item label="客户端名称" prop="Name">
          <el-input v-model="temp.Name" />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input v-model="temp.Description" />
        </el-form-item>
        <el-form-item label="排序号" prop="SortNo">
          <el-input v-model="temp.SortNo" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageClients, createClient, updateClient, deleteClient } from '@/api/clientmgt'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      queryCondition: {
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        Name: '',
        Description: '',
        SortNo: 0
      },
      dialogFormVisible: false,
      formRules: {
        Name: [{ required: true, message: '请输入客户端名称', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPageClients(this.queryCondition).then(response => {
        this.list = response.Data
        this.total = response.Total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.queryCondition.pageIndex = 1
      this.fetchData()
    },
    handleCreate() {
      this.temp = {
        Id: '',
        Name: '',
        Description: '',
        SortNo: 0
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createClient(this.temp).then(response => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateClient(this.temp.Id, this.temp).then(response => {
            const index = this.list.findIndex(v => v.Id === this.temp.Id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteData(row)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    },
    deleteData(row) {
      deleteClient(row.Id).then(response => {
        const index = this.list.findIndex(v => v.Id === this.temp.Id)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
