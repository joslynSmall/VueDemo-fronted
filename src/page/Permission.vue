<template>
	<el-row>
		<!--查询-->
		<el-col :span="23">
			<el-form :inline="true" :model="searchForm" ref="searchForm" class="demo-form-inline">
			  <el-form-item label="权限名">
			    <el-input v-model="searchForm.permission" placeholder="权限名"></el-input>
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
					<el-table-column prop="permission" label="权限名"  >
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
		    <el-form-item label="权限名" prop="permission" :label-width="formLabelWidth">
		      <el-input v-model="addForm.permission" auto-complete="off" placeholder="权限名"></el-input>
		    </el-form-item>
		    <el-form-item label="角色描述" prop="description" :label-width="formLabelWidth">
		     <el-input type="textarea" :rows="2" v-model="addForm.description" placeholder="角色描述">
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
		
	</el-row>
</template>

<script>
	  import { requestUpdatePermission } from '../api/api';
	  import { requestPermissionList } from '../api/api';
	  import { requestDeletePermission } from '../api/api';
	  import { requestSelectPermission } from '../api/api';
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
					permission: [
			            { required: true, message: '请输入权限名', trigger: 'blur' },
			          ]
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
		    	requestPermissionList(param).then(data => {
	              if (data.success) {
	                  this.listData = data.rows;
	                  this.currentPage = data.page;
	                  this.pageSize = data.pageSize;
	                  this.total = data.total;
	              } else {
	                this.$alert(data.errorMsg);
	              }
	            })
		    },
		    //查询
		    onSearch() {
				var keyword = {role:this.searchForm.permission};
				this.loadData(1,10,keyword);
			},

		    //列表
		    formatAvailable(row,column) {
				return row.available == false ? '不可用':'可用';
			},
			//编辑
			handleEdit(index, row) {
		    	
              	this.title='修改权限信息';
		    	this.dialogVisible = true;
		    	//初始化表单信息
		    	this.addForm.id = row.id;
		    	this.addForm.permission=row.permission;
		    	this.addForm.description = row.description;
		    	if (row.available) {
		    		this.addForm.available = "true";
		    	} else {
		    		this.addForm.available = "false";
		    	}
	
		    },
		    //删除
		    handleDelete(index, row) {
		    	this.$confirm('确认删除权限'+row.permission+'？')
		          .then(_ => {
		            requestDeletePermission(row.id).then(data => {
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
		    	this.title='新增权限';
		    	this.dialogVisible = true;
		    	//初始化表单信息
		    	this.addForm.id='';
		    	this.addForm.permission='';
		    	this.addForm.description='';
		    	this.addForm.available='true';
		    },
		    addSubmit() {
		    	var that = this;
		        this.$refs.addForm.validate((valid) => {
		          if (valid) {
		            var addParam = {id:this.addForm.id,permission : this.addForm.permission,description : this.addForm.description,available:this.addForm.available};
		            console.log(addParam);
		            requestUpdatePermission(addParam).then(data => {
		              if (data.success) {
		                  that.$alert("新增权限成功");
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
</style>