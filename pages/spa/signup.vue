<template>
	<view class="signup_wrap">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		
		<view class="part_one">
			<view class="single_one">
				<view class="name">合唱团名称</view>
				<input type="text" v-model="choir.name" class="input_clazz" placeholder="请输入合唱团名称" placeholder-style="color:#C2C2C2" :disabled="contEdit" :style="contEdit?'color:#696969':''"/>
			</view>
			<view class="single_one">
				<view class="name">合唱团类型</view>
				<picker @change="bindPickerChange" :value="index" :range="array" :disabled="contEdit">
					<view class="input_clazz" v-show="!choir.type==''" :style="contEdit?'color:#696969':''">{{choir.type}}</view>
					<view class="input_clazz unchoose" v-show="choir.type==0">请选择合唱团类型</view>
				</picker>
				<i class="arrow"></i>
			</view>
			<view class="single_one">
				<view class="name">合唱团人数</view>
				<input type="number" v-model="choir.number" class="input_clazz" placeholder="请输入合唱团人数" placeholder-style="color:#C2C2C2" :disabled="contEdit" :style="contEdit?'color:#696969':''" />
			</view>
			<view class="single_one">
				<view class="name">合唱团风采</view>
			</view>
			<view class="imgs_wrap">
				<view class="choose_img_single" v-show="choir.imgs.length!=0" v-for="(item, index) in choir.imgs" :key="item" @click="showPreview(item)">
					<image :src="item" mode="aspectFill" class="choose_photo"></image>
					<i class="cancel" @click.stop="delTheImg" :data-img="item"></i>
				</view>
				<view class="img_fill" @click="fillImage" v-if="choir.imgs.length<3">
					<image src="../../static/spa/photo.png" mode="aspectFit" class="photo"></image>
					<text>添加照片</text>
				</view>
				<view class="total">{{choir.imgs.length}}<i>/3</i></view>
			</view>
		</view>
		<view class="part_two">
			<view class="single_textarea_wrap">
				<view class="title">作品链接<text>(非必填)</text></view>
				<input type="text" v-model="choir.url" placeholder="请复制您的作品链接~" placeholder-style="color:#C2C2C2" class="url_input"/>
			</view>
			<view class="single_textarea_wrap">
				<view class="title">合唱团简介</view>
				<textarea placeholder-style="color:#C2C2C2;z-index:1;" placeholder="请输入合唱团简介及背后故事~" class="desc_textarea" maxlength="200" @input="inputCont" v-model="choir.desc"/>
				<view class="total">{{choir.desc.length}}<i>/200</i></view>
			</view>
		</view>
		<view class="part_three">
			<view class="single_one">
				<view class="name">创建者姓名</view>
				<input type="text" v-model="creator.name" class="input_clazz" placeholder="请输入" placeholder-style="color:#C2C2C2"/>
			</view>
			<view class="single_one">
				<view class="name">手机号码</view>
				<input type="number" v-model="creator.phone" class="input_clazz" placeholder="请输入" placeholder-style="color:#C2C2C2" maxlength="11" @blur="checkPhone"/>
			</view>
			<view class="single_one">
				<view class="name">省/市/区</view>
				<view class="no_line_height" @click="showCityPicker" v-if="creator.addr!=''">{{creator.addr}}</view>
				<view class="no_content" @click="showCityPicker" v-else>请选择</view>
				<i class="right_arrow"></i>
				<mpvue-citypicker themeColor="#FF464C" ref="mpvueCityPicker" :pickerValueDefault="[0, 0, 0]" @onConfirm="onConfirmAddress"></mpvue-citypicker>
			</view>
			<view class="no_border">
				<view class="name">详细地址</view>
				<input v-model="creator.detailAddr" placeholder="如街道、小区、单元、楼栋号、门牌号等" placeholder-style="color:#C2C2C2;z-index:1;" class="textarea_clazz"/>
			</view>
		</view>
		<button class="signup_now" @click="signUp">{{contEdit?'更 新':'报 名'}}</button>
		<uni-popup ref="img_preview" type="center">
			<image :src="previewImg" mode="aspectFit"></image>
			<view class="close" @click="closePreview"></view>
		</uni-popup>
	</view>
