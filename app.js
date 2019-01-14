const express=require('express');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');
var User = require("./model/user.js");

// passport config
require('./config/passport')(passport);

// load modals
//require("./modal/user");
//const user=mongoose.modals('user');

//ejs support
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine","ejs");

//for bodyparser
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());



//routes
//const index=require('./routes/index');


app.get("/" ,(req,res)=>{
	res.render("index");
});
app.get('/login',(req,res)=>{
	res.render("login");
});

app.get('/signup',(req,res)=>{
	res.render("signup");
});

app.post('/signup',(req,res)=>{
	//console.log(req.body);

	const newuser= new User({
		username:req.body.username,
		email:req.body.email,
		password:req.body.password 
	});

	bcrypt.genSalt(10,(err,salt)=>{
		bcrypt.hash(newuser.password,salt,(err,hash) => {
			//if(err) throw err;
			newuser.password=hash;
			newuser.save()
			.then(user => { 
				res.redirect('/login');
			})
			.catch(err => {
				console.log(err);
				return ;
			});
		});
	});

	//res.send("signup");
});

app.post('/login',(req,res,next)=>{
 passport.authenticate('local',{
 	successRedirect:'/',
 	failureRedirect:'/login'
 })(req,res,next);
});

//   mongodb
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