<template>
	<view class="mygroup_wrap">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		
		<view class="no_data_wrap" v-if="myChoir==null">
			<view class="no_data">
				<image src="../../static/spa/no_data.png" mode="aspectFit"></image>
				<text>您暂未报名，赶紧参加报名哦～</text>
			</view>
			<view class="conutdown_wrap">
				<countdown :deadline="startTime"></countdown>
			</view>
			<view class="sign_up_now" @click="signUpNow">立即报名</view>
		</view>
		<view class="has_data_wrap" v-else>
			<view class="single_part">
				<view class="header">{{myChoir.name}}合唱团</view>
				<view class="label_wrap">
					<span class="chrio_name">{{tp[Number(myChoir.type)-1]}}</span>
					<span class="chrio_num">{{myChoir.memberCount}}人</span>
					<span class="sign_up_status" v-show="myChoir.verifyStatus==0">待审核</span>
				</view>
			</view>
			<view class="single_part">
				<view class="header">合唱团风采</view>
				<image :src="item.imgUrl" mode="aspectFill" class="chrio_img" v-for="item in myChoirImgs" :key="item.id"></image>
			</view>
			<view class="single_part" v-show="myChoir.worksUrl!=''">
				<view class="header">作品链接</view>
				<view class="chrio_url">{{myChoir.worksUrl}}</view>
			</view>
			<view class="single_part">
				<view class="header">合唱团简介</view>
				<view class="chrio_desc">{{myChoir.introduction}}</view>
			</view>
			<view class="split_line"></view>
			<view class="single_part">
				<view class="header">创建者信息</view>
				<view class="info">
					<view class="name_phone">{{myChoir.connectUser}} <text class="phone">{{myChoir.connectPhone}}</text></view>
					<view class="addr">{{myChoir.province}} {{myChoir.city}} {{myChoir.area}} {{myChoir.connectAddr}}</view>
				</view>
			</view>
			<button class="share_chrio" open-type="share">分享合唱团</button>
		</view>
	</view>
</template>

<script>
	import countdown from "../components/countdown.vue";
	import navigationBar from "../components/header.vue";
	export default {
		data() {
			return {
				myChoir: {
					type:1,
					introduction:"",
					connectUser:"",
					connectPhone:"",
					province:"",
					city:"",
					area:"",
					connectAddr:"",
					name:'',
					memberCount:0
				},
				tp:["青少年合唱团","中年合唱团","老年合唱团"],
				myChoirImgs:[],
				startTime:'2020/07/28 07:00:00',
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '合唱团简介',
					custom:false
				},
			}
		},
		components: {
			countdown,
			navigationBar
		},
		onLoad(options) {
			this.getMyGroup();
			this.getStartTime();
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
		methods: {
			getStartTime(){
				this.util.request(this, '/llcy/choir/getStartTime', {}, true)
					.then(res => {
						this.startTime = res.data;
					})
					.catch(err => {
						this.util.message(err.message);
					})
			},
			signUpNow() {
				uni.switchTab({
					url: "./signup"
				})
			},
			getMyGroup() {
				this.util.request(this, '/llcy/choir/getChoir', {
						memberId: uni.getStorageSync("user").id
					}, true)
					.then(res => {
						if (res.ok) {
							this.myChoir = res.data.choir;
							this.myChoirImgs = res.data.imgs
						}
					})
					.catch(err => {
						this.util.message(err.msg);
					})

			},
			onShareAppMessage: function(options) {
				return {
					title: `动动小手，给${this.myChoir.name}合唱团投上一票，助力合唱团赢取大奖！`,
					path: "/pages/spa/brief_introduction",
					imageUrl: this.myChoirImgs[0].imgUrl,
					success: function() {
						console.log("转发成功");
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	@mixin icon($width:4rpx, $height:30rpx) {
		content: "";
		position: absolute;
		width: $width;
		height: $height;
		top: 50%;
		left: 0%;
		transform: translateY(-50%);
		background-color: #FA5658;
	}

	.mygroup_wrap {
		padding-bottom: 30rpx;
		.sticky_clazz{
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;	
			z-index: 101;
		}
		.no_data_wrap {
			padding-top: 152rpx;
			box-sizing: border-box;

			.no_data {
				font-size: 32rpx;
				color: #333;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 164rpx;

				image {
					width: 547rpx;
					height: 350rpx;
				}
			}

			.conutdown_wrap {
				display: flex;
				justify-content: center;
			}

			.sign_up_now {
				width: 256rpx;
				height: 75rpx;
				line-height: 75rpx;
				text-align: center;
				background: linear-gradient(90deg, rgba(244, 69, 69, 1) 0%, rgba(252, 90, 92, 1) 100%);
				border-radius: 20rpx;
				font-size: 34rpx;
				color: #fff;
				margin: 49rpx auto;
			}
		}

		.has_data_wrap {
			font-size: 32rpx;
			color: #333;

			.single_part {
				padding: 0 30rpx;
				box-sizing: border-box;
				.header {
					height: 100rpx;
					line-height: 100rpx;
					padding-left: 20rpx;
					position: relative;
					font-weight: bold;

					&::before {
						@include icon();
					}
				}

				.label_wrap {
					font-size: 28rpx;
					color: #fff;
					position: relative;
					.chrio_name {
						width: 180rpx;
						height: 45rpx;
						line-height: 45rpx;
						background: rgba(250, 86, 88, 1);
						padding: 5rpx 10rpx;
						margin-right: 20rpx;
					}

					.chrio_num {
						width: 102px;
						height: 45px;
						line-height: 45rpx;
						background: rgba(253, 165, 60, 1);
						padding: 5rpx 20rpx;
					}
					.sign_up_status{
						width: 125rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						background-color: #FF464C;
						color: #fff;
						border-radius: 10rpx;
						position: absolute;
						top: 50%;
						right: 0rpx;
						transform: translateY(-50%);
					}
				}

				.chrio_img {
					width: 690rpx;
					height: 355rpx;
					margin-bottom: 20rpx;
				}

				.chrio_url {
					width: 100%;
					height: 42rpx;
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 42rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					text-indent: 20rpx;
				}

				.chrio_desc {
					width: 100%;
					text-indent: 20rpx;
					margin-bottom: 30rpx;
				}

				.info {
					.name_phone {
						font-size: 30rpx;
						margin-bottom: 20rpx;
						font-weight: bold;

						.phone {
							color: #696969;
							margin-left: 30rpx;
							font-weight: normal;
						}
					}

					.addr {
						font-size: 27rpx;
					}
				}
			}

			.split_line {
				width: 100%;
				height: 20rpx;
				background-color: #F7F7F7;
			}

			.share_chrio {
				width: 640rpx;
				height: 76rpx;
				line-height: 76rpx;
				background: rgba(250, 86, 88, 1);
				border-radius: 42rpx;
				margin: 0 auto;
				margin-top: 78rpx;
				margin-bottom: 64rpx;
				font-size: 34rpx;
				color: #fff;
				text-align: center;
				font-weight: bold;
			}
		}
	}
</style>
