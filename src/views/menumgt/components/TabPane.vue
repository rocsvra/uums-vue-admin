<template>
  <div>
    <div class="filter-container">
      <el-input v-model="queryCondition.name" placeholder="name" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-tooltip class="item" effect="dark" content="搜索" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate" />
      </el-tooltip>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="name" label="name" width="150" />
      <el-table-column label="alwaysShow" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alwaysShow }}</span>
        </template>
      </el-table-column>
      <el-table-column label="hidden" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="redirect" fit>
        <template slot-scope="scope">
          <span>{{ scope.row.redirect==null?"-":scope.row.redirect }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="path" width="150" />
      <el-table-column prop="component" label="component" width="150" />
      <el-table-column label="meta">
        <el-table-column prop="meta.title" label="title" width="120" />
        <el-table-column prop="meta.icon" label="icon" width="150" />
        <el-table-column label="noCache" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.meta.noCache }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="sortNo" label="排序号" width="80" align="center" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <!-- <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)" /> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form ref="dataForm" :rules="formRules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left: 20px">
        <el-form-item label="name">
          <el-cascader ref="menuCascader" v-model="ParentIdData" clearable :options="parentOptions" :props="{ checkStrictly: true }" @change="handleParentIdChange" />
        </el-form-item>
        <el-form-item label="name" prop="Name">
          <el-input v-model="temp.Name" />
        </el-form-item>
        <el-form-item label="alwaysShow">
          <el-switch v-model="temp.AlwaysShow" />
        </el-form-item>
        <el-form-item label="hidden">
          <el-switch v-model="temp.Hidden" />
        </el-form-item>
        <el-form-item label="redirect">
          <el-input v-model="temp.Redirect" />
        </el-form-item>
        <el-form-item label="path" prop="Path">
          <el-input v-model="temp.Path" />
        </el-form-item>
        <el-form-item label="component" prop="Component">
          <el-input v-model="temp.Component" />
        </el-form-item>
        <el-form-item label="title" prop="Title">
          <el-input v-model="temp.Title" />
        </el-form-item>
        <el-form-item label="icon" prop="Icon">
          <el-input v-model="temp.Icon" />
        </el-form-item>
        <el-form-item label="noCache">
          <el-switch v-model="temp.NoCache" />
        </el-form-item>
        <el-form-item label="sortNo">
          <el-input-number v-model="temp.SortNo" :min="1" :max="1000" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenus, createMenu, updateMenu, deleteMenu } from '@/api/menumgt'

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      queryCondition: {
        clientId: this.type,
        name: ''
      },
      list: [],
      loading: false,
      dialogFormVisible: false,
      formRules: {
        Name: [{ required: true, message: '请输入name', trigger: 'blur' }],
        Path: [{ required: true, message: '请输入path', trigger: 'blur' }],
        Component: [{ required: true, message: '请输入component', trigger: 'blur' }],
        Title: [{ required: true, message: '请输入title', trigger: 'blur' }],
        Icon: [{ required: true, message: '请输入icon', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      temp: {
        Id: '',
        ClientId: this.type,
        ParentId: null,
        Name: '',
        AlwaysShow: true,
        Hidden: false,
        Redirect: null,
        Path: '',
        Component: '',
        Title: '',
        NoCache: true,
        SortNo: 0
      },
      parentOptions: [],
      ParentIdData: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getMenus(this.queryCondition).then(response => {
        this.list = response
        this.loading = false
      })
    },
    handleFilter() {
      this.queryCondition.pageIndex = 1
      this.fetchData()
    },
    handleCreate() {
      this.getParentMenuData()
      this.ParentIdData = null
      this.temp = {
        Id: '',
        ClientId: this.type,
        ParentId: null,
        Name: '',
        AlwaysShow: true,
        Hidden: false,
        Redirect: null,
        Path: '',
        Component: '',
        Title: '',
        NoCache: true,
        SortNo: 0
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {

    },
    handleParentIdChange(value) {
      var node = this.$refs.menuCascader.getCheckedNodes()
      this.temp.ParentId = node[0].data.id
    },
    getParentMenuData() {
      var condition = { clientId: this.type, name: '' }
      getMenus(condition).then(response => {
        this.parentOptions = response
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.ClientId = this.type

      console.log(row)
      console.log(this.temp.name)

      this.getParentMenuData()
      this.ParentIdData = null

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateMenu(this.temp.Id, this.temp).then(response => {
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
    }
  }
}
</script>

