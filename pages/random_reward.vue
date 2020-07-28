<template>
	<view class="random_reward">
		<view class="sticky_clazz">
			<navigationBar :custom="navigationBarStyle.custom" :navigationBarStyle="navigationBarStyle" :showBack="navigationBarStyle.showBack"></navigationBar>
		</view>
		<uni-notice-bar showIcon="true" scrollable="true" single="true" :text="winPrizeTitle" @click="showMyReward" v-if="showHorseBar"></uni-notice-bar>
		<uni-notice-bar showIcon="true" scrollable="true" single="true" :text="tipPrizeTitle" @click="gotoAddr" icon="info" v-if="!isBindingAddress && !showHorseBar"></uni-notice-bar>
		<view class="icon-xd">
			<image src="../static/icon_xd.png" style="width: 106rpx;height: 86rpx;"></image>
		</view>
		<image class="title-llcx" src="https://xiaode.oos-cn.ctyunapi.cn/202007231434020169755.png"></image>
		<view class="reward-menu">
			<view class="menu-regular" @tap="showRegular">抽奖规则</view>
			<view class="menu-myReward" @tap="showMyReward" v-if="userInfo">我的奖品</view>
			<view class="menu-myReward" @tap="showLogin" v-else>我的奖品</view>
		</view>
		<view class="content">
			<view class='reward_item' v-for="(item, index) of list_up" :key="item.id" @tap="showImage(index)">
				<view class="mask" v-show="sequence[index] === signed"></view>
				<image :src="item.icon" class="item_img"></image>
			</view>
			<block v-if="is_open">
				<block v-if="userInfo">
					<view class="item_play" @tap="lottery">
						<view class="mask" style="width: 312rpx;height: 151rpx;background-color:rgba(0, 0, 0, 0.4);" v-show="is_play"></view>
						<text class="item_play_text">立即抽奖</text>
						<text class="item_play_num">您还剩余{{num}}次抽奖机会</text>
					</view>
				</block>
				<block v-else>
					<view class="item_play" @tap="showLogin">
						<view class="mask" style="width: 312rpx;height: 151rpx;background-color:rgba(0, 0, 0, 0.4);" v-show="is_play"></view>
						<text class="item_play_text">立即抽奖</text>
						<text class="item_play_num">您还剩余{{num}}次抽奖机会</text>
					</view>
				</block>
			</block>
			<block v-else>
				<view class="item_play" @tap="lottery">
					<view class="mask" style="width: 312rpx;height: 151rpx;background-color:rgba(0, 0, 0, 0.4);"></view>
					<text class="item_play_text" style="color: #888888;margin-top: 48rpx;">活动暂未开始</text>
				</view>
			</block>
			<view class='reward_item' v-for="(item, index) of list_down" :key="item.id" @tap="showImage(index + 5)">
				<view class="mask" v-show="sequence[index + 5] === signed"></view>
				<image :src="item.icon" class="item_img"></image>
			</view>
		</view>
		<view class="suggest">点击上方图片查看奖品详情</view>
		<image class="bottom" src="http://xiaode.oos-cn.ctyunapi.cn/202007231358059028021.jpg" show-menu-by-longpress></image>
		<button class="share" open-type="share">立即分享</button>
		<view class="kefu" @tap="showKefu(0)">
			<image src="../static/icon_kefu.png" style="width:54rpx; height:52rpx;"></image>
		</view>
		
		<uni-popup ref="popup_login" type="center">
			<view class="popup_login">
				<text class="login-title">微信授权</text>
				<view class="line"></view>
				<text class="login-content">您还没有进行微信授权~授权后才可以参与抽奖哦！</text>
				<view class="login-buttons">
					<button class="login-cancel" @tap="closeLogin">暂不登录</button>
					<button class="login-confirm" open-type="getUserInfo" @getuserinfo="onGotUserInfo">立即登录</button>
				</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="popup_reward" type="center">
			<view class="popup_reward">
				<block v-if="is_fail">
					<image src="../static/icon_fail.png" class="reward-fail"></image>
					<text class="reward-message" style="margin-top: 54rpx;">很遗憾，大奖与您擦肩而过不要灰心，请再接再厉！</text>
					<button class="btn-confirm" v-if="num > 0" @tap="closeReward(1)">再抽一次</button>
					<button class="btn-confirm" v-else open-type="share" @tap="closeReward(0)">分享好友</button>
				</block>
				<block v-else>
					<view class="reward-success">中奖了</view>
					<image :src="reward[0].icon" class="reward-good"></image>
					<text class="reward-message" style="margin-top: 33rpx;">恭喜你，中奖了</text>
					<text class="reward-message">快把好消息分享给好友吧！</text>
					<button class="btn-confirm" open-type="share" @tap="closeReward(0)">分享好友</button>
				</block>
			</view>
			<view class="close" @tap="closeReward(0)"></view>
		</uni-popup>
		
		<uni-popup ref="popup_myReward" type="center">
			<view class="popup_myReward">
				<view class="myReward-icon"></view>
				<view class="myReward-title">我的奖品</view>
				<view class="myReward-content" v-if="reward.length > 0">
					<view class="content-body">
						<view style="color:#333333;font-size: 32rpx;margin-top: 10rpx;" v-if="reward[0].status == 2">已发货</view>
						<view style="color:#333333;font-size: 32rpx;margin-top: 10rpx;" v-if="reward[0].status == 1">已领取</view>
						<view class="content-body-get" v-else @tap="go2()">领取</view>
						<view style="color:#999999;font-size: 28rpx;margin-top: 20rpx;">{{reward[0].time}}</view>
					</view>
					<image :src="reward[0].icon" class="content-icon"></image>
				</view>
				<view class="myReward-content" style="border:0;justify-content: center;align-items: center;color:#999999;" v-else>暂无中奖记录</view>
				<button @tap="showKefu(0)" class="add-kefu">添加客服微信</button>
			</view>
			<view class="close" @tap="closeMyReward"></view>
		</uni-popup>

		<uni-popup ref="popup_regular" type="center">
			<view class="regular">
				<view class="regular-title">抽奖规则</view>
				<view class="line"></view>
				<view class="regular-content">
					<view class="content-item" v-for="(item, index) of regular" :key="index">
						<text style="font-weight: bold;">{{index + 1}}、</text>
						<text v-if="index === 0" style="font-weight: bold;">活动日期：</text>
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="close" style="left:297rpx;" @tap="closeRegular"></view>
		</uni-popup>
	
		<view class="popup-image" v-show="image_show" :style="{height: image_height + 'rpx'}" @tap="closeImage">
			<image :src="image_detail_array[touch_image].url" :style="{width: '100%', height: image_height + 'rpx'}" mode="widthFix" lazy-load="true"></image>
			<view class="kefu" @click.stop="showKefu(1)">
				<image src="../static/icon_kefu.png" style="width:54rpx; height:52rpx;"></image>
			</view>
		</view>
		
		<uni-popup ref="popup_kefu" type="center">
			<view class="popup-kefu">
				<image :src="customerWxImg" style="width:453rpx;height:580rpx;" show-menu-by-longpress></image>
				<text style="margin-top: 40rpx;">长按图片保存到本地</text>
				<text style="margin-top: 10rpx;">通过扫码本地图片添加客服微信</text>
			</view>
			<view class="close" @tap="closeKefu(0)"></view>
		</uni-popup>
		
		<uni-popup ref="bind_phone" type="center" :maskClick="bindPhoneCanClick">
			<view class="popup_login">
				<text class="login-title">绑定手机号</text>
				<view class="line"></view>
				<text class="bind-content">请输入手机号,便于中奖告知</text>
				<input type="number" v-model="userInfo.phone" class="bind_phone" placeholder="请输入手机号码" maxlength="11"/>
				<view class="login-buttons">
					<button class="login-cancel" @tap="closeBind">暂不绑定</button>
					<button class="login-confirm" open-type="getUserInfo" @click="bindPhone()">立即绑定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import navigationBar from "./components/header.vue"
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	export default {
		data() {
			return {
				bindPhoneCanClick:false,
				sequence: [0, 1, 2, 3, 9, 4, 8, 7, 6, 5],
				list: [
					{
						id: '0',
						icon: '',
						name: ''
					},
					{
						id: '1',
						icon: '',
						name: ''
					},
					{
						id: '2',
						icon: '',
						name: ''
					},
					{
						id: '3',
						icon: '',
						name: ''
					},
					{
						id: '4',
						icon: '',
						name: ''
					},
					{
						id: '5',
						icon: '',
						name: ''
					},
					{
						id: '6',
						icon: '',
						name: ''
					},
					{
						id: '7',
						icon: '',
						name: ''
					},
					{
						id: '8',
						icon: '',
						name: ''
					},
					{
						id: '9',
						icon: '',
						name: ''
					}
				],
				signed: -1, // 当前选择块的序列
				speed: 200, // 时间间隔，时间越大越慢
				min_rotate: 3, // 匀速的转动圈数
				max_speed: 30, // 最高速度 数值越大速度越慢
				end: -1,
				is_play: false, // 是否在转盘中
				over_time: 10, //结束减速转动次数
				over_delta: 25, //结束减速转动间隔减幅
				num: 3, // 抽奖次数
				regular: [
					"2020年06月21日18∶00至2020年08月30日22∶00",
					"每个用户每天最多有3次抽奖机会，当天不使用视为放弃，获取的抽奖机会不累计；",
					"用户中奖在小程序“我的奖品”在线兑换领取；",
					"兑换成功后，请完整填写您的收货地址、手机号码！若收货信息不完整，将视为自动放弃；",
					"工作人员将于15个工作日内安排派送，请保持手机畅通，若多次未联系到您将会自动退件，不予补发。",
				],
				userInfo: null,
				shareUserId: '',// 父节点id
				wxLogincode: '',
				is_fail: false,
				reward: [
					// {
					// 	id: '0',
					// 	icon: 'http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006041834340106154.png',
					// 	name: '五食佳',
					// 	time: '2010-03-02 20:23:23'
					// }
				],
				set_reward_get: false, // 填写完用户的收货地址后，手动把领取状态置1并不重新调接口
				is_open: true, // 活动是否开启
				image_detail_array: [
					{
						width: 720,
						height: 12517,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640519162840.jpg" // 橙色
						url: "https://jk.laohaowaner.com/qbresource//upload/big_4.jpg" // 蓝色橙色
						
					},
					{
						width: 720,
						height: 11584,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640518681502.jpg" // 绿色
						url: "https://jk.laohaowaner.com/qbresource//upload/big_6.jpg" // 绿色
					},
					{
						width: 789,
						height: 11466,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640514968781.jpg" // 紫色
						url: "https://jk.laohaowaner.com/qbresource//upload/big_1.jpg" // 橙色
					},
					{
						width: 789,
						height: 11431,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640517234681.jpg" // 蓝色
						url: "http://xiaode.oos-cn.ctyunapi.cn/202007231514183413455.jpg" // 蓝色
					},
					{
						width: 789,
						height: 11448,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640516752426.jpg", // 绿色蔬菜
						url: "https://jk.laohaowaner.com/qbresource//upload/big_7.jpg" // 绿色蔬菜6
					},
					{
						width: 789,
						height: 11518,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640517719483.jpg", // 黄色
						url: "https://jk.laohaowaner.com/qbresource//upload/big_5.jpg" // 黄色
					},
					{
						width: 789,
						height: 11542,
						// url: "http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006101640518168687.jpg" // 红色
						url: "https://jk.laohaowaner.com/qbresource//upload/big_2.jpg" // 绿色
					}
				],
				image_height: 400,
				image_show: false, // 详情图是否显示
				touch_image: 0, // 选中的图片索引
				isBindingPhone:false,
				isBindingAddress:false,
				showHorseBar:false,
				winPrizeTitle:'dsafhalkjflkajflkjalkfjklajflkjalkfjlkajfljslkfjska',
				tipPrizeTitle:'请完善收货信息，以便奖品发送哦！',
				navigationBarStyle:{
					background: 'background-image: linear-gradient(#d10c84, #f83427);',
					fontColor: '#ffffff',
					iconColor: '#000000',
					iconText: '孝德抽奖',
					custom:false,
					showBack:true
				},
				customerWxImg:'https://jk.laohaowaner.com/qbresource//upload/kefu.jpg'
			}
		},
		components: {uniNoticeBar,navigationBar},
		computed: {
			list_up: function() {
				return this.list.slice(0, 5);
			},
			list_down: function() {
				return this.list.slice(5, 10);
			}
		},
		onLoad(options) {
			this.shareUserId = options.shareUserId || ''; // 小程序用
			// 获取活动开关
			this.lotteryStatus();
			// 获取用户信息
			this.getUserInfo();
			// 获取奖品列表
			this.getLotteryProduct();
			// 异步获取我的奖品
			if(this.userInfo) {
				// 获取用户抽奖次数
				setTimeout(() => {
					this.lotteyCount();
					this.winning();
				}, 100)
			}
		},
		onShow() {
			this.util.checkLogin();
			if(this.set_reward_get) {
				this.reward[0].status = 1;
				this.set_reward_get = false;
			}
		},
		methods: {
			gotoAddr(){
				// type:0 -> 更新地址 1:领奖
				uni.navigateTo({
					url:`./receive_reward?optionType=0&isBindAddr=${this.isBindingAddress?1:0}&memberId=${this.userInfo.id}`
				})
			},
			lottery() {
				if(!this.isBindingPhone){
					this.$refs.bind_phone.open();
					return;
				}
				if(!this.is_open) {
					this.util.message('活动暂未开始');
					return -1;
				}
				if(this.num <= 0) {
					// this.util.message('今天次数已用完，请明天再来。');
					// return -2;
					this.num = 0;
				}
				let tempParams = {
					memberId: this.userInfo.id,
					categoryId: 'fa85fc3a-206c-463d-998d-4271c27aec78'
				};
				this.util.request(this, '/llcy/lottery/lottery', tempParams, true)
					.then(res => {
						if(res.ok) {
							// 根据id定位到在奖品中的位置
							// Math.floor(Math.random() * 10)
							if(res.data == -1){ // 没中奖
								this.rollAction(Math.random() > 0.5 ? 3 : 6);
							} else {
								this.showHorseBar = true;
								this.list.forEach((item, index) => {
									if(item.id === res.data) {
										this.reward.push({
											id: item.id,
											icon: item.icon,
											name: item.name
										});
										this.winPrizeTitle = `恭喜您已中${item.name}，奖品已就绪，请前往完善配送信息`;
										this.rollAction(index);
									}
								})
							}	
						} else {
							this.util.message(res.message);
						}
					})
			},
			checkBindPhone(){
				this.util.request(this, '/llcy/lottery/isBindingPhone', {memberId: this.userInfo.id}, true)
					.then(res => {
						if(res.ok) {
							this.isBindingPhone = res.data;
						} else {
							this.util.message(res.message);
						}
					})
			},
			checkBindAddr(){
				this.util.request(this, '/llcy/lottery/isBindingAddress', {memberId: this.userInfo.id}, true)
					.then(res => {
						if(res.ok) {
							this.isBindingAddress = res.data;
						} else {
							this.util.message(res.message);
						}
					})
			},
			bindPhone(){
				if(this.util.verifyPhone(this.userInfo.phone)){
					this.updateBindPhone()
				}
			},
			updateBindPhone(){
				this.util.request(this, '/llcy/lottery/updateMemberPhone', {memberId: this.userInfo.id,phone:this.userInfo.phone}, true)
					.then(res => {
						if(res.ok) {
							this.isBindingPhone = true;
							this.util.message('手机号绑定成功');
							this.closeBind();
						} else {
							this.util.message(res.message);
						}
					})
			},
			rollAction(index) {
				if (this.is_play) {
					return -1;
				}
				this.is_play = true;
				let delta = 0;
				// 加速
				let sign_temp = this.signed;
				while(sign_temp < 10) {
					this.speed = this.speed > this.max_speed ? this.speed -= 20 : this.speed
					delta += this.speed;
					sign_temp++;
					setTimeout(() => {
						this.signed = (this.signed + 1) % 10;
					}, delta)
				}
				//匀速
				let min_rotate_temp = 0;
				for(let i = 0; i < this.min_rotate * 10; i++) {
					delta += this.max_speed;
					setTimeout(() => {
						this.signed = (this.signed + 1) % 10;
					}, delta)
				}
				//减速
				setTimeout(() => {
					this.end = index; // 3 6
					this.is_fail = (index == 3 || index == 6);
					this.rollOver(delta);
				}, delta)
			},
			rollOver() {
				let temp_time = 0;
				let start_sign = -1;
				if (this.sequence[this.end] + 10 < this.over_time) {
					start_sign = this.sequence[this.end] + 10 * 2 - this.over_time
				} else {
					start_sign = this.sequence[this.end] + 10 - this.over_time
				}
				let mytime = () => {
					if (this.signed < start_sign && temp_time == 0) {
						this.signed = (this.signed + 1) % 10;
						setTimeout(mytime, this.speed);
					} else if (temp_time < this.over_time) {
						temp_time++;
						this.signed = (this.signed + 1) % 10;
						setTimeout(mytime, this.speed += this.over_delta);
					} else {
						this.speed = 200; // 必须重置speed
						this.$refs.popup_reward.open();
						this.is_play = false;
						this.num--;
						clearTimeout(mytime)
					}
				};
				mytime()
			},
			showLogin() {
				this.$refs.popup_login.open();
			},
			closeLogin() {
				this.$refs.popup_login.close();
			},
			closeBind() {
				this.$refs.bind_phone.close();
			},
			getUserInfo() {
				// #ifdef MP-WEIXIN
				// 获取用户信息
				if(uni.getStorageSync('user')) { // 如果已有缓存则直接进首页
					this.userInfo = uni.getStorageSync('user');
					// 获取是否绑定手机号
					this.checkBindPhone();
					this.checkBindAddr();
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
					shareUserId: this.shareUserId
				}
				uni.showLoading({
					title: '登录中',
					mask: true
				})
				this.util.request(this, '/weixinLogin', tempParams, true)
					.then(res => {
						console.log(res.data);
						if (res.data.loginCode == "1") {
							this.userInfo = res.data.wxUserInfo;
							uni.setStorageSync('user', res.data.wxUserInfo);
							// 拿到用户数据了去获取下剩余抽奖次数和我的奖品
							this.lotteyCount();
							this.winning();
							this.checkBindPhone();
							this.checkBindAddr();
							this.$refs.popup_login.close();
						} else {
							wx.showToast({
								icon: 'none',
								title: res.data.msg,
							});
						}
					})
					.catch(err => {
						this.util.message(err.msg);
					})
			},
			getLotteryProduct() {
				let tempParams = {
					categoryId: 'fa85fc3a-206c-463d-998d-4271c27aec78'
				}
				this.util.request(this, '/llcy/lottery/getLotteryProduct', tempParams, true)
					.then(res => {
						this.list.forEach((item, index) => {
							item.id = res.data[index].id;
							item.icon = res.data[index].pic;
							item.name = res.data[index].name;
						})
					})
			},
			closeReward(index) {
				if(index) {
					this.$refs.popup_reward.close();
					this.lottery();
				} else {
					this.$refs.popup_reward.close();
				}
				
			},
			showMyReward() {
				this.winning();
				this.$refs.popup_myReward.open();
			},
			closeMyReward() {
				this.$refs.popup_myReward.close();
			},
			lotteyCount() {
				// 获取抽奖列表
				let tempParams = {
					memberId: this.userInfo.id,
					categoryId: 'fa85fc3a-206c-463d-998d-4271c27aec78'
				};
				this.util.request(this, '/llcy/lottery/lotteyCount', tempParams, true)
					.then(res => {
						this.num = res.data;
					})
			},
			winning() {
				// 获取我的奖品
				let tempParams = {
					memberId: this.userInfo.id
				};
				this.util.request(this, '/llcy/lottery/winning', tempParams, true)
					.then(res => {
						if(res.data) {
							this.reward = [{
								id: res.data.id,
								icon: res.data.pic,
								name: res.data.name,
								time: res.data.receive_time,
								status: res.data.status
							}]
						}
					})
			},
			go2() {
				uni.navigateTo({
					url: `receive_reward?optionType=1&isBindAddr=${this.isBindingAddress?1:0}&memberId=${this.userInfo.id}`
				})
			},
			lotteryStatus() {
				// 获取活动开关标志 1开启，0关闭
				let tempParams = {
					
				}
				this.util.request(this, '/llcy/lottery/lotteryStatus', tempParams, false)
					.then(res => {
						this.is_open = (res.data == 1);
					})
			},
			showRegular() {
				this.$refs.popup_regular.open();
			},
			closeRegular() {
				this.$refs.popup_regular.close();
			},
			getHeightByWidth() {
				this.image_height = Math.ceil(this.image_detail_array[this.touch_image].height * 710 / this.image_detail_array[this.touch_image].width)
			},
			showImage(index) {
				switch(index) {
					case 0:
						this.touch_image = 0;
					break;
					case 2:
						this.touch_image = 1;
					break;
					case 4:
					case 5:
						this.touch_image = index - 2;
					break;
					case 7:
					case 8:
					case 9:
						this.touch_image = index - 3;
					break;
					default: 
						return -1;
					break;
				}
				console.log(index)
				console.log(this.touch_image)
				this.getHeightByWidth();
				console.log(this.image_height);
				this.image_show = true;
			},
			closeImage() {
				this.image_show = false;
			},
			showKefu(type) {
				if(type === 0){
					this.customerWxImg = 'https://jk.laohaowaner.com/qbresource//upload/kefu.jpg';
				}else if(type === 1){
						this.customerWxImg = 'https://xiaode.oos-cn.ctyunapi.cn/202007231443103919124.jpg';
				}else if(type === 2){
					this.customerWxImg = 'https://jk.laohaowaner.com/qbresource//upload/kefu.jpg';
				}
				this.$refs.popup_kefu.open();
			},
			closeKefu() {
				this.$refs.popup_kefu.close();
			}
		},
		onShareAppMessage: function(options) {
			return {
				title: "央视《乐龄唱响》节目的抽奖活动，丰富奖品等你来拿！",
				path: "/pages/random_reward?shareUserId=" + ((this.userInfo && this.userInfo.id) || ''),
				imageUrl: "https://jk.laohaowaner.com/qbresource//upload/share.png",
				complete: function() {
					this.util.message("分享成功");
				}
			}
		}
	}
