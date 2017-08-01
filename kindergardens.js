'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//运营活动报名信息
var kindergardensSchema = new Schema({
    name: String,            //学校名称
    cityCode: String,  //chegnshi daima                 
});

var kindergardens;

if (mongoose.models.kindergardens) {
  kindergardens = mongoose.model('kindergardens');
} else {
  kindergardens = mongoose.model('kindergardens', kindergardensSchema, 'kindergardens');
}

module.exports = kindergardens;
