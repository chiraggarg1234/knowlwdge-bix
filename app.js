const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
const localstrategy=require('passport-local');
var User = require("./model/user.js");
var question = require("./model/question.js");
var category = require("./model/category.js");
var subcatgs = require("./model/subcatgs.js");
var promise=require('promise');

//####################ejs support##################
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");

//####################for bodyparser################
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());



//routes
//const index=require('./routes/index');

//##################################LOGIN-SIGNUP############################
// app.get("/" ,(req,res)=>{
// 	res.render("index");
// });

app.get("/" ,(req,res)=>{
	category.find({},function(err,found){
		if(err)
			console.log(err);
		res.render("index",{category:found});
	});
});

app.get('/login',(req,res)=>{
	res.render("login");
});

app.get('/signup',(req,res)=>{
	res.render("signup");
});

 //=====================passport configuration===============
	app.use(require("express-session")({
		secret:"once again user signin",
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use(new localstrategy(User.authenticate()));
	passport.serializeUser(User.serializeUser());
	passport.deserializeUser(User.deserializeUser());

//=======================auth path===================  
app.post("/signup",function(req,res){
	var newuser = new User({username:req.body.username,email:req.body.email});
	User.register(newuser,req.body.password,function(err,user){
		if(err){
			return res.render("signup");
			//req.flash("notsignin",err.message);
		}

		passport.authenticate("local")(req,res,function(){
			//req.flash("signup",req.body.username+" is signin successfully!!");
			res.redirect("/login");
		});
	});
});



app.post("/login",passport.authenticate("local",{
			successRedirect:"/testing",
			failureRedirect : "/login"
})//,function(req,res){
	//req.flash("login",req.body.username+" is logged in");
	//console.log("user login!!!");
);

app.get("/logout",function(req,res){
	req.logout();
	//req.flash("success","logout successfully!!");
	res.redirect("/");
});

//##############################LOGIN-SIGNUP-END###############################################

//$$$$$$$$$$$$$testing$$$$$$$$$$$$$$

// subcatgs s1=new subcatgs({
// 	subcategory:String,
// })
// s1.sa

//################################# questions ##############################################
app.get("/add/question",function(req,res){

	category.find({},function(err,found){
		if(err)
			console.log(err);
		subcatgs.find({},function(err,final){
		if(err)
			console.log(err);
		res.render("add",{category:found,subcatgs:final});
	});
		
	});
});
app.get("/add/subcategory",function(req,res){
	category.find({},function(err,found){
		if(err)
			console.log(err);
		res.render("addsub",{category:found});
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
		explanation:req.body.explanation,
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
			subcatgs.find({subcategory:req.body.topic},function(err,found){
				if(err)
					console.log(err);
				console.log("******");
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

app.post("/add/subcategory",function(req,res){

	var newsub={
		subcategory:req.body.subcategory
	}
	subcatgs.create(newsub,function(err,result){
		if(err)
			console.log(err);
		//console.log(result);
		result.save(function(err,found){
			if(err)
				console.log(err);
		//	console.log(found);
			category.find({category:req.body.Category},function(err,data){
				if(err)
					console.log(err);
		//		console.log(data);
				if(data){
					data[0].subcategory.push(found);
					data[0].save(function(err,final){
						if(err)
							console.log(err);
		//				console.log(final);
					});
				}

				res.redirect("/add/subcategory");
			});
			
		});
	});

	});

app.get("/:category/:id/subcategory",function(req,res){
	category.findById(req.params.id).populate("subcatgs").exec(function(err,found){
		if(err)
			console.log(err);
		res.render("show",{subcategory:found});
	});
});

// $$$$$$$$$$$$$$$$$ONLINE-TEST$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app.get("/test/choose",function(req,res){
  category.find({},function(err,final){
  	if(err)
  		console.log(err);
  	//console.log(final);
  	res.render("choose",{category:final});

  });
   
});



// app.post("/test/choose",function(req,res){
// 	var test=[];
//   category.find({category:req.body.sel},function(err,final){
//         if(err)
//         	console.log(err);
//             console.log(final);
//             console.log("******");
//          final[0].subcategory.forEach(function(sub){
//         	console.log(sub._id);

//         	calculate(sub._id).then(function(data){
//         		console.log(data);
        		// data.questions.forEach(function(ques){
        			
        		// 	question.findById(ques._id,function(err,ok)
        		// 		{
        		// 			if(err){
        		// 				console.log(err);
        		// 			}
        		// 		   test.push(ok);        				
        		// 		});
        		// });
        		
        	//});
        	// subcatgs.findById(sub._id,function(err,found){
        	// 	if(err)
        	// 		console.log(err);
        	// 	console.log(found);
        		// found.questions.forEach(function(ques){
        		// 	question.findById(ques._id,function(err,ok)
        		// 		{
        		// 			if(err){
        		// 				console.log(err);
        		// 			}
        		// 		   test.push(ok);        				
        		// 		});

        // 		});
        // 	});
        // 	res.render("start",{test:test});
        // });
//  });

   
//});
//});

	app.post("/test/choose",function(req,res){
			category.find({category:req.body.sel}).populate("subcatgs").exec(function(err,found){
				if(err)
					console.log(err);
				console.log(found);
				found[0].subcategory.forEach(function(eat){
					subcatgs.findById(eat._id).then(function(err,data){
							if(err)
								console.log(err);
							console.log(data);
							console.log("data======");
					});
				});
	});
	});
 function calculate(s){
 	console.log(s);
 	return subcatgs.findById(s).then(function (data){
 		return data;
 	});
};

function calculate2(s){
	return new promise(function(reject,resolve){
		s.questions.forEach(function(ques){
        			
        			question.findById(ques._id,function(err,ok)
        				{
        					if(err){
        						console.log(err);
        					}
        				   resolve(ok);
        				   reject(err);        				
        				});
        		});
	});
};

app.get("/test/start",function(req,res){
    
    res.render("start");
});


//===================passport authaticate================================

	//res.send("signup");



//=============================mongodb================================================
mongoose.connect("mongodb://knowledge:bix123456@ds255794.mlab.com:55794/knowledgebix" ,{useNewUrlParser:true});

var db = mongoose.connection;
db.on('error',function(err){
	console.log("connection error",err);
});
db.once('open',function(){
	console.log("database connected");
});



app.use(express.static(path.join(__dirname,'public')));
//app.use('/',index);


app.listen(process.env.PORT || 3000,function()
{
	console.log('server is up and running on port 3000');
});