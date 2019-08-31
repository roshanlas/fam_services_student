const express = require('express');
const SubmissionModel = require('../models/Submission');
const router = express.Router();
require('dotenv').config();


router.get('/', (req, res) => {
    console.log(req.user);
    res.send("Successful")
});

/**
 * User story submission (incomplete)
 */
router.post('/submit', async (req, res) => {
    const submission = await SubmissionModel
    .findOneAndUpdate(
        { 
            email: req.user.email,
            storyID: req.body.storyID
        }, 
        { 
            submission: req.body.submission, 
            final: req.body.final ,
            storyID: req.body.storyID
        }, 
        { upsert: true }
    )
    .then(data=>data)
    .catch(err=>{
        console.log('err', err);
        return err;
    });

    console.log(submission === null ? {submission} : submission)

    res.status(200).send(submission === null ? {msg: 'created'} : submission)
});

router.get('/retrieve/:storyID', async (req, res)=> {
    const submission = await SubmissionModel
    .findOne(
        { 
            email: req.user.email,
            storyID: req.params.storyID
        }
    )
    .then(data=>data)
    .catch(err=>{
        console.log('err', err);
        return err;
    });

    if(submission === null) {
        res.status(200).send({submission: null})
    } else {
        res.status(200).send(submission)
    }
});

module.exports = router;