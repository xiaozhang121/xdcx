<template>
	<view class="brief-introduction">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle" :showBack="navigationBarStyle.showBack"></navigationBar>
		</view>
		<!-- 合唱团简介 -->
		<view class="row-title">
			{{choirInfo.name}}合唱团
			<view class="btn-row">
			</view>
		</view>
		<view class="outbox">
			<view>
				<view class="tag">{{tp[Number(choirInfo.type)-1]}}</view>
				<view class="tag">
					{{choirInfo.memberCount}}人
				</view>
			</view>
			<view :class="choirInfo.voteSign?'btnsed':'btns'">
				<view class="vote" @click.stop="vote(choirInfo.id)">{{choirInfo.voteSign?'投票+1':'投票'}}
					<image src="../../static/spa/vote.png" mode="aspectFit" class="add_one" v-show="choirInfo.animation"></image>
				</view>
				<view class="total">{{choirInfo.likeCount || 0}}票</view>
			</view>
		</view>
		<view class="row-title">
			合唱团风采
		</view>
		<view class="outbox_img">
			<image v-for="item in choirInfo.choirs" :key="item.id" :src="item.imgUrl" mode="aspectFill" class="chrio_img"></image>
		</view>
		<view class="row-title" v-show="choirInfo.worksUrl!=''">
			作品链接
		</view>
		<view class="outbox">{{choirInfo.worksUrl}}</view>
		<view class="row-title">
			合唱团简介
		</view>
		<view class="outbox">{{choirInfo.introduction}}</view>
		<button class="share-btn" open-type="share">分享合唱团</button>
	</view>
</template>

<script>
	
	import navigationBar from "../components/header.vue"
	export default {
		data() {
			return {
				choirInfo:{
					name:'',
					type:1,
					memberCount:0
				},
				tp:["青少年合唱团","中年合唱团","老年合唱团"],
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '合唱团简介',
					custom:false,
					showBack:true
				},
			};
		},
		components: {
			navigationBar
		},
		onLoad(options) {
			this.getDataByChrioId(options.id)
		},
		methods:{
			getDataByChrioId(choirId){
				let tempParams = {
					choirId:choirId,
					memberId: uni.getStorageSync("user").id
				}
				this.util.request(this, '/llcy/choir/getChoirById', tempParams, true)
					.then(res => {
						if(res.ok){
							this.choirInfo = {...res.data, animation:false, voteSign: res.data.isLike == 1?true:false};
						}
					})
					.catch(err => {
						this.util.message(err.msg);
					})
			},
			vote(chrioId) {
				// console.log(chrioId);
				this.util.request(this, '/llcy/choir/likeChoir', {
						choirId:chrioId,
						memberId:uni.getStorageSync("user").id
					}, true)
					.then(res => {
						if(!res.ok){
							this.util.message(res.message);
							return;
						}
						this.choirInfo.likeCount = res.data;
					})
					.catch(err => {
						this.util.message(err.message);
					})
				this.choirInfo.voteSign = true;
				this.choirInfo.animation = true;
				setTimeout(() => {
					this.choirInfo.animation = false;
				}, 1000);
			},
			onShareAppMessage: function(options) {
				return {
					title: `动动小手，给${this.choirInfo.name}合唱团投上一票，助力合唱团赢取大奖！`,
					path: "/pages/spa/brief_introduction",
					imageUrl: this.choirInfo.choirs[0].imgUrl,
					success: function() {
						console.log("转发成功");
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.brief-introduction {
		.sticky_clazz{
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;	
			z-index: 101;
		}
		.btn-row {
			position: absolute;
			right: 0rpx;
			display: flex;
			top: 50%;			
			transform: translateY(-50%);
			

			view {
				background-color: $row-title;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				line-height: 40rpx;
				padding: 10rpx 30rpx;
			}
		}
		.outbox_img{ 
			margin: 0 30rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:42rpx;
			.chrio_img{
				width: 690rpx;
				height: 355rpx;
				margin-bottom: 20rpx;
			}
		}
		.outbox{
			margin: 0 30rpx;
			font-size:30rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:42rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			.btns,
			.btnsed {
				width: 295rpx;
				height: 60rpx;
				line-height: 60rpx !important;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				color: #FF464C;
				border-radius: 10rpx;
				border: 1rpx solid #FF464C;
				text-align: center;
			
				.vote {
					width: 50%;
					height: 60rpx;
					border-right: 1rpx solid #FF464C;
					position: relative;
			
					.add_one {
						width: 45rpx;
						height: 45rpx;
						position: absolute;
						top: -25rpx;
						left: 50%;
						transform: translateX(-50%);
						z-index: 100;
						animation: ClickLikeAni 1s ease-in-out;
					}
				}
			
				.total {
					width: 50%;
					height: 60rpx;
				}
			}
			
			.btnsed {
				color: #FFF;
				background-color: #FF464C;
				border: none;
			
				.vote {
					border-right: 1rpx solid #fff;
				}
			}
		}
		.share-btn{
			margin:110rpx 55rpx 55rpx 55rpx;
			background:rgba(250,86,88,1);
			border-radius:42rpx;
			font-size:34rpx;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,1);
			line-height:48rpx;
			text-align: center;
			padding: 14rpx 0;
		}
	}
	@keyframes ClickLikeAni {
		0% {
			top: 0px;
		}
	
		10% {
			top: -3px;
		}
	
		20% {
			top: -6px;
		}
	
		30% {
			top: -9px;
		}
	
		40% {
			top: -12px;
			transform: rotate(6deg);
		}
	
		50% {
			top: -15px;
			transform: rotate(12deg);
		}
	
		60% {
			top: -18px;
			transform: rotate(6deg);
		}
	
		70% {
			top: -21px;
			transform: rotate(0deg);
		}
	
		80% {
			top: -24px;
			transform: rotate(-6deg);
			opacity: 0.7;
		}
	
		90% {
			top: -27px;
			transform: rotate(-12deg);
			opacity: 0.5;
		}
	
		100% {
			top: -30px;
			transform: rotate(-6deg);
			opacity: 0.2;
		}
	}
</style>
