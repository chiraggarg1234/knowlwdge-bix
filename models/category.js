var mongoose = require("mongoose");
var schema = mongoose.Schema;

var categoryschema = new schema({
	category:String,
	subcategory:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"subcatgs"
		}
	]
	
});

module.exports = mongoose.model("category",categoryschema);