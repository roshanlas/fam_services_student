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
        required: false
    },
    marriageStatus: {
        type: String,
        required: false
    },
    occupation : {
        type: String,
        required: false
    },
    residence : {
        type: String,
        required: false
    },
    city : {
        type: String,
        required: true
    },
    homeAddress : {
        type: String,
        required: false
    },
    postCode : {
        type: String,
        required: false
    },
    date:{
        type:Date,
        default:Date.now
    }
}, {collection: 'students'}));

module.exports = StudentModel;