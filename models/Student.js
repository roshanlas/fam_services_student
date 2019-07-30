const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentModel =  mongoose.model('students',new Schema ({
    email:{
        type:String, 
        required:true
    },
    password:{
        type:String,
        required:true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    marriageStatus: {
        type: String,
        required: true
    },
    occupation : {
        type: String,
        required: true
    },
    residence : {
        type: String,
        required: true
    },
    city : {
        type: String,
        required: true
    },
    homeAddress : {
        type: String,
        required: true
    },
    postCode : {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    }
}, {collection: 'students'}));

module.exports = StudentModel;