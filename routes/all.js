const express = require('express');
const StudentModel = require('../models/Student');
const router = express.Router();

router.get('/', (req, res) => {
    StudentModel.find()
        .then(students => res.json(students))
        .catch(err => console.log(err)) 
});


router.post('/register', async (req, res) => {
    const student = await StudentModel.findOne({ email: req.body.student.email });
    if(student) {
        res.status(400).send({ msg: 'student exists' })
        return;
    }

    console.log('student is', student);


    const newStudent = await StudentModel
    .create(req.body.student)
    .then(result => {
        res.status(200).send({ msg: 'done' })
    })
    .catch(err => { console.log(err) });
});

module.exports = router;