const express = require('express');
const jwt = require('jsonwebtoken');
const StudentModel = require('../models/Student');
const router = express.Router();
const keys = require('../config/keys');
const sendMail = require('../mailjet');
require('dotenv').config();

// Get Student Profile 
router.get('/', (req, res) => {
    // console.log(req.user);
    let student = req.user._doc;

    if (student && student.emailVerified) {
        res.status(200).json({
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            dob: student.dob,
            gender: student.gender,
            marriageStatus: student.marriageStatus,
            occupation: student.occupation,
            residence: student.residence,
            country: student.country,
            city: student.city,
            homeAddress: student.homeAddress,
            postCode: student.postCode,
        });

    } else if (student && !student.emailVerified) {
        res.status(400).json({
            msg: 'Please verify your email'
        })
    }
});

// Update Student Profile
router.post('/', async (req, res) => {
    // console.log(req.user);
    let oldStudent = req.user._doc;
    let newStudent = req.body;
    console.log("Student", oldStudent);


    if (oldStudent && oldStudent.emailVerified) {
        let emailVerified = oldStudent.emailVerified;
        let password = oldStudent.password;

        // Check Updates to Email Address
        if (oldStudent.email.trim().toLowerCase() !== newStudent.email.trim().toLowerCase()) {
            // Check if email already exists
            const studentTmp = await StudentModel.findOne({ email: newStudent.email })
                .then(data => data)
                .catch(err => {
                    console.log('service error at /', err);
                    return err;
                });

            if (studentTmp === null) {
                emailVerified = false;
                // Send Verification Email
                sendMail(
                    'updateEmail',
                    newStudent.email,
                    newStudent.firstName + ' ' + newStudent.lastName,
                    oldStudent._id
                );
            } else {
                res.status(400).send({ msg: 'An account with that email address exists.' });
                return;
            }
        }

        // Check Updates to password
        if (newStudent.password != null && newStudent.password.trim() != "") {
            password = newStudent.password;
        }

        // Update Student Details
        const updatedStudent = await StudentModel
            .findOneAndUpdate(
                {
                    email: req.user.email
                },
                {
                    email: newStudent.email,
                    firstName: newStudent.firstName,
                    lastName: newStudent.lastName,
                    dob: newStudent.dob,
                    gender: newStudent.gender,
                    marriageStatus: newStudent.marriageStatus,
                    occupation: newStudent.occupation,
                    residence: newStudent.residence,
                    country: newStudent.country,
                    city: newStudent.city,
                    homeAddress: newStudent.homeAddress,
                    postCode: newStudent.postCode,
                    emailVerified: emailVerified,
                    password: password,
                },
                { upsert: false }
            )
            .then(data => data)
            .catch(err => {
                console.log('err', err);
                return err;
            });

        // Generate new JWT Token
        const payload = {
            id: oldStudent._id,
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email
        };
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
                        msg: emailVerified ? 'You profile has been updated successfully!' : 'Email address updated. You will be receiving an email from us shortly. Kindly verify email and re-login to continue.',
                        token: token,
                        firstName: newStudent.firstName,
                        lastName: newStudent.lastName,
                        emailVerified: emailVerified,
                    });
                };
            }
        );

    } else if (oldStudent && !oldStudent.emailVerified) {
        res.status(400).json({
            msg: 'Please verify your email'
        })
    }
});

module.exports = router;