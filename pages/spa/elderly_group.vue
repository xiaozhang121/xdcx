<template>
	<!-- 组详情 -->
	<view class="elderly-group">
		
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle" :showBack="navigationBarStyle.showBack"></navigationBar>
		</view>
		
		<view class="groups">
			<view class="group">
				<view class="single_wrap">
					<view class="single_one" v-for="(item, index) in group" :key="item.chrioId" @click="gotoDetail(item.chrioId)">
						<image :src="item.img" mode="aspectFill" class="single_img"></image>
						<view class="single_info">
							<view class="name_rank">
								<view class="group_name">{{item.name}}</view>
								<view class="group_rank" :style="rankBgc[index]">{{index+1}}</view>
							</view>
							<view class="serial_number">编号：{{item.serial}}</view>
							<view :class="item.voteSign?'btnsed':'btns'">
								<view class="vote" @click.stop="vote(index,item.chrioId)">{{item.voteSign?'投票+1':'投票'}}
									<image src="../../static/spa/vote.png" mode="aspectFit" class="add_one" v-show="item.animation"></image>
								</view>
								<view class="total">{{item.likeCount || 0}}票</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import navigationBar from "../components/header.vue"
	export default {
		data() {
			return {
				rankBgc: ["background-color: #FF464C", "background-color: #FDA53C", "background-color: #FDCF02","background-color: #B8B8B8"],
				groupsWords: ["青少年组","中年组","老年组"],
				group:[],
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '合唱团排名',
					custom:false,
					showBack:true
				},
			};
		},
		components: {
			navigationBar
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: this.groupsWords[Number(options.type)]
			});
			this.getRank(+options.type+1)
		},
		methods:{
			vote(index,chrioId) {
				this.util.request(this, '/llcy/choir/likeChoir', {
						choirId:chrioId,
						memberId:uni.getStorageSync("user").id
					}, true)
					.then(res => {
						if(!res.ok){
							this.util.message(res.message);
						}
					})
					.catch(err => {
						this.util.message(err.message);
					})
				this.group[index].voteSign = true;
				this.group[index].animation = true;
				setTimeout(() => {
					this.group[index].animation = false;
				}, 1000);
			},
			getRank(type) {
				this.util.request(this, '/llcy/choir/getChoirRanking', {
						type: type,
						keyWords:'',
						memberId:uni.getStorageSync("user").id,
						verifyStatus:1
					}, true)
					.then(res => {
						this.group = res.data.map((v,i)=>{
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
						})
					})
					.catch(err => {
						this.util.message(err.msg);
					})
			
			},
			gotoDetail(id){
				uni.navigateTo({
					url:`./brief_introduction?id=${id}`
				})
			},
		}
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

	.elderly-group {
		padding-top: 30rpx;
		
		.sticky_clazz{
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;	
			z-index: 101;
		}
		.groups {
			margin: 0 30rpx;

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

								.group_name {
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}

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
								box-sizing: border-box;
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
		}
		
	}
</style>
