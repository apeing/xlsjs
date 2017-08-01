'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//运营活动报名信息
var signUpSchema = new Schema({
    activityName: String,            //活动名称
    attendeeId: { type: String, index: true},  //参加人ID
    childName: String,           //孩子名称
    ageLevel: String,            //孩子年龄段
    kindergardenName: String,   // 过期
    kindergardenId: String,     // 所在幼儿园Id
    klassName: String,          // 所在班级名称
    district: String,           // 过期
    birthday: String,           //出生日期
    activityType: {type: String, default:'huihua'}, //huihua: 绘画类, shougong: 手工类
    activityGroup:String,       //参赛组别
    recommend:String,			//推荐单位	
    location: {                 // 报名人所属地区
        district: String,       // 地区
        city: String            // 城市
    },
    progress: { type: String, default: 'Pending', enum: {values: ['Pending', 'Payed', 'WorkUploaded', 'Refund','Blocked']}},   //报名状态，Pending未付款|Payed已付款|WorkUploaded作品已上传|Refund已退款|Blocked被屏蔽
    totalCost: { type: Number, default: 0 },   //缴费总额，单位分
    channel: {type: String, default:'Online'}, //Online: 线上报名, Offline: 线下报名
    work: {                                    //作品信息
        description: String,                   //作品描述
        name: String,                          //作品名称
        image: String,                          //图片地址
        sounds: [{                             //作品关联声音信息
            url: String,
            order: Number,                      //声音顺序，如有多段声音时，WeChat只能录制1段1分钟声音，当超过1分钟时，程序自动分段录制
            serverId: String,                   //声音在客户端的id，调用微信api时使用
            urlType: {type: String, enum: {values: ['WeChat', 'Http']}}, //WeChat是微信才可识别的地址，需要用微信的功能播放，Http为一个正常的URL，目前是一个七牛的地址
            persistentId: String                //七牛转码的JobID
        }],
        oldSounds: [{                           //记录历史上传的音频信息, 仅用于恢复数据用
            url: String,
            order: Number,                      //顺序
            serverId: String,
            urlType: {type: String, enum: {values: ['WeChat', 'Http']}}, //WeChat是微信才可识别的地址，需要用微信的功能播放，Http为一个正常的URL，目前是一个七牛的地址
            persistentId: String                //七牛转码的JobID
        }],
        uploadedOn: Date                        //上传日期
    },
    payment: {                                  //支付信息
        paymentType: {type: String, enum: {values: ['Offline', 'WeChat', 'Alipay']}},   //支付方式 Offline线下|WeChat微信|Alipay支付宝
        paymentId: String,                      //支付Id
        status: String,                         //付款状态
        tradeType: String,                      //交易类型
        bankType: String,                       //银行类型
        buyer: {                                //付款人信息
            buyerId: String,                    //付款人Id
            buyerAccount: String                //付款人账户类型
        },
        createdAt: Date,                        //付款时间
    },
    refund: {                                   //退款信息
        refundType: String,                     //退款类型
        refundTime: String,                     //退款时间
        refundCallbackId: String                //退款对应callback
    },
    voteCounts: {type: Number, default: 0, index: true},  //作品获得的投票数
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
	agentid:String                              //招商银行活动 需要记录是从那个代理那里进入的，在支付成功后记录代理id
});

signUpSchema.index({ 'attendeeId': 1, 'activityName': 1}, { unique: true });
signUpSchema.index({ 'progress': 1, 'voteCounts': -1 });
signUpSchema.index({ 'progress': 1, 'work.uploadedOn': -1 });

var ActivitySignUp;

if (mongoose.models.ActivitySignUp) {
  ActivitySignUp = mongoose.model('ActivitySignUp');
} else {
  ActivitySignUp = mongoose.model('ActivitySignUp', signUpSchema, 'activitySignUps');
}

module.exports = ActivitySignUp;
