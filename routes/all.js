const express = require('express');
const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student');
const router = express.Router();
const keys = require('../config/keys');

router.get('/', (req, res) => {
    res.status(200).send({msg: "done"})
});

router.get('/87eece9e43945e6918e7baf6748396e3.txt', (req, res)=>{
    res.status(200).sendFile(`${__dirname}/87eece9e43945e6918e7baf6748396e3.txt`)
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
            res.status(200).send({ msg: 'done', result })
        })
        .catch(err => { 
            // console.log('service error at /register', err);
            res.status(400).send({msg: 'error', err})
        });
    } else {
        res.status(400).send({ msg: 'An account with that email address exists.' });
    }
});

router.post('/login', async (req, res) => {

    const student = await StudentModel.findOne({ email: req.body.email })
    .then(x=>x).catch(err=>console.log('err', err));

    if(student) {
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
    } else {
        res.status(400).json({
            msg: 'The email or password was incorrect'    
        })
    }
});

router.post('/submit', async () => {
    const student = await StudentModel
    .findOneAndUpdate(
        { email: req.body.email }, 
        submission, 
        { upsert: true }
    )
    .then(x=>x).catch(err=>console.log('err', err));
});


module.exports = router;