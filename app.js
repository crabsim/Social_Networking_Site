const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')
var express = require('express');
var bodyParser=require("body-parser"); 
var app = express();
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var User=require('./model')
mongoose.connect('mongodb://localhost:27017/gfg'); 
var db=mongoose.connection; 
const passport=require('passport')
var flash=require("connect-flash");
app.use(flash());

//check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
})
//check errors
db.on('error',function(err){
    console.log(err);
});

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 

//passport config

var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
      }
    );
}));
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }

app.post('/sign_up', function(req,res){ 
     
    var email =req.body.email; 
    var pass = req.body.pass; 
    var fname =req.body.fname;
    var lname= req.body.lname; 
  
    var data = { 
         
        "email":email, 
        "password":pass, 
        "first_name":fname,
        "last_name":lname 
    } 
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    return res.redirect('/'); 
}) 

app.get('/',function(req,res){
    res.sendfile('index.html');
})

app.get('/login', passport.authenticate('login', {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash : true 
  }));
  
 

app.get('/registration',function(req,res){
    res.sendfile('registration.html');
})
app.get('/welcome',function(req,res){
    res.sendfile('welcome.html');
})

app.listen(3000,()=>{
    console.log('Server Running');
})