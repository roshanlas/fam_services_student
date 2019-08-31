const express = require('express');
const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student');
const SubmissionModel = require('../models/Submission');
const router = express.Router();
const keys = require('../config/keys');
const sendMail = require('../mailjet');
require('dotenv').config();

router.get('/', (req, res) => {
    res.status(200).send({msg: "done"})
});

router.get('/87eece9e43945e6918e7baf6748396e3.txt', (req, res)=>{
    res.status(200).sendFile(`${__dirname}/87eece9e43945e6918e7baf6748396e3.txt`)
});

router.get('/045079fea521ee40d3f9759e64c8a840.txt', (req, res)=>{
    res.status(200).sendFile(`${__dirname}/045079fea521ee40d3f9759e64c8a840.txt`)
});

router.post('/register', async (req, res) => {
    const student = await StudentModel.findOne({ email: req.body.email })
    .then(data=>data)
    .catch(err=>{
        console.log('service error at /register', err);
        return err;
    });
    
    if(student === null){
        await StudentModel
        .create(req.body)
        .then(result => {
            res.status(200).send({ msg: 'done', result });

            sendMail(
                'register', 
                result.email, 
                result.firstName + ' ' + result.lastName,
                result._id 
            );
        })
        .catch(err => { 
            console.log('service error at /register', err);
            res.status(400).send({msg: 'error', err})
        });
    } else {
        res.status(400).send({ msg: 'An account with that email address exists.' });
    }
});

router.post('/login', async (req, res) => {

    const student = await StudentModel.findOne({ 
        email: req.body.email 
    })
    .then(data=>data).catch(err=>console.log('err', err));

    if(student && student.emailVerified) {
        const payload = {
            id: student.id, 
            firstName: student.firstName, 
            lastName: student.lastName, 
            email: student.email
        };

        // Sign Token
        await jwt.sign(
            payload,
            keys.secret,
            (err, token) => {
                if (err) {
                    res.status(400).json({
                        msg: err    
                    })
                }
                else {
                    res.status(200).json({
                        success: true,
                        token: token,
                        firstName: student.firstName,
                        lastName: student.lastName
                    });
                };
            }
        );
    } else if (student && !student.emailVerified) {
        res.status(400).json({
            msg: 'Please verify your email'    
        })
    } else {
        res.status(400).json({
            msg: 'The email or password was incorrect'    
        })
    }
});

router.get('/verify/:id', async (req, res)=>{
    const student = await StudentModel
    .updateOne(
        { _id: req.params.id }, 
        { $set: { emailVerified: true } }
    )
    .then(data=>data)
    .catch(err=>{ console.log('err', err); return err; });

    if(student.ok && student.ok === 1) {
        // res.status(200).send({
        //     msg: 'Email has been verified',
        //     student
        // });
        res.redirect(`${process.env.WEB_APP}/sign-in?verified=true`);
    } else {
        // res.status(400).send({
        //     msg: 'Something went wrong',
        //     student
        // });
        res.redirect(`${process.env.WEB_APP}/sign-in?verified=false`)
    }
});

module.exports = router;