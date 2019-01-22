var mongoose = require("mongoose");

var schema = mongoose.Schema({

	subcategory:String,
	questions:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"question"
		}
	]
});

module.exports = mongoose.model("subcatgs",schema);