import axios from 'axios';
import router from '../router';
import { MessageBox } from 'element-ui';

axios.defaults.withCredentials = true;

let base = 'http://localhost:8080/ShiroDemo';

//添加响应拦截器
axios.interceptors.response.use( response =>{
 //对响应数据做些事
 if (response.data && response.data.code == 521) {
 	MessageBox.alert('请先登录！');
  	router.push('/');
  	return false;
  } else {
  	return response;
  }
 
},error => {
 //请求错误时做些事
 MessageBox.alert(error);
 return false;
});

//账户模块
export const requestLogin = params => { return axios.post(`${base}/account/login`, params).then(res => res.data); };

export const requestRegister = params => { return axios.post(`${base}/account/register`, params).then(res => res.data); };

export const requestLogout = params => { return axios.get(`${base}/account/logout`, params).then(res => res.data); };

//用户模块
export const requestUserUpdate = params => { return axios.post(`${base}/user/update`, params).then(res => res.data); };

export const requestUserList = params => { return axios.get(`${base}/user/table`, {params:params}).then(res => res.data); };

export const requestDeleteUser = params => { return axios.delete(`${base}/user/${params}`).then(res => res.data); };

export const requestSelectUser = params => { return axios.get(`${base}/user/${params}`).then(res => res.data); };

export const requestUserBindRoles = params => { return axios.post(`${base}/user/bind`, params).then(res => res.data); };

//修改密码
export const requestUpdatePassword = params => { return axios.post(`${base}/user/updatePassword`, params).then(res => res.data); };

//角色模块
export const requestRoleList = params => { return axios.get(`${base}/role/table`,{params:params}).then(res => res.data); };

export const requestAllRoleList = params => { return axios.get(`${base}/role/all`,{params:params}).then(res => res.data); };

export const requestRoleListByUserId = params => { return axios.get(`${base}/role/user`,{params:params}).then(res => res.data); };

export const requestUpdateRole = params => { return axios.post(`${base}/role/update`,params).then(res => res.data); };

export const requestSelectRole = params => { return axios.get(`${base}/role/${params}`).then(res => res.data); };

export const requestDeleteRole = params => { return axios.delete(`${base}/role/${params}`).then(res => res.data); };

export const requestRoleBindPermissions = params => { return axios.post(`${base}/role/bind`, params).then(res => res.data); };

//权限模块
export const requestPermissionList = params => { return axios.get(`${base}/permission/table`,{params:params}).then(res => res.data); };

export const requestUpdatePermission = params => { return axios.post(`${base}/permission/update`,params).then(res => res.data); };

export const requestSelectPermission = params => { return axios.get(`${base}/permission/${params}`).then(res => res.data); };

export const requestDeletePermission = params => { return axios.delete(`${base}/permission/${params}`).then(res => res.data); };

export const requestAllPermissionList = params => { return axios.get(`${base}/permission/all`,{params:params}).then(res => res.data); };

export const requestPermissionListByRoleId = params => { return axios.get(`${base}/permission/role`,{params:params}).then(res => res.data); };