const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
var promise=require('promise');
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
	category.find({},function(err,found){
		if(err)
			console.log(err);
		subcatgs.find({},function(err,final){
			if(err)
				console.log(err);
			res.render("Add",{category:found,subcat:final});
		});
		
	});
	
});
app.get("/add/subcategory",function(req,res){
	category.find({},function(err,found){
		if(err)
			console.log(err);
		res.render("category",{category:found});
	});
});

app.post("/add/subcategory",function(req,res){
	var data ={
		subcategory:req.body.subcategory
	}
	subcatgs.create(data,function(err,result){
		if(err)
			consol.log(err);
		console.log(result);
		result.save(function(err,final){
			if(err)
				console.log(err);
			console.log(final);
			category.find({category:req.body.Category},function(err,found){
				if(err)
					console.log(err);
				console.log(found);
				if(found)
				{
					found[0].subcategory.push(final);
				}
				found[0].save(function(err,founds){
					if(err)
						console.log(err);
					console.log(founds);
					res.redirect("/add/subcategory");
				});
				
			});
		});
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


// $$$$$$$$$$$$$$$$$ONLINE-TEST$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app.get("/test/choose",function(req,res){
  category.find({},function(err,final){
  	if(err)
  		console.log(err);
  	//console.log(final);
  	res.render("choose",{category:final});

  });
   
});

//=========================================================================================================

app.post("/test/choose",async function(req,res){
	var test=[];

	await category.find({category:req.body.sel},async function(err,cat){
		if(err)
			console.log(err);
		console.log(cat);
		if(cat){
			console.log("&&&&");
			console.log("category call");
			await search(cat,test).then(function(data){
			console.log(test);
			res.render("start",{test:test});
		}).catch(function(err){

				console.log(err);
		})
		}
			
	});
	
});
 


// async function search(s,test){
// 	await s[0].subcategory.forEach(async function(subcat){
// 	 		console.log("******");
// 	 	//	console.log(subcat);
// 			await searchsubcat(subcat._id).then(async function(data){
// 				//console.log(data);
// 				await searchques(data,test).catch(function(err){

// 				// console.log(err);
// 				// });
// 			}).catch(function(err){

// 				console.log(err);
// 			});
// 	});
// }

async function search(s,test){
	
	for(var i=0;i<s[0].subcategory.length;i++){
		console.log("******");
		await searchsubcat(s[0].subcategory[i]._id).then(async function(data){
				console.log("subcategory===========");
				console.log(data);
				d=await searchques(data,test).catch(function(err){

				//console.log(err);
				// });
			}).catch(function(err){

				console.log(err);
			});
	});
}

}

async function searchsubcat(s){
	console.log("%%%%%");
	// // await subcatgs.findById(s,function(err,subcat){
	// // 		if(err)
	// // 			console.log(err);
	// // 		console.log(subcat);
	// // 		if(subcat)
	// // 		{
	// // 			console.log("^^^^^");
	// // 			return subcat;
	// // 		}
	// 		// else{
	// 		// 	return new subcatgs();
	// 		// }
	// });
	var subcat = await subcatgs.findById(s);
	//console.log(subcat);
	return subcat;
}

// async function searchques(s,test){
// 	if(s.questions){
// 		console.log("question");
// 		 s.questions.forEach(function(ques){
// 			await searchq(ques.id).then(function(data){
// 					test.push(data);
// 			}).catch(function(err){

// 				console.log(err);
// 				});
// 	// }).catch(function(err){

// 	// 			console.log(err);
// 		});
// }
// }

async function searchques(s,test){
	if(s.questions){
		console.log("question");
		for(var i=0;i<s.questions.length;i++){
			await searchq(s.questions[i]._id).then(function(data){
					console.log("question insert this");
					console.log(data);
					test.push(data);
					console.log("array test");
					console.log(test);
			}).catch(function(err){

				console.log(err);
				});
		 }
		};
	
	}


async function searchq(s){
		console.log("qqqqqq");
		var q=await question.findById(s);
		console.log(q);
		return q;
}
//========================================================================================================
app.get("/test/start",function(req,res){
    
    res.render("start");
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