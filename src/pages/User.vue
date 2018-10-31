<template>
	<div class="user">
		<el-button type="primary" size="mini" @click='addUser'>新增</el-button>
		<!-- card -->
		<div class="user-body">
			<el-row :gutter="20">
			  <el-col :span="8"  v-for="user in users" style="margin:10px 0">
			    <el-card :body-style="{ padding: '0px'}">
			    	<i class="el-icon-delete el-icon " @click='deleteUserById(user.id)'></i>
			    	<i class="el-icon-edit el-icon" @click='editUser(user)'></i>
			    	<div class="img">
			    		<img class="img-circle" style="width:150px;height:150px;" :src="user.userface?user.userface:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514093920321&di=913e88c23f382933ef430024afd9128a&imgtype=0&src=http%3A%2F%2Fp.3761.com%2Fpic%2F9771429316733.jpg'" alt="...">
			    	</div>

		      	<div class="caption">
		      		<el-row >
		      			<el-col :span="10">用户名: </el-col> 
		      			<el-col :span="14">{{user.username?user.username:'-'}}</el-col>
		      		</el-row>
		      		<el-row >
		      			<el-col :span="10">真实姓名: </el-col> 
		      			<el-col :span="14">{{user.nickname?user.nickname:'-'}}</el-col>
		      		</el-row>
		      		<el-row >
		      			<el-col :span="10">email: </el-col> 
		      			<el-col :span="14">{{user.email?user.email:'-'}}</el-col>
		      		</el-row>
		      		<el-row >
		      			<el-col :span="12">状态: </el-col> 
		      			<el-switch v-model="user.enabled"> </el-switch> 
		      			</el-row>
			      </div>
			    </el-card>
			  </el-col>
			</el-row>
		</div>
		<!-- card end -->
		<!-- 模态框 -->
		<el-dialog title="添加用户":visible.sync="dialogVisible"> 
			<el-form :model="user.form">
		    <el-form-item label="用户名" label-width="120px">
		      <el-input v-model="user.form.username" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="密码" label-width="120px">
		      <el-input v-model="user.form.password" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="确认密码" label-width="120px">
		      <el-input v-model="user.passwordSure" autocomplete="off"></el-input>
		    </el-form-item>
		  	<el-form-item label="真实姓名" label-width="120px">
		      <el-input v-model="user.form.nickname" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="邮箱" label-width="120px">
		      <el-input v-model="user.form.email" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="头像" label-width="120px">
		      <el-input v-model="user.form.userface" autocomplete="off"></el-input>
		    </el-form-item>
		  </el-form>
	  	<span slot="footer" class="dialog-footer">
	    <el-button @click="closeUserDialog">取 消</el-button>
	    <el-button type="primary" @click="saveUser ">确 定</el-button>
  		</span>
		</el-dialog>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default{
		data(){
			return{
				users:[],
				dialogVisible: false,
				user:{
					title:'',
					form:{},
					passwordSure:''
				},
				loading:false,
			}
		},
		beforeMount(){
			this.loadUser();
		},
		methods:{
			editUser(userdata){
				this.dialogVisible=true;
				let newuser=_.cloneDeep(userdata); //深克隆，操作,避免错误修改
				delete newuser .regTime;
				delete newuser .roles;
				this.user.form=newuser;
			},
			deleteUserById(id){
				this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        })
	        .then(()=>{
	        	let url = 'manager/user/deleteUserById?id='+id;
	        	axios.get(url)
	        	.then(()=>{
	        		this.$notify({
			          title: '成功',
			          message: '操作成功',
			        });
			        this.loadUser();
	        	})
	        	.catch(()=>{
	        		this.$notify.error({
			          title: '错误',
			          message: '删除异常'
			        });
	        	});
	        })
	        .catch(()=>{});
			},
			closeUserDialog(){
				this.user.form = {};
				this.dialogVisible=false;
			},
			saveUser(){
				if(this.user.form.username&&this.user.form.password&&this.user.passwordSure&&this.user.form.nickname&&this.user.form.email){
					if(this.user.form.password==this.user.passwordSure){
						// 保存
					let url = '/manager/user/saveOrUpdateUser'
					axios.post(url,this.user.form)
					.then(({data:result})=>{
						if(result.status = 200){
							//1. 关闭模态框
							this.closeUserDialog();
							//2. 提示成功
							this.$notify({
			          title: '成功',
			          message: result.message,
			          type: '操作异常'
			        });
			        //3. 刷新
							this.loadUser();
						} else {
							this.$notify.error({
			          title: '错误',
			          message: result.message
			        });
						}
					})
					.catch((error)=>{
						this.$notify.error({
			          title: '错误',
			          message: '网络异常'
			        });
					});
					}else{
						this.$notify.error({
			          title: '两次密码不一致',
			          message: '操作异常'
			        });
					}
				}else{
					this.$notify.error({
			          title: '请输入完整信息',
			          message: '操作异常'
			        });
				}
			},
			addUser(){
				this.dialogVisible=true;
			},
			loadUser(){
				this.loading=true;
				let url='manager/user/findAllUser';
				axios.get(url).then(({data:result})=>{
					// 将查询到的数据绑定到模型中
					this.users = result.data;
				}).catch((error)=>{
					console.log('error',error);
				}).finally(()=>{
					this.loading=false;
				})
			},
		}
	}
</script>
<style scoped>
	.img{
		width:150px;height:150px;
		margin:0 auto;
		margin-top:1em;
	}
	img{
		border-radius: 50%;
	}
	*{
		box-sizing: border-box;
	}
	.el-row {
		line-height: 40px;
		/*text-align: center;*/
		padding: 0 2em;
	}
	.el-card:hover .el-icon{
		display: block;
	}
	.caption{
		font-size: 18px;
		color: #333;
		font-family: '宋体';

	}
	.el-icon{
		float: right;
		margin: .5em;
		font-size: 18px;
		cursor: pointer;
		display: none;
	}
	.el-icon:hover{
		color: #66b1ff;
	}
</style>