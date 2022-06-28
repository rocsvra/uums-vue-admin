<template>
  <div class="components-container">
    <split-pane split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-form
            ref="pswForm"
            :rules="pswRules"
            :model="temp"
            label-position="left"
            label-width="80px"
            style="margin: 30px"
          >
            <h3>头像</h3>
            <pan-thumb :image="image" style="margin-left: 80px;" />
            <el-form-item style="text-align: right">
              <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">
                变更头像
              </el-button>
            </el-form-item>
            <image-cropper
              v-show="imagecropperShow"
              :ki="imagecropperKey"
              :width="300"
              :height="300"
              :max-size="5000"
              url="/filestorage/base64"
              @close="imagecropperShow = false"
              @crop-upload-success="cropSuccess"
              @crop-upload-fail="cropFail"
            />
            <h3>修改密码</h3>
            <el-form-item label="旧密码">
              <el-input v-model="psw.old" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="psw.new" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="psw.confirm" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="updatePsw()">修改密码</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <el-form
            ref="dataForm"
            :rules="formRules"
            :model="temp"
            label-position="left"
            label-width="80px"
            style="margin: 30px"
          >
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
    </split-pane>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { validAccount, validEmail, validMobile } from '@/utils/validate'
import { getUserinfo } from '@/api/user'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { FILE_PATH } from '@/constants/uums-constants'
import { updateAvatar, updateBase } from '@/api/user'

export default {
  name: 'SplitpaneDemo',
  components: { splitPane, PanThumb, ImageCropper },
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
      pswRules: {

      },
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
      },
      psw: {
        old: '',
        new: '',
        confirm: ''
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      image: this.$store.state.user.avatar,
      fileId: ''
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
    },
    updateData() {
      console.log(1323)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateBase(this.temp).then(response => {
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
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = FILE_PATH + resData.url
      this.fileId = resData.id
      updateAvatar(this.fileId)
        .catch(err => {
          console.log(err)
        })
    },
    cropFail(err) {
      console.log(err)
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
    height: 100%;
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
