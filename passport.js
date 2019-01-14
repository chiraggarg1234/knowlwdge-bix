const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
var user = require("../model/user.js");
//const user=mongoose.model('user');

module.exports=function(passport){
	passport.use(new LocalStrategy({usernameField:'email'},(email,password,done) => {
	
	 user.findOne({
	 	email:email
	 }).then(user =>{
	 	if(!user)
	 	{
	 		return done(null,false,{message:'No user found'});
	 	}
	 	// match password

	 	bcrypt.compare(password,user.password, (err,isMatch) =>{
	 		if(isMatch)
	 		{
	 			return done(null,user);
	 		}else{
	 			return done(null,false,{message:'password-incorrect'});
	 		}
	 	})
	 })
	}));





// 	passport.use(new LocalStrategy(
//   function(username, password, done) {
//     user.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));
}