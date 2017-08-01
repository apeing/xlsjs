'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//运营活动参加人员信息
var activityAttendeeSchema = new Schema({
    unionid: {type: String},                           //用户统一标识。针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。
    mobile: {type: String},                            //普通用户的标识，对当前开发者帐号唯一
    secret: String,                                    //服务器随机生成, 与登录时Token相关
    createdAt: { type: Date, default: Date.now }       //投票时间
});

activityAttendeeSchema.index({ 'unionid': 1 }, { 'unique': true });
activityAttendeeSchema.index({ 'mobile': 1 }, { 'unique': true });

var ActivityAttendee;

if (mongoose.models.ActivityAttendee) {
  ActivityAttendee = mongoose.model('ActivityAttendee');
} else {
  ActivityAttendee = mongoose.model('ActivityAttendee', activityAttendeeSchema, 'activityAttendees');
}

module.exports = ActivityAttendee;
