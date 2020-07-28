<template>
	<view class="home_wrap">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle"></navigationBar>
		</view>
		
		<!-- 热门推荐 -->
		<view class="single_part">
			<view class="title">热门推荐</view>
			<swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="1500" circular="true">
				<swiper-item v-for="item in banners" :key="item">
					<image :src="item" mode="aspectFill" @click="gotoUrl"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="part_one">
			<!-- 幸运大抽奖 -->
			<view class="single_part" @click="gotoLuckdraw">
				<view class="title_luckdraw">幸运大抽奖</view>
				<image src="http://xiaode.oos-cn.ctyunapi.cn/202007211657196476456.jpeg" mode="aspectFit" class="part_img"></image>
			</view>
			<!-- 获奖名单 -->
			<image src="../../static/spa/awaed_list.png" mode="aspectFit" class="award_list" @click="awardsList()"></image>
			<!-- 活动规则 -->
			<countdown :deadline="startTime"></countdown>
			<view class="signup_now" @click="signUpNow">立即报名</view>
		</view>
		<view class="search_rank">
			<view class="search_input" @click="search()">
				<image src="../../static/spa/search.png" mode="aspectFit" class="search_icon"></image>
				<text>搜索合唱团名称或编号</text>
			</view>
			<view class="groups">
				<view class="title">实时排行</view>
				<view class="group" v-for="(item, index) in groups" :key="item.group">
					<view class="header">
						<view class="group_category">{{item.group}}</view>
						<view class="more" @click="lookMore(index)" v-show="item.items.length>4">查看更多>></view>
					</view>
					<view class="single_wrap" v-if="item.items.length!=0">
						<view class="single_one" v-for="(item1, index1) in item.items" :key="item1.name" @click="gotoDetail(item1.chrioId)">
							<image :src="item1.img" mode="aspectFill" class="single_img"></image>
							<view class="single_info">
								<view class="name_rank">
									<view class="group_name">{{item1.name}}</view>
									<view class="group_rank" :style="rankBgc[index1]">{{index1+1}}</view>
								</view>
								<view class="serial_number">编号：{{item1.serial}}</view>
								<view :class="item1.voteSign?'btnsed':'btns'">
									<view class="vote" @click.stop="vote(index,index1,item1.chrioId)">{{item1.voteSign?'投票+1':'投票'}}
										<image src="../../static/spa/vote.png" mode="aspectFit" class="add_one" v-show="item1.animation"></image>
									</view>
									<view class="total">{{item1.vote || 0}}票</view>
								</view>
							</view>
						</view>
					</view>
					<view class="no_chrio" v-else>
						<image src="../../static/spa/no_group.png" mode="aspectFit" class="no_group" @click="signUpNow"></image>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup_login" type="center">
			<view class="popup_login">
				<text class="login-title">微信授权</text>
				<view class="line"></view>
				<text class="login-content">您还没有进行微信授权<br>~授权后才可以参与抽奖哦！</text>
				<view class="login-buttons">
					<button class="login-cancel" @tap="closeLogin">暂不登录</button>
					<button class="login-confirm" open-type="getUserInfo" @getuserinfo="onGotUserInfo">立即登录</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import countdown from "../components/countdown.vue";
	import navigationBar from "../components/header.vue"
	
	export default {
		data() {
			return {
				groups: [
					{
						group: "华东组",
						items: [
						// {
						// 	img: "../../static/spa/luckdraw.png",
						// 	name: "夕阳红合唱团",
						// 	serial: "01",
						// 	vote: 3033,
						// 	voteSign: false,
						// 	animation: false
						// },
						]
					},
					{
						group: "华中组",
						items: []
					},
					{
						group: "华西组",
						items: []
					},
					{
						group: "华南组",
						items: []
					},
					{
						group: "华北组",
						items: []
					}
				],
				rankBgc: ["background-color: #FF464C", "background-color: #FDA53C", "background-color: #FDCF02","background-color: #B8B8B8"],
				showVote: false,
				wxLogincode: "",
				userInfo: null,
				banners:[],
				startTime:'2020/07/28 07:00:00',
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '孝德唱响',
					custom:false
				},
			};
		},
		components: {
			countdown,
			navigationBar
		},
		onLoad() {
			this.getUserInfo();
			this.getBanners();
			if (uni.getStorageSync('user')) { // 如果已有缓存则直接进首页
				this.initData();
			}
		},
		onShow() {
			if (this.util.checkLogin()) {
				this.showLogin();
			}
			
			this.refreshRanking();
		},
		onPullDownRefresh() {
			this.getStartTime();
			this.refreshRanking();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			initData() {
				this.getStartTime();
			},
			gotoUrl(){
				uni.navigateTo({
					url:"./external_link"
				})
			},
			awardsList(){
				uni.showToast({
					title:"功能暂未开放",
					icon:"none",
					duration:2000
				})
			},
			gotoLuckdraw(){
				uni.navigateTo({
					url:"../random_reward"
				})
			},
			refreshRanking(){
				this.getRank(1);
				this.getRank(2);
				this.getRank(3);
			},
			vote(index, index1,chrioId) {
				this.util.request(this, '/llcy/choir/likeChoir', {
						choirId:chrioId,
						memberId:this.userInfo.id
					}, true)
					.then(res => {
						if(!res.ok){
							this.util.message(res.message);
							return;
						}
						console.log(this.groups[index].items[index1].vote);
						this.groups[index].items[index1].vote = res.data;
						// this.util.message(`今日还剩${}投票`);
					})
					.catch(err => {
						this.util.message(err.message);
					})
				this.groups[index].items[index1].voteSign = true;
				this.groups[index].items[index1].animation = true;
				setTimeout(() => {
					this.groups[index].items[index1].animation = false;
				}, 1000);
			},
			getBanners(){
				this.util.request(this, '/llcy/choir/banners', {}, true)
					.then(res => {
						this.banners = res.data;
					})
					.catch(err => {
						this.util.message(err.message);
					})
			},
			getStartTime(){
				this.util.request(this, '/llcy/choir/getStartTime', {}, true)
					.then(res => {
						this.startTime = res.data;
					})
					.catch(err => {
						this.util.message(err.message);
					})
			},
			showLogin() {
				this.$refs.popup_login.open();
			},
			closeLogin() {
				this.$refs.popup_login.close();
			},
			getUserInfo() {
				// #ifdef MP-WEIXIN
				// 获取用户信息
				if (uni.getStorageSync('user')) { // 如果已有缓存则直接进首页
					this.userInfo = uni.getStorageSync('user');
				} else {
					this.getWxSessionKey()
				}
				// #endif
			},
			getWxSessionKey() {
				wx.login({
					success: (res) => {
						this.wxLogincode = res.code
					},
				});
			},
			onGotUserInfo(e) {
				let that = this;
				if (e.detail.errMsg != 'getUserInfo:ok') { // 'getUserInfo:ok' 'getUserInfo:fail auth deny'
					setTimeout(() => {
						this.closeLogin();
					}, 100)
					return
				}
				let tempParams = {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					code: this.wxLogincode,
					shareUserId: this.shareUserId || ''
				}
				uni.showLoading({
					title: '登录中',
					mask: true
				})
				this.util.request(this, '/llcy/choir/weixinLogin', tempParams, true)
					.then(res => {
						if (res.data.loginCode == "1") {
							this.userInfo = res.data.wxUserInfo;
							uni.setStorageSync('user', res.data.wxUserInfo);
							this.$refs.popup_login.close();
						} else {
							wx.showToast({
								icon: 'none',
								title: res.data.msg,
							});
						}
						this.initData()
						this.refreshRanking();
					})
					.catch(err => {
						this.util.message(err.msg);
					})
			},
			signUpNow() {
				uni.switchTab({
					url: "./signup"
				})
			},
			search() {
				uni.navigateTo({
					url: "./search"
				})
			},
			onShareAppMessage: function(options) {
				return {
					title: "孝德唱响《高能合唱团》风采大赛，现金奖励以及丰厚奖品等你来拿",
					path: "/pages/random_reward?shareUserId=''",
					imageUrl: "http://xiaode.oos-cn.ctyunapi.cn/202007231536579421400.jpg"
				}
			},
			getRank(type) {
				this.util.request(this, '/llcy/choir/getChoirRanking', {
						type: type,
						keyWords:'',
						memberId:this.userInfo.id,
						verifyStatus:1
					}, true)
					.then(res => {
						this.groups[type-1].items = res.data.map((v,i) => {
							return {
								img: v.choirs.filter(item => {if(item.mainImg==1){
									return item.imgUrl;
								}})[0].imgUrl,
								name: v.name,
								serial: v.choirSn,
								vote: v.likeCount || 0,
								voteSign: v.isLike == 1?true:false,
								animation: false,
								chrioId:v.id
							}
						}).splice(0,5)
					})
					.catch(err => {
						this.util.message(err.msg);
					})

			},
			lookMore(type) {
				uni.navigateTo({
					url: `./elderly_group?type=${type}`
				})
			},
			gotoDetail(id){
				uni.navigateTo({
					url:`./brief_introduction?id=${id}`
				})
			},
		},
	}
