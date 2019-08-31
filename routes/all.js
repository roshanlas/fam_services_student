const express = require('express');
const router = express.Router();
const stories = require('../stories');
const axios = require('axios');


const makeCalendar = (dayOfWeek, dayOfMonth) => {
    let calendar = [];
    calendar[dayOfWeek] = dayOfMonth;

    for(var i = dayOfWeek-1; i>=1; i--) {
        calendar[i] = dayOfMonth-(dayOfWeek-i);
    }
    for(var i = dayOfWeek+1; i<=7; i++) {
        calendar[i] = dayOfMonth > 31 ? i: dayOfMonth+(i-dayOfWeek);
        console.log( calendar[i] );
    }
	calendar.shift();
    return calendar;
}

router.get('/', (req, res) => {
    res.status(200).send("done")
});

router.post('/story-of-day', async (req, res) => {

    const timeRequest = await axios.get('http://worldtimeapi.org/api/timezone/Africa/Lagos.json')
    .then((response) => response)
    .catch((error) => {
        console.log('error', error)
    })
    .then((response) => response);

    // const calendar = makeCalendar(
    //     timeRequest.data.day_of_week,
    //     parseInt(new Date('2019-08-31T17:32:27.944196+00:00').getDate())
    // )

    res.status(200).send({
        // calendar: calendar,
        dayOfWeek: timeRequest.data.day_of_week,
        dayOfMonth: new Date('2019-08-31T17:32:27.944196+00:00').getDate(),
        currentDay: timeRequest.data.day_of_week,
        story: stories[timeRequest.data.day_of_week]
    });
    // const student = await StudentModel.findOne({ email: req.body.email })
    // .then(x=>x).catch(err=>console.log('err', err));

    // if(student) {


    // } else {
    //     res.status(400).json({
    //         msg: 'The email or password was incorrect'    
    //     })
    // }
});


module.exports = router;