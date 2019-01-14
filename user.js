const mongoose=require('mongoose');
const schema=mongoose.Schema;

const userschema= new schema({
 username:{
 	type:String,
 	require:true
 },
 email:{
 	type:String,
 	require:true
 },
 password:{
 	type:String,
 	require:true
 }

});
module.exports=mongoose.model('User',userschema);