</script>

<style lang="scss">
	@mixin icon($img, $width:44rpx, $height:45rpx) {
		content: "";
		position: absolute;
		width: $width;
		height: $height;
		top: 50%;
		left: 0%;
		transform: translateY(-50%);
		background: url($img) no-repeat;
		background-size: 100%;
	}
	.sticky_clazz{
		position: sticky;
		position: -webkit-sticky;
		top: 0rpx;	
		z-index: 101;
	}
	.home_wrap {
		.single_part {
			color: #333;
			.title {
				font-size: 32rpx;
				font-weight: bold;
				padding-left: 68rpx;
				position: relative;
				line-height: 45px;
				margin: 0 30rpx;
				
				&::before {
					@include icon('../../static/spa/tuijian.png');
				}
			}

			.swiper {
				width: 100%;
				height: 300rpx;
				text-align: center;
			}

			swiper-item image {
				width: 690rpx;
				height: 100%;
				border-radius: 30rpx;
			}
		}

		.part_one {
			padding: 0 30rpx;
			box-sizing: border-box;

			.single_part {
				color: #333;

				.title,
				.title_luckdraw {
					font-size: 32rpx;
					font-weight: bold;
					padding-left: 68rpx;
					position: relative;
					line-height: 45px;

					&::before {
						@include icon('../../static/spa/tuijian.png');
					}
				}

				.title_luckdraw {
					&::before {
						@include icon('../../static/spa/choujiang.png');
					}
				}

				.swiper,
				.part_img {
					width: 690rpx;
					height: 300rpx;
					
					border-radius: 30rpx;
				}

				swiper-item image {
					width: 100%;
					height: 100%;
					border-radius: 30rpx;
				}
			}

			.award_list {
				width: 690rpx;
				height: 128rpx;
				margin-top: 30rpx;
				border-radius: 30rpx;
			}

			.signup_now {
				width: 256rpx;
				height: 75rpx;
				line-height: 75rpx;
				text-align: center;
				background: linear-gradient(90deg, rgba(244, 69, 69, 1) 0%, rgba(252, 90, 92, 1) 100%);
				border-radius: 20rpx;
				font-size: 34rpx;
				color: #fff;
				font-weight: bold;
				margin: 49rpx auto;
			}
		}

		.search_rank {
			border-top: 20rpx solid #F7F7F7;
			padding: 0 30rpx;
			box-sizing: border-box;

			.search_input {
				width: 690rpx;
				height: 84rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0rpx 2rpx 12rpx 6rpx rgba(133, 133, 133, 0.1);
				border-radius: 20rpx;
				margin-top: 36rpx;
				margin-bottom: 45rpx;
				color: #C2C2C2;
				font-size: 30rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				align-items: center;
				display: flex;

				text {
					white-space: nowrap;
					margin-left: 15rpx;
				}

				.search_icon {
					width: 28rpx;
					height: 28rpx;
				}
			}

			.groups {
				.title {
					font-size: 32rpx;
					font-weight: bold;
					padding-left: 68rpx;
					position: relative;
					line-height: 45px;
					color: #333;
					margin-bottom: 10rpx;

					&::before {
						@include icon('../../static/spa/rank.png');
					}
				}

				.group {
					margin-bottom: 13rpx;

					.header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: #FF464C;
						margin-bottom: 30rpx;

						.group_category {
							width: 160rpx;
							height: 48rpx;
							line-height: 48rpx;
							background: rgba(255, 239, 240, 1);
							border-radius: 10rpx;
							font-size: 30rpx;
							font-weight: bold;
							text-align: center;
						}

						.more {
							font-size: 26rpx;
							font-family: simsun;
						}
					}

					.single_wrap {
						display: flex;
						justify-content: space-between;
						flex-wrap: wrap;

						.single_one {
							width: 335rpx;
							box-shadow: 0rpx 2rpx 12rpx 6rpx rgba(133, 133, 133, 0.1);
							border-radius: 20rpx;
							background-color: #fff;
							overflow: hidden;
							margin-bottom: 31rpx;

							.single_img {
								width: 100%;
								height: 243rpx;
								vertical-align: bottom;
							}

							.single_info {
								padding: 20rpx 20rpx 30rpx 20rpx;
								box-sizing: border-box;
								font-size: 30rpx;
								color: #333;
								display: flex;
								flex-direction: column;
								justify-content: space-around;

								.name_rank {
									display: flex;
									justify-content: space-between;

									.group_name {}

									.group_rank {
										width: 42rpx;
										height: 42rpx;
										line-height: 42rpx;
										color: #fff;
										text-align: center;
										border-radius: 50%;
									}
								}

								.serial_number {
									font-size: 30rpx;
									color: #999;
									margin-top: 10rpx;
								}

								.btns,
								.btnsed {
									width: 295rpx;
									height: 60rpx;
									line-height: 60rpx;
									display: flex;
									justify-content: space-between;
									align-items: center;
									font-size: 28rpx;
									color: #FF464C;
									border-radius: 10rpx;
									border: 1rpx solid #FF464C;
									text-align: center;
									margin-top: 20rpx;

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
						}
					}
					.no_chrio{
						.no_group{
							width: 690rpx;
							height: 270rpx;
							margin: 0 0 20rpx 0;
							border-radius:20rpx;
							overflow: hidden;
							box-shadow: 0rpx 2rpx 12rpx 6rpx rgba(255, 70, 76, .3);
						}
					}
				}
			}
		}

		.popup_login {
			width: 552rpx;
			height: 514rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #FFFFFF;
			border-radius: 20rpx;

			.login-title {
				margin-top: 51rpx;
				color: #333333;
				font-size: 34rpx;
			}

			.line {
				width: 480rpx;
				height: 0;
				border-top: 2rpx #EEEEEE solid;
				margin-top: 39rpx;
			}

			.login-content {
				width: 355rpx;
				color: #333333;
				font-size: 30rpx;
				line-height: 48rpx;
				margin-top: 67rpx;
				text-align: center;
			}

			.login-buttons {
				width: 480rpx;
				margin-top: 70rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.login-cancel {
					height: 70rpx;
					line-height: 66rpx;
					width: 220rpx;
					border: 2rpx solid #999999;
					border-radius: 30rpx;
					background-color: #FFFFFF;
					color: #999999;
					font-size: 32rpx;
				}

				.login-confirm {
					width: 220rpx;
					height: 70rpx;
					line-height: 66rpx;
					color: #FFFFFF;
					background-color: #FF473A;
					border-radius: 30rpx;
					font-size: 32rpx;
				}
			}
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
