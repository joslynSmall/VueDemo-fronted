<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-position="left" class="content">
        <el-form-item prop="password">
          <el-input type="password" v-model="passwordForm.password" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" placeholder="密码确认"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:10%;float:right" @click="onSubmit()">确认</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  
</template>
<script>
  import { requestUpdatePassword } from '../api/api';
  export default {
    name:'updatePassword',
    data() {
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registerForm.newPassword) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
      };
      return {
        passwordForm: {
        },
        passwordRules: {
          password: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ],
          confirmPassword: [
            { validator: validatePass2, trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      onSubmit(formName) {
        var that = this;
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            var updateParam = {password : this.passwordForm.username,newPassword : this.passwordForm.newPassword};
            requestUpdatePassword(updateParam).then(data => {
              if (data.success) {
                  that.$alert("密码修改成功");
              } else {
                this.$alert(data.errorMsg);
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .content {
    margin-top:30px;
  }
</style>