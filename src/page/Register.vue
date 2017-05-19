<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">注册账号</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="registerForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input type="password" v-model="registerForm.confirmPassword" placeholder="密码确认"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:70%;" @click="onSubmit()">注册</el-button>
      <el-button type="primary" style="width:26%;float:right" @click="onBack()">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestRegister } from '../api/api';
  export default {
    name:'register',
    data() {
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.registerForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
      };
      return {
        registerForm: {
        },
        registerRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
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
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            var registerParam = {username : this.registerForm.username,password : this.registerForm.password};
            requestRegister(registerParam).then(data => {
              if (data.success) {
                  that.$alert("注册成功");
                  that.$router.push('/');
              } else {
                this.$alert(data.errorMsg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      register() {
        this.$router.push('/Home');
      },
      onBack() {
        this.$router.push('/');
      }
    }
  }
</script>
<style scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 140px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
.login-container .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
.login-container .remember {
      margin-bottom : 16px;
    }
.register {
  float:right;
  font-size:15px;
  color:#23a1ff;
  cursor:pointer;
}
</style>