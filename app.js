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
var net = require("net");
//var http = require("http").createServer(app);
// passport config
require('./passport')(passport);

//=====================ejs support====================================
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));

//===================for bodyparser=====================================
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());



//====================routes=============================================
var test=[];


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

app.get('/register',(req,res)=>{
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
	
	subcatgs.create({subcategory:req.body.subcategory},function(err,result){
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
				console.log("&&&&&&&&&&&&&&&&&&&&&&&&");
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
	console.log(req.params.id);
	category.findById(req.params.id).populate("subcatgs").exec(function(err,subcatgs){
		if(err)
			console.log(err);
		console.log(subcatgs);
		res.render("show",{subcategory:subcatgs});
	});
});

app.get("/:subcategory/:id/question",function(req,res){
	console.log("*******");
	subcatgs.findById(req.params.id).populate("question").exec(function(err,ques){
		if(err)
			console.log(err);
		console.log(ques);
		res.render("questions",{questions:ques});
	});
});

// $$$$$$$$$$$$$$$$$ONLINE-TEST$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

app.get("/test/choose",function(req,res){
  category.find({},function(err,final){
  	if(err)
  		console.log(err);
  		console.log(final);
	  	res.render("choose",{category:final});
  });
   
});


app.get("/test/result",function(req,res){
  res.render("result");
});

app.post("/test/result",function(req,res){
	console.log(req.body);
	//res.render("login");
	var wrong=0;
	var right=0;
	var un=0;
     for(var i=0;i<7;i++){
     	var value = "option"+i;
     	var val = req.body[value];
     	if(val==test[i].answer){
     		right++;
     	}
     	else if(!val){
     		un++;
     	}
     	else
     	{
     		 wrong++;
     	}
     }
      console.log("wrong answers:" +wrong);
      console.log("wrong answers:" +un);
      console.log("right answers:" +right);

     var ress={
     	wr:wrong,
     	ri:right,
     	u:un
     };
        
        res.render("result",{Ress:ress});
     });

//=========================================================================================================

app.post("/test/choose",async function(req,res){
	
		test=[];
	await category.find({category:req.body.sel},async function(err,cat){
		if(err)
			console.log(err);
		console.log(cat);
		if(cat){
			
			console.log("category call");
			await search(cat,test).then(function(data){
			console.log(test);
			res.render("start",{test:test,cat:cat});

		}).catch(function(err){

				console.log(err);
		})
		}
			
	});
	
});
 

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

	var subcat = await subcatgs.findById(s);
	return subcat;
}



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

//========================CONTEST ====================================================================






app.get("/contest",function(req,res){

	var socket = net.Socket();
	console.log(socket.id);
	socket.connect(3000,function(soc){
		console.log(soc);
		res.sendFile(__dirname + "/add.html");
	});
	

});



//===================passport authaticate================================

	





//==========================database connection===================================
mongoose.connect("mongodb://knowledge:bix123456@ds255794.mlab.com:55794/knowledgebix" ,{useNewUrlParser:true});

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
