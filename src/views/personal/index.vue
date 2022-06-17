<template>
  <div class="components-container">
    <split-pane split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-form
            ref="dataForm"
            :rules="formRules"
            :model="temp"
            label-position="left"
            label-width="80px"
            style="margin: 30px"
          >
            <h3>头像</h3>

            <h3>基本资料</h3>
            <el-form-item label="姓名">
              <el-input v-model="temp.Name" />
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="temp.Account" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="temp.Sex">
                <el-radio :label="true">男</el-radio>
                <el-radio :label="false">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="temp.Mobile" />
            </el-form-item>
            <el-form-item label="邮件">
              <el-input v-model="temp.Mail" />
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="updateData()">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template slot="paneR">
        <split-pane split="horizontal">
          <template slot="paneL">
            <div class="top-container" />
          </template>
          <template slot="paneR">
            <div class="bottom-container" />
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { validAccount, validEmail, validMobile } from '@/utils/validate'
import { getUserinfo } from '@/api/user'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane },
  data() {
    const validateAccout = (rule, value, callback) => {
      if (!validAccount(value)) {
        callback(new Error('账户至少6位数字或字母'))
      } else {
        callback()
      }
    }
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('手机号码不正确'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('邮箱错误'))
      } else {
        callback()
      }
    }

    return {
      formRules: {
        Name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        Account: [
          { required: true, trigger: 'blur', validator: validateAccout }
        ],
        Mobile: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        Mail: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      temp: {
        Name: '',
        Account: '',
        Sex: true,
        Mobile: '',
        Mail: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getUserinfo().then(response => {
        this.temp = response
      })
    }
  }
}
</script>

<style  scoped>
  .components-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    height: 100%;
  }

  .right-container {
    height: 200px;
  }

  .top-container {
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    height: 100%;
  }
</style>
