const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
var User = require("./user.js");
var category = require("./models/category.js");
var question = require("./models/question.js");
var subcatgs = require("./models/subcatgs.js");
// passport config
require('./passport')(passport);

//=====================ejs support====================================
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");
//app.use(express.static(path.join(__dirname,'public')));

//===================for bodyparser=====================================
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());



//====================routes=============================================

app.get("/" ,(req,res)=>{
	category.find({},function(err,found){
		if(err)
			console.log(err);
		res.render("Home",{category:found});
	});
});
app.get('/login',(req,res)=>{
	res.render("login");
});

app.get('/signup',(req,res)=>{
	res.render("signup");
});

app.get("/add/question",function(req,res){
	res.render("Add");
});
app.get("/add/category",function(req,res){
	category.find({},function(err,found){
		if(err)
			console.log(err);
		res.render("category",{category:found});
	});
});
app.post("/add/question",function(req,res){
	//User.findById(req.user.id,function(err,profile){
	//	if(err)
	//		console.log(err);
	//	console.log(profile);
		var data = {
		Question:req.body.question,
		option1:req.body.option1,
		option2: req.body.option2,
		option3: req.body.option3,
		option4: req.body.option4,
		answer:req.body.answer,
		description:req.body.description
	}
	question.create(data,function(err,final){
		if(err)
			console.log(err);
		console.log(final);
		final.save(function(err,saved){
			if(err)
				console.log(err);
			console.log(saved);
			var field={"subcategory":req.body.topic};
			subcatgs.find(field,function(err,found){
				if(err)
					console.log(err);
				console.log(found);
				if(found){
					found[0].questions.push(saved);
					found[0].save(function(err,result){
						if(err)
							console.log(err);
						console.log(result);
					});
					res.redirect("/add/question");
				}
				else{
					res.send("NoT FOUND");
				}
			});	
		});
	});
	});

//});


app.get("/:category/:id/subcategory",function(req,res){
	category.findById(req.params.id).populate("subcatgs").exec(function(err,found){
		if(err)
			console.log(err);
		res.render("show",{subcategory:found});
	});
});
//===================passport authaticate================================

	//res.send("signup");





//==========================database connection===================================
mongoose.connect("mongodb://Tulsi Sharma:tulsi123@ds257314.mlab.com:57314/knowledgebix" ,{useNewUrlParser:true});

var db = mongoose.connection;
db.on('error',function(err){
	console.log("connection error",err);
});
db.once('open',function(){
	console.log("database connected");
});



app.listen(process.env.PORT || 3000,function()
{
	console.log('server is up and running on port 3000');
});