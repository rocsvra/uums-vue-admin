<template>
  <div>
    <div class="filter-container">
      <el-input v-model="queryCondition.name" placeholder="角色名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-tooltip class="item" effect="dark" content="搜索" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate" />
      </el-tooltip>
    </div>
    <el-table v-loading="loading" :data="list" row-key="id" border>
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="Name" label="角色名称" width="150" />
      <el-table-column label="启用" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Enabled ? '是' :'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="{ row }"><span>{{ row.Description }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(row)" />
          <el-tooltip effect="dark" content="关联菜单" placement="top-start">
            <el-button type="primary" size="mini" icon="el-icon-menu" @click="handleMenu(row)" />
          </el-tooltip>
          <el-tooltip effect="dark" content="关联用户" placement="top-start">
            <el-button type="primary" size="mini" icon="el-icon-user-solid" @click="handleUser(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryCondition.pageIndex" :limit.sync="queryCondition.pageSize" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
      <el-form ref="dataForm" :rules="formRules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left: 20px">
        <el-form-item label="角色名称" prop="Name">
          <el-input v-model="temp.Name" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="temp.Enabled" />
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input v-model="temp.Description" type="textarea" :rows="3" placeholder="请输入内容" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogMenuVisible" :title="'关联菜单'" width="550px">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="关联菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="menus"
            :props="{ children: 'children', label: 'label' }"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogMenuVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMenu">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUserVisible" title="角色关联用户" width="650px">
      <div class="filter-container">
        <el-tooltip effect="dark" content="新增" placement="top-start">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleLinkuser" />
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top-start">
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteUsers()" />
        </el-tooltip>
      </div>

      <el-table ref="usertbl" v-loading="userLoading" :data="users" row-key="id" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="Account" label="账号" width="120" />
        <el-table-column prop="Name" label="姓名" width="120" />
        <el-table-column prop="Mobile" label="联系电话" />
      </el-table>
    </el-dialog>

    <el-dialog title="角色关联用户【新增】" :visible.sync="dialogUserFormVisible" width="450px">
      <el-form ref="userForm" label-position="left" label-width="70px" style="width: 400px; margin-left: 20px">
        <el-form-item label="用户名" prop="Name">
          <el-row>
            <el-autocomplete
              v-model="selectedUser.name"
              class="inline-input"
              :fetch-suggestions="userQuerySearch"
              placeholder="请输入姓名"
              :trigger-on-focus="false"
              @select="handleSelect"
            />
            <el-button type="primary" style="margin-left:20px" @click="confirmLinkeUser">关联用户</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPageRoles, createRole, updateRole, deleteRole, updateRoleMenus, getRoleMenus, getRoleUsers, getUnlinkedRoleUsers, addLinkUsers, deleteLinkUsers } from '@/api/rolemgt'
import { getMenus } from '@/api/menumgt'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
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
        pageIndex: 1,
        pageSize: 10,
        name: ''
      },
      list: [],
      loading: false,
      total: 0,
      temp: {
        Name: '',
        Description: '',
        Enabled: true,
        ClientId: this.type
      },
      dialogFormVisible: false,
      formRules: {
        Name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogMenuVisible: false,
      checkStrictly: false,
      menus: [],
      dialogUserVisible: false,
      userLoading: false,
      users: [],
      selectedUser: {
        id: '',
        name: ''
      },
      dialogUserFormVisible: false
    }
  },
  created() {
    this.fetchData()
    this.getMenuData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getPageRoles(this.queryCondition).then(response => {
        this.list = response.Data
        this.total = response.Total
        this.loading = false
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
        Enabled: true,
        ClientId: this.type
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
          createRole(this.temp).then(response => {
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
      this.temp.ClientId = this.type
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateRole(this.temp.Id, this.temp).then(response => {
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
      deleteRole(row.Id).then(response => {
        const index = this.list.findIndex(v => v.Id === this.temp.Id)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleMenu(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.ClientId = this.type
      getRoleMenus(this.temp.Id).then(response => {
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys(response)
        }
      })
      this.dialogMenuVisible = true
    },
    confirmMenu() {
      var menuids = this.$refs.tree.getCheckedKeys()
      updateRoleMenus(this.temp.Id, menuids).then(response => {
        this.dialogMenuVisible = false
        this.$notify({
          title: 'Success',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    getMenuData() {
      var condition = { clientId: this.type, name: '' }
      getMenus(condition).then(response => {
        this.menus = response
      })
    },
    handleUser(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.ClientId = this.type
      this.userLoading = true
      this.fetchUserData()
      this.dialogUserVisible = true
    },
    handleLinkuser() {
      this.dialogUserFormVisible = true
      this.selectedUser = { id: '', name: '' }
    },
    userQuerySearch(queryString, callBack) {
      var unlinkedUsers = []
      getUnlinkedRoleUsers(this.temp.Id, queryString).then(response => {
        response.forEach(element => {
          var item = { value: element.Account + ' | ' + element.Name, id: element.Id, name: element.Name }
          unlinkedUsers.push(item)
        })
        callBack(unlinkedUsers)
      })
    },
    fetchUserData() {
      this.userLoading = true
      getRoleUsers(this.temp.Id).then(response => {
        this.users = response
        this.userLoading = false
      })
    },
    handleSelect(item) {
      this.selectedUser.name = item.name
      this.selectedUser.id = item.id
    },
    confirmLinkeUser() {
      var linkedUsers = []
      linkedUsers.push(this.selectedUser.id)
      addLinkUsers(this.temp.Id, linkedUsers).then(response => {
        this.dialogUserFormVisible = false
        this.$notify({
          title: 'Success',
          message: '关联成功',
          type: 'success',
          duration: 2000
        })

        this.fetchUserData()
      })
    },
    handleDeleteUsers() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var selectedIds = []
          this.$refs.usertbl.selection.forEach((item) => {
            selectedIds.push(item.Id)
          })
          deleteLinkUsers(this.temp.Id, selectedIds).then(() => {
            this.fetchUserData()
            this.$notify({
              title: 'Success',
              message: '已删除',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
    }
  }
}
</script>

