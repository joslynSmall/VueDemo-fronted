<template>
	<el-row>
		<!--查询-->
		<el-col :span="23">
			<el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
			  <el-form-item label="用户名">
			    <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="onSearch">查询</el-button>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="add">新增</el-button>
			  </el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-col :span="23">
			<el-table :data="listData">
				<el-table-column type="index" width="150">
				</el-table-column>
					<el-table-column prop="username" label="用户名" width="150" >
				</el-table-column>
					<el-table-column prop="password" label="密码" :formatter="formatPassword" width="150" >
				</el-table-column>
				</el-table-column>
					<el-table-column prop="salt" label="盐" width="150" >
				</el-table-column>
				</el-table-column>
					<el-table-column prop="locked" label="是否锁定" :formatter="formatLock" width="150" >
				</el-table-column>
				<el-table-column label="操作" width="285">
			      <template scope="scope">
			        <el-button
			          size="small"
			          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			          size="small"
			          type="danger"
			          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			          <el-button
			          size="small"
			          type="danger"
			          @click="handleBind(scope.$index, scope.row)">绑定角色</el-button>
			      </template>
			    </el-table-column>
			</el-table>
		</el-col>

		<!--分页-->
		<el-col :span="23" class="pagination">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="pageSizes"
		      :page-size="pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</el-col>

		<!--新增-->
		<el-dialog :title="title" :visible.sync="dialogVisible" :show-close="false">
		  <el-form :model="addForm" :rules="addFormRules" ref="addForm">
		    <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
		      <el-input v-model="addForm.username" auto-complete="off" placeholder="用户名"></el-input>
		    </el-form-item>
		    <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
		      <el-input type="password" :disabled="passwordDisabled" v-model="addForm.password" auto-complete="off" placeholder="密码"></el-input>
		    </el-form-item>
		    <el-form-item label="密码确认" prop="confirmPassword" :label-width="formLabelWidth">
		      <el-input type="password" :disabled="passwordDisabled" v-model="addForm.confirmPassword" auto-complete="off" placeholder="密码确认"></el-input>
		    </el-form-item>
		    <el-form-item label="盐" :label-width="formLabelWidth">
		      <el-input type="text" v-model="addForm.salt" auto-complete="off" placeholder="盐"></el-input>
		    </el-form-item>
		    <el-form-item label="是否锁定" :label-width="formLabelWidth">
		        <el-radio class="radio" v-model="addForm.locked" label="true">是</el-radio>
  				<el-radio class="radio" v-model="addForm.locked" label="false">否</el-radio>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addSubmit">确 定</el-button>
		  </div>
		</el-dialog>

		<!--绑定角色-->
		<el-dialog title="绑定角色" :visible.sync="dialogBindRole" :show-close="false">
		  <el-form :model="bindList" ref="bindList">
		    <el-select v-model="bindList.value" class="selectLength" multiple size="large" placeholder="请选择" >
		    	<!--v_model和value必须一致-->
			    <el-option
			      v-for="item in bindList.options"
			      :label="item.role"
			      :value="item.id">
			       <span style="float: left">{{ item.role }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
				    </el-option>
			    </el-option>
			  </el-select>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogBindRole = false">取 消</el-button>
		    <el-button type="primary" @click="bindSubmit">确 定</el-button>
		  </div>
		</el-dialog>
		
	</el-row>


</template>

<script>
	  import { requestUserList } from '../api/api';
	  import { requestAllRoleList } from '../api/api';
	  import { requestRoleListByUserId } from '../api/api';
	  import { requestDeleteUser } from '../api/api';
	  import { requestUserUpdate } from '../api/api';
	  import { requestSelectUser } from '../api/api';
	  import { requestUserBindRoles } from '../api/api';
	export default {
		name : 'accountManagement',
		data() {
			var validatePass2 = (rule, value, callback) => {
		          if (value === '') {
		            callback(new Error('请再次输入密码'));
		          } else if (value !== this.addForm.password) {
		            callback(new Error('两次输入密码不一致!'));
		          } else {
		            callback();
		          }
		      };
			return {
				//查询
				searchForm:{

				},
				//列表
				listData :[
				
				],
				//分页
				pageSizes:[10, 20, 30, 50],
				currentPage:1,
				pageSize:10,
				total:0,
				//新增
				dialogVisible:false,
				addForm:{
					locked:"false"
				},
				formLabelWidth:'80px',
				title:'',
				addFormRules:{
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
				passwordDisabled : false,
				//绑定
				dialogBindRole:false,
				bindList:{
					value:'',
					options:[]
				}
			}
		},
		methods : {
			//公用
			loadData (page,rows,keyword) {
		    	var param;
		    	if (keyword == null || keyword == undefined) {
		    		param = {page:page,rows:rows};
		    	} else {
		    		keyword.page = page;
		    		keyword.rows = rows;
		    		param = keyword;
		    	}
		    	requestUserList(param).then(data => {
	              if (data.success) {
	                  this.listData = data.rows;
	                  this.currentPage = data.page;
	                  this.pageSize = data.pageSize;
	                  this.total = data.total;
	                  this.loading = false;
	              } else {
	                this.$alert(data.errorMsg);
	              }
	            })
		    },
		    //查询
		    onSearch() {
				var keyword = {username:this.searchForm.username};
				this.loadData(1,10,keyword);
			},

		    //列表
		    formatLock(row,column) {
				return row.locked == false ? '未锁定':'已锁定';
			},
			formatPassword(row,column) {
				return '******';
			},
			//编辑
			handleEdit(index, row) {
              	this.title='修改用户信息';
		    	this.dialogVisible = true;
		    	this.passwordDisabled = true;
		    	//初始化表单信息
		    	this.addForm.id = row.id;
		    	this.addForm.username=row.username;
		    	this.addForm.salt = row.salt;
		    	if (row.locked) {
		    		this.addForm.locked = "true";
		    	} else {
		    		this.addForm.locked = "false";
		    	}
		    	this.addForm.password=row.password;
		    	this.addForm.confirmPassword=row.password;
		    },
		    //删除
		    handleDelete(index, row) {
		    	this.$confirm('确认删除'+row.username+'？')
		          .then(_ => {
		            requestDeleteUser(row.id).then(data => {
		              if (data.success) {
		                  this.loadData(this.currentPage,this.pageSize);
		              } else {
		                this.$alert(data.errorMsg);
		              }
		            })
		          })
		          .catch(_ => {});
		    	
		    },
		    //分页
		    handleSizeChange(val) {
			this.loadData(this.currentPage,val);
		        console.log(`每页 ${val} 条`);
		    },
		    handleCurrentChange(val) {
		    	this.loadData(val,this.pageSize);
		        console.log(`当前页: ${val}`);
		    },
		    //新增
		    add() {
		    	this.title='新增用户';
		    	this.dialogVisible = true;
		    	//初始化表单信息
		    	this.addForm.id='';
		    	this.addForm.username='';
		    	this.addForm.password='';
		    	this.addForm.confirmPassword='';
		    	this.addForm.salt='';
		    	this.addForm.locked='false';
		    },
		    addSubmit() {
		    	var that = this;
		        this.$refs.addForm.validate((valid) => {
		          if (valid) {
		            var addParam = {id:this.addForm.id,username : this.addForm.username,password : this.addForm.password,salt:this.addForm.salt,locked:this.addForm.locked};
		            requestUserUpdate(addParam).then(data => {
		              if (data.success) {
		                  that.$alert("新增用户成功");
		                  this.dialogVisible = false;
		                  this.loadData(this.currentPage,this.pageSize);
		              } else {
		                this.$alert(data.errorMsg);
		                this.dialogVisible = false;

		              }
		            })
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		    //绑定
		    handleBind(index, row) {
		    	this.dialogBindRole = true;
		    	this.bindList.id = row.id;
		    	requestAllRoleList().then(data => {
		    		if (data.success) {
		    			this.bindList.options = data.rows;
		    			requestRoleListByUserId({userId:row.id}).then(data => {
		    				if (data.success) {
		    					//获取的是已有角色id集合给value，和option的value匹配
		    					this.bindList.value = data.rows;
		    				} else {
		    					this.$alert(data.errorMsg);
		    					this.dialogBindRole = false;
		    				}
		    			})
		    			
		    		} else {
		    			this.$alert(data.errorMsg);
		                this.dialogBindRole = false;
		    		}
		    	})
		    },
		    bindSubmit() {
		    	var bindParam = {userId:this.bindList.id,roleIds:this.bindList.value};
		    	requestUserBindRoles(bindParam).then(data => {
		    		if (data.success) {
		    			this.$alert("绑定成功");
		    			this.dialogBindRole = false;
		    		} else {
		    			this.$alert(data.errorMsg);
		    			this.dialogBindRole = false;
		    		}
		    	})
		    	console.log(bindParam);
		    }

		},
		mounted() {
			this.loadData(this.currentPage,this.pageSize);
			
		}
	}
</script>
<style scoped>
@import url("//unpkg.com/element-ui/lib/theme-default/index.css");
.demo-form-inline {
	padding-top:3px;
	padding-left:3px;
}
.pagination {
	margin-top:10px;
	text-align:right;
}
.selectLength {
	width:480px;
}
</style>