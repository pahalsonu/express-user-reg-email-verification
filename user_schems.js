

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new  Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String
    },
    email : {
        
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    }
   
});

//mongoose.model("restapi"(data base), userSchema, "new_users"(collection name))
module.exports = mongoose.model("test", userSchema, "pahal_users");