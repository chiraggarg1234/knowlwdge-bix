var mongoose=require("mongoose");
var schema = mongoose.Schema;

var questionschema = new schema({
	Question:String,
	option1:String,
	option2:String,
	option3:String,
	option4:String,
	answer:String,
	topic:String,
	category:String,
	author:String
});
module.exports = mongoose.model('question',questionschema);