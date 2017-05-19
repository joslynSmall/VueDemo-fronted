<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="5" class="logo">
				{{sysName}}
			</el-col>
			<el-col :span="15">
				<div class="tools">
					<i class="el-icon-menu"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" />{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<el-col :span="5" class="left">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo"
					 unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
			</el-col>
			<el-col :span="19" class="right">
				<transition name="fade"
	            mode="out-in">
					<router-view></router-view>
				</transition>
			</el-col>
		</el-col>
	</el-row>
</template>

<script>
	import { requestLogout } from '../api/api';
	export default {
		name:'home',
		data() {
			return {
				sysName :　'Full Stack',
				sysUserAvatar : require('../assets/user.png'),
				sysUserName : ''
			}
		},
		methods : {
			logout : function() {
				var that = this;
				this.$confirm('确认退出吗?', '提示', {
				}).then(() => {
					requestLogout().then(data => {
		              if (data.success) {
		                  sessionStorage.removeItem('user');
						  that.$router.push('/');
		              } else {
		                this.$alert(data.errorMsg);
		              }
		            })
					
				})
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			}
		},
		mounted() {
			this.sysUserName = sessionStorage.getItem("user")
		}
	}
</script>
<style scoped>
	.container {
		position : absolute;
		top:0px;
		left:0px;
		margin:0px;
		width:100%;
	}
	.header {
		height:50px;
		line-height:50px;
		font-color:#FFF;
		background-color:#20A0FF;
	}
	.header .logo {
		text-align:center;
	}
	.header .tools {
		margin-left:6px;
	}
	.userinfo {
		text-align:right;
		padding-right:47px;
		padding-top:2px;
		cursor:pointer;
	}
	.userinfo img {
		padding-left:2px;
		width:45px;
		border-radius:22px;
		float:right;
	}
</style>