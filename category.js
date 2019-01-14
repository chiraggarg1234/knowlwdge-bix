var mongoose= require("mongoose");
var schema = mongoose.Schema;

var category = new schema({
	Apptitude:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},
	Currentaffairs:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},
	technical:{
		topics:String,
		questions: [
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},
	programming:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},

	reasoning:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},
	
	english:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	},
	
	Maths:{
		topics:String,
		questions:[
			{
				type:mongoose.Schema.Types.ObjectId,
				ref:"question"
			}
		]
	}
});

module.exports=mongoose.model("category",category);