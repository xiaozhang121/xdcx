import util from './utility'
var jweixin = require('jweixin-module')

export default {
	// 先配置 后使用
	init: function(res) {
		jweixin.config({
			debug: false,
			appId: res.appId,
			timestamp: res.timestamp,
			nonceStr: res.nonceStr,
			signature: res.signature,
			jsApiList: [
				// 'getLocation',
				'onMenuShareAppMessage', // 分享给朋友
				'onMenuShareTimeline', // 分享到朋友圈
				// 'chooseWXPay', // 发起一个微信支付请求
				// 'scanQRCode' // 扫描二维码
			]
		})
	},
	// pay: function(wxResult, orderId, self, JumpTo = '../member/component/order_category', callback = null, cancelback = null) {
	// 	let that = this
	// 	this.init(wxResult)
	// 	jweixin.ready(function() {
	// 		jweixin.chooseWXPay({
	// 			timestamp: wxResult.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
	// 			nonceStr: wxResult.nonceStr, // 支付签名随机串，不长于 32 位
	// 			package: "prepay_id=" + wxResult.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
	// 			signType: 'HMAC-SHA256', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
	// 			paySign: wxResult.signature, // 支付签名
	// 			success: function(res) { // 支付成功后的回调函数
	// 				console.log('pay success')
	// 				if (res.errMsg === 'chooseWXPay:ok') { // err_msg
	// 					util.showLoading('订单支付中…')
	// 					let remainTime = 0;
	// 					self.clock = function() {
	// 						console.log('start clock')
	// 						let requestPak = util.createRequestPak();
	// 						requestPak.requestBody = {
	// 							orderId: orderId,
	// 							memberId: self.user.id
	// 						};
	// 						remainTime++;
	// 						util.request(that, '/customerApp/getOrderDetail', requestPak, false)
	// 							.then((res) => {
	// 								// 0成功 1支付中
	// 								if ((res.data && res.data.order && res.data.order.status == '3') || remainTime === 4) {
	// 									self.clock = null
	// 									util.hideLoading()
	// 									if (util.isNullOrWhiteSpace(JumpTo)) {
	// 										console.log('isnull')
	// 										callback()
	// 									} else {
	// 										uni.reLaunch({
	// 											url: JumpTo
	// 										})
	// 									}
	// 								}
	// 							})
	// 						if (remainTime <= 3) {
	// 							setTimeout(self.clock, 3000);
	// 						}
	// 					};
	// 					self.clock();
	// 				}
	// 			},
	// 			cancel: (res) => {
	// 				console.log('cancel')
	// 				//支付取消
	// 				if (cancelback != null) {
	// 					cancelback()
	// 				}
	// 			}
	// 		})
	// 	})
	// },
	shareFriendAndCircle: function(res) {
		this.init(res)
		jweixin.ready(function() {
			jweixin.onMenuShareAppMessage({
				title: res.title, // 分享标题
				desc: res.desc, // 分享描述
				link: res.real_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: res.imgUrl || 'https://www.laohaowaner.com/qbresource/upload/share/qbjy_share.jpg', // 分享图标
				success: function() {
					// 设置成功
					this.util.message('分享成功')
				}
			})
			jweixin.onMenuShareTimeline({
				title: res.title, // 分享标题
				link: res.real_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: res.imgUrl || 'https://www.laohaowaner.com/qbresource/upload/share/qbjy_share.jpg', // 分享图标
				success: function() {
					// 设置成功
					this.util.message('分享成功')
				}
			})
		})
	},
	// getLocation: function(res, callback) {
	// 	this.init(res)
	// 	jweixin.ready(function() {
	// 		jweixin.getLocation({
	// 			type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
	// 			success: function(r) {
	// 				console.log('success')
	// 				callback(r)
	// 			}
	// 		})
	// 	})
	// },
	// scanCode: function(res, callback) {
	// 	this.init(res)
	// 	jweixin.ready(function() {
	// 		jweixin.scanQRCode({
	// 			needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
	// 			scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
	// 			success: function(res) {
	// 				callback(res.resultStr)
	// 			}
	// 		})
	// 	})
	// }
};
