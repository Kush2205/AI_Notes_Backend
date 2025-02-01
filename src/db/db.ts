import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const url : string  = process.env.MONGO_URL || "";

mongoose.connect(url);
const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    username : {type : String, required : true , unique : true},
    password : {type : String, required : true},
});

const uploadSchema = new mongoose.Schema({
    name : {type : String, required : true},
    Content : {type : String},
    Imageurl : {type : String},
    AudioUrl : {type : String},
    ImageName : {type : String},
    AudioName : {type : String},
    UploadDate : {type : Date , default : Date.now},
    ImageId : {type : String},
    AudioId : {type : String},
    ImageType : {type : String},
    AudioType : {type : String},
    userId : {type : mongoose.Schema.Types.ObjectId,ref :"User" , required : true},
})

const User = mongoose.model("User",userSchema);
const FileUpload = mongoose.model("Files" , uploadSchema);


export {User , FileUpload};
