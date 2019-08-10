const express = require('express');
const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student');
const router = express.Router();
const keys = require('../config/keys');

router.get('/', (req, res) => {
    res.status(200).send("done")
});


router.post('/register', async (req, res) => {
    const student = await StudentModel.findOne({ email: req.body.email })
    .then(x=>x).catch(err=>console.log('err', err));
    
    if(student) {
        res.status(400).send({ msg: 'An account with that email address exists.' });
        return;
    }

    const newStudent = await StudentModel
    .create(req.body)
    .then(result => {
        res.status(200).send({ msg: 'done' })
    })
    .catch(err => { 
       // console.log('err', err);
       res.status(400).send({msg: err})
    });
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

    };
});


module.exports = router;