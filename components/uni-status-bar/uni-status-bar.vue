<template>
	<view :style="{ height: statusBarHeight,'background-color': backgroundColor  }" class="uni-status-bar">
		<slot />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		},
		props:{
			backgroundColor: {
				type: String,
				default: "rgba(0,0,0,0)"
			},
		}
	}
</script>

<style lang="scss" scoped>
	.uni-status-bar {
		width: 750rpx;
		height: 20px;
		// height: var(--status-bar-height);
	}
</style>
