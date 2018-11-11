<template>
  <div class='newarticle'>
    <!-- 按钮区 -->
    <div class="btns">
      <el-select clearable style='width:120px' size='mini' v-model="params.categoryId" placeholder="所有栏目">
        <el-option v-for='c in categories' :label='c.name' :value='c.id' :key='c.id'></el-option>
      </el-select>
      <el-input
        style="width:130px"
        size="mini"
        placeholder="请输入关键字"
        v-model="params.keywords"
        clearable>
      </el-input>
      <el-button type="primary"size='mini' @click='toAddArticle'>添加</el-button>
      <el-button type="primary"size='mini' @click='batchDeleteArticles'>批量删除</el-button>
    </div>
    <!-- 按钮区结束 -->
    <!-- 数据区 -->
    <div class="article_tbl" v-loading='loading'>
      <el-table :border='true' size='mini' :data="articles" style="width: 100%" @selection-change="handleSelectionChange">
         <el-table-column
          type="selection"
          width="100"
          align='center' >
        </el-table-column>
        <el-table-column
          prop="title"
          label="文章标题"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="category.name"
          label="所属栏目"
          align='center'>
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者"
          width="100"
          align='center'>
        </el-table-column>
         <el-table-column
          prop="publishtime"
          label="发布时间"
          align='center'>
        </el-table-column>
         <el-table-column
          prop="readtimes"
          label="阅读次数"
          align='center'>
        </el-table-column>
        <el-table-column label="操作" width='100'>
          <template slot-scope='{row}'>
            <i class="fa fa-pencil" @click='toUpdateArticle(row)'></i>
            <i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 数据区结束 -->
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='handleCurrentChange'
        :page-size='params.pageSize'
        :total="total">
      </el-pagination>
    </div>
    <!-- 分页结束 -->
    <!-- 模态框区 -->
    <el-dialog fullscreen :title="articleDialog.title" :visible.sync="articleDialog.visible">
      <el-form :model="articleDialog.form" :rules="rules" ref="articleDialog.form">
        <el-form-item label="资讯标题" label-width="120px" prop="title">
          <el-input v-model="articleDialog.form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属栏目" label-width="120px" prop="categoryId">
          <el-select v-model="articleDialog.form.categoryId" placeholder="一级栏目">
            <el-option :key='index' v-for='(c,index) in categories' :label="c.name" :value="c.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="列表样式" label-width="120px" prop="liststyle">
          <div class="list_style">
            <div class="list_one" 
            :class='{current:articleDialog.form.liststyle == "style-one"}' 
            @click='articleDialog.form.liststyle="style-one"'>
              <img src="@/assets/style-one.jpg" alt="">
            </div>
            <div class="list_two" 
            :class='{current:articleDialog.form.liststyle == "style-two"}'
            @click='articleDialog.form.liststyle="style-two"'>
              <img src="@/assets/style-two.jpg" alt="">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="缩略图" label-width="120px">
          <el-upload
            action="http://47.106.244.20:8099/manager/file/upload"
            :file-list="articleDialog.fileList"
            :on-remove='handleUploadRemove'
            :on-success='handlerUploadSuccess'
            list-type="picture">
            <el-button size="mini" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="资讯正文" label-width="120px" prop="content">
          <!-- 富文本编辑器 -->
          <mavon-editor v-model="articleDialog.form.content"/>
        </el-form-item>
        <el-form-item>
          <el-button class='dialogBtns' type="primary" @click="submitForm('articleDialog.form')">确 定</el-button>
          <el-button class='dialogBtns' @click='closeArticleDialog'>取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 模态框区结束 -->
  </div>
