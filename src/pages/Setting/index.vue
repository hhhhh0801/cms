<template>
	<div class="setting">
		<ul class="setting-nav">
			<li :class="{current:currentRouter=='/setting/info'}"><router-link to='/setting/info'>基础设置</router-link></li>
			<li :class="{current:currentRouter=='/setting/auth'}"><router-link to='/setting/Auth'>权限设置</router-link></li>
			<li :class="{current:currentRouter=='/setting/adv'}"><router-link to='/setting/Adv'>广告设置</router-link></li>
		</ul>
		<div class="setting-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				currentRouter:'/setting/info'
			}
		},
		watch:{
			'$route':function(to,from){
				this.currentRoute=to.path;

			}
		},
		mounted(){
			this.$router.push(this.currentRouter);
		}
	}
</script>
<style>
	.setting-nav{
		border-bottom: 1px solid #f0f0f0;
		height: 30px;
	}
	.setting-nav > li{
		line-height: 30px;
		float:left;
		width: 120px;
	}
	.setting-nav > .current{
		border-bottom: 1px solid pink;
	}


</style>