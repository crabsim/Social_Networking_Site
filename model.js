var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	email: String,
    password: String,
    first_name:String,
    last_name:String 
	
}),
User = mongoose.model('User', userSchema);

module.exports = User;