</script>

<style lang="scss">
	.random_reward {
		background: url("http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006041832438606893.jpg") no-repeat;
		background-size: 100% 100%;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		
		.sticky_clazz{
			position: sticky;
			position: -webkit-sticky;
			top: 0rpx;	
			z-index: 101;
		}
		.icon-xd {
			width: 148rpx;
			height: 110rpx;
			position: absolute;
			top: 250rpx;
			left: 0;
			padding: 12rpx 20rpx 12rpx 22rpx;
			background-color: rgba(255, 255, 255, 0.3);
			border-radius: 0 10rpx 10rpx 0;
			box-sizing: border-box;
		}

		.title-llcx {
			width: 713rpx;
			height: 547rpx;
			margin: 134rpx auto 0;
		}
		
		.reward-menu {
			widht: 750rpx;
			height: 88rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			
			.menu-regular {
				width: 193rpx;
				height: 50rpx;
				line-height: 50rpx;
				border: 2rpx solid rgba(255,255,255,1);
				border-radius: 15rpx;
				margin-left: 30rpx;
				color: #FFFFFF;
				font-size: 30rpx;
				text-align: center;
			}
			
			.menu-myReward {
				color: #AD1118;
				font-size: 30rpx;
				background: url("http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006041834336927634.png") no-repeat;
				background-size: 100% 100%;
				width: 188rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-indent: 48rpx;
				font-weight: bold;
			}
		}

		.content {
			background: url("http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006091759305512910.png") no-repeat;
			background-size: 100% 100%;
			width: 702rpx;
			height: 539rpx;
			margin: 0 auto;
			display: flex;
			flex-direction: row;
			align-content: flex-start; // 用于取消flex布局换行时的间隙问题
			flex-wrap: wrap;
			padding: 22rpx 34rpx 20rpx 28rpx;
			box-sizing: border-box;

			.reward_item {
				width: 154rpx;
				height: 154rpx;
				border-radius: 14rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 6rpx 0 0 6rpx;

				.item_img {
					width: 155rpx;
					height: 155rpx;
				}
			}
			
			.mask {
				width: 155rpx;
				height: 155rpx;
				position: absolute;
				background-color: rgba(255, 255, 0, 0.4);
				z-index: 1;
				border-radius: 14rpx;
			}
			
			.item_play {
				background: url("http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006041834336043499.png") no-repeat;
				background-size: 100% 100%;
				width: 312rpx;
				height: 151rpx;
				margin: 6rpx 0 0 6rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.item_play_text {
					color: #AD1118;
					font-size: 41rpx;
					font-weight: bold;
					text-shadow: 0 1rpx 0 rgba(255, 255, 255, 1);
					margin-top: 28rpx;
				}

				.item_play_num {
					color: #333333;
					font-size: 23rpx;
					font-weight: bold;
					margin-top: 12rpx;
				}
			}
		}

		.regular {
			width: 654rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 20rpx;
			background-color: #FFFFFF;

			.regular-title {
				font-size: 30rpx;
				font-weight: bold;
				margin-top: 40rpx;
			}
			
			.line {
				width: 586rpx;
				height: 0;
				border-top: 2rpx #D6D6D6 solid;
				margin-top: 26rpx;
			}
			
			.regular-content {
				width: 590rpx;
				box-sizing: border-box;
				margin-top: 33rpx;
				margin-bottom: 34rpx;
				.content-item {
					font-size: 26rpx;
					color: #333333;
					line-height: 46rpx;
				}
			}
		}
		
		.suggest {
			font-size: 26rpx;
			color: #FFFFFF;
			text-align: center;
			margin-top: 10rpx;
		}
		
		.bottom {
			width: 701rpx;
			height: 650rpx;
			margin: 24rpx auto;
		}
		
		.share {
			background: url("http://xdzj-app.oss-cn-hangzhou.aliyuncs.com/202006041834343138496.png") no-repeat;
			background-size: 100% 100%;
			width: 598rpx;
			height: 84rpx;
			line-height: 76rpx;
			text-align: center;
			margin: 0 auto;
			margin-bottom: calc(31rpx + env(safe-area-inset-bottom));
			color: #AD1118;
			font-size: 40rpx;
			font-weight: bold;
		}
	
		.kefu {
			position: fixed;
			bottom: 100rpx;
			right: 30rpx;
			width: 120rpx;
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #FFFFFF;
			box-shadow: 0 0 16rpx #333;
			border-radius: 50%;
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
			.bind-content{
				width: 400rpx;
				white-space: nowrap;
				color: #333333;
				font-size: 30rpx;
				line-height: 48rpx;
				margin-top: 20rpx;
				text-align: center;
			}
			
			.bind_phone{
				background-color: #f7f7f7;
				border-radius: 10rpx;
				width: 350rpx;
				height: 80rpx;
				line-height: 80rpx;
				padding: 0 10rpx;
				margin-top: 30rpx;
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
	
		.popup_reward {
			width: 552rpx;
			height: 514rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.reward-fail {
				width: 126rpx;
				height: 126rpx;
				margin-top: 84rpx;
			}
			
			.reward-success {
				background: url(../static/icon_success.png) no-repeat;
				background-size: 100% 100%;
				width: 412rpx;
				height: 146rpx;
				font-size: 40rpx;
				font-weight: bold;
				text-align: center;
				line-height: 154rpx;
				color: #FFFFFF;
				margin-top: -76rpx;
			}
			
			.reward-good {
				width: 160rpx;
				height: 160rpx;
			}
			
			.reward-message {
				width: 370rpx;
				line-height: 48rpx;
				color: #333333;
				font-size: 30rpx;
				text-align: center;
			}
			
			.btn-confirm {
				background: url(../static/icon_button.png) no-repeat;
				background-size: 100% 100%;
				width: 375rpx;
				height: 77rpx;
				line-height: 70rpx;
				font-size: 36rpx;
				text-align: center;
				margin-top: 47rpx;
				color: #FFFFFF;
			}
		}
		
		.popup_myReward {
			width: 552rpx;
			height: 514rpx;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.myReward-icon {
				background: url(../static/icon_reward.png) no-repeat;
				background-size: 100% 100%;
				width: 191rpx;
				height: 189rpx;
				position: absolute;
				top: -78rpx;
				left: 0;
			}
			
			.myReward-title {
				width: 445rpx;
				height: 88rpx;
				line-height: 88rpx;
				background-color: #FB3929;
				border-radius: 20rpx 0 50rpx 0;
				text-indent: 218rpx;
				font-size: 40rpx;
				font-weight: bold;
				color: #FFFFFF;
				align-self: flex-start;
			}
			
			.myReward-content {
				width: 500rpx;
				height: 132rpx;
				margin-top: 77rpx;
				border-bottom: 1rpx solid #DDDDDD;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				
				.content-body {
					width: 350rpx;
					height: 122rpx;
					
					.content-body-get {
						color: #333333;
						margin-top: 10rpx;
						background-color: #FB3929;
						height: 50rpx;
						line-height: 50rpx;
						width: 134rpx;
						border-radius: 20rpx;
						text-align: center;
						font-size: 32rpx;
						color: #FFFFFF;
					}
				}
				
				.content-icon {
					width: 122rpx;
					height: 122rpx;
				}
			}
			
			.add-kefu {
				color: #333333;
				background-color: #FB3929;
				height: 60rpx;
				line-height: 58rpx;
				width: 300rpx;
				border-radius: 20rpx;
				text-align: center;
				font-size: 32rpx;
				color: #FFFFFF;
				margin-top: 50rpx;
			}
		}
		
		.close {
			background: url(../static/icon_close.png) no-repeat;
			background-size: 100% 100%;
			width: 60rpx;
			height: 60rpx;
			position: relative;
			left: 246rpx;
			top: 30rpx;
		}
		
		.popup-image {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
			width: 750rpx;
			background-color: rgba(0, 0, 0, 1);
		}
	
		.popup-kefu {
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 30rpx 40rpx;
			color: 30rpx;
			font-size: 30rpx;
		}
	}
</style>
