<template>
	<el-row>
		<!--查询-->
		<el-col :span="23">
			<el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
			  <el-form-item label="角色名">
			    <el-input v-model="searchForm.role" placeholder="角色名"></el-input>
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
				<el-table-column type="index" >
				</el-table-column>
					<el-table-column prop="role" label="角色名"  >
				</el-table-column>
					<el-table-column prop="description" label="描述" >
				</el-table-column>
				</el-table-column>
					<el-table-column prop="available" :formatter="formatAvailable" label="是否可用">
				</el-table-column>
				<el-table-column label="操作">
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
			          @click="handleBind(scope.$index, scope.row)">绑定权限</el-button>
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
		    <el-form-item label="角色名" prop="role" :label-width="formLabelWidth">
		      <el-input v-model="addForm.role" auto-complete="off" placeholder="角色名"></el-input>
		    </el-form-item>
		    <el-form-item label="角色描述" prop="description" :label-width="formLabelWidth">
		     <el-input type="textarea" :rows="2" placeholder="角色描述" v-model="addForm.description">
			</el-input>
		    </el-form-item>
		    <el-form-item label="是否可用" :label-width="formLabelWidth">
		        <el-radio class="radio" v-model="addForm.available" label="true">是</el-radio>
  				<el-radio class="radio" v-model="addForm.available" label="false">否</el-radio>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addSubmit">确 定</el-button>
		  </div>
		</el-dialog>

		<!--绑定角色-->
		<el-dialog title="绑定角色" :visible.sync="dialogBindPermission" :show-close="false">
		  <el-form :model="bindList" ref="bindList">
		    <el-select v-model="bindList.value" class="selectLength" multiple size="large" placeholder="请选择" >
		    	<!--v_model和value必须一致-->
			    <el-option
			      v-for="item in bindList.options"
			      :label="item.permission"
			      :value="item.id">
			       <span style="float: left">{{ item.permission }}</span>
				      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
				    </el-option>
			    </el-option>
			  </el-select>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogBindPermission = false">取 消</el-button>
		    <el-button type="primary" @click="bindSubmit">确 定</el-button>
		  </div>
		</el-dialog>
		
	</el-row>
</template>

<script>
	  import { requestUpdateRole } from '../api/api';
	  import { requestRoleList } from '../api/api';
	  import { requestDeleteRole } from '../api/api';
	  import { requestSelectRole } from '../api/api';
	  import { requestAllPermissionList } from '../api/api';
	  import { requestPermissionListByRoleId } from '../api/api';
	  import { requestRoleBindPermissions } from '../api/api';
	export default {
		name : 'role',
		data() {
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
					available:"true"
				},
				formLabelWidth:'80px',
				title:'',
				addFormRules:{
					role: [
			            { required: true, message: '请输入角色名', trigger: 'blur' },
			          ]
				},
				//绑定
				dialogBindPermission:false,
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
		    	requestRoleList(param).then(data => {
		    		console.log(data);
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
				var keyword = {role:this.searchForm.role};
				this.loadData(1,10,keyword);
			},

		    //列表
		    formatAvailable(row,column) {
				return row.available == false ? '不可用':'可用';
			},
			//编辑
			handleEdit(index, row) {
              	this.title='修改角色信息';
		    	this.dialogVisible = true;
		    	//初始化表单信息
		    	this.addForm.id = row.id;
		    	this.addForm.role=row.role;
		    	this.addForm.description = row.description;
		    	if (row.available) {
		    		this.addForm.available = "true";
		    	} else {
		    		this.addForm.available = "false";
				}
		    },
		    //删除
		    handleDelete(index, row) {
		    	this.$confirm('确认删除角色'+row.role+'？')
		          .then(_ => {
		            requestDeleteRole(row.id).then(data => {
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
		    	this.title='新增角色';
		    	this.dialogVisible = true;
		    	//初始化表单信息
		    	this.addForm.id='';
		    	this.addForm.role='';
		    	this.addForm.description='';
		    	this.addForm.available='true';
		    },
		    addSubmit() {
		    	var that = this;
		        this.$refs.addForm.validate((valid) => {
		          if (valid) {
		            var addParam = {id:this.addForm.id,role : this.addForm.role,description : this.addForm.description,available:this.addForm.available};
		            console.log(addParam);
		            requestUpdateRole(addParam).then(data => {
		              if (data.success) {
		                  that.$alert("新增角色成功");
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
		    	this.dialogBindPermission = true;
		    	this.bindList.id = row.id;
		    	requestAllPermissionList().then(data => {
		    		if (data.success) {
		    			this.bindList.options = data.rows;
		    			requestPermissionListByRoleId({roleId:row.id}).then(data => {
		    				if (data.success) {
		    					//获取的是已有权限id集合给value，和option的value匹配
		    					this.bindList.value = data.rows;
		    				} else {
		    					this.$alert(data.errorMsg);
		    					this.dialogBindPermission = false;
		    				}
		    			})
		    			
		    		} else {
		    			this.$alert(data.errorMsg);
		                this.dialogBindPermission = false;
		    		}
		    	})
		    },
		    bindSubmit() {
		    	var bindParam = {roleId:this.bindList.id,permissionIds:this.bindList.value};
		    	requestRoleBindPermissions(bindParam).then(data => {
		    		if (data.success) {
		    			this.$alert("绑定成功");
		    			this.dialogBindPermission = false;
		    		} else {
		    			this.$alert(data.errorMsg);
		    			this.dialogBindPermission = false;
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