</template>

<script>
	import mpvueCitypicker from "@/components/mpvue-citypicker/mpvueCityPicker.vue";
	
	import navigationBar from "../components/header.vue";
	export default {
		data() {
			return {
				choir:{
					name:"",
					type:"",
					number:"",
					imgs:[], //存放本地图片地址
					imgsRemote:[], // 存放远程图片地址
					url:"",
					desc:"",
					choirId:""
				},
				choirTip:{
					name:"请输入合唱团名称",
					type:"请选择合唱团类型",
					number:"请输入合唱团人数",
					imgs:"请至少上传一张合唱团图片", //存放本地图片地址
					desc:"请输入合唱团简介",
				},
				creatorTip:{
					name:"请输入创建人姓名",
					phone:"请输入创建人电话",
					addr:"请选择创建人地址",
					detailAddr:"请输入创建人详细地址"
				},
				creator:{
					name:"",
					phone:"",
					addr:"",
					detailAddr:""
				},
				// array: ['青少年合唱团', '中年合唱团', '老年合唱团'],
				array: ['华东', '华中', '华西', '华南', '华北'],
				index: 0,
				previewImg:"",
				contEdit:false,
				
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '合唱团报名',
					custom:false
				}
			};
		},
		components: {
			'mpvue-citypicker': mpvueCitypicker,
			navigationBar
		},
		onLoad() {
			this.getMyGroup();
		},
		onShow() {
			this.util.checkLogin();
		},
		
		onPullDownRefresh() {
			this.getMyGroup();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods:{
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			showPreview(url){
				this.previewImg = url;
				this.$refs.img_preview.open();
			},
			closePreview() {
				this.$refs.img_preview.close()
			},
			onConfirmAddress(event) {
				let label = event.label.split('-');
				this.creator.addr = `${label[0]} ${label[1]} ${label[2]}`;
			},
			bindPickerChange: function(e) {
				this.index = Number(e.target.value);
				this.choir.type = this.array[this.index];
			},
			fillImage(){
				uni.chooseImage({
				    count: 3 - this.choir.imgs.length,
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: (res) => {
						this.choir.imgs = this.choir.imgs.concat(res.tempFilePaths);
						console.log(this.choir);
				    }
				});
			},
			delTheImg(e){
				let tempIndex = this.choir.imgs.indexOf(e.currentTarget.dataset.img);
				this.choir.imgs.splice(tempIndex,1);
			},
			inputCont(e){
				this.choir.desc = e.detail.value;
			},
			checkPhone(){
				this.util.verifyPhone(this.creator.phone)
			},
			signUp(){
				let canUpload = true;
				Object.keys(this.choir).map((x, i) => {
					if(this.choir[x].length === 0 && x != 'imgsRemote' && x != 'url'){
						uni.showToast({
							title:this.choirTip[x],
							icon:'none'
						})
						canUpload = false;
						return;
					}
				})
				Object.keys(this.creator).map((x, i) => {
					if(this.creator[x] === ''){
						uni.showToast({
							title:this.creatorTip[x],
							icon:'none'
						})
						canUpload = false;
						return;
					}
				})
				if(canUpload){
					this.uploadImgs();
				}
			},
			uploadInfo(){
				let tempParams = {
					memberId:uni.getStorageSync("user").id,
					name:this.choir.name,
					type:this.array.indexOf(this.choir.type)+1,
					member_count:this.choir.number,
					urls:this.choir.imgsRemote.join(","),
					works_url:this.choir.url,
					introduction:this.choir.desc,
					choirId:this.choir.choirId,
					connect_user:this.creator.name,
					connect_phone:this.creator.phone,
					province:this.creator.addr.split(" ")[0],
					city:this.creator.addr.split(" ")[1],
					area:this.creator.addr.split(" ")[2],
					connect_addr:this.creator.detailAddr,
				};
				this.util.request(this, '/llcy/choir/choirSignup', tempParams, true).then(res => {
					console.log(res);
					if(res.ok){
						uni.showToast({
							title:this.contEdit?"更新成功，待审核":"报名成功，待审核",
						})
						setTimeout(()=>{
							uni.reLaunch({
								url:"./mygroup"
							})
						},1000)
					}
				}).catch(err => {
					this.util.message(err.msg);
				})
			},
			uploadImgs(){
				this.choir.imgsRemote = [];
				this.choir.imgs.forEach((v, i) => {
					this.uploadImg(v,i);
				})
			},
			/**
			 * @param {Object} path :本地图片路径
			 * @param {Object} index :根据index判断调用报名接口
			 */
			uploadImg(path,index){
				uni.showLoading({
					title:"上传中...",
					mask:true
				})
				if(path.search("xiaode.oos-cn.ctyunapi.cn")!=-1){
					this.choir.imgsRemote.push(path);
					if(index == this.choir.imgs.length-1){
						this.uploadInfo();
					}
					return;
				}
				uni.uploadFile({
					url: this.config.contextPath + '/llcy/choir/uploadImage', 
					filePath: path,
					name: 'file',
					success: (res) => {
						this.choir.imgsRemote.push(JSON.parse(res.data).data);
						
						if(index == this.choir.imgs.length-1){
							this.uploadInfo();
						}
					},
					fail: (err) => {
						uni.showToast({
							title: err,
							icon: 'none',
							duration: 1000
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			getMyGroup() {
				this.util.request(this, '/llcy/choir/getChoir', {
						memberId: uni.getStorageSync("user").id
					}, true)
					.then(res => {
						if (res.ok) {
							let temp = res.data.choir;
							if(temp.name != '' && temp.type != '' && temp.number != ''){
								this.contEdit = true;
							}
							this.choir = {
								name:temp.name,
								type:this.array[+temp.type-1],
								number:temp.memberCount,
								imgs:res.data.imgs.map(v => v.imgUrl),
								imgsRemote:[],
								url:temp.worksUrl,
								desc:temp.introduction,
								choirId:temp.id
							}
							this.creator = {
								name:temp.connectUser,
								phone:temp.connectPhone,
								addr:`${temp.province} ${temp.city} ${temp.area}`,
								detailAddr:temp.connectAddr
							}
						}
						
						console.log(this.choir);
					})
					.catch(err => {
						this.util.message(err.msg);
					})
			
			},
		}
	}
</script>

<style lang="scss">
@mixin icon($img,$width:44rpx,$height:45rpx) {
	content:"";
	position: absolute;
	width: $width;
	height:$height;
	top:50%;
	left:0%;
	transform: translateY(-50%);
	background:url($img) no-repeat;
	background-size: 100%;
}
.signup_wrap{
	padding-bottom:30rpx;
	
	.sticky_clazz{
		position: sticky;
		position: -webkit-sticky;
		top: 0rpx;	
		z-index: 101;
	}
	.part_one{
		padding: 0 33rpx 0 31rpx;
		box-sizing: border-box;
		.single_one{
			display: flex;
			height: 100rpx;
			line-height: 100rpx;
			border-bottom: 1rpx solid #EEE;
			position: relative;
			
			picker .uni-picker-action.uni-picker-action-confirm{  
			        color: #FF464C !important;  
			}
			.name{
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
			}
			.input_clazz{
				width: 450rpx;
				margin-left: 46rpx;
				height: 100rpx;
				line-height: 100rpx;
				font-weight: normal;
			}
			.unchoose{
				color: #C2C2C2;
			}
			.arrow{
				width: 20rpx;
				height: 20rpx;
				border-top: 1rpx solid #C2C2C2;
				border-right: 1rpx solid #C2C2C2;
				position: absolute;
				top:50%;
				right:0;
				transform: translateY(-50%) rotate(135deg);
			}
		}
		.imgs_wrap{
			margin: 32rpx 0 34rpx 0;
			display: flex;
			position:relative;
			.img_fill{
				width: 162rpx;
				height: 162rpx;
				border: 2rpx dashed #E4E4E4;
				position:relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.photo{
					width: 48rpx;
					height: 38rpx;
				}
				text{
					font-size: 28rpx;
					color: #C2C2C2;
					margin-top: 26rpx;
				}
			}
			.choose_img_single{
				position: relative;
				.cancel{
					width: 40rpx;
					height: 40rpx;
					background:url(../../static/spa/cancel.png)no-repeat;
					background-size: 100%;
					position: absolute;
					top:-15rpx;
					right: 15rpx;
				}
				.choose_photo{
					width: 162rpx;
					height: 162rpx;
					margin-right: 30rpx;
					background-color: #fff;
					vertical-align: bottom;
				}
			}
			.total{
				font-size: 26rpx;
				color:#C2C2C2;
				position: absolute;
				bottom: 0;
				right: 0;
				display: flex;
				i{
					font-style: normal;
					color: #333;
				}
			}
		}
	}
	.part_two{
		border-top: 20rpx solid #F7F7F7;
		padding: 0 30rpx 0 29rpx;
		box-sizing: border-box;
		.single_textarea_wrap{
			font-size: 30rpx;
			position: relative;
			.title{
				height: 100rpx;
				line-height: 100rpx;
				font-weight: bold;
				text{
					font-weight: normal;
					color: #C2C2C2;
				}
			}
			.url_input{
				width: 690rpx;
				height: 87rpx;
				background:rgba(247,247,247,1);
				border-radius:10rpx;
				padding-left: 30rpx;
			}
			.desc_textarea{
				width: 690rpx;
				min-height: 350rpx;
				background:rgba(247,247,247,1);
				border-radius:10rpx;
				padding: 23rpx 30rpx 50rpx 30rpx;
				box-sizing: border-box;
				margin-bottom: 33rpx;
			}
			.total{
				font-size: 26rpx;
				color:#C2C2C2;
				position: absolute;
				bottom: 15rpx;
				right: 15rpx;
				display: flex;
				i{
					font-style: normal;
					color: #333;
				}
			}
		}
	}
	.part_three{
		border-top: 20rpx solid #F7F7F7;
		padding: 0 30rpx 0 29rpx;
		box-sizing: border-box;
		.single_one{
			display: flex;
			height: 100rpx;
			align-items: center;
			border-bottom: 1rpx solid #EEE;
			position: relative;
			.name{
				width:160rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
				white-space: nowrap;
			}
			.input_clazz{
				width: 450rpx;
				margin-left: 46rpx;
				height: 100rpx;
			}
			.no_line_height{
				width: 450rpx;
				margin-left: 46rpx;
				height: 100rpx;
				line-height: 100rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				font-weight: normal;
			}
			.no_content{
				width: 450rpx;
				margin-left: 46rpx;
				color: #C2C2C2;
			}
			.right_arrow{
				width: 20rpx;
				height: 20rpx;
				border-top: 1rpx solid #C2C2C2;
				border-right: 1rpx solid #C2C2C2;
				position: absolute;
				top:50%;
				right: 0;
				transform: translateY(-50%) rotate(45deg);
			}
			.unchoose{
				color: #C2C2C2;
			}
			.arrow{
				width: 20rpx;
				height: 20rpx;
				border-top: 1rpx solid #C2C2C2;
				border-right: 1rpx solid #C2C2C2;
				position: absolute;
				top:50%;
				right:0;
				transform: translateY(-50%) rotate(135deg);
			}
		}
		.no_border{
			display: flex;
			align-items: top;
			position: relative;
			.name{
				width:160rpx;
				font-size: 30rpx;
				color: #333;
				font-weight: bold;
				white-space: nowrap;
				padding-top: 30rpx;
			}
			.textarea_clazz{
				width: 450rpx;
				height: 100rpx;
				white-space: pre-wrap;
				margin-left: 46rpx;
				height: 100rpx;
				z-index: 1;
			}
		}
	}
	.signup_now{
		width: 640rpx;
		height: 76rpx;
		line-height: 76rpx;
		color: #fff;
		font-size: 34rpx;
		margin-top: 124rpx;
		background-color: #FA5658;
		border-radius:42rpx;
		font-weight: bold;
	}
	.close {
		background: url(../../static/icon_close.png) no-repeat;
		background-size: 100% 100%;
		width: 60rpx;
		height: 60rpx;
		margin: 30rpx auto;
	}
}
</style>
