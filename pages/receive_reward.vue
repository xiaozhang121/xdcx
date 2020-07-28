<template>
	<view class="receive_reward">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle" :showBack="navigationBarStyle.showBack"></navigationBar>
		</view>
		<!-- <uni-nav-bar left-icon="back" title="填写领奖地址" :shadow="false" :border="false"></uni-nav-bar> -->
		<view class="item">
			<view class="item-title">收件人</view>
			<input class="item-value" type="text" v-model="name" placeholder="请输入收件人姓名"/>
		</view>
		<view class="item">
			<view class="item-title">手机号码</view>
			<input class="item-value" type="number" v-model="mobile" maxlength="11" placeholder="请输入收件人电话"/>
		</view>
		<view class="item">
			<view class="item-title">省/市/区</view>
			<view class="item-value sign" @tap="showCityPicker" v-if="address!=''">{{address}}</view>
			<view class="item-value sign" style="color:rgb(128,128,128)" @tap="showCityPicker" v-else>请选择省市区</view>
			<mpvue-citypicker themeColor="#007AFF" ref="mpvueCityPicker" :pickerValueDefault="aside" @onConfirm="onConfirmAddress"></mpvue-citypicker>
		</view>
		<view class="item">
			<view class="item-title">详细地址</view>
			<input class="item-value" type="text" v-model="address_detail" placeholder="请输入详细地址"/>
		</view>
		<button class="submit" @tap="receiveProduct" v-if="optionType==1">领取</button>
		<button class="submit" @tap="receiveProduct" v-else>保存地址</button>
	</view>
</template>

<script>
	import mpvueCitypicker from "@/components/mpvue-citypicker/mpvueCityPicker.vue"
	import navigationBar from "./components/header.vue"
	export default {
		components: {
			'mpvue-citypicker': mpvueCitypicker,
			navigationBar
		},
		data() {
			return {
				name: '',
				mobile: '',
				address: '',
				address_detail: '',
				productId: '',
				memberId: '',
				optionType:0, //type:0 -> 更新地址 1:领奖
				aside:[0, 0, 0],
				navigationBarStyle:{
					background: '#FFFFFF',
					fontColor: '#3A3A3A',
					iconColor: '#000000',
					iconText: '地址',
					custom:false,
					showBack:true
				},
			}
		},
		watch: {},
		computed: {},
		onLoad(options) {
			console.log(options)
			this.memberId = options.memberId;
			this.optionType = options.optionType;
			if(options.isBindAddr == '1'){
				console.log("已绑定地址");
				this.getAddrInfo();
			}
		},
		methods: {
			showCityPicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirmAddress(event) {
				console.log(event)
				let label = event.label.split('-');
				this.aside = event.value;
				this.address = `${label[0]} ${label[1]} ${label[2]}`;
			},
			verify() {
				if(!this.name) {
					this.util.message('请填写收件人姓名');
					return -1;
				}
				if(!this.mobile) {
					this.util.message('请填写收件人手机号码');
					return -1;
				} else if(!this.util.verifyPhone(this.mobile)) {
					return -1;
				}
				if(!this.address) {
					this.util.message('请填写收货地址省市区');
					return -1;
				}
				if(!this.address_detail) {
					this.util.message('请填写详细收货地址');
					return -1;
				}
				return 1;
			},
			getAddrInfo(){
				this.util.request(this, '/llcy/lottery/getLotteryAddress', {memberId: this.memberId}, false)
					.then(res => {
						if(res.ok) {
							let temp = res.data.address.split(" ");
							this.name = res.data.username;
							this.mobile = res.data.phone;
							this.aside = res.data.aside.split(",").map(v => +v);
							this.address = `${temp[0]} ${temp[1]} ${temp[2]}`;
							this.address_detail = temp[temp.length-1];
						} else {
							this.util.message(res.message);
						}
					})
			},
			receiveProduct() {
				if(this.verify() == -1) {
					return -1;
				}
				// 兑换奖品
				let tempParams = {
					username: this.name,
					phone: this.mobile,
					address: `${this.address} ${this.address_detail}`,
					memberId: this.memberId,
					aside:this.aside.join(",")
				};
				if(this.optionType != 0){
					uni.showLoading({
						title: '奖品领取中',
						mask: true
					})
				}
				this.util.request(this, '/llcy/lottery/receiveProduct', tempParams, false)
					.then(res => {
						if(res.ok) {
							if(this.optionType == 0){
								let pages = getCurrentPages();
								let prepage = pages[pages.length - 2]; //上一个页面
								prepage.$vm.isBindingAddress = true;
								uni.navigateBack({
									delta: 1
								})
							}else{
								setTimeout(() => {
									uni.hideLoading();
									this.util.setLastPageData({
										set_reward_get: true
									})
									uni.showToast({
										title: '奖品领取成功',
										icon: 'none',
										duration: 2000
									})
									setTimeout(() => {
										let pages = getCurrentPages();
										let prepage = pages[pages.length - 2]; //上一个页面
										prepage.$vm.isBindingAddress = true;
										prepage.$vm.showHorseBar = false;
										uni.navigateBack({
											delta: 1
										})
									}, 2000)
								}, 1000)
							}
						} else {
							this.util.message(res.message);
						}
					})
			}
		}
	}
</script>

<style lang="scss">
	.receive_reward {
		.sticky_clazz{
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;	
			z-index: 101;
		}
		.item {
			height: 100rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			
			.item-title {
				width: 155rpx;
				text-indent: 32rpx;
				color: #333333;
				font-size: 30rpx;
				font-weight: bold;
			}
			
			.item-value {
				width: 500rpx;
				margin-left: 50rpx;
			}
			
			.sign {
				&:after {
					content: "";
					float: right;
					margin-left: 10rpx;
					margin-top: 14rpx;
					display: inline-block;
					width: 12rpx;
					height: 12rpx;
					border-width: 4rpx 4rpx 0 0;
					border-style: solid;
					border-color: #c8c8cd;
					transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
				}
			}
		}
		
		.submit {
			position: fixed;
			bottom: 155rpx;
			left: 55rpx;
			width: 640rpx;
			height: 76rpx;
			line-height: 74rpx;
			background-color: #FF473A;
			border-radius: 42rpx;
			color: #FFFFFF;
			text-align: center;
			letter-spacing: 10rpx;
		}
	}
</style>
