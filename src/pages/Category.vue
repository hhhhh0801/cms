<template>
	<div class="category">
		<div class="btn">
			<el-button type="primary" size="mini" @click='addCategory'>新增</el-button>
		  <el-button type="primary" size="mini" @click='batchDelCategory'>批量删除</el-button>
		</div>
		<!-- 表格 -->
		<div class="table" v-loading="loading">
		  <el-table :data="categories":border='true' style="width: 100%" size="mini" @selection-change="handleSelectionChange">
			  <!-- <el-table-column label="编号" width="100"  align='center'> 
					<template slot-scope="{row}">
							<input type="checkbox" v-model='ids' :value='row.id' >
	      	</template>
		    </el-table-column>  -->
		    <el-table-column
          type="selection"
          width="100"
          align='center' >
        </el-table-column>
		    <el-table-column prop="name"label="栏目名称" align='center'> </el-table-column> 
		    <el-table-column prop="parent.name"label="父栏目"  align='center'> </el-table-column> 
		    <el-table-column prop="comment"label="描述"  align='center'> </el-table-column> 
		    <el-table-column label="操作" width="180"  align='center'> 
					<template slot-scope="{row}">
		      		<i class="fa fa-pencil" @click='updateCategory(row)'></i>
	        		<i class="fa fa-trash" @click='deleteCategory(row.id)'></i>
	      	</template>
		    </el-table-column> 
		  </el-table>
	  </div>
	  <!-- 模态框 -->
	  <div class="dialog">
	  	<el-dialog :title="categoryDialog.title" :visible.sync="categoryDialog.visible">
			  <el-form :model="categoryDialog.form">
			    <el-form-item label="栏目名称" label-width="120px">
			      <el-input v-model="categoryDialog.form.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="父栏目" label-width="120px">
			      <el-select v-model="categoryDialog.form.parentId" placeholder="请选择" >
			        <el-option :key='index' v-for='(c,index) in categories' :label="c.name" :value="c.id"></el-option>
			      </el-select>
			    </el-form-item>
			    <el-form-item label="描述信息" label-width="120px">
			      <el-input type="textarea":rows="2"placeholder="请输入内容"v-model="categoryDialog.form.comment"> </el-input> 
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click='closeCategoryDialog'>取 消</el-button>
			    <el-button type="primary" @click='saveOrUpdateCategory'>确 定</el-button>
			  </div>
			</el-dialog>
	  </div>
	</div>
</template>
<script>
	import axios from '@/http/axios'
	export default {
		data(){
			return{
				categories:[],
				loading:false,
				multipleSelection:[],
				categoryDialog:{
					title:'',
					form:{},
					visible:false
				}
			}
		},
		created(){
			// 加载所有栏目信息
			this.loadCategory();
		},
		methods:{
			handleSelectionChange(val){
        this.multipleSelection = val;
      },
			batchDelCategory(){
        this.$confirm('此操作将永久删除该栏目信息,以及该栏目关联栏目和文章 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(()=>{
          let url = '/manager/category/batchDeleteCategory';
          let ids  = this.multipleSelection.map((item)=>{
            return item.id;
          })
          var obj = {
            ids:ids.toString()
          };
          axios.post(url,obj)
          .then(({data:result})=>{
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            });
            this.loadCategory();
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
			updateCategory(row){
				this.categoryDialog.title='修改信息';
				this.categoryDialog.visible=true;
				this.categoryDialog.form=row;

				// if(){

				// }
			},
			deleteCategory(id){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=>{
        	let url = '/manager/category/deleteCategoryById?id='+id;
        	axios.get(url)
        	.then(({data:result})=>{
        		this.$notify({
		          title: '成功',
		          message: result.message,
		          type: 'success'
		        });
		        this.loadCategory();
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
			saveOrUpdateCategory(){
				let url = '/manager/category/saveOrUpdateCategory'
				axios.post(url,this.categoryDialog.form)
				.then(({data:result})=>{
					if(result.status = 200){
						//1. 关闭模态框
						this.closeCategoryDialog();
						//2. 提示成功
						this.$notify({
		          title: '成功',
		          message: result.message,
		          type: 'success'
		        });
		        //3. 刷新
						this.loadCategory();
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
			},
			addCategory(){
				this.categoryDialog.title='添加栏目';
				this.categoryDialog.visible=true;
			},
			closeCategoryDialog(){
				this.categoryDialog.form = {};
				this.categoryDialog.visible=false;
			},
			loadCategory(){
				this.loading=true;
				let url='/manager/category/findAllCategory';
				axios.get(url).then(({data:result})=>{
					// 将查询到的数据绑定到模型中
					this.categories = result.data;
				}).catch((error)=>{
					console.log('error',error);
				}).finally(()=>{
					this.loading=false;
				})
			}

		}
	}
</script>
<style scoped>
	.btn {
		margin-bottom: .5em;
	}
	i.fa {
		margin: 0 .5em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
	i.fa-pencil{
		color:#66bb0d;
	}
</style>
