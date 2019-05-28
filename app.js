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
var notesschema=require("./model/notesschema.js");
var promise=require('promise');

const crypto=require('crypto');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
const Grid=require('gridfs-stream');
const methodoverride=require('method-override');

//####################ejs support##################
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");
app.use(methodoverride('_method'));

//####################for bodyparser################
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

var test=[];

//routes
//const index=require('./routes/index');

//##################################LOGIN-SIGNUP############################
// app.get("/" ,(req,res)=>{
// 	res.render("index");
// });

app.get("/" ,(req,res)=>{
	console.log(req.user);
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
	var newuser = new User({email:req.body.nickname,username:req.body.username});
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
			successRedirect:"/",
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

app.post("/test/result",function(req,res){
	//console.log(req.body);
     req.body.name='A';
     
     console.log(req.body.name);
	//var an=i.toString();
	//const str="A";
    //const x=str;

  
	// console.log(req.body.option2);
	// console.log(req.body.option3);
	// console.log(req.body.option4);
	// console.log(req.body.option5);
	 
	 // var cnt=0;
	 // //console.log(obj);

	 // for(var i=0;i<test.length;i++)
	 // {
	 // 	//var j = i.toString();
	 // 	var op ="option"+i;
	 // 	console.log(op);
	 
	 // 	var ans=req.body.op;
	 // 	console.log(ans);

	 // 	// if(test[i].answer==ans)
	 // 	// {
	 // 	// 	cnt++;
	 // 	// }
	 // }



   //for(i=0;i<test.length;i++)
    //{
    	//console.log(test[i].answer);
    //		var an=i.toString();
   // 	console.log(req.body.an);
   // 	var an=i.toString();
   // 	 if(req.body.an==test.answer)
   // 	 {
   // 	 	cnt++;
   // 	 }
  // } 

//console.log("***************************************************************");
	 //console.log(test);
  //console.log(cnt);
});

app.get("/notes",function(req,res){
            res.send("stored notes are here ...........");
});

app.get("/notes/add",function(req,res){
   res.render("add_notes");
});

app.post("/notes/add",function(req,res){
     console.log(req.body.title);

     console.log(req.body.text);

     console.log(req.body.file);

     var note={
     	title:req.body.title,
     	body:req.body.text,
     	file:req.body.file
     }

     notesschema.create(note,function(err,final){
     	if(err)
     	{
     		console.log(err);
     	}
     	final.save(function(err,done){
     		if(err)
     			console.log(err);
     		else
     			console.log(done);
     	});
     });

     res.redirect("/notes");

});

//mongo file storage
// const storage = new GridFsStorage({
//   url: "mongodb://knowledge:bix123456@ds255794.mlab.com:55794/knowledgebix",
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

// //const gfs = Grid(db, mongo);

// const upload = multer({ storage });
// app.get("/notes/upload",function(req,res){
// 	//res.render("notesupload");

// 	gfs.files.find().toArray((err,files)=>{

// 		if(!files || files.length===0)
// 		{
// 			res.render('notesupload',{files:false});
// 		}
// 		else
// 		{
// 			files.map(file => {
// 				if(file.contentType==='image/jpeg' || file.contentType==='image/png')
// 				{
// 					file.isImage=true;
// 				}
// 				else
// 				{
// 					file.isImage=false;
// 				}
// 			});
// 			console.log(files);
// 			res.render('notesupload',{files:files});
// 			//console.log(files);
// 		}
// 		//return res.json(files);
// 	});
// });

// app.post('/notes/upload',upload.single('file'), (req,res)=>{
//   //res.json({file:req.file});
//   res.redirect('/notes/upload');
// });


// app.get('notes/upload/image/:filename',(req,res)=>{
//  gfs.files.findOne({filename:req.params.filename},(err,file)=>{

//  	if(!file || file.length===0)
//  	{
//  		return res.status(404).json({
//  			err:'no files exist'
//  		});
//  	}

//   if(file.contentType=== 'image/png' || file.contentType=== 'image/jpeg')
//   {
//   	const readstream =gfs.createReadStream(file.filename);
//   	readstream.pipe(res);
//   }
//   else
//   {
//   	res.status(404).json({
//   		err:'NOT an image'
//   	});
//   }

//  });
// });

// app.get('/notes/upload/files',(req,res)=>{
//  gfs.files.find().toArray((err,files)=>{

//    if(!files || files.length===0){
//    	return res.status(404).json({
//    		err:'No files exist'
//    	});
//    }
//     return res.json(files);
//  });
// });


// app.get('/notes/upload/files/:filename',(req,res)=>{
// 	gfs.files.findOne({filename:req.params.filename},(err,file)=>{

// 		if(!file || file.length ===0)
// 		{
// 			return res.status(404).json({
// 				err:'No file exists'
// 			});
// 		}
// 		return res.json(file);
// 	});
// });
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
		//console.log(req.body);
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

// app.get("/test/choose",function(req,res){
//   category.find({},function(err,final){
//   	if(err)
//   		console.log(err);
//   	//console.log(final);
//   	res.render("choose",{category:final});

//   });
   
// });



// app.post("/test/choose",function(req,res){
// 	var test=[];
//   category.find({category:req.body.sel}, async function(err,final){
//         if(err)
//         	console.log(err);
//             console.log(final);
//             console.log("******");
//          await final[0].subcategory.forEach( async function(sub){
//         	console.log(sub._id);

//         	await calculate(sub._id).then(function(data){
//         		console.log(data);
//         		data.questions.forEach(async function(ques){
        			
//         			await question.findById(ques._id, async function(err,ok)
//         				{
//         					if(err){
//         						console.log(err);
//         					}
//         				  await test.push(ok);        				
//         				});
//         		});
        		
//         	});
//         	await subcatgs.findById(sub._id,function(err,found){
//         		if(err)
//         			console.log(err);
//         		console.log(found);
//         		found.questions.forEach( async function(ques){
//         			question.findById(ques._id,function(err,ok)
//         				{
//         					if(err){
//         						console.log(err);
//         					}
//         				   test.push(ok); 
//         				   console.log(test);       				
//         				});

//         		});
//         	});
//         	await res.render("start",{test:test});

//         });
//  });

   
// });


//  async function calculate(s){
// atgs.findById(s).(function (data){
//  		return data;
//  	});
// };

// function calculate2(s){
// 	return new promise(function(reject,resolve){
// 		s.questions.forEach(function(ques){
        			
//         			question.findById(ques._id,function(err,ok)
//         				{
//         					if(err){
//         						console.log(err);
//         					}
//         				   resolve(ok);
//         				   reject(err);        				
//         				});
//         		});
// 	});
// };

// app.get("/test/start",function(req,res){
    
//     res.render("start");
// });


//===================passport authaticate================================

	//res.send("signup");
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
	// var test=[];

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
 
async function search(s,test){
	
	for(var i=0;i<s[0].subcategory.length;i++){
		console.log("******");
		await searchsubcat(s[0].subcategory[i]._id).then(async function(data){
				console.log("subcategory===========");
				//console.log(data);
				await searchques(data,test).catch(function(err){

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
	
	var subcat = await subcatgs.findById(s);
	//console.log(subcat);
	return subcat;
}

async function searchques(s,test){
	if(s.questions){
		console.log("question");
		for(var i=0;i<s.questions.length;i++){
			await searchq(s.questions[i]._id).then(function(data){
					console.log("question insert this");
					//console.log(data);
					test.push(data);
					console.log("array test");
					//console.log(test);
			}).catch(function(err){

				console.log(err);
				});
		 }
		};
	
	}


async function searchq(s){
		console.log("qqqqqq");
		var q=await question.findById(s);
		//console.log(q);
		return q;
}
//========================================================================================================
app.get("/test/start",function(req,res){
    
    res.render("start");
});



//=============================mongodb================================================
mongoose.connect("mongodb://knowledge:bix123456@ds255794.mlab.com:55794/knowledgebix" ,{useNewUrlParser:true});


var db = mongoose.connection;
db.on('error',function(err){
	console.log("connection error",err);
});
db.once('open',function(){
	console.log("database connected");
});

const gfs=Grid(db,mongoose.mongo);

app.use(express.static(path.join(__dirname,'public')));
//app.use('/',index);


app.listen(process.env.PORT || 3000,function()
{
	console.log('server is up and running on port 3000');
});