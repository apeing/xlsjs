var xlsx = require('node-xlsx');
var fs = require('fs');
var async = require('async');
var mongoose = require('mongoose');
var moment = require('moment');
var enity = require('./activity_sign_up.js');
var enity2 = require('./activity_attendee.js');
var enity3 = require('./kindergardens.js')
var config = {
        "host": "192.168.1.253:27017",
        "name": "serverintegrate",
        "username": "integrate",
        "password": "tomatotown",
        "options": {
            "replset": {
                "poolSize": 10,
                "socketOptions": {
                    "keepAlive": 1
                }
            }
        }
    };
var typeconfig = {
	"huihua":['ID','参赛项目','家长手机号','作者名称','年龄段','出生年月','参赛组别','学校名称','班级名称','所在地区','推荐单位','报名状态','作品名称','作品描述','作品地址','音频地址','报名时间','上传时间','人气值'],
	"shougong":['ID','参赛项目','家长手机号','作者名称','出生年月','参赛组别',"学校名称",'所在地区','推荐单位','报名状态','报名时间','上传时间']
}	
var param = [['ID','参赛项目','家长手机号','作者名称','年龄段','出生年月',''],
				[]];
var uri =  'mongodb://' + config.username + ':' + config.password + '@' + config.host + '/' + config.name;

function selectstatus(value){
	if(value === 'Pending')
	{
		return '未付款';
	}else if(value === 'Payed')
	{
		return '已付款';
	}else if(value === 'WorkUploaded')
	{
		return '作品已上传';
	}else if(value === 'Refund')
	{
		return '已退款';
	}else if(value === 'Blocked')
	{
		return '被屏蔽';
	}else {
		return '未知';
	}
}

mongoose.connect(uri, config.options,
    function(err){
        if(err) {
            console.error('ERROR: 无法连接数据库 - ' + config.db.host + '/' + config.db.name);
            console.error('       错误详情 - ' + err.name + ': ' + err.message);
            throw err;
        }else{
			console.log("connect success!");
			enity.find({"activityName":"2017年4月上海好灵童大赛"},function(err,result){
				if(err)
				throw err;
				if(result)
				{
					async.map(result,function(item,callback){
						setTimeout(function(){
							var obj = mongoose.Types.ObjectId(item.attendeeId);
							enity2.findOne({"_id":obj},function(error,data){
							//	SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								var obj2 = mongoose.Types.ObjectId(item.kindergardenId);
								enity3.findOne({"_id":obj2},function(error2,kinds){
									var progress = selectstatus(item.progress);
									var longcreate = Number(moment(item.createdAt)) + 8*60*60*1000;
									var datecreate = new Date(longcreate);
									var longupdate = Number(moment(item.updatedAt)) + 8*60*60*1000;
									var dateupdate = new Date(longupdate);
										if(item.activityType === 'shougong')
											if(item.work.sounds.length)
											callback(null,[item.attendeeId,'手工类',data.mobile,item.childName,'',item.birthday,item.activityGroup,kinds.name,'',item.location.district,item.recommend,progress,item.work.name,item.work.description,item.work.image,item.work.sounds[0]['url'],datecreate,dateupdate,item.voteCounts]);
											else callback(null,[item.attendeeId,'手工类',data.mobile,item.childName,'',item.birthday,item.activityGroup,kinds.name,'',item.location.district,item.recommend,progress,item.work.name,item.work.description,item.work.image,'',datecreate,dateupdate,item.voteCounts]);
										else
											if(item.work.sounds.length)
											callback(null,[item.attendeeId,'绘画类',data.mobile,item.childName,item.ageLevel,item.birthday,item.activityGroup,kinds.name,item.klassName,item.location.district,item.recommend,progress,item.work.name,item.work.description,item.work.image,item.work.sounds[0]['url'],datecreate,dateupdate,item.voteCounts]);
											else callback(null,[item.attendeeId,'绘画类',data.mobile,item.childName,item.ageLevel,item.birthday,item.activityGroup,kinds.name,item.klassName,item.location.district,item.recommend,progress,item.work.name,item.work.description,item.work.image,'',datecreate,dateupdate,item.voteCounts]);
								});
								
							//		callback(null,[item.attendeeId,'绘画类',data.mobile,item.childName,item.ageLevel,item.recommend,item.klassName,item.location.district,item.progress,item.createdAt.pattern("yyyy-MM-dd hh:mm:ss"),item.updatedAt.pattern("yyyy-MM-dd hh:mm:ss")]);
							});			
						},100);
					},function(err,res){
						res.unshift(typeconfig.huihua);
					//	console.log(res);
						var buffer = xlsx.build([{"name":"activity","data":res}]);
						var strdate = moment().get('year').toString() + (moment().get('month') + 1).toString() + moment().get('date').toString();
						var strfile = '好灵童报名信息表' + strdate + '.xlsx';
						fs.writeFileSync(strfile,buffer,'binary');
						console.log("finish!");
					});
				}
				// var data = [["ID","活动名称","姓名","年龄","班级","出生年月"],["小李","28","男"],["小雷","30","男"]];
				 
			});
		}
    }
);

mongoose.connection.on('reconnected', function() {
    console.log('已重新连接上MongoDB');
});




// var data = [["名称","年龄","性别"],["小李","28","男"],["小雷","30","男"]];
// var buffer = xlsx.build([{"name":"mysheet","data":data}]);
// fs.writeFileSync('b.xlsx',buffer,'binary');




