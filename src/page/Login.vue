<template>
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <a href="javascript:void(0)" @click="register()" class="register" >注册新账号</a>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.prevent="onSubmit()">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  export default {
    name:'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      onSubmit(formName) {
        var that = this;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            var loginParam = {username : this.loginForm.username,password : this.loginForm.password};
            console.log(loginParam);
            requestLogin(loginParam).then(data => {
              if (data.success) {
                  this.$store.commit('USER_SIGNIN', data.data);
                  sessionStorage.setItem('user',that.loginForm.username);
                  that.$router.push('/account');
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
        this.$router.push('/register');
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