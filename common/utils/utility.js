import config from "../config/config.js";

export default {
	createRequestPak: function() {
		return {
			platform: "wx",
			requestUser: "1",
			requestBody: {},
			token: "505d644c-6270-43b4-ab4b-4a56dec8da73",
			sign: "aaaa-bbbb-cccc-ddd"
		};
	},
	showLoading: function(title) {
		if (this.isNullOrWhiteSpace(title)) {
			title = '加载中';
		}
		uni.showLoading({
			title: title
		})
	},
	hideLoading: function() {
		uni.hideLoading()
	},
	message: function(message, duration) {
		if (this.isNullOrWhiteSpace(duration)) {
			duration = 2000;
		}
		uni.showToast({
			title: message,
			icon: "none",
			duration: duration
		});
	},
	messageSuccess: function(message) {
		// icon的类型，有效值：success,loading---
		if (this.isNullOrWhiteSpace(message)) {
			message = ' 成功';
		}
		uni.showToast({
			title: message,
			icon: 'success',
			duration: 3000
		})
	},
	messageDelete: function() {
		return this.messageConfirm("确认删除");
	},
	messageConfirm: function(message) {
		var postpromise = new Promise(function(resolve, reject) {
			uni.showModal({
				title: '提示',
				content: message,
				success(res) {
					if (res.confirm) {
						resolve(true);
					} else if (res.cancel) {
						resolve(false);
					}
				},
				fail(fres) {
					reject(fres);
				}
			})
		})
		return postpromise;
	},
	request: function(that, url, userdata, loading) {
		let self = this;
		if(url != '/llcy/choir/likeChoir' && url != '/llcy/choir/getChoirRanking'){
			uni.showLoading({
				title:"加载中...",
				mask:true,
			})
		}
		let promise = new Promise((resolve, reject) => {
			uni.request({
				method: "POST",
				url: config.contextPath + url,
				data: {
					platform: "wx",
					requestUser: "1",
					sign: "aaaa-bbbb-cccc-ddd",
					requestBody: userdata
				},
				success: function(res) {
					let data = res.data;
					resolve(data);
				},
				fail: (fres) => {
					self.message("网络中断或服务不存在");
					console.log(fres);
					reject(fres);
				},
				complete: () => {
					if (loading !== false) {
						self.hideLoading();
					}
				}
			})
		});
		return promise;
	},
	
	isNullOrWhiteSpace: function(val) {
		if (val === undefined || val === null || val === "" || val.length === 0) {
			return true;
		} else {
			return false;
		}
	},
	//zrm update
	formatDate(add) {
		let date = new Date();
		let year = date.getFullYear() + add;
		let month = (date.getMonth() + 1 + "").padStart(2, '0');
		let day = (date.getDate() + "").padStart(2, '0');
		return year + "-" + month + "-" + day;
	},
	//前一天日期
	formatPreDate() {
		let date = new Date();
		let preDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
		let year = preDate.getFullYear() + "";
		let month = (preDate.getMonth() + 1 + "").padStart(2, '0');
		let day = (preDate.getDate() + "").padStart(2, '0');
		return year + "-" + month + "-" + day;
	},
	setLastPageData(obj, ceng = 1) {
		let pages = getCurrentPages();
		let page = pages[pages.length - 1 - ceng];
		for (let item in obj) {
			page.$vm[item] = obj[item]
		}
	},
	verifyPhone(mobile) {
		if ((/^1[3456789]\d{9}$/.test(mobile))) {
			return true;
		} else {
			this.message("手机号有误，请重填")
			return false;
		}
	},
	checkLogin(){
		if(uni.getStorageSync("user") == ""){
			uni.showToast({
				title:"请先授权登录~",
				icon:"none",
				duration:1300,
				success() {
					setTimeout(()=>{
						uni.switchTab({
							url:"/pages/spa/home"
						})
					},1300)
				}
			})
			return true;
		}else{
			return false;
		}
	},
	requireComponents(localPath){
		const path = require('path');
		const files = require.context(localPath,false,/\.vue$/);
		const modules = {};
		files.keys().forEach(key => {
			const name = path.basename(key,'.vue');
			modules[name] = files(key).default || files(key)
		})
		return modules;
	}
};
