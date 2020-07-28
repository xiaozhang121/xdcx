<template>
    <view class="bar-sticky">
        <view class="status-line" :style="{height: lineHeight, background: navigationBarStyle.background || normal.background}"></view>
        <view class="bar-line" :style="{background: navigationBarStyle.background || normal.background}">
            <view class="bar-line container-in" :style="{background: navigationBarStyle.background || normal.background}">
                <view class="bar-font bar-content" v-if="!custom">
                    <view class="icon-fanhui bar-back" :style="{color: navigationBarStyle.iconColor || normal.iconColor}" @click="back" v-if="showBack"></view>
                    <view class="bar-title" :style="{color: navigationBarStyle.fontColor || normal.fontColor}">{{navigationBarStyle.iconText}}</view>
                </view>
                <view class="bar-font container-in" v-else>
                    <slot></slot>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            custom: {
                type: Boolean,
                default: false
            },
            navigationBarStyle: {
                type: Object,
                default: function() {
                    return {
                        background: '#FFFFFF',
                        fontColor: '#000000',
                        iconColor: '#000000',
                        iconText: '' //导航栏文字
                    }
                }
            },
            showBack: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                normal: {
                    background: '#FFFFFF',
                    fontColor: '#000000',
                    iconColor: '#000000',
                }, //公用样式,个性化样式可通过传值实现
                lineHeight: '' //状态栏高度
            };
        },
		methods:{
			back(){
				uni.navigateBack({
					delta:"1"
				})
			}
		},
        mounted() {
            const systemInfo = uni.getSystemInfoSync();
            // px转换到rpx的比例
            let pxToRpxScale = 750 / systemInfo.windowWidth;
            let systems = {
                ktxStatusHeight: systemInfo.statusBarHeight * pxToRpxScale, // 状态栏的高度
                navigationHeight: 44 * pxToRpxScale, // 导航栏的高度
                ktxWindowWidth: systemInfo.windowWidth * pxToRpxScale, // window的宽度
                ktxWindowHeight: systemInfo.windowHeight * pxToRpxScale, // window的高度
                ktxScreentHeight: systemInfo.screenHeight * pxToRpxScale, // 屏幕的高度
            }
            // 底部tabBar的高度
            systems.tabBarHeight = systems.ktxScreentHeight - systems.ktxStatusHeight - systems.navigationHeight - systems.ktxWindowHeight // 底部tabBar的高度
            this.lineHeight = systems.ktxStatusHeight + 'rpx';
            this.$emit('getHeight', systems)
        }
    }
</script>

<style lang="scss">
    /*正中*/
    .bar-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    //导航栏吸顶效果
    .bar-sticky {
        position: sticky;
        position: -webkit-sticky;
        top: 0rpx;	
        z-index: 101;
    }

    /*垂直居中*/
    .container-in {
        display: flex;
        -webkit-align-items: center;
        align-items: center;
        width: 100%;
        height: 44px;
    }

    .bar-line {
        height: 44px; //导航栏高度
		position: relative;
        .bar-back {
            font-size: 52rpx !important;
            position: absolute;
            left: 30rpx;
        }
		.icon-fanhui{
			position: absolute;
			top: 50%;
			left: 35rpx;
			width: 55rpx;
			height: 55rpx;
			transform: translateY(-50%);
			background-color: rgba($color: #999, $alpha: 0.3);
			border: 1rpx solid #ccc;
			border-radius: 50%;
			&::before{
				content: "";
				position: absolute;
				top: 50%;
				left: 40%;
				width: 20rpx;
				height: 20rpx;
				border-top: 3rpx solid #333;
				border-left: 3rpx solid #333;
				transform: translateY(-50%) rotate(-45deg);
				font-weight: bold;
				border-radius: 3rpx 0 0 0;
			}
		}

        .bar-title {
            font-size: 36rpx;
			font-weight: bold;
        }
    }
</style>