</template>
<script>
  import axios from '@/http/axios'
  export default {
    data(){
      return {
        loading:false,
        categories:[],
        articles:[],
        multipleSelection:[],
        total:0,
        params:{
          page:0,
          pageSize:10,
        },
        articleDialog:{
          title:'',
          visible:false,
          form:{
            liststyle:'style-one',
            fileIds:[]
          },
          fileList:[]
        },
        rules: {
                title: [
                  { required: true, message: '请输入资讯标题', trigger: 'blur' },
                ],
                categoryId: [
                  { required: true, message: '请选择所属栏目', trigger: 'change' }
                ],
                content: [
                  { required: true, message: '请输入资讯正文', trigger: 'blur' },
                ],
            }
      }
    },
    watch:{
      // 只要params中的任意参数发生改变，就要刷新页面
      params:{
        handler:function(){
          this.findAllArticles();
        },
        deep:true
      }
    },
    created(){
      this.findAllCategories();
      this.findAllArticles();
    },
    methods:{
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveOrUpdateArticle();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteArticle(id){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(()=>{
          let url = '/manager/article/deleteArticleById?id='+id;
          axios.get(url)
          .then(({data:result})=>{
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            });
            this.findAllArticles();
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
      toUpdateArticle(row){
        // 1. 显示模态框
        this.articleDialog.title = '修改资讯';
        this.articleDialog.visible = true;
        // 2. 克隆当前行数据（避免错误修改）
        let article = _.cloneDeep(row);
        // 3. 处理附件默认显示
        this.articleDialog.fileList = article.articleFileVMs.map((item)=>{
          return {
            name:item.cmsFile.id,
            url:'http://39.108.81.60:8888/group1/'+item.cmsFile.id
          }
        })

        // 4. 处理表单数据    
        // 4.1 依赖栏目 category - > categoryId
        article.categoryId = article.category.id;
        delete article.category;
        // 4.2 依赖文件 articleFileVMs -> fileIds
        article.fileIds = article.articleFileVMs.map(item=>item.cmsFile.id);
        delete article.articleFileVMs;
        // 4.3 取消默认空值
        for(let key in article){
          let val = article[key]
          if(!val){
            delete article[key];
          }
        }
        //5 将处理后的结果与表单双向绑定
        this.articleDialog.form = article;
      },
      batchDeleteArticles(){
        this.$confirm('此操作将永久删除这些数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(()=>{
          let url = '/manager/article/batchDeleteArticle';
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
            this.findAllArticles();
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
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      // 关闭模态框
      closeArticleDialog(){
        this.articleDialog.visible = false;
      },
      // 保存或更新文章
      saveOrUpdateArticle(){
        let url = '/manager/article/saveOrUpdateArticle'
        axios.post(url,this.articleDialog.form)
        .then(({data:result})=>{
          if(result.status = 200){
            //1. 关闭模态框
            this.closeArticleDialog();
            //2. 提示成功
            this.$notify({
              title: '成功',
              message: result.message,
              type: 'success'
            });
            //3. 刷新
            this.findAllArticles();
          } else {
            this.$notify.error({
              title: '错误',
              message: result.message
            });
          }
        })
        .catch((error)=>{
          this.$notify.error({title: '错误', message: '网络异常'});
        });
      },
      handlerUploadSuccess(response, file, fileList){
        this.articleDialog.form.fileIds.push(response.data.id);
      },
      // 删除附件
      handleUploadRemove(file){
        //1. 调用接口删除图片
        axios.get('/manager/file/delete',{
          params:{
            id:file.name
          }
        })
        .then(()=>{
          this.$notify({title:'成功', message:'操作成功'})
          //2. 从fileIds中移除掉
          _.remove(this.articleDialog.form.fileIds,(id)=>{
            return id == file.name;
          });
          this.articleDialog.form.fileIds.push(1);
          this.articleDialog.form.fileIds.pop();
        })
        .catch(()=>{
          this.$notify.error({title:'错误', message:'网络异常'})
        })
      },
      toAddArticle(){
        this.articleDialog.form = {
            liststyle:'style-one',
            fileIds:[],
        };
        this.articleDialog.title = '发布资讯';
        this.articleDialog.visible = true;
        this.articleDialog.fileList=[];
      },
      // 查询所有栏目
      findAllCategories(){
        let url = '/manager/category/findAllCategory';
        axios.get(url).then(({data:result})=>{
          this.categories = result.data;
        }).catch((error)=>{
          this.$notify.error({
            title:'错误',
            message:'网络异常'
          })
        })
      },
      handleCurrentChange(page){
        this.params.page = page-1;
      },
      // 查询所有文章
      findAllArticles(){
        this.loading = true;
        let url = '/manager/article/findArticle';
        axios.get(url,{
          params:this.params
        })
        .then(({data:result})=>{
          // 将查询到的数据绑定到模型中
          console.log(result);
          this.total = result.data.total;
          this.articles = result.data.list;
        }).catch((error)=>{
          this.$notify.error({
            title:'错误',
            message:'网络异常'
          })
        }).finally(()=>{
          this.loading = false;
        });
      },
    }
  }
</script>

<style scoped>
  .list_style > div {
    width: 200px;
    height: 80px;
    overflow-y: hidden;
    border:1px solid #ededed;
    padding: .5em;
    border-radius: 5px;
  }
  .list_style > div.current{
    border-color: #419fff;
  }
  .list_style img {
    width: 100%;
  }
  .list_style > div.list_one {
    float: left;
  }
  .list_style > div.list_two {
    margin-left: 220px;
  }
  .btns {
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
  .page{
    position: fixed;
    bottom: 1em;
    right: 2em;
  }
  .dialogBtns{
    float: right;
    margin:0 1em;
  }
</style>