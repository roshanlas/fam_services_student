const express = require('express');
const StudentModel = require('../models/Student');
const router = express.Router();

router.get('/', (req, res) => {
    // StudentModel.find()
    //     .then(students => res.json(students))
    //     .catch(err => console.log(err)) 
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
       console.log('err', err);
       res.status(400).send({msg: err})
    });
});

module.exports = router;