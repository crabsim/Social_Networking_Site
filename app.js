const mongoose=require('mongoose');
var express = require('express');
var bodyParser=require("body-parser"); 
var app = express();
mongoose.connect('mongodb://localhost:27017/gfg'); 
var db=mongoose.connection; 

//check connection
db.once('open',function(){
    console.log('Connectede to MongoDB');
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
app.get('/login',function(req,res){
    res.sendfile('welcome.html');
})
app.get('/registration',function(req,res){
    res.sendfile('registration.html');
})

app.listen(3000,()=>{
    console.log('Server Running');
})