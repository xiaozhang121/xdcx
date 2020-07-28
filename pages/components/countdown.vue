<template>
	<view class="countdown">
		<view class="left_icon">
			<image src="../../static/spa/number1.png" mode="aspectFit"></image>
			<text>活动规则</text>
		</view>
		<view class="right_countdown">
			<view class="title_icon">距离活动结束还有</view>
			<view class="count_down_time">
				{{timee.day}}<i>天</i>{{timee.hour}}<i>时</i>{{timee.minute}}<i>分</i>{{timee.second}}<i>秒</i>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timee:{
					day:"00",
					hour:"00",
					minute:"00",
					second:"00",
				},
				timer:null
			};
		},
		created() {
			this.timeslot();
		},
		destroyed() {
			clearInterval(this.timer);
		},
		props:{
			deadline:{
				type: String,
				default: ''
			},
		},
		methods:{
			timeslot(){
				let now = new Date().getTime();
				let timeslot = new Date(this.deadline).getTime() - now;
				let dayMsec = 24*60*60*1000;
				let hourMsec = 60*60*1000;
				let minuteMsec = 60*1000;
				let secondMsec = 1000;
				this.timer = setInterval(()=>{
					timeslot = timeslot - 1000;
					this.timee.day = String(parseInt(timeslot/dayMsec)).padStart(2,"0");
					this.timee.hour = String(parseInt((timeslot%dayMsec)/hourMsec)).padStart(2,"0");
					this.timee.minute = String(parseInt(((timeslot%dayMsec)%hourMsec)/minuteMsec)).padStart(2,"0");
					this.timee.second = String(parseInt((((timeslot%dayMsec)%hourMsec)%minuteMsec)/secondMsec)).padStart(2,"0");
				},1000)
			}
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
.countdown{
	width:690rpx;
	height:163rpx;
	border-radius: 30rpx;
	background-color: #F7F8F9;
	margin-top: 30rpx;
	display: flex;
	overflow: hidden;
	font-size: 30rpx;
	.left_icon{
		width: 194rpx;
		height: 100%;
		background-color: #F2F2F2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		color: #FF464C;
		image{
			width: 44rpx;
			height: 53rpx;
			margin-bottom: 8rpx;
		}
	}
	.right_countdown{
		width: calc(690rpx - 194rpx);
		height: 100%;
		color: #696969;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		color: #696969;
		.title_icon{
			padding-left: 41rpx;
			position: relative;
			&::before{
				@include icon("../../static/spa/loudou.png",21rpx,29rpx)
				
			}
		}
		.count_down_time{
			margin-top:7rpx;
			display: flex;
			align-items: center;
			font-size: 40rpx;
			color: #333;
			i{
				font-style: normal;
				font-size: 30rpx;
				margin: 0 20rpx 0  15rpx;
				color: #696969;
			}
		}
	}
}
</style>
